"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const pageLabels: Record<string, string> = {
  about: "About",
  programmes: "Programmes",
  events: "Events",
  gallery: "Gallery",
  leadership: "Leadership",
  branches: "Branches",
  vision: "Vision",
  contact: "Contact",
  apply: "Apply to join",
  terms: "Terms and Conditions",
  privacy: "Privacy Policy",
};

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const page = segments[0] === "en" ? segments[1] : segments[0];
  if (!page || !(page in pageLabels)) return null;

  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs">
      <ol>
        <li><Link href="/en">Home</Link></li>
        <li aria-current="page">{pageLabels[page]}</li>
      </ol>
    </nav>
  );
}
