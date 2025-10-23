import React, { useRef, useEffect } from "react";

function FractionPainter({ numerator, denominator, width = 110, height = 110 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Drawing parameters
    const NEW_HEIGHT = 100;
    const WIDTH_HEIGHT_SCALE = 0.98;
    const ar = width / height;
    const _width = ar * NEW_HEIGHT;

    // Calculate integer part & remainder numerator
    const integerPart = Math.floor(numerator / denominator);
    const remainderNum = numerator % denominator;

    // Calculate rectangle width for each pie
    const pieces = integerPart + (remainderNum > 0 ? 1 : 0);
    const deltaWidth = pieces > 0 ? _width / pieces : _width;
    const xStart = (-NEW_HEIGHT * ar + deltaWidth) / 2;

    // Setup transformation matrix similar to original plugin
    ctx.setTransform(width / _width, 0, 0, -height / NEW_HEIGHT, width / 2, height / 2);

    // Helper function to draw full or partial pie
    const drawPie = (num, den, posX) => {
      ctx.save();
      ctx.translate(xStart + posX * deltaWidth, 0);

      const radius = (deltaWidth * WIDTH_HEIGHT_SCALE) / 2;
      const angle = (2 * Math.PI) / den;

      // Draw filled slice (numerator)
      ctx.fillStyle = "#4CAF9D";
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, 0, num * angle);
      ctx.closePath();
      ctx.fill();

      // Draw remainder slice
      ctx.fillStyle = "#F3F4F6";
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, num * angle, 2 * Math.PI);
      ctx.closePath();
      ctx.fill();

      // Draw slice lines
      ctx.strokeStyle = "#4CAF9D";
      ctx.lineWidth = 0.3;
      for (let i = 0; i < den; i++) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, i * angle, (i + 1) * angle);
        ctx.lineTo(0, 0);
        ctx.stroke();
      }

      ctx.restore();
    };

    // Draw integer part as full pies
    for (let i = 0; i < integerPart; i++) {
      drawPie(denominator, denominator, i);
    }

    // Draw fractional remainder part if any
    if (remainderNum > 0) {
      drawPie(remainderNum, denominator, integerPart);
    }
  }, [numerator, denominator, width, height]);

  return <canvas ref={canvasRef} width={width} height={height} />;
}

export default FractionPainter;
