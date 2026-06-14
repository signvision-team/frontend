// src/components/gamification/BadgeNotification.jsx
import { motion } from "framer-motion";

export default function BadgeNotification({ badge, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ delay: index * 0.3 }}
      style={{
        position: "fixed", bottom: 40 + index * 80, right: 40,
        background: "linear-gradient(135deg, #1e293b, #0f172a)",
        border: "1px solid #fbbf24", borderRadius: 16,
        padding: "16px 24px", zIndex: 9997,
        display: "flex", alignItems: "center", gap: 12,
        boxShadow: "0 8px 30px rgba(251,191,36,0.3)",
        minWidth: 260,
      }}
    >
      <span style={{ fontSize: "2rem" }}>🏅</span>
      <div>
        <div style={{ color: "#fbbf24", fontWeight: "bold", fontSize: "0.85rem",
                      letterSpacing: "1px" }}>BADGE UNLOCKED</div>
        <div style={{ color: "white", fontWeight: "bold" }}>{badge}</div>
      </div>
    </motion.div>
  );
}