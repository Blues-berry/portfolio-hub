import type { Metadata } from "next";
import { GameDemosHub } from "@/components/game-demos-hub";

export const metadata: Metadata = { title: "互动游戏 | Blues-berry", description: "三款现已开放试玩的独立游戏：职场社死模拟器、Beyond the Rules 与终焉协议。" };

export default function GameDemosPage() { return <GameDemosHub locale="zh" />; }
