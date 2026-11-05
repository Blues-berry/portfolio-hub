import type { Metadata } from "next";
import { GameDemosHub } from "@/components/game-demos-hub";

export const metadata: Metadata = { title: "互动游戏 | Blues-berry", description: "五款独立游戏与两款进阶版，包含 WITHERROOT: FROSTBOUND 和 STELLAR FORGE: LAST STAND。" };

export default function GameDemosPage() { return <GameDemosHub locale="zh" />; }
