import type { MetadataRoute } from "next";
import { siteUrl } from "@/data/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    ...(siteUrl ? { sitemap: `${siteUrl}/sitemap.xml` } : {}),
  };
}
