import type { Metadata } from "next";
import { GameDemosHub } from "@/components/game-demos-hub";

export const metadata: Metadata = { title: "Playable Games | Blues-berry", description: "Play three selected games: Office Cringe Simulator, Beyond the Rules, and Protocol: Endgame." };

export default function EnglishGameDemosPage() { return <GameDemosHub locale="en" />; }
