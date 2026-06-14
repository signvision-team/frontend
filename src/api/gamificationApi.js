// src/api/gamificationApi.js
import axios from "axios";
import { API } from "./config";
import { cache } from "./cache";

const gami = axios.create({ baseURL: API.GAMIFICATION });
// src/api/gamificationApi.js

export const getUserXP = async (userId) => {
  const key = `xp_${userId}`;
  const cached = cache.get(key);
  if (cached) return cached;
  
  // ── COMBINED PATH: /xp from main.py + /user/${userId}/xp from your router file
  const { data } = await gami.get(`/xp/user/${userId}`);
  cache.set(key, data);
  return data;
};

export const getXPHistory = async (userId, limit = 20) => {
  // ── COMBINED PATH HERE TOO ──
  const { data } = await gami.get(`/xp/user/${userId}/xp/history?limit=${limit}`);
  return data;
};

// ... keep all other code exactly the same

export const awardXP = async (userId, eventType, referenceId = null, description = null) => {
  const { data } = await gami.post("/xp/award", {
    user_id: userId, event_type: eventType,
    reference_id: referenceId ? String(referenceId) : null, description,
  });
  // Invalidate cached XP so it refreshes
  cache.invalidate(`xp_${userId}`);
  cache.invalidate(`badges_${userId}`);
  return data;
};

export const getUserBadges = async (userId) => {
  const key = `badges_${userId}`;
  const cached = cache.get(key);
  if (cached) return cached;
  const { data } = await gami.get(`/badges/user/${userId}`);
  cache.set(key, data);
  return data;
};

export const getAllBadges = async () => {
  const cached = cache.get("all_badges");
  if (cached) return cached;
  const { data } = await gami.get("/badges/all");
  cache.set("all_badges", data);
  return data;
};

export const getUserStreak = async (userId) => {
  const key = `streak_${userId}`;
  const cached = cache.get(key);
  if (cached) return cached;
  const { data } = await gami.get(`/streaks/user/${userId}`);
  cache.set(key, data);
  return data;
};

export const updateStreak = async (userId) => {
  const { data } = await gami.post("/streaks/update", { user_id: userId });
  cache.invalidate(`streak_${userId}`);
  return data;
};

export const getLeaderboard = async (limit = 50) => {
  const key = `leaderboard_${limit}`;
  const cached = cache.get(key);
  if (cached) return cached;
  const { data } = await gami.get(`/leaderboard/global?limit=${limit}`);
  cache.set(key, data);
  return data;
};

export const getUserRank = async (userId) => {
  const { data } = await gami.get(`/leaderboard/user/${userId}/rank`);
  return data;
};