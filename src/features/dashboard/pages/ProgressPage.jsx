import React, { useEffect, useState } from "react";
import Card from "../../dashboard/components/Card";
import { getUserXP, getUserBadges, getUserStreak } from "../../../api/gamificationApi";
import { getUserProgress } from "../../../api/learningApi";

const ProgressPage = ({ navigate, userData }) => {
  const userId = userData?.id || userData?.user_id || 1;

  const [xp, setXP] = useState(null);
  const [badges, setBadges] = useState([]);
  const [streak, setStreak] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [xpData, badgeData, streakData, progressData] = await Promise.all([
          getUserXP(userId),
          getUserBadges(userId),
          getUserStreak(userId),
          getUserProgress(userId),
        ]);
        setXP(xpData);
        setBadges(badgeData?.badges || badgeData || []);
        setStreak(streakData);
        setProgress(progressData);
      } catch (err) {
        console.error("Progress load failed:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userId]);

  // —— Styles ——
  const containerStyle = { color: "#e2e8f0", fontFamily: "sans-serif", padding: "20px" };
  const subtitleStyle  = { fontSize: "1.05rem", color: "#94a3b8", marginTop: "5px", marginBottom: "30px" };

  const statsBoxStyle = {
    background: "linear-gradient(135deg, rgba(29,29,53,0.8) 0%, rgba(21,21,38,0.8) 100%)",
    backdropFilter: "blur(12px)", border: "1px solid rgba(74,103,255,0.25)",
    borderRadius: "16px", padding: "25px", boxShadow: "0 15px 35px rgba(10,10,26,0.5)",
    marginBottom: "30px", display: "flex", flexDirection: "column", gap: "15px",
  };

  const progressTrackStyle = {
    width: "100%", height: "10px", backgroundColor: "rgba(15,23,42,0.6)",
    borderRadius: "10px", overflow: "hidden", marginTop: "5px",
    border: "1px solid rgba(255,255,255,0.03)",
  };

  const badgeItemStyle = (borderColor, textHighlight) => ({
    display: "flex", alignItems: "center", gap: "8px",
    backgroundColor: "rgba(30,30,58,0.4)", padding: "8px 16px",
    borderRadius: "20px", border: `1px solid ${borderColor}`,
    color: textHighlight || "#e2e8f0", fontSize: "0.85rem",
    fontWeight: "600", boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
  });

  const chartContainerStyle = {
    background: "rgba(22,22,43,0.6)", border: "1px solid rgba(74,103,255,0.15)",
    borderRadius: "16px", padding: "30px 25px 25px", marginBottom: "35px",
    boxShadow: "0 15px 30px rgba(10,10,26,0.4)",
  };

  const backLinkStyle = {
    display: "inline-flex", alignItems: "center", color: "#60a5fa",
    cursor: "pointer", fontWeight: "600", fontSize: "0.95rem", marginTop: "5px",
  };

  if (loading) {
    return (
      <Card style={{ backgroundColor: "#1a1a2f" }}>
        <div style={{ color: "white", padding: 40 }}>Loading your progress...</div>
      </Card>
    );
  }

  // Fallbacks map across both direct metric and computed progress wrappers
  const proficiencyScore = progress?.overall_progress_percent ?? 0;
  const totalXP          = xp?.total_xp ?? 0;
  const currentLevel     = xp?.current_level ?? 1;
  const xpPercent        = xp?.xp_progress_percent ?? 0;
  
  // Dynamic fallback evaluation logic for chapter signs completed
  const calculatedSignsLearned = progress?.chapters?.reduce((acc, ch) => acc + (ch.completed_lessons || 0), 0) ?? 0;
  const signsLearned     = xp?.signs_learned || progress?.total_completed_lessons || calculatedSignsLearned || 0;

  return (
    <Card style={{ backgroundColor: "#1a1a2f", border: "1px solid rgba(255,255,255,0.05)",
                   boxShadow: "0 20px 40px rgba(0,0,0,0.4)" }}>
      <div style={containerStyle}>

        {/* Header */}
        <h2 style={{ fontSize: "2.2rem", fontWeight: "800", margin: 0,
                     color: "#ffffff", letterSpacing: "-0.5px" }}>
          Your Progress Report
        </h2>
        <p style={subtitleStyle}>
          Track your proficiency, points, and achievement badges.
        </p>

        {/* Stats Box */}
        <div style={statsBoxStyle}>

          {/* Score + XP row */}
          <div style={{ display: "flex", alignItems: "center",
                        justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
            <h3 style={{ fontSize: "1.6rem", fontWeight: "700", color: "#4a67ff",
                         margin: 0, textShadow: "0 0 10px rgba(74,103,255,0.3)" }}>
              Lesson Progress: {proficiencyScore}%
            </h3>
            <span style={{ fontSize: "1.05rem", fontWeight: "600", color: "#60a5fa" }}>
              ⚡ {totalXP} XP · Level {currentLevel}
            </span>
          </div>

          {/* XP progress bar */}
          <div>
            <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: "700",
                           letterSpacing: "1px" }}>
              PROGRESS TO NEXT LEVEL — {xpPercent}%
            </span>
            <div style={progressTrackStyle}>
              <div style={{
                width: `${xpPercent}%`, height: "100%",
                background: "linear-gradient(90deg, #3b82f6 0%, #4a67ff 100%)",
                borderRadius: "10px", boxShadow: "0 0 14px rgba(74,103,255,0.5)",
              }} />
            </div>
          </div>

          {/* Streak */}
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            <div>
              <span style={{ color: "#64748b", fontSize: "0.75rem", fontWeight: 700,
                             letterSpacing: "1px" }}>CURRENT STREAK</span>
              <div style={{ color: "#f97316", fontSize: "1.5rem", fontWeight: "bold" }}>
                🔥 {streak?.current_streak ?? 0} days
              </div>
            </div>
            <div>
              <span style={{ color: "#64748b", fontSize: "0.75rem", fontWeight: 700,
                             letterSpacing: "1px" }}>BEST STREAK</span>
              <div style={{ color: "#fbbf24", fontSize: "1.5rem", fontWeight: "bold" }}>
                ⭐ {streak?.longest_streak ?? 0} days
              </div>
            </div>
            <div>
              <span style={{ color: "#64748b", fontSize: "0.75rem", fontWeight: 700,
                             letterSpacing: "1px" }}>SIGNS LEARNED</span>
              <div style={{ color: "#4ade80", fontSize: "1.5rem", fontWeight: "bold" }}>
                🤟 {signsLearned}
              </div>
            </div>
          </div>

          {/* Badges */}
          <div>
            <label style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: "700",
                            letterSpacing: "1px" }}>EARNED BADGES</label>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "12px" }}>
              {badges.length === 0 ? (
                <span style={{ color: "#64748b" }}>No badges yet. Complete lessons to earn them!</span>
              ) : badges.map((badge, idx) => (
                <div key={badge.id || idx} style={badgeItemStyle("rgba(74,103,255,0.4)", "#adc1ff")}>
                  {badge.icon || "🏅"} {badge.name || badge}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chapter Progress */}
        {progress?.chapters?.length > 0 && (
          <div style={chartContainerStyle}>
            <h4 style={{ margin: "0 0 20px 0", fontSize: "0.8rem", color: "#64748b",
                         fontWeight: "700", letterSpacing: "1px" }}>
              CHAPTER PROGRESS
            </h4>
            {progress.chapters.map((ch) => (
              <div key={ch.id} style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ color: "#e2e8f0", fontSize: "0.9rem" }}>{ch.title}</span>
                  <span style={{ color: "#64748b", fontSize: "0.8rem" }}>
                    {ch.completed_lessons}/{ch.total_lessons}
                  </span>
                </div>
                <div style={{ ...progressTrackStyle, height: 8 }}>
                  <div style={{
                    width: `${ch.progress_percent}%`, height: "100%",
                    background: ch.progress_percent === 100
                      ? "linear-gradient(90deg, #4ade80, #22c55e)"
                      : "linear-gradient(90deg, #3b82f6, #4a67ff)",
                    borderRadius: 10,
                  }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Back link */}
        <span
          style={backLinkStyle}
          onClick={() => navigate("DASHBOARD")}
          onMouseEnter={(e) => { e.currentTarget.style.color = "#ffffff"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "#60a5fa"; }}
        >
          ← Back to Dashboard
        </span>

      </div>
    </Card>
  );
};

export default ProgressPage;