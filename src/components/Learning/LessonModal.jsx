// src/components/learning/LessonModal.jsx
// ─────────────────────────────────────────────────────────────
// Opens when a user clicks a lesson.
// Shows: video ↔ sign image side-by-side → quiz → completion
// ─────────────────────────────────────────────────────────────

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X, CheckCircle, XCircle } from "lucide-react";
import { getLessonDetail, completeLesson, submitQuizAnswer } from "../../api/learningApi";
import FloatingQuiz from "../quiz/FloatingQuiz";

// This takes "http://127.0.0.1:8000" and expands it safely to "http://127.0.0.1:8000/api/detection"
const BASE_DETECTION_URL = import.meta.env.VITE_DETECTION_API 
  ? `${import.meta.env.VITE_DETECTION_API}/api/detection`
  : "http://127.0.0.1:8000/api/detection";
export default function LessonModal({ lessonId, userId, onClose, onComplete }) {
  const [lesson, setLesson]         = useState(null);
  const [loading, setLoading]       = useState(true);
  const [step, setStep]             = useState("video"); // video | quiz | done
  const [currentQ, setCurrentQ]     = useState(0);
  const [quizResult, setQuizResult] = useState(null);
  const [totalXP, setTotalXP]       = useState(0);
  const [completing, setCompleting] = useState(false);
  
  // Real-time AI prediction stream state variable
  const [prediction, setPrediction] = useState(""); 

  // Load lesson detail data
  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const data = await getLessonDetail(lessonId, userId);
        if (isMounted) setLesson(data);
      } catch (e) {
        console.error(e);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => { isMounted = false; };
  }, [lessonId, userId]);

  // ── 🛠️ REAL-TIME DETECTION API LIFECYCLE MANAGEMENT ──
  useEffect(() => {
    let intervalId = null;
    let isCurrentStep = true; // Flag to instantly prevent asynchronous ghost requests

    if (step === "quiz") {
      console.log("🚀 Quiz started. Triggering backend sign language detection...");
      
      // 1. Tell the backend to initialize/start the camera model detection process
      fetch(`${BASE_DETECTION_URL}/start`, { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, lesson_id: lessonId })
      })
      .then(res => res.json())
      .catch(err => console.error("Failed to start detection API:", err));

      // 2. Poll the prediction outcome frame results every 400ms
      intervalId = setInterval(async () => {
        try {
          const res = await fetch(`${BASE_DETECTION_URL}/current/${userId}`);
          
          // Fast escape if the user leaves the step mid-fetch request
          if (!isCurrentStep) return;

          if (res.ok) {
            const data = await res.json();
            if (data.prediction) {
              setPrediction(data.prediction.toUpperCase()); // Feeds floating bubbles
            }
          }
        } catch (err) {
          console.error("Error fetching live prediction frame:", err);
        }
      }, 400); 

      // ── CLEANUP ON STEP CHANGE OR MODAL UNMOUNT ──
      return () => {
        isCurrentStep = false; // Block pending intervals immediately
        if (intervalId) clearInterval(intervalId);
        
        console.log("🛑 Leaving quiz. Stopping backend sign language detection...");
        
        fetch(`${BASE_DETECTION_URL}/stop`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId })
        }).catch(err => console.error("Failed to stop detection API:", err));
      };
    }
  }, [step, userId, lessonId]);

  const getMedia = (role) =>
    lesson?.media?.find((m) => m.media_role === role)?.url || null;

  const videoUrl   = getMedia("main_video");
  const signImgUrl = getMedia("sign_image");
  const questions   = lesson?.quiz_questions || [];
  const currentQuestion = questions[currentQ];

  // ── Step: video finished → complete backend, update local view ──
  const handleVideoEnd = async () => {
    if (!completing) {
      setCompleting(true);
      try {
        const result = await completeLesson(lessonId, userId);
        setTotalXP((prev) => prev + (result.gamification?.xp_awarded || 0));
        if (onComplete && questions.length === 0) {
          onComplete(lessonId, result.gamification);
        }
      } catch (e) {
        console.error(e);
      }
    }

    if (questions.length > 0) {
      setStep("quiz");
    } else {
      setStep("done");
    }
  };

  const handleAnswer = async (optionText) => {
    try {
      const result = await submitQuizAnswer(userId, currentQuestion.id, optionText);
      setQuizResult(result);
      setTotalXP((prev) => prev + (result.xp_awarded || 0));

      setTimeout(() => {
        setQuizResult(null);
        if (currentQ + 1 < questions.length) {
          setCurrentQ((q) => q + 1);
        } else {
          setStep("done");
        }
      }, 1800);
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return (
    <Overlay onClose={onClose}>
      <div style={{ color: "var(--color-primary-cyan)", fontSize: "1.2rem", fontWeight: "600" }}>
        Loading lesson...
      </div>
    </Overlay>
  );

  return (
    <Overlay onClose={onClose}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: "rgba(20, 20, 30, 0.75)", 
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderRadius: "24px", 
          padding: "35px",
          maxWidth: "1100px", 
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto", 
          position: "relative",
          border: "1px solid rgba(255, 255, 255, 0.15)", 
          boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
          color: "#ffffff", 
        }}
      >
        {/* Close Button */}
        <button 
          onClick={onClose} 
          style={{
            position: "absolute", top: 20, right: 20,
            background: "none", border: "none", cursor: "pointer", 
            color: "rgba(255, 255, 255, 0.6)", transition: "color 0.2s"
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = "var(--color-primary-cyan)"}
          onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255, 255, 255, 0.6)"}
        >
          <X size={24} />
        </button>

        {/* Title Header */}
        <div style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)", paddingBottom: "16px", marginBottom: "24px" }}>
          <h2 style={{ color: "#ffffff", fontSize: "1.8rem", margin: 0, fontWeight: "700" }}>{lesson?.title}</h2>
          {lesson?.sign_letter && (
            <span style={{ color: "var(--color-primary-cyan)", fontWeight: "bold", fontSize: "1.1rem", marginTop: "4px", display: "inline-block" }}>
              Sign Target: {lesson.sign_letter}
            </span>
          )}
        </div>

        {/* ── VIDEO + SIGN PARALLEL STEP ── */}
        {step === "video" && (
          <div>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))",
              gap: "24px",
              alignItems: "start"
            }}>
              {/* Left Side: Video Player */}
              <div>
                <h4 style={{ marginBottom: "12px", color: "#b3b3b3", fontWeight: "500" }}>Lesson Video</h4>
                {videoUrl ? (
                  <video
                    src={videoUrl}
                    controls
                    autoPlay
                    onEnded={handleVideoEnd}
                    style={{ width: "100%", borderRadius: "12px", background: "#000000", boxShadow: "0 8px 24px rgba(0,0,0,0.3)" }}
                  />
                ) : (
                  <div style={{
                    background: "rgba(255, 255, 255, 0.03)", borderRadius: "12px", height: "260px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "rgba(255, 255, 255, 0.4)", border: "2px dashed rgba(255, 255, 255, 0.15)",
                  }}>
                    No video uploaded yet for this lesson.
                  </div>
                )}
              </div>

              {/* Right Side: Sign Reference Image */}
              <div>
                <h4 style={{ marginBottom: "12px", color: "#b3b3b3", fontWeight: "500" }}>Sign Form</h4>
                {signImgUrl ? (
                  <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "12px", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
                    <img 
                      src={signImgUrl} 
                      alt="Sign reference visual"
                      style={{ width: "100%", height: "auto", maxHeight: "350px", objectFit: "contain", borderRadius: "8px" }} 
                    />
                  </div>
                ) : (
                  <div style={{
                    background: "rgba(255, 255, 255, 0.03)", borderRadius: "12px", height: "260px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "rgba(255, 255, 255, 0.4)", border: "2px dashed rgba(255, 255, 255, 0.15)",
                  }}>
                    No sign reference image available.
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Row Description */}
            <div style={{ 
              marginTop: "24px", 
              backgroundColor: "rgba(255, 255, 255, 0.06)", 
              padding: "20px", 
              borderRadius: "16px",
              border: "1px solid rgba(255, 255, 255, 0.08)"
            }}>
              <p style={{ color: "#e0e0e0", margin: 0, fontSize: "0.95rem", lineHeight: "1.6" }}>
                {lesson?.description || "No description provided for this lesson."}
              </p>
            </div>

            <button
              onClick={handleVideoEnd}
              className="btn primary"
              style={{ marginTop: "28px", width: "100%", padding: "14px", fontSize: "1.1rem", borderRadius: "12px" }}
            >
              I've watched this — Continue to Quiz →
            </button>
          </div>
        )}

        {/* ── QUIZ STEP ── */}
        {step === "quiz" && currentQuestion && (
          <div style={{ marginTop: "10px" }}>
            <div style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "0.9rem", marginBottom: "12px", fontWeight: "500" }}>
              Question {currentQ + 1} of {questions.length}
            </div>

            <FloatingQuiz 
              lesson={lesson}
              currentQuestion={currentQuestion}
              detectedLetter={prediction} 
              onCorrectDetection={(matchedLetter) => {
                if (!quizResult) {
                  handleAnswer(matchedLetter);
                }
              }}
            />

            {/* Status Answer Banner */}
            {quizResult && (
              <div style={{
                marginTop: "28px", padding: "18px", borderRadius: "14px",
                background: quizResult.is_correct ? "rgba(74, 222, 128, 0.12)" : "rgba(248, 113, 113, 0.12)",
                border: `1px solid ${quizResult.is_correct ? "#4ade80" : "#f87171"}`,
                display: "flex", alignItems: "center", gap: "14px",
              }}>
                {quizResult.is_correct ? <CheckCircle color="#4ade80" size={24} /> : <XCircle color="#f87171" size={24} />}
                <div>
                  <div style={{ color: quizResult.is_correct ? "#4ade80" : "#f87171", fontWeight: "bold", fontSize: "1.1rem" }}>
                    {quizResult.is_correct ? `Correct Sign Detected! +${quizResult.xp_awarded} XP` : "Incorrect Selection"}
                  </div>
                  {!quizResult.is_correct && (
                    <div style={{ color: "#cccccc", fontSize: "0.9rem", marginTop: "4px" }}>
                      Correct option was: <strong style={{ color: "#ffffff" }}>{quizResult.correct_answer}</strong>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── DONE STEP ── */}
        {step === "done" && (
          <div style={{ marginTop: "20px", textAlign: "center", padding: "30px 0" }}>
            <div style={{ fontSize: "5rem", marginBottom: "20px" }}>🎉</div>
            <h3 style={{ color: "#4ade80", fontSize: "2rem", fontWeight: "700", margin: 0 }}>Lesson Finished!</h3>
            <p style={{ color: "#e0e0e0", fontSize: "1.15rem", marginTop: "12px" }}>
              Incredible work! You generated <strong style={{ color: "var(--color-primary-cyan)" }}>+{totalXP} XP</strong> total.
            </p>
            <button
              onClick={() => {
                if (onComplete) onComplete(lessonId, null);
                onClose();
              }}
              className="btn primary"
              style={{ marginTop: "32px", padding: "14px 60px", fontSize: "1.05rem", borderRadius: "12px" }}
            >
              Continue Learning Path →
            </button>
          </div>
        )}
      </motion.div>
    </Overlay>
  );
}

function Overlay({ children, onClose }) {
  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed", inset: 0, zIndex: 9000,
        background: "rgba(10, 10, 15, 0.45)", 
        backdropFilter: "blur(8px)", 
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px",
      }}
    >
      {children}
    </div>
  );
}