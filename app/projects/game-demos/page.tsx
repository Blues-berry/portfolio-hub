import type { Metadata } from "next";
import { GameDemosHub } from "@/components/game-demos-hub";

export const metadata: Metadata = { title: "互动游戏 | Blues-berry", description: "五款现已开放试玩的独立游戏：Office Cringe Simulator、Beyond the Rules、Protocol: Endgame、WITHERROOT 与 STELLAR FORGE。" };

export default function GameDemosPage() { return <GameDemosHub locale="zh" />; }
