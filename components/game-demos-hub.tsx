import Link from "next/link";
import Image from "next/image";
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
    image: "/games/office-cringe-cover.png",
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
    image: "/games/beyond-the-rules-cover.png",
  },
  {
    number: "03",
    title: "Xiu Lian: Protocol",
    cnTitle: "修炼：规则协议",
    description: "A rules-horror visual novel about investigation, deduction, and branching endings.",
    cnDescription: "一款围绕调查、推理与多结局选择展开的规则怪谈视觉小说。",
    href: "/project-demos/xiulian/index.html",
    tone: "protocol",
    label: "DEMO AVAILABLE",
    image: "/projects/previews/protocol-endgame.svg",
    external: true,
  },
  {
    number: "04",
    title: "Evolution Arena",
    cnTitle: "进化战场",
    description: "A browser combat experiment with waves, skills, relics, shops, and progression choices.",
    cnDescription: "浏览器里的波次战斗实验，包含技能、遗物、商店与成长选择。",
    href: "/project-demos/game1/index.html",
    tone: "evolution",
    label: "DEMO AVAILABLE",
    image: "/projects/previews/evolution-arena.svg",
    external: true,
  },
  {
    number: "05",
    title: "Game 0 · HTML Experiment",
    cnTitle: "Game 0 · HTML 实验",
    description: "A single-file HTML game prototype kept in its original, instantly playable form.",
    cnDescription: "保留原始形态的单文件 HTML 游戏原型，打开即可体验。",
    href: "/project-demos/game0/index.html",
    tone: "html",
    label: "PLAYABLE NOW",
    image: "/projects/previews/game0.svg",
    external: true,
  },
  {
    number: "06",
    title: "Protocol: Endgame",
    cnTitle: "终焉协议",
    description: "An interactive rules-horror visual novel built around trust, survival points, and six endings.",
    cnDescription: "围绕信任、生存点与六种结局展开的规则怪谈交互式视觉小说。",
    href: "/project-demos/qifei/index.html",
    tone: "endgame",
    label: "PLAYABLE NOW",
    image: "/projects/previews/protocol-endgame.svg",
    external: true,
  },
];

type Game = (typeof games)[number];

function gameHref(locale: Locale, game: Game) {
  return game.external ? game.href : localePath(locale, game.href);
}

export function GameDemosHub({ locale }: { locale: Locale }) {
  const isEnglish = locale === "en";
  return (
    <>
      <SiteHeader locale={locale} directory />
      <main className="game-hub-main" lang={isEnglish ? "en" : "zh-CN"}>
        <div className="game-hub-noise" aria-hidden="true" />
        <section className="game-hub-hero page-shell">
          <a className="game-hub-back" href={`${localePath(locale, "/")}#project-directory`}>
            <ArrowIcon /> {isEnglish ? "Back to project index" : "返回项目目录"}
          </a>
          <p className="game-hub-kicker">{isEnglish ? "INTERACTIVE LAB · 02" : "INTERACTIVE LAB · 02"}</p>
          <h1>{isEnglish ? "Imaginative experiments." : "奇思妙想"}</h1>
          <p>{isEnglish ? "A small shelf of playable experiments, each with its own rhythm, interface, and kind of trouble." : "一组可以直接进入的互动实验，每个游戏都有自己的节奏、界面和麻烦。"}</p>
        </section>

        <nav className="game-hub-tabs page-shell" aria-label={isEnglish ? "Game demos" : "游戏 Demo"}>
          {games.map((game, index) => {
            const tab = <span className={`game-hub-tab${index === 0 ? " active" : ""}`}>{game.number} · {isEnglish ? game.title : game.cnTitle}</span>;
            return game.external ? <a key={game.number} href={gameHref(locale, game)}>{tab}</a> : <Link key={game.number} href={gameHref(locale, game)}>{tab}</Link>;
          })}
          <span className="game-hub-tab-line" aria-hidden="true" />
        </nav>

        <section className="game-hub-grid page-shell" aria-label={isEnglish ? "Available games" : "可用游戏"}>
          {games.map((game) => {
            const content = (
              <>
              <div className="game-demo-card-top">
                <span>{game.number} · {game.label}</span>
                <ArrowIcon />
              </div>
              <div className="game-demo-art" aria-hidden="true">
                <Image
                  className="game-demo-cover-frame"
                  src={game.image}
                  alt={`${game.title} preview`}
                  fill
                  sizes="(max-width: 900px) 100vw, 50vw"
                />
                <span className="game-demo-cover-label">LIVE PREVIEW</span>
              </div>
              <div className="game-demo-copy">
                <h2>{game.tone === "rules" || isEnglish ? game.title : game.cnTitle}</h2>
                <p>{game.tone === "rules" || isEnglish ? game.description : game.cnDescription}</p>
                <span className="game-demo-enter">{isEnglish ? "Enter game" : "进入游戏"} <ArrowIcon /></span>
              </div>
              </>
            );
            return game.external ? <a className={`game-demo-card game-demo-card-${game.tone}`} href={gameHref(locale, game)} key={game.number}>{content}</a> : <Link className={`game-demo-card game-demo-card-${game.tone}`} href={gameHref(locale, game)} key={game.number}>{content}</Link>;
          })}
        </section>
      </main>
      <footer className="game-hub-footer">
        <div className="page-shell footer-inner"><span>BLUES‑BERRY / INTERACTIVE LAB</span><span>{isEnglish ? "Six interactive experiments" : "六个互动实验"}</span></div>
      </footer>
    </>
  );
}
