"use client";

import { useEffect } from "react";

export function GalaxyCursorNebula() {
  useEffect(() => {
    const directory = document.getElementById("project-directory");
    const pointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!directory || !pointer.matches) return;

    const nebula = document.createElement("div");
    nebula.className = "galaxy-cursor-nebula";
    nebula.setAttribute("aria-hidden", "true");
    document.body.appendChild(nebula);

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;
    let frame: number | null = null;

    const move = (event: MouseEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
    };

    const tick = () => {
      currentX += (targetX - currentX) * 0.14;
      currentY += (targetY - currentY) * 0.14;
      nebula.style.left = `${currentX}px`;
      nebula.style.top = `${currentY}px`;
      frame = window.requestAnimationFrame(tick);
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        if (frame !== null) window.cancelAnimationFrame(frame);
        frame = null;
      } else if (frame === null) {
        frame = window.requestAnimationFrame(tick);
      }
    };

    window.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    tick();

    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (frame !== null) window.cancelAnimationFrame(frame);
      nebula.remove();
    };
  }, []);

  return null;
}
