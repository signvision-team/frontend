// src/components/quiz/SignQuiz.jsx
// ─────────────────────────────────────────────────────────────
// Gamified sign language quiz:
// - Floating alphabet letters bounce around the screen
// - Webcam runs MediaPipe detection continuously
// - When correct sign detected → target letter explodes with XP
// - Wrong detection → gentle shake, keep trying
// - Each correct answer awards XP via Gamification Service
// ─────────────────────────────────────────────────────────────

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Camera, CameraOff, CheckCircle, Trophy } from "lucide-react";
import { submitQuizAnswer } from "../../api/learningApi";
import { awardXP }          from "../../api/gamificationApi";

// ── Floating letter config ────────────────────────────────────
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const COLORS   = [
  "#00bcd4","#4ade80","#fbbf24","#f97316",
  "#a78bfa","#f472b6","#34d399","#60a5fa",
];

function randomBetween(a, b) { return a + Math.random() * (b - a); }

function makeFloatingLetter(letter, isTarget = false) {
  return {
    id:       Math.random().toString(36).slice(2),
    letter,
    isTarget,
    x:        randomBetween(5, 85),    // % from left
    y:        randomBetween(5, 85),    // % from top
    size:     isTarget ? randomBetween(60, 90) : randomBetween(28, 52),
    color:    COLORS[Math.floor(Math.random() * COLORS.length)],
    dx:       (Math.random() - 0.5) * 0.3,   // drift per frame
    dy:       (Math.random() - 0.5) * 0.3,
    opacity:  isTarget ? 1 : randomBetween(0.15, 0.45),
    rotation: randomBetween(-30, 30),
  };
}

// ── Detection polling ─────────────────────────────────────────
// Calls your existing MediaPipe backend every 800ms
const DETECTION_URL = window.location.hostname.includes("localhost")
  ? "http://127.0.0.1:8000/predict"
  : "https://detectionbase.onrender.com/predict";  // ← your detection endpoint
const DETECTION_INTERVAL = 800;  // ms between predictions
const MIN_CONFIDENCE     = 0.75; // minimum confidence to count


const SignQuiz = ({ lessonId, userId, questions, onClose, onComplete }) => {

  // Quiz state
  const [questionIndex, setQuestionIndex] = useState(0);
  const [phase, setPhase]   = useState("intro");   // intro | detecting | correct | done
  const [totalXP, setTotalXP]   = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [results, setResults]   = useState([]);

  // Detection state
  const [detectedLetter, setDetectedLetter] = useState(null);
  const [confidence, setConfidence]         = useState(0);
  const [cameraOn, setCameraOn]             = useState(true);
  const [cameraError, setCameraError]       = useState(false);

  // Floating letters
  const [floaters, setFloaters]   = useState([]);
  const [exploding, setExploding] = useState(null);   // letter that just exploded

  const videoRef      = useRef(null);
  const canvasRef     = useRef(null);
  const streamRef     = useRef(null);
  const detectTimer   = useRef(null);
  const animFrame     = useRef(null);
  const floatersRef   = useRef([]);

  const currentQ  = questions[questionIndex];
  const target    = currentQ?.correct_answer?.toUpperCase();
  const totalQ    = questions.length;

  // ── Build floating letters for current question ───────────
  const buildFloaters = useCallback((targetLetter) => {
    const items = [];
    // Add target letter prominently (3 copies)
    for (let i = 0; i < 3; i++) items.push(makeFloatingLetter(targetLetter, true));
    // Add distractor letters
    const distractors = ALPHABET.filter(l => l !== targetLetter)
      .sort(() => Math.random() - 0.5).slice(0, 18);
    distractors.forEach(l => items.push(makeFloatingLetter(l, false)));
    floatersRef.current = items;
    setFloaters([...items]);
  }, []);

  // ── Animate floaters ──────────────────────────────────────
  useEffect(() => {
    const animate = () => {
      floatersRef.current = floatersRef.current.map(f => {
        let nx = f.x + f.dx;
        let ny = f.y + f.dy;
        let ndx = f.dx;
        let ndy = f.dy;
        if (nx < 2 || nx > 92) ndx = -ndx;
        if (ny < 2 || ny > 92) ndy = -ndy;
        return { ...f, x: nx, y: ny, dx: ndx, dy: ndy };
      });
      setFloaters([...floatersRef.current]);
      animFrame.current = requestAnimationFrame(animate);
    };
    animFrame.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrame.current);
  }, []);

  // ── Start camera ──────────────────────────────────────────
  useEffect(() => {
    const startCam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 320, height: 240, facingMode: "user" }
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (e) {
        console.warn("Camera error:", e);
        setCameraError(true);
        setCameraOn(false);
      }
    };
    startCam();
    return () => streamRef.current?.getTracks().forEach(t => t.stop());
  }, []);

  // ── Detection polling ─────────────────────────────────────
  useEffect(() => {
    if (!cameraOn || phase !== "detecting") return;

    const detect = async () => {
      if (!videoRef.current || !canvasRef.current) return;
      const ctx = canvasRef.current.getContext("2d");
      ctx.drawImage(videoRef.current, 0, 0, 320, 240);
      canvasRef.current.toBlob(async (blob) => {
        if (!blob) return;
        try {
          const form = new FormData();
          form.append("file", blob, "frame.jpg");
          const res  = await fetch(DETECTION_URL, { method: "POST", body: form });
          const data = await res.json();

          // Support both { prediction, confidence } and { letter, confidence }
          const letter = (data.prediction || data.letter || "").toUpperCase();
          const conf   = data.confidence ?? 1;

          setDetectedLetter(letter);
          setConfidence(conf);

          if (letter && conf >= MIN_CONFIDENCE) {
            handleDetection(letter, conf);
          }
        } catch (e) {
          // Detection service not reachable — silent
        }
      }, "image/jpeg", 0.8);
    };

    detectTimer.current = setInterval(detect, DETECTION_INTERVAL);
    return () => clearInterval(detectTimer.current);
  }, [cameraOn, phase, questionIndex]);

  // ── Load floaters when question changes ───────────────────
  useEffect(() => {
    if (target && phase !== "done") {
      buildFloaters(target);
      setDetectedLetter(null);
      setConfidence(0);
    }
  }, [questionIndex, target, buildFloaters]);

  // ── Handle detection result ───────────────────────────────
  const handleDetection = useCallback(async (letter, conf) => {
    if (phase !== "detecting" || !currentQ) return;
    setAttempts(a => a + 1);

    if (letter === target) {
      // ── CORRECT ──────────────────────────────────────────
      clearInterval(detectTimer.current);
      setPhase("correct");
      setExploding(target);

      // Submit to learning service
      let xpEarned = 0;
      try {
        const result = await submitQuizAnswer(userId, currentQ.id, letter);
        xpEarned = result.xp_awarded || 0;
        setTotalXP(prev => prev + xpEarned);
      } catch (e) {
        // fallback: award directly
        try {
          const r = await awardXP(userId, "quiz_correct", String(currentQ.id));
          xpEarned = r?.xp_awarded || 15;
          setTotalXP(prev => prev + xpEarned);
        } catch (_) {}
      }

      setResults(prev => [...prev, { question: target, correct: true, xp: xpEarned }]);

      // Move to next question after 2 seconds
      setTimeout(() => {
        setExploding(null);
        if (questionIndex + 1 < totalQ) {
          setQuestionIndex(i => i + 1);
          setPhase("detecting");
        } else {
          setPhase("done");
          if (onComplete) onComplete(totalXP + xpEarned);
        }
      }, 2200);
    }
  }, [phase, target, currentQ, questionIndex, totalQ, userId, totalXP, onComplete]);

  // ── Skip question (manual) ────────────────────────────────
  const handleSkip = () => {
    setResults(prev => [...prev, { question: target, correct: false, xp: 0 }]);
    if (questionIndex + 1 < totalQ) {
      setQuestionIndex(i => i + 1);
      setPhase("detecting");
    } else {
      setPhase("done");
    }
  };

  // ── Render ────────────────────────────────────────────────
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9500,
      background: "linear-gradient(135deg, #0a0a1a 0%, #0d1b2a 100%)",
      overflow: "hidden",
    }}>

      {/* ── Hidden canvas for frame capture ── */}
      <canvas ref={canvasRef} width={320} height={240}
              style={{ display: "none" }} />

      {/* ── Floating letters background ── */}
      {floaters.map((f) => (
        <motion.div
          key={f.id}
          style={{
            position: "absolute",
            left:   `${f.x}%`,
            top:    `${f.y}%`,
            fontSize: f.size,
            color:  f.color,
            opacity: f.opacity,
            fontWeight: "bold",
            userSelect: "none",
            pointerEvents: "none",
            textShadow: f.isTarget
              ? `0 0 30px ${f.color}, 0 0 60px ${f.color}`
              : "none",
            transform: `rotate(${f.rotation}deg)`,
            transition: "left 0.1s linear, top 0.1s linear",
            zIndex: f.isTarget ? 2 : 1,
          }}
        >
          {f.letter}
        </motion.div>
      ))}

      {/* ── Explosion when correct ── */}
      <AnimatePresence>
        {exploding && (
          <motion.div
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: 8, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              position: "fixed", top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: "6rem", fontWeight: "bold",
              color: "#fbbf24",
              textShadow: "0 0 80px #fbbf24, 0 0 160px #f97316",
              zIndex: 9999,
              pointerEvents: "none",
            }}
          >
            {exploding}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Close button ── */}
      <button
        onClick={onClose}
        style={{
          position: "absolute", top: 20, right: 20, zIndex: 9600,
          background: "rgba(255,255,255,0.1)", border: "none",
          borderRadius: "50%", width: 44, height: 44,
          cursor: "pointer", color: "white",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <X size={20} />
      </button>

      {/* ── Progress bar top ── */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 4,
        background: "rgba(255,255,255,0.1)", zIndex: 9600,
      }}>
        <motion.div
          animate={{ width: `${((questionIndex) / totalQ) * 100}%` }}
          transition={{ duration: 0.4 }}
          style={{ height: "100%", background: "#00bcd4" }}
        />
      </div>

      {/* ── INTRO screen ── */}
      {phase === "intro" && (
        <div style={{
          position: "absolute", inset: 0, display: "flex",
          flexDirection: "column", alignItems: "center",
          justifyContent: "center", zIndex: 9600,
        }}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{
              background: "rgba(15,23,42,0.95)",
              border: "1px solid rgba(0,188,212,0.4)",
              borderRadius: 24, padding: "48px 56px",
              textAlign: "center", maxWidth: 480,
              backdropFilter: "blur(20px)",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: 16 }}>🤟</div>
            <h2 style={{ color: "white", fontSize: "1.8rem", marginBottom: 12 }}>
              Sign Language Quiz
            </h2>
            <p style={{ color: "#94a3b8", marginBottom: 8 }}>
              {totalQ} questions · Show each sign to your camera
            </p>
            <p style={{ color: "#64748b", fontSize: "0.85rem", marginBottom: 32 }}>
              Find the glowing letters — they're your targets!
            </p>
            <button
              onClick={() => setPhase("detecting")}
              style={{
                padding: "14px 48px", background: "#00bcd4",
                color: "black", border: "none", borderRadius: 12,
                fontSize: "1rem", fontWeight: "bold", cursor: "pointer",
              }}
            >
              Start Quiz →
            </button>
          </motion.div>
        </div>
      )}

      {/* ── DETECTING screen ── */}
      {phase === "detecting" && (
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          padding: 24, display: "flex", justifyContent: "space-between",
          alignItems: "flex-end", zIndex: 9600,
        }}>

          {/* Target prompt */}
          <motion.div
            key={questionIndex}
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            style={{
              background: "rgba(15,23,42,0.92)",
              border: "1px solid rgba(0,188,212,0.5)",
              borderRadius: 20, padding: "20px 28px",
              backdropFilter: "blur(20px)",
              maxWidth: 340,
            }}
          >
            <div style={{ color: "#64748b", fontSize: "0.8rem",
                          fontWeight: 700, letterSpacing: "1px", marginBottom: 8 }}>
              QUESTION {questionIndex + 1} OF {totalQ}
            </div>
            <div style={{ color: "white", fontSize: "1rem", marginBottom: 12 }}>
              {currentQ?.question_text || `Show the sign for:`}
            </div>
            <div style={{
              fontSize: "4rem", fontWeight: "bold", color: "#00bcd4",
              textShadow: "0 0 30px #00bcd4",
              lineHeight: 1,
            }}>
              {target}
            </div>
            <div style={{ marginTop: 16, color: "#94a3b8", fontSize: "0.85rem" }}>
              +{currentQ?.xp_reward || 15} XP for correct sign
            </div>

            {/* Detected letter feedback */}
            {detectedLetter && (
              <div style={{
                marginTop: 12, padding: "8px 16px",
                background: detectedLetter === target
                  ? "rgba(74,222,128,0.15)"
                  : "rgba(255,255,255,0.05)",
                borderRadius: 8,
                border: `1px solid ${detectedLetter === target ? "#4ade80" : "rgba(255,255,255,0.1)"}`,
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <span style={{ color: "#64748b", fontSize: "0.8rem" }}>Detected:</span>
                <span style={{
                  color: detectedLetter === target ? "#4ade80" : "white",
                  fontWeight: "bold", fontSize: "1.2rem",
                }}>
                  {detectedLetter}
                </span>
                <span style={{ color: "#64748b", fontSize: "0.75rem" }}>
                  {Math.round(confidence * 100)}%
                </span>
              </div>
            )}

            <button
              onClick={handleSkip}
              style={{
                marginTop: 16, padding: "8px 20px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 8, color: "#94a3b8",
                cursor: "pointer", fontSize: "0.85rem", width: "100%",
              }}
            >
              Skip this question →
            </button>
          </motion.div>

          {/* Camera feed */}
          <div style={{
            background: "rgba(15,23,42,0.92)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 20, overflow: "hidden",
            backdropFilter: "blur(20px)",
          }}>
            {cameraOn && !cameraError ? (
              <div style={{ position: "relative" }}>
                <video
                  ref={videoRef}
                  muted playsInline
                  style={{
                    width: 260, height: 195,
                    transform: "scaleX(-1)",   // mirror
                    display: "block",
                  }}
                />
                <div style={{
                  position: "absolute", bottom: 8, left: 8,
                  background: "rgba(0,0,0,0.6)", borderRadius: 6,
                  padding: "4px 8px", display: "flex",
                  alignItems: "center", gap: 6,
                }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: "#4ade80",
                    animation: "pulse 1.5s infinite",
                  }} />
                  <span style={{ color: "white", fontSize: "0.75rem" }}>
                    Live
                  </span>
                </div>
              </div>
            ) : (
              <div style={{
                width: 260, height: 195,
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                color: "#64748b", gap: 8,
              }}>
                <CameraOff size={32} />
                <span style={{ fontSize: "0.8rem" }}>Camera unavailable</span>
                <span style={{ fontSize: "0.75rem", color: "#475569", textAlign: "center",
                               padding: "0 16px" }}>
                  Use Skip to continue
                </span>
              </div>
            )}

            {/* XP counter */}
            <div style={{
              padding: "10px 16px", borderTop: "1px solid rgba(255,255,255,0.08)",
              display: "flex", justifyContent: "space-between",
            }}>
              <span style={{ color: "#64748b", fontSize: "0.8rem" }}>Total XP</span>
              <span style={{ color: "#fbbf24", fontWeight: "bold" }}>+{totalXP}</span>
            </div>
          </div>
        </div>
      )}

      {/* ── CORRECT flash ── */}
      {phase === "correct" && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 9700,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(0,0,0,0.3)",
        }}>
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            style={{
              background: "rgba(15,23,42,0.95)",
              border: "2px solid #4ade80",
              borderRadius: 24, padding: "40px 56px",
              textAlign: "center",
              boxShadow: "0 0 60px rgba(74,222,128,0.3)",
            }}
          >
            <CheckCircle color="#4ade80" size={56} style={{ marginBottom: 16 }} />
            <h2 style={{ color: "#4ade80", fontSize: "2rem", margin: 0 }}>
              Correct! 🎉
            </h2>
            <p style={{ color: "#fbbf24", fontSize: "1.5rem",
                        fontWeight: "bold", marginTop: 12 }}>
              +{results[results.length - 1]?.xp || 15} XP
            </p>
          </motion.div>
        </div>
      )}

      {/* ── DONE screen ── */}
      {phase === "done" && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 9700,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)",
        }}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{
              background: "rgba(15,23,42,0.98)",
              border: "1px solid rgba(0,188,212,0.3)",
              borderRadius: 24, padding: "48px 56px",
              textAlign: "center", maxWidth: 480, width: "90%",
            }}
          >
            <Trophy color="#fbbf24" size={56} style={{ marginBottom: 16 }} />
            <h2 style={{ color: "white", fontSize: "2rem", marginBottom: 8 }}>
              Quiz Complete!
            </h2>

            {/* Score breakdown */}
            <div style={{
              display: "flex", justifyContent: "center",
              gap: 32, margin: "24px 0",
            }}>
              <div>
                <div style={{ color: "#4ade80", fontSize: "2rem", fontWeight: "bold" }}>
                  {results.filter(r => r.correct).length}
                </div>
                <div style={{ color: "#64748b", fontSize: "0.8rem" }}>Correct</div>
              </div>
              <div>
                <div style={{ color: "#fbbf24", fontSize: "2rem", fontWeight: "bold" }}>
                  {totalXP}
                </div>
                <div style={{ color: "#64748b", fontSize: "0.8rem" }}>XP Earned</div>
              </div>
              <div>
                <div style={{ color: "#94a3b8", fontSize: "2rem", fontWeight: "bold" }}>
                  {results.filter(r => !r.correct).length}
                </div>
                <div style={{ color: "#64748b", fontSize: "0.8rem" }}>Skipped</div>
              </div>
            </div>

            {/* Per-question results */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8,
                          justifyContent: "center", marginBottom: 32 }}>
              {results.map((r, i) => (
                <div key={i} style={{
                  width: 40, height: 40, borderRadius: 8,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: "bold", fontSize: "1.1rem",
                  background: r.correct
                    ? "rgba(74,222,128,0.15)" : "rgba(248,113,113,0.1)",
                  border: `1px solid ${r.correct ? "#4ade80" : "#f87171"}`,
                  color: r.correct ? "#4ade80" : "#f87171",
                }}>
                  {r.question}
                </div>
              ))}
            </div>

            <button
              onClick={onClose}
              style={{
                padding: "14px 48px", background: "#00bcd4",
                color: "black", border: "none", borderRadius: 12,
                fontSize: "1rem", fontWeight: "bold", cursor: "pointer",
              }}
            >
              Back to Lessons
            </button>
          </motion.div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
};

export default SignQuiz;
