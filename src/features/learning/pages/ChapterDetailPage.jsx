// src/pages/ChapterDetailPage.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Lock, CheckCircle, PlayCircle, Brain } from "lucide-react";
import { getChapterDetail } from "../../../api/learningApi";
import { useGamification } from "../../../hooks/useGamification";
import { cache } from "../../../api/cache"; 
import LessonModal from "../../../components/learning/LessonModal";
import SignQuiz from "../../../components/quiz/SignQuiz";
import XPAnimation from "../../../components/gamification/XPAnimation";
import LevelUpModal from "../../../components/gamification/LevelUpModal";
import BadgeNotification from "../../../components/gamification/BadgeNotification";

const ChapterDetailPage = ({ navigate, userData, chapterId }) => {
  const userId = userData?.id || userData?.user_id || 1;

  const [chapter, setChapter]           = useState(null);
  const [loading, setLoading]           = useState(true);
  const [openLessonId, setOpenLessonId] = useState(null);
  const [showQuiz, setShowQuiz]         = useState(false);
  const [allQuestions, setAllQuestions] = useState([]);

  const {
    xp, showXPPop, xpGained,
    leveledUp, newBadges, refetch: refetchGami,
  } = useGamification(userId);

  const fetchChapter = async (forceRefresh = false) => {
    try {
      setLoading(true);
      
      // Force refresh on event completion and bust all related local caches
      if (forceRefresh) {
        cache.invalidate(`chapter_${chapterId}_${userId}`);
        cache.invalidate(`chapters_${userId}`);
        cache.invalidate(`progress_${userId}`);
        cache.invalidate(`xp_${userId}`);
        cache.invalidate(`streak_${userId}`);
        cache.invalidate(`badges_${userId}`);
        cache.invalidate(`leaderboard_50`);
      }

      const data = await getChapterDetail(chapterId, userId);
      setChapter(data);

      // FIXED: Normalized dataset extraction to support backend variations
      const questions = (data.lessons || []).flatMap(l => {
        const rawQuiz = l.quiz_questions || l.quizzes || l.quiz || [];
        return Array.isArray(rawQuiz) ? rawQuiz : [rawQuiz];
      }).filter(Boolean);

      setAllQuestions(questions);
    } catch (e) {
      console.error("Error building chapter metrics detail: ", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchChapter(false); 
  }, [chapterId, userId]);

  const handleLessonComplete = async () => {
    setOpenLessonId(null);
    // Bust global cache so the backend recalculates completion percentages
    cache.invalidate(`xp_${userId}`);
    cache.invalidate(`streak_${userId}`);
    if (refetchGami) await refetchGami();
    await fetchChapter(true); 
  };

  const handleQuizComplete = async (earnedXP) => {
    setShowQuiz(false);
    cache.invalidate(`xp_${userId}`);
    cache.invalidate(`streak_${userId}`);
    if (refetchGami) await refetchGami();
    await fetchChapter(true);
  };

  if (loading) return (
    <div className="content-area" style={{ color: "var(--color-primary-cyan)", padding: 40 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 20, height: 20, border: "3px solid var(--color-primary-cyan)",
          borderTopColor: "transparent", borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }} />
        Loading chapter records...
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const canStartQuiz = allQuestions.length > 0;
  const completedCount = chapter?.completed_lessons || 0;
  const totalCount     = chapter?.total_lessons || 0;

  return (
    <div className="content-area" style={{ background: "var(--color-bg-light)", minHeight: "100vh", padding: "20px" }}>

      {showXPPop && <XPAnimation xp={xpGained} />}
      {leveledUp  && <LevelUpModal level={xp?.current_level} />}
      {newBadges.map((b, i) => <BadgeNotification key={i} badge={b} index={i} />)}

      {/* Lesson Modal */}
      {openLessonId && (
        <LessonModal
          lessonId={openLessonId}
          userId={userId}
          onClose={() => setOpenLessonId(null)}
          onComplete={handleLessonComplete}
        />
      )}

      {/* Full Screen Sign Quiz Wrapper */}
      {showQuiz && (
        <SignQuiz
          lessonId={chapterId}
          userId={userId}
          questions={allQuestions}
          onClose={() => setShowQuiz(false)}
          onComplete={handleQuizComplete}
        />
      )}

      {/* Structural Controls Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
        <button 
          className="btn primary" 
          onClick={() => navigate("LEARN")}
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px" }}
        >
          <ArrowLeft size={18} /> Back
        </button>
        <div style={{ flex: 1, minWidth: "200px" }}>
          <h2 style={{ color: "var(--color-text)", margin: 0, fontSize: "2rem" }}>{chapter?.title}</h2>
          <p style={{ color: "#666666", margin: "4px 0 0", fontSize: "0.95rem", fontWeight: "500" }}>
            {completedCount}/{totalCount} lessons complete · {chapter?.progress_percent || 0}%
          </p>
        </div>

        {/* Action Button: Conditional layout rendering */}
        <button
          onClick={() => canStartQuiz ? setShowQuiz(true) : null}
          disabled={!canStartQuiz}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "12px 24px", borderRadius: "var(--btn-radius, 8px)", fontWeight: "bold",
            cursor: canStartQuiz ? "pointer" : "not-allowed",
            background: canStartQuiz
              ? "linear-gradient(135deg, var(--color-primary-cyan), #00acc1)"
              : "#e0e0e0",
            border: "none",
            color: canStartQuiz ? "#ffffff" : "#999999",
            fontSize: "0.95rem",
            boxShadow: canStartQuiz ? "0 4px 12px rgba(0,188,212,0.2)" : "none",
          }}
          title={!canStartQuiz ? "No quiz questions linked to this track" : ""}
        >
          <Brain size={18} />
          {canStartQuiz ? `Take Chapter Quiz (${allQuestions.length} Qs)` : "No quiz yet"}
        </button>
      </div>

      {/* Progress Bar Progress Tracking */}
      <div style={{ width: "100%", height: 12, background: "#dddddd", borderRadius: 20, marginBottom: 28, overflow: "hidden" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${chapter?.progress_percent || 0}%` }}
          transition={{ duration: 0.6 }}
          style={{ height: "100%", background: "var(--color-primary-cyan)", borderRadius: 20 }}
        />
      </div>

      {/* Core Dynamic Lessons Card Section */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {chapter?.lessons?.map((lesson, idx) => (
          <motion.div
            key={lesson.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => !lesson.is_locked && setOpenLessonId(lesson.id)}
            style={{
              background: "var(--color-bg-dark, #ffffff)",
              border: lesson.is_completed
                ? "2px solid #4ade80"
                : lesson.is_locked
                ? "1px solid #e0e0e0"
                : "2px solid var(--color-primary-cyan)",
              borderRadius: "var(--card-radius, 12px)", 
              padding: "20px 24px",
              display: "flex", 
              alignItems: "center", 
              gap: 20,
              cursor: lesson.is_locked ? "not-allowed" : "pointer",
              opacity: lesson.is_locked ? 0.6 : 1,
              boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            whileHover={!lesson.is_locked ? { scale: 1.01, boxShadow: "0 6px 16px rgba(0,0,0,0.06)" } : {}}
          >
            {lesson.thumbnail_url ? (
              <img src={lesson.thumbnail_url} alt={lesson.title}
                   style={{ width: 64, height: 64, borderRadius: 8, objectFit: "cover" }} />
            ) : (
              <div style={{
                width: 64, height: 64, borderRadius: 8,
                background: lesson.is_completed ? "rgba(74,222,128,0.1)" : "#f4f4f4",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.8rem", fontWeight: "bold",
                color: lesson.is_completed ? "#22c55e" : "var(--color-primary-cyan)",
                border: `1px solid ${lesson.is_completed ? "#4ade80" : "#cccccc"}`,
              }}>
                {lesson.sign_letter || "✋"}
              </div>
            )}

            <div style={{ flex: 1 }}>
              <h3 style={{ color: "var(--color-text)", margin: 0, fontSize: "1.1rem", fontWeight: "600" }}>
                {lesson.title}
              </h3>
              {lesson.description && (
                <p style={{ color: "#666666", margin: "4px 0 0", fontSize: "0.9rem", lineHeight: "1.4" }}>
                  {lesson.description}
                </p>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
              <span style={{ color: "#d97706", fontSize: "0.9rem", fontWeight: "bold" }}>
                +{lesson.xp_reward || 15} XP
              </span>
              {lesson.is_completed
                ? <CheckCircle color="#22c55e" size={22} />
                : lesson.is_locked
                ? <Lock color="#999999" size={22} />
                : <PlayCircle color="var(--color-primary-cyan)" size={22} />}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Interactive Callout CTA Block at Base */}
      {canStartQuiz && (
        <motion.div
          onClick={() => setShowQuiz(true)}
          style={{
            marginTop: 32, padding: "24px 32px",
            background: "rgba(0,188,212,0.06)",
            border: "2px dashed var(--color-primary-cyan)",
            borderRadius: "var(--card-radius, 12px)", 
            cursor: "pointer",
            display: "flex", alignItems: "center", gap: 20,
          }}
          whileHover={{ scale: 1.005 }}
        >
          <div style={{
            width: 56, height: 56, borderRadius: 12,
            background: "rgba(0,188,212,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Brain size={28} color="var(--color-primary-cyan)" />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ color: "var(--color-text)", margin: 0, fontSize: "1.2rem", fontWeight: "600" }}>
              Chapter Mastery Sign Quiz
            </h3>
            <p style={{ color: "#666666", margin: "4px 0 0", fontSize: "0.9rem" }}>
              {allQuestions.length} questions interactive verification matrix · Earn up to {allQuestions.length * 15} XP
            </p>
          </div>
          <div style={{ color: "var(--color-primary-cyan)", fontWeight: "bold", fontSize: "1.1rem" }}>
            Start →
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ChapterDetailPage;