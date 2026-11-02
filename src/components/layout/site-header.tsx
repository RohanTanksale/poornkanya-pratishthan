"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { label: "Home", href: "/en" },
  { label: "About", href: "/en/about" },
  { label: "Vision", href: "/en/vision" },
  { label: "Programmes", href: "/en/programmes" },
  { label: "Events", href: "/en/events" },
  { label: "Leadership", href: "/en/leadership" },
  { label: "Branches", href: "/en/branches" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [menuOpen]);

  useEffect(() => {
    document.body.classList.toggle("navigation-menu-open", menuOpen);

    return () => {
      document.body.classList.remove("navigation-menu-open");
    };
  }, [menuOpen]);

  const isActive = (href: string) =>
    href === "/en"
      ? pathname === "/en" || pathname === "/en/"
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className={`premium-header ${scrolled ? "is-scrolled" : ""}`}>
      <div className="premium-header-inner">

        <Link
          href="/en"
          className="premium-brand"
          aria-label="Poornakanya Pratishthan home"
          onClick={() => setMenuOpen(false)}
        >
          <span className="premium-brand-mark">P</span>
          <span className="premium-brand-name">
            Poornakanya
            <span>Pratishthan</span>
          </span>
        </Link>

        <nav className="premium-desktop-nav" aria-label="Main navigation">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`premium-nav-link ${isActive(item.href) ? "active" : ""}`}
              aria-current={isActive(item.href) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="premium-header-actions">
          <Link
            href="/en/apply"
            className="premium-join-button"
          >
            Join Us <span aria-hidden="true">↗</span>
          </Link>

          <button
            type="button"
            className={`premium-menu-toggle ${menuOpen ? "menu-active" : ""}`}
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            aria-controls="premium-mobile-nav"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      <div
        id="premium-mobile-nav"
        className={`premium-mobile-nav ${menuOpen ? "mobile-nav-open" : ""}`}
        aria-hidden={!menuOpen}
      >
        <nav aria-label="Mobile navigation">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              tabIndex={menuOpen ? 0 : -1}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`premium-mobile-link ${isActive(item.href) ? "active" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
              <span aria-hidden="true">↗</span>
            </Link>
          ))}

          <Link
            href="/en/apply"
            tabIndex={menuOpen ? 0 : -1}
            className="premium-mobile-join"
            onClick={() => setMenuOpen(false)}
          >
            Become a part of our journey ↗
          </Link>
        </nav>
      </div>
    </header>
  );
}

