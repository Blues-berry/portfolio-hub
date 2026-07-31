import type { Metadata } from "next";
import { HomePage } from "@/components/home-page";

export const metadata: Metadata = {
  title: "Open‑rPPG Experience",
  description:
    "Explore the complete Open‑rPPG browser experience, from camera capture to real-time physiology feedback.",
  alternates: {
    canonical: "/projects/open-rppg",
    languages: {
      "zh-CN": "/projects/open-rppg",
      en: "/en/projects/open-rppg",
    },
  },
};

export default function OpenRppgPage() {
  return <HomePage locale="zh" projectPage />;
}
