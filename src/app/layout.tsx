import type { Metadata } from "next";
import { SiteChrome } from "@/components/layout/site-chrome";
import { defaultMetadata } from "@/lib/metadata";
import "./globals.css";

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
