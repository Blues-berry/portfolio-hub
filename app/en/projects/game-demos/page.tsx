import type { Metadata } from "next";
import { GameDemosHub } from "@/components/game-demos-hub";

export const metadata: Metadata = { title: "Playable Games | Blues-berry", description: "Play five selected games: Office Cringe Simulator, Beyond the Rules, Protocol: Endgame, WITHERROOT, and STELLAR FORGE." };

export default function EnglishGameDemosPage() { return <GameDemosHub locale="en" />; }
