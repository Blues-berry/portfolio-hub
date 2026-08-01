import type { Metadata } from "next";
import { GameDemosHub } from "@/components/game-demos-hub";

export const metadata: Metadata = { title: "Interactive Game Demos", description: "Playable interactive game experiments by Blues-berry." };

export default function EnglishGameDemosPage() { return <GameDemosHub locale="en" />; }
