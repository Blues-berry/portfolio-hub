import Link from "next/link";
import { ArrowIcon } from "./icons";
import { SiteHeader } from "./site-header";
import { copy } from "@/lib/content";
import { type Locale } from "@/lib/site";
import type { CSSProperties } from "react";
import { JourneyGate } from "./journey-gate";

const starPositions = [
  [5, 12, 2], [12, 31, 1], [18, 8, 1], [24, 46, 2], [31, 18, 1], [37, 66, 1],
  [44, 11, 2], [51, 38, 1], [58, 74, 1], [64, 22, 2], [71, 54, 1], [78, 14, 1],
  [85, 42, 2], [93, 76, 1], [8, 84, 1], [16, 62, 2], [28, 78, 1], [35, 92, 1],
  [47, 58, 1], [55, 91, 2], [67, 88, 1], [74, 68, 1], [88, 90, 2], [97, 28, 1],
  [3, 52, 1], [21, 96, 1], [41, 31, 2], [61, 6, 1], [82, 62, 1], [91, 8, 2],
] as const;

export function ProjectDirectory({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const directory = t.directory;

  return (
    <JourneyGate>
      <SiteHeader locale={locale} directory />
      <main className="directory-main" lang={locale === "en" ? "en" : "zh-CN"}>
        <div className="directory-starfield" aria-hidden="true">
          {starPositions.map(([left, top, size], index) => (
            <i
              key={index}
              style={{ "--star-left": `${left}%`, "--star-top": `${top}%`, "--star-size": `${size}px` } as CSSProperties}
            />
          ))}
        </div>
        <section className="directory-hero page-shell">
          <div className="directory-particles" aria-hidden="true">
            {Array.from({ length: 18 }, (_, index) => <i key={index} />)}
          </div>
          <div className="directory-hero-copy">
            <p className="eyebrow">
              <span />
              {directory.eyebrow}
            </p>
            <h1 aria-label={directory.title}>
              <span className="directory-title-line">{directory.titleLines[0]}</span>
              <span className="directory-title-line">{directory.titleLines[1]}</span>
            </h1>
            <p className="directory-description">{directory.description}</p>
          </div>
          <div className="directory-orbit" aria-hidden="true">
            <div className="directory-orbit-core">03</div>
            <i />
            <i />
            <i />
            <div className="directory-orbit-ship"><span /></div>
          </div>
        </section>

        <section className="directory-section page-shell" aria-labelledby="directory-title">
          <div className="directory-section-heading">
            <div>
              <p className="eyebrow">
                <span />
                {directory.indexLabel}
              </p>
              <h2 id="directory-title">{directory.indexLabel}</h2>
            </div>
            <span className="directory-count">03 / 03</span>
          </div>

          <div className="directory-grid">
            <a
              className="directory-card directory-card-featured"
              href="https://open-rppg-nu.vercel.app/#experience"
            >
              <div className="directory-card-meta">
                <span>01 · LIVE</span>
                <ArrowIcon />
              </div>
              <span className="directory-rarity">SSR · GOLD</span>
              <span className="directory-card-burst" aria-hidden="true">
                {Array.from({ length: 8 }, (_, index) => <i key={index} />)}
              </span>
              <div className="directory-card-signal" aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
              <div className="directory-card-copy">
                <p>{t.projects.openRppg.subtitle}</p>
                <h3>{t.projects.openRppg.title}</h3>
                <span>{directory.openLabel}</span>
              </div>
            </a>

            {t.projects.placeholders.map((project, index) => (
              project.href ? (
                <Link className={`directory-card directory-card-placeholder directory-card-placeholder-${index + 1}`} href={project.href} key={project.index}>
                  <PlaceholderContent project={project} directory={directory} />
                </Link>
              ) : (
                <div className={`directory-card directory-card-placeholder directory-card-placeholder-${index + 1}`} key={project.index}>
                  <PlaceholderContent project={project} directory={directory} />
                </div>
              )
            ))}
          </div>
        </section>

        <p className="directory-footer page-shell">{directory.footer}</p>
      </main>
      <footer lang={locale === "en" ? "en" : "zh-CN"}>
        <div className="page-shell footer-inner">
          <span>© {new Date().getFullYear()} BLUES‑BERRY</span>
          <span>{directory.footer}</span>
        </div>
      </footer>
    </JourneyGate>
  );
}

function PlaceholderContent({
  project,
  directory,
}: {
  project: (typeof copy.zh.projects.placeholders)[number];
  directory: (typeof copy.zh.directory);
}) {
  return (
    <>
      <div className="directory-card-meta">
        <span>{project.index} · {directory.placeholderLabel}</span>
        <span className="directory-card-lock">{project.href ? "↗" : "—"}</span>
      </div>
      <span className={`directory-rarity ${project.href ? "directory-rarity-demo" : "directory-rarity-muted"}`}>
        {project.href ? "PLAYABLE" : "LOCKED"}
      </span>
      <div className="directory-placeholder-mark" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="directory-card-copy">
        <p>{project.status}</p>
        <h3>{project.title}</h3>
        <span>{project.description}</span>
      </div>
    </>
  );
}
