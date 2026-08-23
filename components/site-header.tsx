import Link from "next/link";
import { copy } from "@/lib/content";
import { localePath, type Locale } from "@/lib/site";

export function SiteHeader({
  locale,
  detail = false,
  projectPage = false,
  caseStudy = false,
  directory = false,
}: {
  locale: Locale;
  detail?: boolean;
  projectPage?: boolean;
  caseStudy?: boolean;
  directory?: boolean;
}) {
  const t = copy[locale];
  const alternate = locale === "zh" ? "en" : "zh";
  const homeHref = `${localePath(locale)}#project-directory`;
  const alternatePathBase = localePath(
    alternate,
    caseStudy || projectPage || detail ? "/projects/open-rppg" : "/",
  );
  const alternatePath = directory ? `${alternatePathBase}#project-directory` : alternatePathBase;

  return (
    <header
      className={`site-header${directory ? " site-header-directory" : ""}`}
      lang={locale === "en" ? "en" : "zh-CN"}
    >
      <div className="header-inner">
        {directory ? (
          <a className="brand" href={homeHref}>
            <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
            <span>BLUES‑BERRY</span>
          </a>
        ) : (
          <Link className="brand" href={homeHref}>
            <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
            <span>BLUES‑BERRY</span>
          </Link>
        )}
        <nav aria-label={locale === "zh" ? "主导航" : "Primary navigation"}>
          {!detail && (
            <>
              <Link href="#work">{t.nav.work}</Link>
              <Link href="#expertise">{t.nav.expertise}</Link>
              <Link href="#about">{t.nav.about}</Link>
            </>
          )}
          <Link className="language-link" href={alternatePath}>
            {t.nav.language}
          </Link>
        </nav>
      </div>
    </header>
  );
}
