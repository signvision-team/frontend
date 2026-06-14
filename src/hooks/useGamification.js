// src/hooks/useGamification.js
// ─────────────────────────────────────────────────────────────
// Drop this hook into any component that needs live gamification data.
// Handles all loading, error states, and refetching automatically.
//
// Usage:
//   const { xp, badges, streak, rank, awardXP, loading } = useGamification(userId);
// ─────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from "react";
import {
  getUserXP,
  getUserBadges,
  getUserStreak,
  getUserRank,
  awardXP as awardXPApi,
  updateStreak,
} from "../api/gamificationApi";

export const useGamification = (userId) => {
  const [xp, setXP]         = useState(null);
  const [badges, setBadges] = useState([]);
  const [streak, setStreak] = useState(null);
  const [rank, setRank]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  // XP animation state
  const [xpGained, setXpGained]     = useState(0);
  const [leveledUp, setLeveledUp]   = useState(false);
  const [newBadges, setNewBadges]   = useState([]);
  const [showXPPop, setShowXPPop]   = useState(false);

  const fetchAll = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const [xpData, badgeData, streakData, rankData] = await Promise.all([
        getUserXP(userId),
        getUserBadges(userId),
        getUserStreak(userId),
        getUserRank(userId),
      ]);
      setXP(xpData);
      setBadges(badgeData.badges || []);
      setStreak(streakData);
      setRank(rankData);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // On daily login, update streak automatically
  const handleDailyStreak = useCallback(async () => {
    if (!userId) return;
    try {
      const result = await updateStreak(userId);
      if (result.streak_extended && result.xp_awarded > 0) {
        // Streak XP bonus — show animation
        setXpGained(result.xp_awarded);
        setShowXPPop(true);
        setTimeout(() => setShowXPPop(false), 2500);
        await fetchAll();
      }
    } catch (e) {
      console.warn("Streak update failed silently:", e.message);
    }
  }, [userId, fetchAll]);

  useEffect(() => {
    fetchAll();
    handleDailyStreak();
  }, [fetchAll, handleDailyStreak]);

  /**
   * Award XP and trigger animations automatically.
   * Call this from any component after an action.
   *
   * @param {string} eventType - "lesson_complete" | "quiz_correct" | etc.
   * @param {string|number} referenceId - optional lesson/quiz ID
   */
  const awardXP = useCallback(async (eventType, referenceId = null) => {
    if (!userId) return null;
    try {
      const result = await awardXPApi(userId, eventType, referenceId);

      // Trigger XP pop animation
      setXpGained(result.xp_awarded);
      setShowXPPop(true);
      setTimeout(() => setShowXPPop(false), 2500);

      // Trigger level-up state
      if (result.leveled_up) {
        setLeveledUp(true);
        setTimeout(() => setLeveledUp(false), 4000);
      }

      // Trigger badge notifications
      if (result.badges_earned?.length > 0) {
        setNewBadges(result.badges_earned);
        setTimeout(() => setNewBadges([]), 4000);
      }

      // Refresh all data
      await fetchAll();
      return result;
    } catch (e) {
      console.warn("XP award failed silently:", e.message);
      return null;
    }
  }, [userId, fetchAll]);

  return {
    // Data
    xp,           // { total_xp, current_level, xp_progress_percent, xp_for_next_level, signs_learned }
    badges,       // array of earned badges
    streak,       // { current_streak, longest_streak }
    rank,         // { rank, total_xp, current_level }
    loading,
    error,

    // Actions
    awardXP,      // call this after any action
    refetch: fetchAll,

    // Animation triggers (pass these to your animation components)
    xpGained,     // number — how much XP was just awarded
    leveledUp,    // boolean — true for 4s after leveling up
    newBadges,    // string[] — badge names just earned
    showXPPop,    // boolean — true for 2.5s after XP award
  };
};