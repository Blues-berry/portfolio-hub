import { ArrowIcon } from "./icons";
import { SiteHeader } from "./site-header";
import { copy } from "@/lib/content";
import { type Locale } from "@/lib/site";

export function ProjectDirectory({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const directory = t.directory;

  return (
    <>
      <SiteHeader locale={locale} directory />
      <main className="directory-main" lang={locale === "en" ? "en" : "zh-CN"}>
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
              <div className={`directory-card directory-card-placeholder directory-card-placeholder-${index + 1}`} key={project.index}>
                <div className="directory-card-meta">
                  <span>{project.index} · {directory.placeholderLabel}</span>
                  <span className="directory-card-lock">—</span>
                </div>
                <span className="directory-rarity directory-rarity-muted">LOCKED</span>
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
              </div>
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
    </>
  );
}
