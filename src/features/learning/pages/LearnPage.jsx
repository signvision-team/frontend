import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Lock, CheckCircle, PlayCircle, Star } from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const card = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4 },
  },
};

const LearnPage = ({ navigate }) => {
  const levels = [
    { id: 1, title: "The Alphabet", desc: "Learn A-Z basics", status: "completed", stars: 3 },
    { id: 2, title: "Common Greetings", desc: "Hello, Goodbye, Thanks", status: "active", stars: 0 },
    { id: 3, title: "Numbers 1-10", desc: "Counting basics", status: "locked", stars: 0 },
    { id: 4, title: "Family & Friends", desc: "Mom, Dad, Friend", status: "locked", stars: 0 },
    { id: 5, title: "Emotions", desc: "Happy, Sad, Angry", status: "locked", stars: 0 },
    { id: 6, title: "Emergency Signs", desc: "Help, Hospital, Police", status: "locked", stars: 0 },
  ];

  return (
    <div className="dashboard-content">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <div>
          <h2 style={{ color: "white", fontSize: "2rem", margin: 0 }}>
            Learning Path
          </h2>
          <p style={{ color: "#94a3b8", marginTop: "5px" }}>
            Complete levels to unlock new signs.
          </p>
        </div>

        <button
          className="btn-secondary"
          onClick={() => navigate("DASHBOARD")}
          style={{ padding: "10px 20px", display: "flex", gap: "8px" }}
        >
          <ArrowLeft size={18} /> Back
        </button>
      </motion.div>

      {/* Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "25px",
        }}
      >
        {levels.map((level) => (
          <motion.div
            key={level.id}
            variants={card}
            whileHover={
              level.status !== "locked"
                ? { scale: 1.03, y: -5 }
                : {}
            }
            className="dashboard-card"
            style={{
              position: "relative",
              opacity: level.status === "locked" ? 0.6 : 1,
              cursor: level.status === "locked" ? "not-allowed" : "pointer",
              border:
                level.status === "active"
                  ? "1px solid #00bcd4"
                  : "1px solid rgba(255,255,255,0.1)",
              transition: "all 0.2s ease",
            }}
          >
            {/* Status Icon */}
            <div style={{ position: "absolute", top: "20px", right: "20px" }}>
              {level.status === "completed" && (
                <CheckCircle color="#4ade80" />
              )}
              {level.status === "active" && (
                <PlayCircle color="#00bcd4" />
              )}
              {level.status === "locked" && <Lock color="#94a3b8" />}
            </div>

            {/* Level */}
            <span
              style={{
                fontSize: "0.8rem",
                textTransform: "uppercase",
                color: level.status === "active" ? "#00bcd4" : "#64748b",
                fontWeight: "bold",
                letterSpacing: "1px",
              }}
            >
              Level {level.id}
            </span>

            {/* Title */}
            <h3 style={{ color: "white", marginTop: "10px" }}>
              {level.title}
            </h3>

            <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
              {level.desc}
            </p>

            {/* Footer */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderTop: "1px solid rgba(255,255,255,0.1)",
                paddingTop: "15px",
                marginTop: "15px",
              }}
            >
              {level.status === "locked" ? (
                <span style={{ color: "#64748b" }}>Locked</span>
              ) : (
                <span
                  style={{
                    color:
                      level.status === "active"
                        ? "#00bcd4"
                        : "#4ade80",
                    fontWeight: "bold",
                  }}
                >
                  {level.status === "active" ? "Continue" : "Review"}
                </span>
              )}

              {/* Stars */}
              {level.status === "completed" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ display: "flex", gap: "2px" }}
                >
                  {[...Array(level.stars)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill="#fbbf24"
                      color="#fbbf24"
                    />
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default LearnPage;