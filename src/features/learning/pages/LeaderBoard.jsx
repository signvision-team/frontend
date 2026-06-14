// src/pages/Leaderboard.jsx
// ─────────────────────────────────────────────────────────────
// Replaces your old Leaderboard that called http://127.0.0.1:8000/leaderboard
// Now calls the real Gamification Service.
// ─────────────────────────────────────────────────────────────

import { useEffect, useState } from "react";
import { getLeaderboard, getUserRank } from "../../../api/gamificationApi";

export default function Leaderboard({ userData }) {
  const userId = userData?.id || 1;

  const [leaders, setLeaders]   = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [boardData, rankData] = await Promise.all([
          getLeaderboard(50),
          getUserRank(userId),
        ]);
        setLeaders(boardData.entries || []);
        setUserRank(rankData);
      } catch (err) {
        console.error("Leaderboard load failed:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userId]);

  const medalColors = { 1: "#FFD700", 2: "#C0C0C0", 3: "#CD7F32" };

  if (loading) return <div style={{ color: "white", padding: 40 }}>Loading leaderboard...</div>;

  return (
    <div style={{ padding: "20px", color: "white" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "8px" }}>
        🏆 Leaderboard
      </h1>

      {/* Your rank banner */}
      {userRank?.rank && (
        <div style={{
          background: "rgba(0,188,212,0.1)", border: "1px solid #00bcd4",
          borderRadius: 12, padding: "12px 20px", marginBottom: 24,
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span style={{ color: "#94a3b8" }}>Your Rank</span>
          <span style={{ color: "#00bcd4", fontWeight: "bold", fontSize: "1.2rem" }}>
            #{userRank.rank} — {userRank.total_xp} XP — Level {userRank.current_level}
          </span>
        </div>
      )}

      {/* Leaderboard list */}
      {leaders.map((user) => (
        <div
          key={user.rank}
          style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            background: user.user_id === userId
              ? "rgba(0,188,212,0.15)"
              : "rgba(255,255,255,0.04)",
            border: user.user_id === userId
              ? "1px solid #00bcd4"
              : "1px solid rgba(255,255,255,0.08)",
            padding: "14px 20px", marginBottom: "10px",
            borderRadius: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{
              fontSize: "1.3rem",
              color: medalColors[user.rank] || "#64748b",
              fontWeight: "bold", minWidth: 32,
            }}>
              {user.rank <= 3 ? ["🥇","🥈","🥉"][user.rank - 1] : `#${user.rank}`}
            </span>
            <div>
              <div style={{ fontWeight: "bold" }}>
                User {user.user_id}
                {user.user_id === userId && (
                  <span style={{ color: "#00bcd4", fontSize: "0.75rem", marginLeft: 8 }}>
                    (You)
                  </span>
                )}
              </div>
              <div style={{ color: "#64748b", fontSize: "0.8rem" }}>
                Level {user.current_level} · {user.signs_learned} signs learned
              </div>
            </div>
          </div>
          <span style={{ color: "#fbbf24", fontWeight: "bold", fontSize: "1.1rem" }}>
            {user.total_xp} XP
          </span>
        </div>
      ))}
    </div>
  );
}