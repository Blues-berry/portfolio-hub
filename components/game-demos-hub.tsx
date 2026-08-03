import Link from "next/link";
import { ArrowIcon } from "./icons";
import { SiteHeader } from "./site-header";
import { localePath, type Locale } from "@/lib/site";

const games = [
  {
    number: "01",
    title: "Office Cringe Simulator",
    cnTitle: "职场社死模拟器",
    description: "A chaotic workplace comedy where every decision can become a new kind of awkward.",
    cnDescription: "在每一个选择都可能变成新型社死的办公室里，试着活过今天。",
    href: "/projects/game-demos/office-cringe",
    tone: "cringe",
    label: "PLAYABLE NOW",
  },
  {
    number: "02",
    title: "Beyond the Rules",
    cnTitle: "打破规则",
    description: "A rule-horror visual novel about seven days, seven rules, and one lie.",
    cnDescription: "七天、七条规则，以及一个谎言。观察、推理，或者打破游戏。",
    href: "/projects/game-demos/beyond-the-rules",
    tone: "rules",
    label: "PLAYABLE NOW",
  },
];

export function GameDemosHub({ locale }: { locale: Locale }) {
  const isEnglish = locale === "en";
  return (
    <>
      <SiteHeader locale={locale} directory />
      <main className="game-hub-main" lang={isEnglish ? "en" : "zh-CN"}>
        <div className="game-hub-noise" aria-hidden="true" />
        <section className="game-hub-hero page-shell">
          <Link className="game-hub-back" href={localePath(locale, "/")}>
            <ArrowIcon /> {isEnglish ? "Back to project index" : "返回项目目录"}
          </Link>
          <p className="game-hub-kicker">{isEnglish ? "INTERACTIVE LAB · 02" : "INTERACTIVE LAB · 02"}</p>
          <h1>{isEnglish ? "Imaginative experiments." : "奇思妙想。"}</h1>
          <p>{isEnglish ? "A small shelf of playable experiments, each with its own rhythm, interface, and kind of trouble." : "一组可以直接进入的互动实验，每个游戏都有自己的节奏、界面和麻烦。"}</p>
        </section>

        <nav className="game-hub-tabs page-shell" aria-label={isEnglish ? "Game demos" : "游戏 Demo"}>
          <Link className="game-hub-tab active" href={localePath(locale, games[0].href)}>{games[0].title}</Link>
          <Link className="game-hub-tab" href={localePath(locale, games[1].href)}>{games[1].title}</Link>
          <span className="game-hub-tab">{isEnglish ? "Partially live" : "部分上线"}</span>
          <span className="game-hub-tab-line" aria-hidden="true" />
        </nav>

        <section className="game-hub-grid page-shell" aria-label={isEnglish ? "Available games" : "可用游戏"}>
          {games.map((game) => (
            <Link className={`game-demo-card game-demo-card-${game.tone}`} href={localePath(locale, game.href)} key={game.number}>
              <div className="game-demo-card-top">
                <span>{game.number} · {game.label}</span>
                <ArrowIcon />
              </div>
              <div className="game-demo-art" aria-hidden="true">
                <iframe
                  className="game-demo-cover-frame"
                  src={game.tone === "cringe" ? "/games/office-cringe/index.html" : "/games/beyond-the-rules/index.html"}
                  title={`${game.title} preview`}
                  tabIndex={-1}
                  loading="lazy"
                />
                <span className="game-demo-cover-label">LIVE PREVIEW</span>
              </div>
              <div className="game-demo-copy">
                <h2>{game.tone === "rules" || isEnglish ? game.title : game.cnTitle}</h2>
                <p>{game.tone === "rules" || isEnglish ? game.description : game.cnDescription}</p>
                <span className="game-demo-enter">{isEnglish ? "Enter game" : "进入游戏"} <ArrowIcon /></span>
              </div>
            </Link>
          ))}
          <div className="game-demo-coming-soon">
            <span>03 · {isEnglish ? "IN DEVELOPMENT" : "开发中"}</span>
            <strong>{isEnglish ? "More strange interfaces soon." : "更多奇怪的界面，正在形成。"}</strong>
          </div>
        </section>
      </main>
      <footer className="game-hub-footer">
        <div className="page-shell footer-inner"><span>BLUES‑BERRY / INTERACTIVE LAB</span><span>{isEnglish ? "Two playable experiments" : "两个可游玩的互动 Demo"}</span></div>
      </footer>
    </>
  );
}
