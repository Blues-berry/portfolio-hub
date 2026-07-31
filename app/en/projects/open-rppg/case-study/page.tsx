import type { Metadata } from "next";
import { ProjectDetail } from "@/components/project-detail";

export const metadata: Metadata = {
  title: "Open‑rPPG Case Study",
  description:
    "Contactless heart-rate sensing in the browser with camera capture, FacePhys, and Workers.",
  alternates: {
    canonical: "/en/projects/open-rppg/case-study",
    languages: {
      "zh-CN": "/projects/open-rppg/case-study",
      en: "/en/projects/open-rppg/case-study",
    },
  },
};

export default function EnglishOpenRppgCaseStudyPage() {
  return <ProjectDetail locale="en" />;
}
