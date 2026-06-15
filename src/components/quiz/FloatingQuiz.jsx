import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const generateFloatingAnimation = () => ({
  x: [0, Math.random() * 40 - 20, Math.random() * 40 - 20, Math.random() * 40 - 20, 0],
  y: [0, Math.random() * 40 - 20, Math.random() * 40 - 20, Math.random() * 40 - 20, 0],
  transition: {
    duration: 6 + Math.random() * 4,
    repeat: Infinity,
    ease: "easeInOut"
  }
});

export default function FloatingQuiz({ 
  lesson, 
  currentQuestion, 
  onCorrectDetection, 
  onIncorrectDetection, // Added handler for wrong answers
  detectedLetter 
}) {
  const [characters, setCharacters] = useState([]);
  const [poppedIds, setPoppedIds] = useState(new Set());
  const [wrongId, setWrongId] = useState(null); // Tracks which ID is currently flashing red

  useEffect(() => {
    if (currentQuestion?.options) {
      const initialChars = currentQuestion.options.map((opt, index) => ({
        id: opt.id || index,
        letter: opt.option_text,
        initialX: 15 + (index * 22) + (Math.random() * 8), 
        initialY: 25 + (Math.random() * 40),
        floatProps: generateFloatingAnimation()
      }));
      setCharacters(initialChars);
      setPoppedIds(new Set());
      setWrongId(null);
    }
  }, [currentQuestion]);

  useEffect(() => {
    if (detectedLetter) {
      const matchedChar = characters.find(
        (c) => c.letter.toLowerCase() === detectedLetter.toLowerCase() && !poppedIds.has(c.id)
      );

      if (matchedChar) {
        const isTargetCorrect = matchedChar.letter === currentQuestion.correct_answer;
        
        if (isTargetCorrect) {
          setPoppedIds((prev) => {
            const next = new Set(prev);
            next.add(matchedChar.id);
            return next;
          });
          
          if (onCorrectDetection) {
            onCorrectDetection(matchedChar.letter);
          }
        } else {
          // HANDLE WRONG DETECTION: Flash bubble red and shake it
          setWrongId(matchedChar.id);
          if (onIncorrectDetection) {
            onIncorrectDetection(matchedChar.letter);
          }
          // Clear the visual error flash after 1 second
          setTimeout(() => setWrongId(null), 1000);
        }
      }
    }
  }, [detectedLetter, characters, currentQuestion, poppedIds, onCorrectDetection, onIncorrectDetection]);

  return (
    <div style={{ marginTop: "15px" }}>
      <h3 style={{ color: "#ffffff", textAlign: "center", marginBottom: "20px", fontSize: "1.4rem" }}>
        Show the sign for: <span style={{ color: "var(--color-primary-cyan)", fontSize: "1.8rem", fontWeight: "800" }}>
          {currentQuestion?.correct_answer}
        </span>
      </h3>

      <div style={{
        position: "relative",
        width: "100%",
        height: "380px",
        background: "rgba(255, 255, 255, 0.03)",
        borderRadius: "20px",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        overflow: "hidden",
        boxShadow: "inset 0 4px 30px rgba(0, 0, 0, 0.2)"
      }}>
        <AnimatePresence>
          {characters.map((char) => {
            const isPopped = poppedIds.has(char.id);
            const isWrong = wrongId === char.id;

            return (
              <motion.div
                key={char.id}
                style={{
                  position: "absolute",
                  left: `${char.initialX}%`,
                  top: `${char.initialY}%`,
                  transform: "translate(-50%, -50%)",
                  userSelect: "none",
                  zIndex: isPopped || isWrong ? 10 : 2
                }}
                animate={
                  isPopped 
                    ? { scale: [1, 1.4, 0], rotate: [0, 15, -15, 0], opacity: [1, 1, 0] } 
                    : isWrong 
                    ? { x: [0, -10, 10, -10, 10, 0] } // Shake animation
                    : char.floatProps
                }
                exit={{ scale: 0, opacity: 0 }}
                transition={
                  isPopped 
                    ? { duration: 0.6, ease: "easeOut" } 
                    : isWrong 
                    ? { duration: 0.5 } 
                    : undefined
                }
              >
                <div style={{
                  width: "75px",
                  height: "75px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.8rem",
                  fontWeight: "bold",
                  color: isPopped ? "#4ade80" : isWrong ? "#f87171" : "#ffffff",
                  background: isPopped 
                    ? "rgba(74, 222, 128, 0.25)" 
                    : isWrong 
                    ? "rgba(248, 113, 113, 0.25)" 
                    : "rgba(255, 255, 255, 0.08)",
                  border: isPopped 
                    ? "2px solid #4ade80" 
                    : isWrong 
                    ? "2px solid #f87171" 
                    : "1px solid rgba(255, 255, 255, 0.2)",
                  boxShadow: isPopped 
                    ? "0 0 25px rgba(74, 222, 128, 0.6)" 
                    : isWrong 
                    ? "0 0 25px rgba(248, 113, 113, 0.6)" 
                    : "0 8px 32px rgba(0, 0, 0, 0.2)",
                  backdropFilter: "blur(6px)",
                  WebkitBackdropFilter: "blur(6px)",
                  transition: "background 0.2s, border 0.2s, color 0.2s, box-shadow 0.2s"
                }}>
                  {char.letter}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}