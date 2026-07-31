import Link from "next/link";
import { ArrowIcon, ExternalIcon, GithubIcon } from "./icons";
import { SignalVisual } from "./signal-visual";
import { SiteHeader } from "./site-header";
import { copy } from "@/lib/content";
import { localePath, site, type Locale } from "@/lib/site";

export function HomePage({ locale, projectPage = false }: { locale: Locale; projectPage?: boolean }) {
  const t = copy[locale];

  return (
    <>
      <SiteHeader locale={locale} projectPage={projectPage} />
      <main lang={locale === "en" ? "en" : "zh-CN"}>
        <section className="hero">
          <div className="hero-grid page-shell">
            <div className="hero-copy">
              <p className="eyebrow">
                <span />
                {t.hero.eyebrow}
              </p>
              <h1>
                {t.hero.title}
                <em>{t.hero.accent}</em>
              </h1>
              <p className="hero-description">{t.hero.description}</p>
              <div className="button-row">
                <Link className="button button-primary" href="#work">
                  {t.hero.primary}
                  <ArrowIcon />
                </Link>
                <a
                  className="button button-ghost"
                  href={site.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GithubIcon />
                  {t.hero.secondary}
                </a>
              </div>
              <div className="status-line">
                <span className="status-dot" />
                {t.hero.status}
              </div>
            </div>
            <SignalVisual />
          </div>
          <div className="stat-strip">
            <div className="page-shell stat-grid">
              {t.stats.map((stat) => (
                <div className="stat" key={stat.label}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section page-shell" id="work">
          <div className="section-heading">
            <div>
              <p className="eyebrow">
                <span />
                {t.projects.eyebrow}
              </p>
              <h2>{t.projects.title}</h2>
            </div>
            <p>{t.projects.intro}</p>
          </div>

          <article className="project-card">
            <div className="project-visual">
              <div className="project-grid-overlay" />
              <div className="face-frame">
                <i className="corner corner-tl" />
                <i className="corner corner-tr" />
                <i className="corner corner-bl" />
                <i className="corner corner-br" />
                <div className="face-outline">
                  <span className="face-eye face-eye-left" />
                  <span className="face-eye face-eye-right" />
                  <span className="face-nose" />
                </div>
              </div>
              <div className="project-wave">
                <svg viewBox="0 0 660 100" preserveAspectRatio="none">
                  <path d="M0 58h76l12-8 12 10 18-2 12-36 15 66 14-45 16 18 22-3 12-10 15 12h60l14-8 16 6 12-34 16 60 15-42 18 24 18-9 16 3h89l14-9 16 11 12-38 17 66 15-43 18 19 18-5h43" />
                </svg>
              </div>
              <span className="visual-label visual-label-top">FACE REGION · 01</span>
              <span className="visual-label visual-label-bottom">SIGNAL QUALITY · 94%</span>
            </div>
            <div className="project-copy">
              <span className="project-index">{t.projects.featured}</span>
              <h3>{t.projects.openRppg.title}</h3>
              <p className="project-subtitle">{t.projects.openRppg.subtitle}</p>
              <p className="project-description">
                {t.projects.openRppg.description}
              </p>
              <div className="tag-list">
                {t.projects.openRppg.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <div className="project-actions">
                <Link
                  className="text-link"
                  href={localePath(locale, "/projects/open-rppg/case-study")}
                >
                  {t.projects.openRppg.details}
                  <ArrowIcon />
                </Link>
                <a
                  className="project-action-link"
                  href={site.openRppgDemoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalIcon />
                  {t.projects.openRppg.live}
                </a>
                <a
                  className="project-action-link project-action-github"
                  href={site.openRppgGithubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GithubIcon />
                  {t.projects.openRppg.github}
                </a>
                <Link
                  className="project-action-link"
                  href={`${localePath(locale, "/projects/open-rppg/case-study")}#materials`}
                >
                  {t.projects.openRppg.materials}
                  <ArrowIcon />
                </Link>
              </div>
            </div>
          </article>
          <div className="project-placeholder-grid">
            {t.projects.placeholders.map((project) => (
              <article className="project-placeholder-card" key={project.index}>
                <div className="placeholder-topline">
                  <span>{project.status}</span>
                  <strong>{project.index}</strong>
                </div>
                <div className="placeholder-mark" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="expertise-section" id="expertise">
          <div className="section page-shell">
            <div className="section-heading expertise-heading">
              <div>
                <p className="eyebrow">
                  <span />
                  {t.expertise.eyebrow}
                </p>
                <h2>{t.expertise.title}</h2>
              </div>
            </div>
            <div className="expertise-grid">
              {t.expertise.items.map((item) => (
                <article key={item.number}>
                  <span>{item.number}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="about-section page-shell" id="about">
          <div className="about-rule" />
          <p className="eyebrow">
            <span />
            {t.about.eyebrow}
          </p>
          <div className="about-grid">
            <h2>{t.about.title}</h2>
            <div>
              <p>{t.about.description}</p>
              <a
                className="text-link"
                href={site.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t.about.contact}
                <ExternalIcon />
              </a>
            </div>
          </div>
        </section>
      </main>
      <footer lang={locale === "en" ? "en" : "zh-CN"}>
        <div className="page-shell footer-inner">
          <span>© {new Date().getFullYear()} BLUES‑BERRY</span>
          <span>{t.footer}</span>
        </div>
      </footer>
    </>
  );
}
