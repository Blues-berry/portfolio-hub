import Link from "next/link";
import { ArrowIcon, ExternalIcon, GithubIcon } from "./icons";
import { SiteHeader } from "./site-header";
import { copy } from "@/lib/content";
import { localePath, site, type Locale } from "@/lib/site";

export function ProjectDetail({ locale }: { locale: Locale }) {
  const t = copy[locale].detail;

  return (
    <>
      <SiteHeader locale={locale} detail caseStudy />
      <main
        className="detail-main"
        lang={locale === "en" ? "en" : "zh-CN"}
      >
        <section className="detail-hero page-shell">
          <Link className="back-link" href={localePath(locale, "/projects/open-rppg")}>
            <ArrowIcon />
            {t.back}
          </Link>
          <div className="detail-hero-grid">
            <div>
              <p className="eyebrow">
                <span />
                {t.eyebrow}
              </p>
              <h1>{t.title}</h1>
              <p className="detail-subtitle">{t.subtitle}</p>
              <div className="button-row">
                <a
                  className="button button-primary"
                  href={site.openRppgDemoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t.live}
                  <ExternalIcon />
                </a>
                <a
                  className="button button-ghost"
                  href={site.openRppgGithubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GithubIcon />
                  {t.source}
                </a>
              </div>
            </div>
            <div className="detail-meter" aria-hidden="true">
              <div className="meter-top">
                <span>LIVE / 72 BPM</span>
                <span>94%</span>
              </div>
              <svg viewBox="0 0 600 170" preserveAspectRatio="none">
                <path className="meter-grid" d="M0 34h600M0 68h600M0 102h600M0 136h600M75 0v170M150 0v170M225 0v170M300 0v170M375 0v170M450 0v170M525 0v170" />
                <path className="meter-wave-shadow" d="M0 105h66l18-5 14 7 17-4 17-70 21 118 20-88 18 48 22-11 15 5 22-9 20 11h57l23-9 20 10 18-5 17-61 20 100 21-77 18 38 20-4 21 7 20-12 22 9h61" />
                <path className="meter-wave" d="M0 105h66l18-5 14 7 17-4 17-70 21 118 20-88 18 48 22-11 15 5 22-9 20 11h57l23-9 20 10 18-5 17-61 20 100 21-77 18 38 20-4 21 7 20-12 22 9h61" />
              </svg>
              <div className="meter-bottom">
                <span>00:16</span>
                <span>SIGNAL ACQUIRED</span>
              </div>
            </div>
          </div>
        </section>

        <section className="detail-section page-shell">
          <div className="detail-number">01</div>
          <div>
            <h2>{t.overviewTitle}</h2>
            <p className="large-body">{t.overview}</p>
          </div>
        </section>

        <section className="detail-section page-shell">
          <div className="detail-number">02</div>
          <div>
            <h2>{t.capabilityTitle}</h2>
            <div className="capability-grid">
              {t.capabilities.map((capability, index) => (
                <article key={capability.title}>
                  <span>0{index + 1}</span>
                  <h3>{capability.title}</h3>
                  <p>{capability.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="architecture-section">
          <div className="detail-section page-shell">
            <div className="detail-number">03</div>
            <div>
              <h2>{t.architectureTitle}</h2>
              <div className="architecture-flow">
                {t.architecture.map((step, index) => (
                  <div className="architecture-step" key={step.label}>
                    <span>{step.label}</span>
                    <strong>{step.value}</strong>
                    {index < t.architecture.length - 1 && (
                      <ArrowIcon className="architecture-arrow" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="detail-section page-shell" id="materials">
          <div className="detail-number">04</div>
          <div>
            <h2>{t.materialsTitle}</h2>
            <p className="materials-intro">{t.materialsIntro}</p>
            <div className="materials-grid">
              {t.materials.map((material, index) => (
                <article key={material.title}>
                  <span>0{index + 1}</span>
                  <h3>{material.title}</h3>
                  <p>{material.description}</p>
                </article>
              ))}
            </div>
            <a
              className="button button-primary materials-button"
              href={site.openRppgGithubUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.visitGithub}
              <ExternalIcon />
            </a>
          </div>
        </section>

        <aside className="privacy-note page-shell">
          <span>!</span>
          <div>
            <strong>{t.privacyTitle}</strong>
            <p>{t.privacy}</p>
          </div>
        </aside>
      </main>
      <footer lang={locale === "en" ? "en" : "zh-CN"}>
        <div className="page-shell footer-inner">
          <span>© {new Date().getFullYear()} BLUES‑BERRY</span>
            <Link href={localePath(locale, "/projects/open-rppg")}>
            {t.back}
            <ArrowIcon />
          </Link>
        </div>
      </footer>
    </>
  );
}
