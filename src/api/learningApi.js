// src/api/learningApi.js  — WITH CACHING
import axios from "axios";
import { API } from "./config";
import { cache } from "./cache";

const learn = axios.create({ baseURL: API.LEARNING });

// ── Chapters ─────────────────────────────────────────────────

export const getChapters = async (userId) => {
  const key = `chapters_${userId}`;
  const cached = cache.get(key);
  if (cached) return cached;                  // ← instant on repeat visit

  const { data } = await learn.get(`/chapters${userId ? `?user_id=${userId}` : ""}`);
  cache.set(key, data);
  return data;
};

export const getChapterDetail = async (chapterId, userId) => {
  const key = `chapter_${chapterId}_${userId}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const { data } = await learn.get(`/chapters/${chapterId}${userId ? `?user_id=${userId}` : ""}`);
  cache.set(key, data);
  return data;
};

// ── Lessons ──────────────────────────────────────────────────

export const getLessonDetail = async (lessonId, userId) => {
  const key = `lesson_${lessonId}_${userId}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const { data } = await learn.get(`/lessons/${lessonId}${userId ? `?user_id=${userId}` : ""}`);
  cache.set(key, data);
  return data;
};

export const completeLesson = async (lessonId, userId, watchTimeSeconds = 0) => {
  const { data } = await learn.post(`/lessons/${lessonId}/complete`, {
    user_id: userId,
    watch_time_seconds: watchTimeSeconds,
  });

  // Invalidate both progress and gamification caches for real-time consistency
  cache.invalidate(`chapters_${userId}`);
  cache.invalidate(`chapter_${data.chapter_id}_${userId}`);
  cache.invalidate(`lesson_${lessonId}_${userId}`);
  cache.invalidate(`progress_${userId}`);
  cache.invalidate(`xp_${userId}`);
  cache.invalidate(`streak_${userId}`);
  
  return data;
};

// ── Quiz ─────────────────────────────────────────────────────

export const submitQuizAnswer = async (userId, questionId, userAnswer) => {
  const { data } = await learn.post("/quiz/submit", {
    user_id: userId,
    question_id: questionId,
    user_answer: userAnswer,
  });
  return data;
};

// ── User Progress ─────────────────────────────────────────────

export const getUserProgress = async (userId) => {
  const key = `progress_${userId}`;
  const cached = cache.get(key);
  if (cached) return cached;                  // ← instant on repeat visit

  const { data } = await learn.get(`/progress/${userId}`);
  cache.set(key, data);
  return data;
};

// ── Admin ─────────────────────────────────────────────────────

export const uploadLessonVideo = async (lessonId, chapterId, file) => {
  const form = new FormData();
  form.append("chapter_id", chapterId);
  form.append("file", file);
  const { data } = await learn.post(`/admin/lessons/${lessonId}/upload/video`, form);
  return data;
};

export const uploadThumbnail = async (lessonId, chapterId, file) => {
  const form = new FormData();
  form.append("chapter_id", chapterId);
  form.append("file", file);
  return (await learn.post(`/admin/lessons/${lessonId}/upload/thumbnail`, form)).data;
};

export const uploadSignImage = async (lessonId, chapterId, file) => {
  const form = new FormData();
  form.append("chapter_id", chapterId);
  form.append("file", file);
  return (await learn.post(`/admin/lessons/${lessonId}/upload/sign-image`, form)).data;
};

export const createChapter  = async (p) => (await learn.post("/admin/chapters", p)).data;
export const createLesson   = async (p) => (await learn.post("/admin/lessons", p)).data;
export const createQuizQuestion = async (p) => (await learn.post("/admin/quiz/questions", p)).data;