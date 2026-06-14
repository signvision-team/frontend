// src/components/gamification/XPAnimation.jsx
// Drop-in replacement for your existing XPAnimation.
// Now accepts xp as a prop and uses it directly.

import { useEffect, useState } from "react";

export default function XPAnimation({ xp }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (xp > 0) {
      setShow(true);
      const t = setTimeout(() => setShow(false), 2500);
      return () => clearTimeout(t);
    }
  }, [xp]);

  if (!show) return null;

  return (
    <div style={{
      position: "fixed", top: 40, right: 40,
      background: "linear-gradient(135deg, #fbbf24, #f97316)",
      color: "black", padding: "12px 24px",
      borderRadius: "16px", fontWeight: "bold", fontSize: "1.2rem",
      boxShadow: "0 8px 30px rgba(251,191,36,0.4)",
      zIndex: 9999,
      animation: "xpBounce 0.4s ease",
    }}>
      +{xp} XP ⚡
      <style>{`
        @keyframes xpBounce {
          0%   { transform: scale(0.5) translateY(-20px); opacity: 0; }
          60%  { transform: scale(1.2) translateY(0);     opacity: 1; }
          100% { transform: scale(1)   translateY(0);     opacity: 1; }
        }
      `}</style>
    </div>
  );
}