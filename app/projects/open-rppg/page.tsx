import type { Metadata } from "next";
import { ProjectDetail } from "@/components/project-detail";

export const metadata: Metadata = {
  title: "Open‑rPPG",
  description:
    "在浏览器中使用摄像头、FacePhys 与 Worker 完成非接触式心率感知。",
  alternates: {
    canonical: "/projects/open-rppg",
    languages: {
      "zh-CN": "/projects/open-rppg",
      en: "/en/projects/open-rppg",
    },
  },
};

export default function OpenRppgPage() {
  return <ProjectDetail locale="zh" />;
}
