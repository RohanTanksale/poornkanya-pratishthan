"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const revealSelector = [
  "main > section",
  "main > section .theme-card",
  "main > section .value-item",
  "main > section .initiative-card",
  "main > section .home-initiative-grid > article",
  "main > section .committee-member",
  "main > section .roadmap-item",
  "main > section .challenge-card",
  "main > section .philosophy-profile-card",
  "main > section .dimensions-grid > article",
].join(", ");

export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    ) {
      return;
    }

    const targets = document.querySelectorAll<HTMLElement>(revealSelector);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-scroll-reveal", "visible");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -6% 0px" },
    );

    targets.forEach((target, index) => {
      target.style.setProperty("--reveal-delay", `${(index % 4) * 65}ms`);
      target.setAttribute("data-scroll-reveal", "pending");
      observer.observe(target);
    });

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
