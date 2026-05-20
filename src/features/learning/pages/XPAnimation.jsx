import { useEffect, useState } from "react";

export default function XPAnimation({ xp }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (xp > 0) {
      setShow(true);

      setTimeout(() => {
        setShow(false);
      }, 2000);
    }
  }, [xp]);

  if (!show) return null;

  return (
    <div className="fixed top-10 right-10 bg-yellow-400 text-black px-4 py-2 rounded-xl shadow-lg animate-bounce z-50">
      +{xp} XP
    </div>
  );
}