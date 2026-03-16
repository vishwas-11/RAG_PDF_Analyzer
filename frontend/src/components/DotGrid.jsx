'use client';
import { useRef, useEffect, useCallback, useMemo } from 'react';
import { gsap } from 'gsap';

const DotGrid = ({
  dotSize = 2,
  gap = 35,
  baseColor = '#2e1065', // Dark Violet
  activeColor = '#a855f7', // Electric Purple
  proximity = 140,
  returnDuration = 1.2
}) => {
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);
  const dotsRef = useRef([]);
  const pointerRef = useRef({ x: -1000, y: -1000 });

  const buildGrid = useCallback(() => {
    const wrap = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const { width, height } = wrap.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.scale(dpr, dpr);

    const cols = Math.floor(width / gap);
    const rows = Math.floor(height / gap);
    const startX = (width - (cols - 1) * gap) / 2;
    const startY = (height - (rows - 1) * gap) / 2;

    const dots = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        dots.push({ cx: startX + x * gap, cy: startY + y * gap, xOffset: 0, yOffset: 0 });
      }
    }
    dotsRef.current = dots;
  }, [gap]);

  useEffect(() => {
    let rafId;
    const draw = () => {
      const ctx = canvasRef.current?.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      dotsRef.current.forEach(dot => {
        const dx = dot.cx - pointerRef.current.x;
        const dy = dot.cy - pointerRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        ctx.beginPath();
        ctx.arc(dot.cx + dot.xOffset, dot.cy + dot.yOffset, dotSize / 2, 0, Math.PI * 2);
        ctx.fillStyle = dist < proximity ? activeColor : baseColor;
        ctx.fill();
      });
      rafId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(rafId);
  }, [baseColor, activeColor, dotSize, proximity]);

  useEffect(() => {
    buildGrid();
    const handleMove = (e) => {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      pointerRef.current = { x, y };

      dotsRef.current.forEach(dot => {
        const dist = Math.sqrt(Math.pow(dot.cx - x, 2) + Math.pow(dot.cy - y, 2));
        if (dist < proximity) {
          gsap.to(dot, {
            xOffset: (dot.cx - x) * 0.15,
            yOffset: (dot.cy - y) * 0.15,
            duration: 0.3,
            onComplete: () => {
              gsap.to(dot, { xOffset: 0, yOffset: 0, duration: returnDuration, ease: "elastic.out(1, 0.3)" });
            }
          });
        }
      });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [buildGrid, proximity, returnDuration]);

  return (
    <div ref={wrapperRef} className="w-full h-full">
      <canvas ref={canvasRef} className="block pointer-events-none" />
    </div>
  );
};

export default DotGrid;