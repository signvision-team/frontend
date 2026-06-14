// src/features/learning/pages/LearnPage.jsx
// Imports fixed for actual file location: src/features/learning/pages/

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Lock, CheckCircle, PlayCircle, Star } from "lucide-react";

// ── FIXED paths: 3 levels up to reach src/api and src/hooks ──
import { getChapters }     from "../../../api/learningApi.js";
import { useGamification } from "../../../hooks/useGamification.js";
import XPAnimation         from "../../../components/gamification/XPAnimation.jsx";
import LevelUpModal        from "../../../components/gamification/LevelUpModal.jsx";
import BadgeNotification   from "../../../components/gamification/BadgeNotification.jsx";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const card = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  show:   { opacity: 1, y: 0,  scale: 1, transition: { duration: 0.4 } },
};

const LearnPage = ({ navigate, userData }) => {
  const userId = userData?.id || userData?.user_id || 1;

  const [chapters, setChapters]             = useState([]);
  const [chaptersLoading, setChaptersLoading] = useState(true);
  const [error, setError]                   = useState(null);

  const {
    xp, showXPPop, xpGained,
    leveledUp, newBadges, refetch: refetchGami,
  } = useGamification(userId);

  const fetchChapters = async () => {
    try {
      setChaptersLoading(true);
      setError(null);
      const data = await getChapters(userId);
      setChapters(data);
    } catch (err) {
      console.error("Failed to load chapters:", err);
      setError("Could not load chapters. Make sure Docker is running on port 8003.");
    } finally {
      setChaptersLoading(false);
    }
  };

  useEffect(() => {
    fetchChapters();
  }, [userId]);

  const handleChapterClick = (chapter) => {
    if (chapter.is_locked) return;
    navigate("CHAPTER_DETAIL", { chapterId: chapter.id });
  };

  // ── Loading state ─────────────────────────────────────────
  if (chaptersLoading) {
    return (
      <div className="dashboard-content" style={{ color: "white", padding: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 20, height: 20, border: "3px solid #00bcd4",
            borderTopColor: "transparent", borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }} />
          Loading learning path...
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // ── Error state ───────────────────────────────────────────
  if (error) {
    return (
      <div className="dashboard-content" style={{ padding: 40 }}>
        <div style={{
          background: "rgba(248,113,113,0.1)", border: "1px solid #f87171",
          borderRadius: 12, padding: 24, color: "#f87171",
        }}>
          <h3 style={{ margin: "0 0 8px" }}>⚠️ Could not load chapters</h3>
          <p style={{ margin: "0 0 16px", color: "#94a3b8" }}>{error}</p>
          <p style={{ margin: "0 0 8px", color: "#94a3b8", fontSize: "0.85rem" }}>
            Check: is Docker running? Open{" "}
            <a href="http://localhost:8003/health" target="_blank" rel="noreferrer"
               style={{ color: "#00bcd4" }}>
              http://localhost:8003/health
            </a>
          </p>
          <button
            onClick={fetchChapters}
            style={{
              marginTop: 12, padding: "10px 24px", background: "#00bcd4",
              color: "black", border: "none", borderRadius: 8,
              cursor: "pointer", fontWeight: "bold",
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-content">

      {showXPPop && <XPAnimation xp={xpGained} />}
      {leveledUp  && <LevelUpModal level={xp?.current_level} />}
      {newBadges.map((b, i) => <BadgeNotification key={i} badge={b} index={i} />)}

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ display: "flex", justifyContent: "space-between",
                 alignItems: "center", marginBottom: "30px" }}
      >
        <div>
          <h2 style={{ color: "white", fontSize: "2rem", margin: 0 }}>
            Learning Path
          </h2>
          <p style={{ color: "#94a3b8", marginTop: "5px" }}>
            Complete chapters to unlock new signs.
          </p>
        </div>

        {/* XP bar */}
        <div style={{ display: "flex", flexDirection: "column",
                      alignItems: "flex-end", gap: 6 }}>
          {xp && (
            <>
              <span style={{ color: "#00bcd4", fontWeight: "bold", fontSize: "0.9rem" }}>
                Level {xp.current_level} — {xp.total_xp} XP
              </span>
              <div style={{ width: 180, height: 8, background: "#1e293b",
                            borderRadius: 20, overflow: "hidden" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${xp.xp_progress_percent}%` }}
                  transition={{ duration: 0.6 }}
                  style={{ height: "100%", background: "#00bcd4", borderRadius: 20 }}
                />
              </div>
              <span style={{ color: "#64748b", fontSize: "0.75rem" }}>
                {xp.xp_progress_percent}% to next level
              </span>
            </>
          )}
        </div>

        <button
          className="btn-secondary"
          onClick={() => navigate("DASHBOARD")}
          style={{ padding: "10px 20px", display: "flex", gap: "8px" }}
        >
          <ArrowLeft size={18} /> Back
        </button>
      </motion.div>

      {/* No chapters yet */}
      {chapters.length === 0 && (
        <div style={{
          textAlign: "center", padding: 60,
          color: "#64748b", border: "1px dashed #334155",
          borderRadius: 16,
        }}>
          <div style={{ fontSize: "3rem", marginBottom: 16 }}>📚</div>
          <h3 style={{ color: "white", marginBottom: 8 }}>No chapters yet</h3>
          <p>Add chapters via the admin API at{" "}
            <a href="http://localhost:8003/docs" target="_blank" rel="noreferrer"
               style={{ color: "#00bcd4" }}>
              localhost:8003/docs
            </a>
          </p>
        </div>
      )}

      {/* Chapter grid */}
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
        {chapters.map((chapter) => (
          <motion.div
            key={chapter.id}
            variants={card}
            whileHover={!chapter.is_locked ? { scale: 1.03, y: -5 } : {}}
            onClick={() => handleChapterClick(chapter)}
            className="dashboard-card"
            style={{
              position: "relative",
              opacity: chapter.is_locked ? 0.6 : 1,
              cursor: chapter.is_locked ? "not-allowed" : "pointer",
              border:
                chapter.completed_lessons === chapter.total_lessons && chapter.total_lessons > 0
                  ? "1px solid #4ade80"
                  : chapter.completed_lessons > 0
                  ? "1px solid #00bcd4"
                  : "1px solid rgba(255,255,255,0.1)",
            }}
          >
            {chapter.thumbnail_url && (
              <img src={chapter.thumbnail_url} alt={chapter.title}
                   style={{ width: "100%", height: 140, objectFit: "cover",
                            borderRadius: 8, marginBottom: 12 }} />
            )}

            <div style={{ position: "absolute", top: "20px", right: "20px" }}>
              {chapter.completed_lessons === chapter.total_lessons && chapter.total_lessons > 0
                ? <CheckCircle color="#4ade80" />
                : chapter.is_locked
                ? <Lock color="#94a3b8" />
                : <PlayCircle color="#00bcd4" />}
            </div>

            <span style={{ fontSize: "0.8rem", textTransform: "uppercase",
                           color: chapter.is_locked ? "#64748b" : "#00bcd4",
                           fontWeight: "bold", letterSpacing: "1px" }}>
              {chapter.difficulty} — Chapter {chapter.order_index}
            </span>

            <h3 style={{ color: "white", marginTop: "10px" }}>{chapter.title}</h3>
            <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>{chapter.description}</p>

            <div style={{ width: "100%", height: "10px", background: "#1e293b",
                          borderRadius: "20px", marginTop: "15px", overflow: "hidden" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${chapter.progress_percent}%` }}
                transition={{ duration: 0.6 }}
                style={{ height: "100%", background: "#00bcd4" }}
              />
            </div>

            <p style={{ color: "#94a3b8", marginTop: "8px", fontSize: "0.8rem" }}>
              {chapter.completed_lessons}/{chapter.total_lessons} lessons
              — {chapter.progress_percent}%
            </p>

            <div style={{ display: "flex", justifyContent: "space-between",
                          alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.1)",
                          paddingTop: "15px", marginTop: "15px" }}>
              {chapter.is_locked ? (
                <span style={{ color: "#64748b" }}>Locked</span>
              ) : (
                <span style={{ color: chapter.progress_percent === 100 ? "#4ade80" : "#00bcd4",
                               fontWeight: "bold" }}>
                  {chapter.progress_percent === 100 ? "Review" : "Continue"}
                </span>
              )}
              {chapter.progress_percent === 100 && (
                <div style={{ display: "flex", gap: "2px" }}>
                  {[...Array(3)].map((_, i) => (
                    <Star key={i} size={16} fill="#fbbf24" color="#fbbf24" />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default LearnPage;