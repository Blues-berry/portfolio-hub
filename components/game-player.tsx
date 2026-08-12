import Link from "next/link";
import { ArrowIcon } from "./icons";
import { SiteHeader } from "./site-header";
import { localePath, type Locale } from "@/lib/site";

export function GamePlayer({ locale, game }: { locale: Locale; game: "cringe" | "rules" }) {
  const isEnglish = locale === "en";
  const isCringe = game === "cringe";
  const title = isCringe ? "Office Cringe Simulator" : "Beyond the Rules";
  const subtitle = isCringe
    ? (isEnglish ? "A playable workplace chaos experiment." : "一个可以直接游玩的职场混乱实验。")
    : (isEnglish ? "A rule-horror visual novel." : "一部关于规则恐惧的视觉小说。");
  const src = isCringe ? "/games/office-cringe/index.html" : "/games/beyond-the-rules/index.html";

  return (
    <>
      <SiteHeader locale={locale} directory />
      <main className="game-player-main" lang={isEnglish ? "en" : "zh-CN"}>
        <div className="game-player-bar page-shell">
          <Link className="game-player-back" href={localePath(locale, "/projects/game-demos")}><ArrowIcon /> {isEnglish ? "All game demos" : "全部游戏 Demo"}</Link>
          <div><span className="game-player-label">{isCringe ? "01" : "02"} / PLAYABLE</span><h1>{title}</h1><p>{subtitle}</p></div>
        </div>
        <div className="game-player-stage page-shell">
          <iframe
            src={src}
            title={title}
            allow="autoplay; fullscreen"
            sandbox="allow-scripts allow-same-origin allow-forms allow-pointer-lock"
          />
        </div>
      </main>
    </>
  );
}
