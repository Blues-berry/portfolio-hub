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
    artLabel: "START / STORY",
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
    artLabel: "ENTER / RULES",
    image: "/games/beyond-the-rules-cover.png",
  },
  {
    number: "03",
    title: "Protocol: Endgame",
    cnTitle: "终焉协议",
    description: "An interactive rules-horror visual novel built around trust, survival points, and seven endings.",
    cnDescription: "围绕信任、生存点与七种结局展开的规则怪谈交互式视觉小说。",
    href: "/project-demos/qifei/index.html",
    tone: "endgame",
    artLabel: "START / PROTOCOL",
    image: "/projects/covers/protocol-endgame.png",
    external: true,
  },
  {
    number: "04",
    title: "WITHERROOT — Decay to Rebirth",
    cnTitle: "WITHERROOT — Decay to Rebirth",
    description: "A five-stage strategy game about tending roots, preserving memories, and surviving the frost.",
    cnDescription: "五关渐进式生存策略：培育根系、收集记忆，在灰烬与霜冻中寻找重生。",
    href: "/project-demos/game0/index.html?lang=zh",
    enHref: "/project-demos/game0/index.html?lang=en",
    tone: "witherroot",
    artLabel: "GROW / REMEMBER",
    image: "/projects/covers/witherroot-v2.png",
  },
  {
    number: "05",
    title: "STELLAR FORGE",
    cnTitle: "STELLAR FORGE",
    description: "Merge elemental Star Cores, evolve your defenses, and survive the Void's escalating waves.",
    cnDescription: "融合元素星核、进化防线，在不断升级的虚空浪潮中生存下来。",
    href: "/project-demos/game1/index.html",
    enHref: "/project-demos/game1-en/index.html",
    tone: "stellar",
    artLabel: "MERGE / EVOLVE",
    image: "/projects/covers/stellar-forge-v2.png",
  },
  {
    number: "06",
    title: "WITHERROOT: FROSTBOUND",
    cnTitle: "WITHERROOT: FROSTBOUND",
    description: "Plan each root before the foretold frost strikes. Collect memories and keep the Heart alive.",
    cnDescription: "进阶版：预判霜冻方向，规划根系路线，收集记忆并保护核心。",
    href: "/project-demos/game0-advanced/index.html?lang=zh",
    enHref: "/project-demos/game0-advanced/index.html?lang=en",
    tone: "witherroot",
    artLabel: "PLAN / SURVIVE",
    image: "/projects/covers/witherroot-frostbound.png",
  },
  {
    number: "07",
    title: "STELLAR FORGE: LAST STAND",
    cnTitle: "STELLAR FORGE: LAST STAND",
    description: "Spend limited deployment charges, merge elemental towers, and defend the core for 20 waves.",
    cnDescription: "进阶版：管理部署点，融合元素星核，防守核心并迎战第 20 波首领。",
    href: "/project-demos/game1-advanced/index.html",
    enHref: "/project-demos/game1-advanced-en/index.html",
    tone: "stellar",
    artLabel: "DEPLOY / DEFEND",
    image: "/projects/covers/stellar-last-stand.png",
  },
];

type Game = (typeof games)[number];

function gameHref(locale: Locale, game: Game) {
  if (locale === "en" && "enHref" in game && game.enHref) return game.enHref;
  if (locale !== "en" && "href" in game && (game.tone === "witherroot")) return game.href;
  if (locale !== "en" && game.tone === "stellar") return game.href;
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
          <p>{isEnglish ? "Five games, including two new advanced editions to explore." : "五款游戏，包含两款玩法进阶版。"}</p>
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
                <span>{game.number} · {isEnglish ? "PLAYABLE NOW" : "现已开放"}</span>
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
                <span className="game-demo-cover-label">{game.artLabel}</span>
              </div>
              <div className="game-demo-copy">
                <h2>{game.title === game.cnTitle || game.tone === "rules" || isEnglish ? game.title : game.cnTitle}</h2>
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
        <div className="page-shell footer-inner"><span>BLUES‑BERRY / INTERACTIVE LAB</span><span>{isEnglish ? "Five games · Seven playable versions" : "五款游戏 · 七个可玩版本"}</span></div>
      </footer>
    </>
  );
}
