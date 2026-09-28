"use client";

import Image from "next/image";
import { useRef, type CSSProperties, type PointerEvent } from "react";
import type { Locale } from "@/lib/site";
import styles from "./pikachu-holo-card.module.css";

const initialStyle = {
  "--tilt-x": "0deg",
  "--tilt-y": "0deg",
  "--card-x": "50%",
  "--card-y": "50%",
} as CSSProperties;

export function PikachuHoloCard({ locale }: { locale: Locale }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const reset = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty("--tilt-x", "0deg");
    card.style.setProperty("--tilt-y", "0deg");
    card.style.setProperty("--card-x", "50%");
    card.style.setProperty("--card-y", "50%");
  };

  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    const card = cardRef.current;
    if (!card) return;
    const bounds = card.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
    const y = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));
    card.style.setProperty("--tilt-x", `${(0.5 - y) * 12}deg`);
    card.style.setProperty("--tilt-y", `${(x - 0.5) * 14}deg`);
    card.style.setProperty("--card-x", `${x * 100}%`);
    card.style.setProperty("--card-y", `${y * 100}%`);
  };

  return (
    <div
      ref={cardRef}
      className={styles.card}
      style={initialStyle}
      role="img"
      aria-label={locale === "en" ? "Running Pikachu holographic card" : "奔跑皮卡丘镭射卡"}
      onPointerMove={move}
      onPointerLeave={reset}
    >
      <div className={styles.foil} aria-hidden="true" />
      <div className={styles.grid} aria-hidden="true" />
      <div className={styles.header}>
        <span>POKÉMON · 025</span>
        <span>SSR / 001</span>
      </div>
      <div className={styles.subject} aria-hidden="true">
        <Image
          src="/pikachu-runner.svg"
          alt=""
          fill
          sizes="(max-width: 760px) 240px, 280px"
          unoptimized
        />
      </div>
      <div className={styles.copy}>
        <span className={styles.kicker}>ELECTRIC · RUNNER</span>
        <h2>{locale === "en" ? "PIKACHU" : "皮卡丘"}</h2>
        <p>{locale === "en" ? "A flash of courage." : "把勇气跑成一道闪电"}</p>
      </div>
      <div className={styles.stats}>
        <span>HP 060</span>
        <span>LIGHTNING TYPE</span>
      </div>
      <span className={styles.sheen} aria-hidden="true" />
    </div>
  );
}
