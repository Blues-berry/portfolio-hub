"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export function JourneyGate({ children }: { children: React.ReactNode }) {
  const gateRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useLayoutEffect(() => {
    const gate = gateRef.current;
    if (!gate) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const context = gsap.context(() => {
      if (reduced) return;
      gsap.to(".journey-kaleidoscope", { rotation: 360, duration: 30, repeat: -1, ease: "none" });
      gsap.to(".journey-kaleidoscope-inner", { rotation: -360, duration: 18, repeat: -1, ease: "none" });
      gsap.to(".journey-orbit", { rotation: -360, duration: 22, repeat: -1, ease: "none" });
      gsap.fromTo(".journey-particle", { autoAlpha: 0.18, scale: 0.65 }, { autoAlpha: 0.9, scale: 1.35, duration: 1.8, repeat: -1, yoyo: true, stagger: { each: 0.16, from: "random" }, ease: "sine.inOut" });
    }, gate);

    return () => context.revert();
  }, []);

  const enter = () => {
    if (open) return;
    setOpen(true);
    const gate = gateRef.current;
    if (!gate) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      gate.remove();
      return;
    }

    gsap.timeline({ onComplete: () => gate.remove() })
      .to(".journey-label", { scale: 1.15, duration: 0.25, ease: "power2.out" })
      .to(".journey-kaleidoscope", { scale: 3.8, rotation: "+=130", duration: 1.15, ease: "expo.in" }, "<")
      .to(".journey-orbit", { scale: 5, rotation: "+=210", duration: 1.05, ease: "expo.in" }, "<")
      .to(".journey-glow", { scale: 7, autoAlpha: 0.9, duration: 0.8, ease: "power3.in" }, "<0.15")
      .to(gate, { autoAlpha: 0, duration: 0.38, ease: "power2.in" }, "-=0.22");
  };

  return (
    <>
      <div ref={gateRef} className={`journey-gate${open ? " is-exiting" : ""}`} role="dialog" aria-modal="true">
        <div className="journey-noise" aria-hidden="true" />
        <div className="journey-glow" aria-hidden="true" />
        <div className="journey-kaleidoscope" aria-hidden="true">
          <div className="journey-kaleidoscope-inner">
            {Array.from({ length: 12 }, (_, index) => <i className="journey-ray" key={index} />)}
          </div>
        </div>
        <div className="journey-orbit" aria-hidden="true"><i /><i /><i /><i /></div>
        <div className="journey-particles" aria-hidden="true">
          {Array.from({ length: 28 }, (_, index) => <i className="journey-particle" key={index} />)}
        </div>
        <div className="journey-corners" aria-hidden="true"><i /><i /><i /><i /></div>
        <button className="journey-label" type="button" onClick={enter} autoFocus>
          开启旅程
        </button>
      </div>
      {children}
    </>
  );
}
