import type { Metadata } from "next";
import { GameDemosHub } from "@/components/game-demos-hub";

export const metadata: Metadata = { title: "Playable Games | Blues-berry", description: "Play five games and two advanced editions: WITHERROOT: FROSTBOUND and STELLAR FORGE: LAST STAND." };

export default function EnglishGameDemosPage() { return <GameDemosHub locale="en" />; }
