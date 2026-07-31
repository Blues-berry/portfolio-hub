import type { Metadata } from "next";
import { ProjectDirectory } from "@/components/project-directory";

export const metadata: Metadata = {
  title: "Computer Vision & Web ML",
  description:
    "A portfolio exploring remote physiology, computer vision, and in-browser machine learning.",
  alternates: {
    canonical: "/en",
    languages: {
      "zh-CN": "/",
      en: "/en",
    },
  },
};

export default function EnglishPage() {
  return <ProjectDirectory locale="en" />;
}
