"use client";

import { useEffect, useState } from "react";

export function JourneyGate({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    document.body.classList.add("journey-locked");
    return () => document.body.classList.remove("journey-locked");
  }, []);

  const enter = () => {
    if (open) return;
    setOpen(true);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      document.body.classList.remove("journey-locked");
      setVisible(false);
      return;
    }
    window.setTimeout(() => {
      document.body.classList.remove("journey-locked");
      setVisible(false);
    }, 260);
  };

  return (
    <>
      {visible && <div data-variant="eclipse" className={`journey-gate${open ? " is-exiting" : ""}`} role="dialog" aria-modal="true">
        <div className="journey-chrome" aria-hidden="true"><i /><i /><i /><i /></div>
        <div className="journey-variant-art" aria-hidden="true">
          <div className="journey-signal"><span /><i /><i /><i /><i /><i /><i /><i /><i /><i /><b /><em /></div>
        </div>
        <button className="journey-label" type="button" onClick={enter} autoFocus>
          开启旅程
        </button>
      </div>}
      {children}
    </>
  );
}
