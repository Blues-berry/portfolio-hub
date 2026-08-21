"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import styles from "./journey-gate.module.css";

type Phase = "idle" | "launch" | "cruise" | "arrival" | "dock";
const journeyStorageKey = "portfolio-journey-completed";
const timeline: ReadonlyArray<readonly [Exclude<Phase, "idle">, number]> = [["cruise", 360], ["arrival", 1640], ["dock", 2660]];

export function JourneyGate({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [visible, setVisible] = useState(true);
  const [flight, setFlight] = useState<CSSProperties>({});
  const buttonRef = useRef<HTMLButtonElement>(null);
  const timersRef = useRef<number[]>([]);
  const clearTimers = () => { timersRef.current.forEach((timer) => window.clearTimeout(timer)); timersRef.current = []; };

  useEffect(() => {
    const directToDirectory = window.location.hash === "#project-directory" || new URLSearchParams(window.location.search).has("skip-intro");
    let completed = directToDirectory;
    try {
      if (directToDirectory) window.sessionStorage.setItem(journeyStorageKey, "1");
      else completed = window.sessionStorage.getItem(journeyStorageKey) === "1";
    } catch { /* Private browsing can deny storage. */ }
    if (completed || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.body.classList.remove("journey-locked");
      document.body.classList.add("journey-complete");
      const timer = window.setTimeout(() => setVisible(false), 0);
      return () => window.clearTimeout(timer);
    }
    document.body.classList.remove("journey-complete");
    document.body.classList.add("journey-locked");
    return () => { clearTimers(); document.body.classList.remove("journey-locked", "journey-complete"); };
  }, []);

  const enter = () => {
    if (phase !== "idle" || !buttonRef.current) return;
    try { window.sessionStorage.setItem(journeyStorageKey, "1"); } catch { /* Continue without persistence. */ }
    const source = buttonRef.current.getBoundingClientRect();
    const dot = document.querySelector(".directory-orbit i:nth-of-type(3)")?.getBoundingClientRect();
    const target = dot ?? document.querySelector(".directory-orbit-core")?.getBoundingClientRect();
    const startX = source.left + source.width / 2;
    const startY = source.top + source.height / 2;
    const endX = target ? target.left + target.width / 2 : window.innerWidth * .78;
    const endY = target ? target.top + target.height / 2 : window.innerHeight * .39;
    const planetX = window.innerWidth * .5;
    const planetY = window.innerHeight * .5;
    setFlight({
      "--launch-x": `${startX}px`, "--launch-y": `${startY}px`,
      "--cruise-x": `${planetX - startX}px`, "--cruise-y": `${planetY - startY - Math.min(150, window.innerHeight * .14)}px`,
      "--planet-x": `${planetX - startX}px`, "--planet-y": `${planetY - startY}px`,
      "--dock-x": `${endX - startX}px`, "--dock-y": `${endY - startY}px`,
    } as CSSProperties);
    setPhase("launch"); clearTimers();
    timeline.forEach(([next, delay]) => timersRef.current.push(window.setTimeout(() => setPhase(next), delay)));
    timersRef.current.push(window.setTimeout(() => { document.body.classList.remove("journey-locked"); document.body.classList.add("journey-complete"); setVisible(false); }, 2820));
  };

  return <>
    {visible && <div className={`${styles.gate} ${styles[phase]}`} role="dialog" aria-modal="true" aria-label="开启旅程">
      <div className={styles.signalScene} aria-hidden="true"><div className={styles.chrome}><i /><i /><i /><i /></div><div className={styles.signal}><span />{Array.from({ length: 10 }, (_, index) => <i key={index} />)}<b /><em /></div></div>
      <div className={styles.space} aria-hidden="true">{Array.from({ length: 12 }, (_, index) => <i key={index} />)}</div><div className={styles.planet} aria-hidden="true" /><div className={styles.flash} aria-hidden="true" />
      <div className={styles.flight} style={flight} aria-hidden="true"><div className={styles.ship}><i /><b /></div></div>
      <button ref={buttonRef} className={styles.action} type="button" onClick={enter} autoFocus>开启旅程</button>
    </div>}
    {children}
  </>;
}
