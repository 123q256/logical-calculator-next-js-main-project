"use client";

import React, { useEffect, useState } from "react";
import Confetti from "react-confetti";

export default function Celebration() {
  const [show, setShow] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Set window size properly
    const updateSize = () =>
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });

    updateSize();
    window.addEventListener("resize", updateSize);

    // 🎉 Show confetti
    setShow(true);

    const timer = setTimeout(() => setShow(false), 5000);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden", // 🚫 Prevent scrollbars
        zIndex: 9999, // 👆 Always on top
        pointerEvents: "none", // ✋ Don't block clicks
      }}
    >
      <Confetti
        width={windowSize.width}
        height={windowSize.height}
        numberOfPieces={250}
        recycle={false}
      />
    </div>
  );
}
