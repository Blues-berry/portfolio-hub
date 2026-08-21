"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

type Phase = "idle" | "launch" | "cruise" | "jump" | "arrive" | "departing";

const timeline = [
  ["cruise", 240],
  ["jump", 1180],
  ["arrive", 1460],
  ["departing", 2480],
] as const;

export function JourneyGate({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [visible, setVisible] = useState(true);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [flight, setFlight] = useState<CSSProperties>({});

  useEffect(() => {
    document.body.classList.add("journey-locked");
    let reducedMotionTimer: number | undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.body.classList.remove("journey-locked");
      document.body.classList.add("journey-complete");
      reducedMotionTimer = window.setTimeout(() => setVisible(false), 0);
    }
    return () => {
      if (reducedMotionTimer) window.clearTimeout(reducedMotionTimer);
      document.body.classList.remove("journey-locked", "journey-complete");
    };
  }, []);

  const enter = () => {
    if (phase !== "idle" || !buttonRef.current) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.body.classList.remove("journey-locked");
      document.body.classList.add("journey-complete");
      setVisible(false);
      return;
    }

    const launch = buttonRef.current.getBoundingClientRect();
    const target = document.querySelector(".directory-orbit-core")?.getBoundingClientRect();
    const startX = launch.left + launch.width / 2;
    const startY = launch.top + launch.height / 2;
    const endX = target ? target.right + Math.min(target.width * 0.22, 34) : window.innerWidth * 0.78;
    const endY = target ? target.top + target.height * 0.22 : window.innerHeight * 0.39;

    setFlight({
      "--launch-x": `${startX}px`, "--launch-y": `${startY}px`,
      "--travel-x": `${endX - startX}px`, "--travel-y": `${endY - startY}px`,
      "--mid-x": `${(endX - startX) * 0.58}px`,
      "--mid-y": `${(endY - startY) * 0.36 - Math.min(window.innerHeight * 0.18, 150)}px`,
    } as CSSProperties);
    setPhase("launch");
    timeline.forEach(([nextPhase, delay]) => window.setTimeout(() => setPhase(nextPhase), delay));
    window.setTimeout(() => {
      document.body.classList.remove("journey-locked");
      document.body.classList.add("journey-complete");
      setVisible(false);
    }, 3000);
  };

  return (
    <>
      {visible && (
        <div className={`journey-gate journey-phase-${phase}`} role="dialog" aria-modal="true">
          <div className="journey-space" aria-hidden="true">{Array.from({ length: 12 }, (_, index) => <i key={index} />)}</div>
          <div className="journey-signal-field" aria-hidden="true"><span /><span /><span /><span /><span /></div>
          <div className="journey-planet" aria-hidden="true"><i /></div>
          <div className="journey-flash" aria-hidden="true" />
          <div className="journey-flight" style={flight} aria-hidden="true"><div className="journey-flight-vector"><div className="journey-ship"><i /><b /><em /></div></div></div>
          <button ref={buttonRef} className="journey-label" type="button" onClick={enter} autoFocus>开启旅程</button>
        </div>
      )}
      {children}
    </>
  );
}
