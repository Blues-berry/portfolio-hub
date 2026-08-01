import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/en",
    "/projects/game-demos",
    "/en/projects/game-demos",
    "/projects/game-demos/office-cringe",
    "/projects/game-demos/beyond-the-rules",
    "/en/projects/game-demos/office-cringe",
    "/en/projects/game-demos/beyond-the-rules",
  ];

  return routes.map((route) => ({
    url: `${site.siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : route === "/en" ? 0.9 : 0.8,
  }));
}
