import type { Metadata } from "next";
import { ProjectDetail } from "@/components/project-detail";

export const metadata: Metadata = {
  title: "Open‑rPPG",
  description:
    "Contactless heart-rate sensing in the browser with camera capture, FacePhys, and Workers.",
  alternates: {
    canonical: "/en/projects/open-rppg",
    languages: {
      "zh-CN": "/projects/open-rppg",
      en: "/en/projects/open-rppg",
    },
  },
};

export default function EnglishOpenRppgPage() {
  return <ProjectDetail locale="en" />;
}
