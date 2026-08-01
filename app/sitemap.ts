import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/en",
  ];

  return routes.map((route) => ({
    url: `${site.siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : route === "/en" ? 0.9 : 0.8,
  }));
}
