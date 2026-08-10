"use client";

import { useEffect, useRef, useState } from "react";

type JourneyVariant = "prism" | "terminal" | "eclipse";

export function JourneyGate({ children }: { children: React.ReactNode }) {
  const gateRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [variant] = useState<JourneyVariant>(() => {
    if (typeof window === "undefined") return "prism";
    const requested = new URLSearchParams(window.location.search).get("intro");
    return requested === "2" ? "terminal" : requested === "3" ? "eclipse" : "prism";
  });

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
      <div ref={gateRef} data-variant={variant} className={`journey-gate${open ? " is-exiting" : ""}`} role="dialog" aria-modal="true">
        <div className="journey-chrome" aria-hidden="true"><i /><i /><i /><i /></div>
        <div className="journey-variant-art" aria-hidden="true">
          {variant === "prism" && <div className="journey-monolith"><span /><i /><i /><i /><i /><i /><b /><b /></div>}
          {variant === "terminal" && <div className="journey-radar"><span className="radar-core" /><span className="radar-sweep" /><i /><i /><i /><b /><b /><em /><em /><em /><em /></div>}
          {variant === "eclipse" && <div className="journey-signal"><span /><i /><i /><i /><i /><i /><i /><i /><i /><i /><b /><em /></div>}
        </div>
        <button className="journey-label" type="button" onClick={enter} autoFocus>
          开启旅程
        </button>
      </div>
      {children}
    </>
  );
}
