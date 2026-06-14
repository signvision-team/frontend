// src/components/gamification/LevelUpModal.jsx
import { motion, AnimatePresence } from "framer-motion";

export default function LevelUpModal({ level }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      style={{
        position: "fixed", inset: 0, zIndex: 9998,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)",
      }}
    >
      <div style={{
        background: "linear-gradient(135deg, #1e293b, #0f172a)",
        border: "2px solid #00bcd4", borderRadius: 24,
        padding: "50px 60px", textAlign: "center",
        boxShadow: "0 0 60px rgba(0,188,212,0.4)",
      }}>
        <div style={{ fontSize: "4rem", marginBottom: 16 }}>🎉</div>
        <h2 style={{ color: "#00bcd4", fontSize: "2rem", margin: 0 }}>Level Up!</h2>
        <p style={{ color: "white", fontSize: "1.3rem", marginTop: 12 }}>
          You reached <strong>Level {level}</strong>
        </p>
        <p style={{ color: "#94a3b8", marginTop: 8 }}>Keep signing to unlock more!</p>
      </div>
    </motion.div>
  );
}