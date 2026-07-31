import Link from "next/link";
import { copy } from "@/lib/content";
import { localePath, type Locale } from "@/lib/site";

export function SiteHeader({
  locale,
  detail = false,
}: {
  locale: Locale;
  detail?: boolean;
}) {
  const t = copy[locale];
  const alternate = locale === "zh" ? "en" : "zh";
  const alternatePath = localePath(
    alternate,
    detail ? "/projects/open-rppg" : "/",
  );

  return (
    <header className="site-header" lang={locale === "en" ? "en" : "zh-CN"}>
      <div className="header-inner">
        <Link className="brand" href={localePath(locale)}>
          <span className="brand-mark" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span>BLUES‑BERRY</span>
        </Link>
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
