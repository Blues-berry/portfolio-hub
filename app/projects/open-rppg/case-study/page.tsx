import type { Metadata } from "next";
import { ProjectDetail } from "@/components/project-detail";

export const metadata: Metadata = {
  title: "Open‑rPPG Case Study",
  description:
    "在浏览器中使用摄像头、FacePhys 与 Worker 完成非接触式心率感知。",
  alternates: {
    canonical: "/projects/open-rppg/case-study",
    languages: {
      "zh-CN": "/projects/open-rppg/case-study",
      en: "/en/projects/open-rppg/case-study",
    },
  },
};

export default function OpenRppgCaseStudyPage() {
  return <ProjectDetail locale="zh" />;
}
