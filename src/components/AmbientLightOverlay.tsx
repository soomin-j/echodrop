"use client";

import { useEffect, useRef } from "react";

const LERP_FACTOR = 0.06;
const GRADIENT_RADIUS = 600;
const GRADIENT_OPACITY = 0.2;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function AmbientLightOverlay() {
  const displayPos = useRef({ x: 0, y: 0 });
  const targetPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const initCenter = () => {
      const x = window.innerWidth / 2;
      const y = window.innerHeight / 2;
      displayPos.current = { x, y };
      targetPos.current = { x, y };
      document.documentElement.style.setProperty("--mouse-x", `${x}px`);
      document.documentElement.style.setProperty("--mouse-y", `${y}px`);
    };

    initCenter();

    const handleMove = (e: MouseEvent) => {
      targetPos.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("mousemove", handleMove, { passive: true });

    let rafId: number;
    const tick = () => {
      const { x: dx, y: dy } = displayPos.current;
      const { x: tx, y: ty } = targetPos.current;

      displayPos.current = {
        x: lerp(dx, tx, LERP_FACTOR),
        y: lerp(dy, ty, LERP_FACTOR),
      };

      document.documentElement.style.setProperty(
        "--mouse-x",
        `${displayPos.current.x}px`
      );
      document.documentElement.style.setProperty(
        "--mouse-y",
        `${displayPos.current.y}px`
      );

      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        background: `radial-gradient(${GRADIENT_RADIUS}px at var(--mouse-x) var(--mouse-y), rgba(255,255,255,${GRADIENT_OPACITY}), transparent 70%)`,
        backgroundAttachment: "fixed",
      }}
    />
  );
}
