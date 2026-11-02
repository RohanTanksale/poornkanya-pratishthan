"use client";

import { usePathname } from "next/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin") ?? false;

  if (isAdminRoute) return children;

  return (
    <>
      <SiteHeader />
      <ScrollReveal />
      {children}
      <SiteFooter />
    </>
  );
}
