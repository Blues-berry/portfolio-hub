import type { Metadata } from "next";
import { GameDemosHub } from "@/components/game-demos-hub";

export const metadata: Metadata = { title: "互动游戏 | Blues-berry", description: "七款独立游戏与两款进阶版，新增 PRISM ROUTE 与 ORBIT COURIER。" };

export default function GameDemosPage() { return <GameDemosHub locale="zh" />; }
