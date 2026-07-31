import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/en",
    "/projects/open-rppg",
    "/en/projects/open-rppg",
  ];

  return routes.map((route) => ({
    url: `${site.siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route.includes("projects") ? "monthly" : "weekly",
    priority: route === "" ? 1 : route === "/en" ? 0.9 : 0.8,
  }));
}
