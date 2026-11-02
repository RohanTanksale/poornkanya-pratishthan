import type { Metadata } from "next";
import { siteUrl } from "@/data/site";

export function createPageMetadata(title: string, description: string, path: string): Metadata {
  const canonical = siteUrl ? `${siteUrl}${path}` : undefined;

  return {
    title,
    description,
    alternates: siteUrl
      ? {
          canonical,
        }
      : undefined,
    openGraph: {
      title,
      description,
      type: "website",
      url: canonical,
      siteName: "Poornakanya Pratishthan",
      locale: "en_IN",
    },
  };
}

export const defaultMetadata: Metadata = {
  title: {
    default: "Poornakanya Pratishthan",
    template: "%s | Poornakanya Pratishthan",
  },
  description:
    "Supporting the holistic development of girls and young women through education, values and guidance.",
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  openGraph: {
    title: "Poornakanya Pratishthan",
    description:
      "Supporting the holistic development of girls and young women through education, values and guidance.",
    type: "website",
    siteName: "Poornakanya Pratishthan",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Poornakanya Pratishthan",
    description:
      "Supporting the holistic development of girls and young women through education, values and guidance.",
  },
};
