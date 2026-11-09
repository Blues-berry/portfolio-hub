import type { Metadata } from "next";
import { GameDemosHub } from "@/components/game-demos-hub";

export const metadata: Metadata = { title: "Playable Games | Blues-berry", description: "Seven games and two advanced editions, now including PRISM ROUTE and ORBIT COURIER." };

export default function EnglishGameDemosPage() { return <GameDemosHub locale="en" />; }
