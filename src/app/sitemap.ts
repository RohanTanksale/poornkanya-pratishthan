import type { MetadataRoute } from "next";
import { siteUrl } from "@/data/site";

const paths = [
  "/en",
  "/about",
  "/programmes",
  "/events",
  "/gallery",
  "/leadership",
  "/branches",
  "/vision",
  "/contact",
  "/apply",
  "/terms",
  "/privacy",
];

export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteUrl) {
    return [];
  }

  return paths.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: path === "/en" ? 1 : 0.7,
  }));
}
