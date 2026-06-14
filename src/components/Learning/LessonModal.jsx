// src/components/learning/LessonModal.jsx
// ─────────────────────────────────────────────────────────────
// Opens when a user clicks a lesson.
// Shows: video ↔ sign image side-by-side → quiz → completion
// ─────────────────────────────────────────────────────────────

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X, CheckCircle, XCircle } from "lucide-react";
import { getLessonDetail, completeLesson, submitQuizAnswer } from "../../api/learningApi";

export default function LessonModal({ lessonId, userId, onClose, onComplete }) {
  const [lesson, setLesson]         = useState(null);
  const [loading, setLoading]       = useState(true);
  const [step, setStep]             = useState("video"); // video | quiz | done
  const [currentQ, setCurrentQ]     = useState(0);
  const [quizResult, setQuizResult] = useState(null);
  const [totalXP, setTotalXP]       = useState(0);
  const [completing, setCompleting] = useState(false);

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
        // Delay parent update notifications until the user clicks complete
        // This stops LearnPage from re-rendering and tearing down the quiz early
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
          // ── GLASSMORPHISM BASE ──
          background: "rgba(20, 20, 30, 0.75)", // Deep dark glass base
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderRadius: "24px", // Matches custom welcome radius
          padding: "35px",
          maxWidth: "1100px", 
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto", 
          position: "relative",
          // ── WHITE COATING ALPHA BORDER ──
          border: "1px solid rgba(255, 255, 255, 0.15)", 
          boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
          color: "#ffffff", // Pure white readable text
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

            {/* Bottom Row Description: Nested Inner Glass Box */}
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
            <h3 style={{ color: "#ffffff", marginBottom: "28px", fontSize: "1.4rem", fontWeight: "600" }}>
              {currentQuestion.question_text || `Which sign matches the target letter "${lesson?.sign_letter}"?`}
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
              {currentQuestion.options.map((opt) => {
                const isCorrect = quizResult && opt.option_text === quizResult.correct_answer;
                const isWrong   = quizResult && opt.option_text !== quizResult.correct_answer && opt.option_text === quizResult.user_answer;
                
                return (
                  <button
                    key={opt.id}
                    onClick={() => !quizResult && handleAnswer(opt.option_text)}
                    disabled={!!quizResult}
                    style={{
                      padding: "18px",
                      borderRadius: "14px",
                      fontWeight: "600",
                      fontSize: "1rem",
                      cursor: quizResult ? "default" : "pointer",
                      transition: "all 0.2s ease",
                      // Dynamic Glass Variants for quiz interaction
                      border: isCorrect ? "2px solid #4ade80"
                            : isWrong   ? "2px solid #f87171"
                            : "1px solid rgba(255, 255, 255, 0.15)",
                      background: isCorrect ? "rgba(74, 222, 128, 0.2)"
                                : isWrong   ? "rgba(248, 113, 113, 0.2)"
                                : "rgba(255, 255, 255, 0.06)",
                      color: isCorrect ? "#4ade80" : isWrong ? "#f87171" : "#ffffff",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                    onMouseEnter={(e) => {
                      if (!quizResult) {
                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.12)";
                        e.currentTarget.style.borderColor = "var(--color-primary-cyan)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!quizResult) {
                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)";
                        e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
                      }
                    }}
                  >
                    {opt.option_text}
                  </button>
                );
              })}
            </div>

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
                    {quizResult.is_correct ? `Correct! +${quizResult.xp_awarded} XP` : "Incorrect Selection"}
                  </div>
                  {!quizResult.is_correct && (
                    <div style={{ color: "#ccccccc", fontSize: "0.9rem", marginTop: "4px" }}>
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
        background: "rgba(10, 10, 15, 0.45)", // Semi-transparent base layer
        backdropFilter: "blur(8px)", // Native backdrop blurring layer
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px",
      }}
    >
      {children}
    </div>
  );
}