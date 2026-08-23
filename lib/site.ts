export type Locale = "zh" | "en";

import { projectRegistry } from "./projects";

const rawSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://chexueyuan.vercel.app";

export const site = {
  name: "Blues-berry",
  siteUrl: rawSiteUrl.replace(/\/$/, ""),
  githubUrl: "https://github.com/Blues-berry",
  openRppgGithubUrl: `https://github.com/${projectRegistry.find((project) => project.id === "open-rppg")?.repo ?? "Blues-berry/open-rppg"}`,
  openRppgDemoUrl:
    process.env.NEXT_PUBLIC_OPEN_RPPG_URL ??
    "https://open-rppg-nu.vercel.app",
};

export const localePath = (locale: Locale, path = "") => {
  const normalized = path === "/" ? "" : path;
  return locale === "en" ? `/en${normalized}` || "/en" : normalized || "/";
};
