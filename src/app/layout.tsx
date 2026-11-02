
import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";

import { SiteChrome } from "@/components/layout/site-chrome";
import { defaultMetadata } from "@/lib/metadata";

import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>

        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
