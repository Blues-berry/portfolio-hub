"use client";

import { useEffect, useRef, useState } from "react";

export function JourneyGate({ children }: { children: React.ReactNode }) {
  const gateRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.classList.add("journey-locked");
    return () => document.body.classList.remove("journey-locked");
  }, []);

  const enter = () => {
    if (open) return;
    setOpen(true);
    const gate = gateRef.current;
    if (!gate) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      document.body.classList.remove("journey-locked");
      gate.remove();
      return;
    }
    window.setTimeout(() => {
      document.body.classList.remove("journey-locked");
      gate.remove();
    }, 260);
  };

  return (
    <>
      <div ref={gateRef} className={`journey-gate${open ? " is-exiting" : ""}`} role="dialog" aria-modal="true">
        <button className="journey-label" type="button" onClick={enter} autoFocus>
          开启旅程
        </button>
      </div>
      {children}
    </>
  );
}
