import Link from "next/link";
import Image from "next/image";
import { ArrowIcon } from "./icons";
import { SiteHeader } from "./site-header";
import { copy } from "@/lib/content";
import { type Locale } from "@/lib/site";
import type { CSSProperties } from "react";
import { JourneyGate } from "./journey-gate";
import { getProjectRegistry } from "@/lib/projects";
import type { ProjectDefinition } from "@/lib/projects";
import { GalaxyCursorNebula } from "./galaxy-cursor-nebula";

const starPositions = [
  [5, 12, 2], [12, 31, 1], [18, 8, 1], [24, 46, 2], [31, 18, 1], [37, 66, 1],
  [44, 11, 2], [51, 38, 1], [58, 74, 1], [64, 22, 2], [71, 54, 1], [78, 14, 1],
  [85, 42, 2], [93, 76, 1], [8, 84, 1], [16, 62, 2], [28, 78, 1], [35, 92, 1],
  [47, 58, 1], [55, 91, 2], [67, 88, 1], [74, 68, 1], [88, 90, 2], [97, 28, 1],
  [3, 52, 1], [21, 96, 1], [41, 31, 2], [61, 6, 1], [82, 62, 1], [91, 8, 2],
] as const;

export async function ProjectDirectory({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const directory = t.directory;
  const projects = await getProjectRegistry();
  const featuredProject = projects.find((project) => project.featured);
  const interactiveProject = projects.find((project) => project.id === "game-demos");

  return (
    <JourneyGate>
      <SiteHeader locale={locale} directory />
      <main id="project-directory" className="directory-main" lang={locale === "en" ? "en" : "zh-CN"}>
        <GalaxyCursorNebula />
        <div className="directory-starfield" aria-hidden="true">
          {starPositions.map(([left, top, size], index) => (
            <i
              key={index}
              style={{ "--star-left": `${left}%`, "--star-top": `${top}%`, "--star-size": `${size}px` } as CSSProperties}
            />
          ))}
        </div>
        <div className="directory-wind" aria-hidden="true">
          {Array.from({ length: 11 }, (_, index) => <i key={index} />)}
        </div>
        <DirectoryScenery />
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
            <div className="directory-hero-data" aria-hidden="true">
              <div className="directory-data-chip"><span>FIELD NOTE</span><b>026 / 2026</b></div>
              <div className="directory-data-chip"><span>FLOW STATE</span><b>03.7 Hz</b></div>
              <div className="directory-data-line"><i /><span>RESEARCH → EXPERIENCE</span><b>LIVE</b></div>
            </div>
          </div>
          <DirectoryGalaxy />
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
              href={featuredProject?.demoUrl ?? "https://open-rppg-nu.vercel.app/#experience"}
            >
              <div className="directory-card-meta">
                <span>01 · {featuredProject?.github?.archived ? "ARCHIVED" : "LIVE"}</span>
                <ArrowIcon />
              </div>
              <span className="directory-rarity">SSR · GOLD</span>
              <div className="directory-card-hud" aria-hidden="true">
                <span className="hud-lens" />
                <span className="hud-ring" />
                <span className="hud-crosshair" />
                <span className="hud-caption">FACEPHYS · LOCAL SIGNAL</span>
              </div>
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

            {interactiveProject ? <DirectoryProjectCard project={interactiveProject} locale={locale} index={2} /> : null}
            <DirectoryPlaceholderCard project={t.projects.placeholders[1]} directory={directory} />
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

function DirectoryPlaceholderCard({
  project,
  directory,
}: {
  project: (typeof copy.zh.projects.placeholders)[number];
  directory: typeof copy.zh.directory;
}) {
  const content = (
    <>
      <div className="directory-card-meta">
        <span>{project.index} · {directory.placeholderLabel}</span>
        <span className="directory-card-lock">—</span>
      </div>
      <span className="directory-rarity directory-rarity-muted">LOCKED</span>
      <div className="directory-placeholder-mark" aria-hidden="true">
        <span /><span /><span />
      </div>
      <div className="directory-card-copy">
        <p>{project.status}</p>
        <h3>{project.title}</h3>
        <span>{project.description}</span>
      </div>
    </>
  );

  return <div className="directory-card directory-card-placeholder directory-card-placeholder-2">{content}</div>;
}

function DirectoryProjectCard({
  project,
  locale,
  index,
}: {
  project: ProjectDefinition;
  locale: Locale;
  index: number;
}) {
  const title = project.title[locale];
  const description = project.description[locale];
  const href = project.demoPath ?? project.caseStudyPath;
  const status = project.presentation === "snapshot"
    ? locale === "en" ? "SNAPSHOT" : "截图展示"
    : project.presentation === "collection"
      ? locale === "en" ? "COLLECTION" : "项目集合"
      : locale === "en" ? "PLAYABLE" : "可试玩";

  const content = (
    <>
      <div className="directory-card-meta">
        <span>{String(index).padStart(2, "0")} · {status}</span>
        <span className="directory-card-lock">{href ? "↗" : "—"}</span>
      </div>
      <span className={`directory-rarity ${project.presentation === "snapshot" ? "directory-rarity-muted" : "directory-rarity-demo"}`}>
        {project.presentation === "collection" ? "6 AGENTS" : project.presentation === "snapshot" ? "VIEW" : "PLAY"}
      </span>
      <div className="directory-project-preview" aria-hidden="true">
        {project.previewImage ? <Image src={project.previewImage} alt="" fill sizes="(max-width: 760px) 86vw, 32vw" /> : null}
        <span>{project.presentation === "snapshot" ? "ARCHIVE / PREVIEW" : "OPEN / DEMO"}</span>
      </div>
      <div className="directory-card-copy">
        <p>{project.tags.slice(0, 3).join(" · ")}</p>
        <h3>{title}</h3>
        <span>{description}</span>
      </div>
    </>
  );

  return href ? (
    project.demoPath ? (
      <a className={`directory-card directory-card-placeholder directory-card-project-${index}`} href={project.demoPath} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    ) : (
      <Link className={`directory-card directory-card-placeholder directory-card-project-${index}`} href={project.caseStudyPath!}>
        {content}
      </Link>
    )
  ) : (
    <div className={`directory-card directory-card-placeholder directory-card-project-${index}`}>
      {content}
    </div>
  );
}

function DirectoryScenery() {
  return (
    <div className="directory-scenery" aria-hidden="true">
      <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="water" x1="0" x2="1"><stop stopColor="#6b9f9e" stopOpacity=".08" /><stop offset=".48" stopColor="#b1d8cf" stopOpacity=".58" /><stop offset="1" stopColor="#5e8294" stopOpacity=".1" /></linearGradient>
          <linearGradient id="bridge" x1="0" x2="1"><stop stopColor="#496c82" stopOpacity=".1" /><stop offset=".55" stopColor="#bd765c" stopOpacity=".62" /><stop offset="1" stopColor="#496c82" stopOpacity=".12" /></linearGradient>
          <radialGradient id="canopy"><stop stopColor="#c8ddd3" stopOpacity=".74" /><stop offset="1" stopColor="#496c82" stopOpacity=".04" /></radialGradient>
        </defs>
        <g className="scenery-water">
          <path d="M-40 690 C200 610 355 765 590 690 S970 605 1480 720" fill="none" stroke="url(#water)" strokeWidth="44" />
          <path d="M-40 720 C180 650 410 790 640 720 S1080 645 1480 755" fill="none" stroke="#d2eee4" strokeOpacity=".24" strokeWidth="2" />
          <path d="M-30 760 C260 675 430 825 700 750 S1120 680 1480 790" fill="none" stroke="#6f9aa2" strokeOpacity=".22" strokeWidth="2" />
        </g>
        <g className="scenery-bridge">
          <path d="M475 655 Q650 510 832 655" fill="none" stroke="url(#bridge)" strokeWidth="18" />
          <path d="M475 655 Q650 510 832 655" fill="none" stroke="#f7eee0" strokeOpacity=".58" strokeWidth="2" strokeDasharray="4 11" />
          <path d="M510 653v-66 M570 602v-49 M650 570v-43 M730 602v-49 M795 654v-66" stroke="#496c82" strokeOpacity=".42" strokeWidth="3" />
        </g>
        <g className="scenery-tree">
          <path d="M165 705 C185 585 205 468 184 318" fill="none" stroke="#496c82" strokeOpacity=".56" strokeWidth="15" />
          <path d="M188 500 C124 440 97 392 61 352 M190 458 C255 400 281 353 312 310 M178 414 C131 355 108 309 104 254" fill="none" stroke="#496c82" strokeOpacity=".42" strokeWidth="7" />
          <circle cx="83" cy="285" r="112" fill="url(#canopy)" /><circle cx="242" cy="286" r="128" fill="url(#canopy)" /><circle cx="141" cy="394" r="105" fill="url(#canopy)" />
          <path d="M70 299c22-38 67-59 112-52M185 260c35-22 73-15 111 11M106 376c25-22 55-28 91-15" fill="none" stroke="#c8ddd3" strokeOpacity=".32" strokeWidth="2" />
        </g>
        <g className="scenery-windmill" transform="translate(1210 505)">
          <path d="M0 176 L28 0 L56 176 Z" fill="#496c82" fillOpacity=".34" />
          <path d="M-12 176 H68" stroke="#bd765c" strokeOpacity=".66" strokeWidth="5" />
          <g className="windmill-blades"><circle cx="28" cy="0" r="8" fill="#f6eee1" /><path d="M28 0 L28 -95 Q70 -67 63 -26 Z M28 0 L123 0 Q97 42 55 35 Z M28 0 L28 95 Q-14 68 -7 26 Z M28 0 L-67 0 Q-40 -42 1 -35 Z" fill="#c8ddd3" fillOpacity=".72" /></g>
        </g>
      </svg>
    </div>
  );
}

function DirectoryGalaxy() {
  const armStars = Array.from({ length: 42 }, (_, index) => index);
  return (
    <div className="directory-galaxy" aria-hidden="true">
      <div className="directory-galaxy-orbit directory-galaxy-orbit-inner"><i /><i /></div>
      <div className="directory-galaxy-orbit directory-galaxy-orbit-outer"><i /><i /></div>
      <div className="directory-galaxy-arm directory-galaxy-arm-a">
        {armStars.map((index) => <i key={index} style={{ "--star-y": `${(index - 21) * 1.1}%`, "--star-x": `${index * 0.93}%`, "--star-size": `${Math.max(2, 5 - index * 0.07)}px`, "--star-opacity": Math.max(0.35, 0.95 - index * 0.012), "--star-delay": `${-(index * 0.12)}s` } as CSSProperties} />)}
      </div>
      <div className="directory-galaxy-arm directory-galaxy-arm-b">
        {armStars.map((index) => <i key={index} style={{ "--star-y": `${(index - 21) * 1.1}%`, "--star-x": `${index * 0.93}%`, "--star-size": `${Math.max(2, 5 - index * 0.07)}px`, "--star-opacity": Math.max(0.35, 0.95 - index * 0.012), "--star-delay": `${-(index * 0.12)}s` } as CSSProperties} />)}
      </div>
      <div className="directory-galaxy-core">
        <span className="directory-galaxy-pulse-ring" />
        <span className="directory-galaxy-pulse-ring directory-galaxy-pulse-ring-delay" />
        <span className="directory-galaxy-core-light" />
        <span className="directory-galaxy-core-point" />
      </div>
    </div>
  );
}
