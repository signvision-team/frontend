// src/components/dashboard/DashboardIndividual.jsx
import React, { useEffect, useState } from "react";
import { getUserXP, getUserStreak, getUserRank } from "../../../api/gamificationApi";

const DashboardIndividual = ({ navigate = () => {}, userData }) => {
  // Gracefully fallback to ID 1 if userData hasn't mounted into state yet
  const userId = userData?.id || userData?.user_id || 1;

  const [xpData, setXpData] = useState(null);
  const [streakData, setStreakData] = useState(null);
  const [rankData, setRankData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardMetrics = async () => {
      try {
        setLoading(true);
        // Fetch leaderboard position, streak counters, and levels concurrently
        const [xp, streak, rank] = await Promise.all([
          getUserXP(userId),
          getUserStreak(userId),
          getUserRank(userId),
        ]);
        
        setXpData(xp);
        setStreakData(streak);
        setRankData(rank);
      } catch (error) {
        console.error("Error fetching live dashboard statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardMetrics();
  }, [userId]);

  // Derived metrics from fallback layers or live states
  const currentLevel = xpData?.current_level ?? "—";
  const totalXP = xpData?.total_xp ?? 0;
  const currentStreak = streakData?.current_streak ?? 0;
  
  // Format rank message conditionally based on API response
  const rankSubtext = rankData?.rank 
    ? `Ranked #${rankData.rank} globally` 
    : "Keep learning to climb ranks!";

  return (
    <div className="dashboard-content">
      <div className="dashboard-cards" style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
        
        {/* Progress Card */}
        <div className="dashboard-card" style={{ flex: 1, minWidth: "150px" }}>
          <h3>My Progress</h3>
          <p className="big" style={{ opacity: loading ? 0.6 : 1 }}>
            {loading ? "..." : `Level ${currentLevel}`}
          </p>
          <span className="card-subtext">{loading ? "Loading metrics..." : `${totalXP} Total XP`}</span>
        </div>

        {/* Detections/Rank Card */}
        <div className="dashboard-card" style={{ flex: 1, minWidth: "150px" }}>
          <h3>Global Standing</h3>
          <p className="big" style={{ opacity: loading ? 0.6 : 1 }}>
            {loading ? "..." : rankData?.rank ? `#${rankData.rank}` : "—"}
          </p>
          <span className="card-subtext">{loading ? "Syncing..." : rankSubtext}</span>
        </div>

        {/* Daily Streak Card */}
        <div className="dashboard-card" style={{ flex: 1, minWidth: "150px" }}>
          <h3>Daily Streak</h3>
          <p className="big" style={{ opacity: loading ? 0.6 : 1 }}>
            {loading ? "..." : `🔥 ${currentStreak} Day${currentStreak === 1 ? "" : "s"}`}
          </p>
          <span className="card-subtext">
            {streakData?.is_active_today ? "Active today!" : "Complete a task to save your streak!"}
          </span>
        </div>

      </div>

      <div className="dashboard-actions">
        <button
          className="btn-primary"
          onClick={() => navigate("DETECTION")}
        >
          Start Detection
        </button>

        <button
          className="btn-primary"
          onClick={() => navigate("LEARN")}
        >
          Continue Learning
        </button>
      </div>
    </div>
  );
};

export default DashboardIndividual;