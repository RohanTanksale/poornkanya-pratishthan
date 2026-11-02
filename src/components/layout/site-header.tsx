
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { navigation } from "@/data/site";
import { BrandMark } from "@/components/ui/brand-mark";

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuOpenedOnPath, setMenuOpenedOnPath] = useState<string | null>(
    null,
  );
  const menuToggleRef = useRef<HTMLButtonElement>(null);

  const isMenuOpen =
    menuOpen && menuOpenedOnPath === pathname;

  function closeMenu() {
    setMenuOpen(false);
  }

  function toggleMenu() {
    if (isMenuOpen) {
      closeMenu();
      return;
    }

    setMenuOpenedOnPath(pathname);
    setMenuOpen(true);
  }

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link
          aria-label="Poornakanya Pratishthan home"
          className="brand"
          href="/en"
          onClick={closeMenu}
        >
          <BrandMark />
          <span className="brand-copy">
            <span className="brand-name">Poornakanya</span>
            <span className="brand-subtitle">Pratishthan</span>
          </span>
        </Link>

        <button
          aria-controls="primary-navigation"
          aria-expanded={isMenuOpen}
          aria-label={
            isMenuOpen
              ? "Close navigation menu"
              : "Open navigation menu"
          }
          className={`menu-toggle${isMenuOpen ? " is-open" : ""}`}
          onClick={toggleMenu}
          ref={menuToggleRef}
          type="button"
        >
          <span />
          <span />
        </button>

        <nav
          aria-label="Main navigation"
          className={`primary-navigation${isMenuOpen ? " is-open" : ""}`}
          id="primary-navigation"
        >
          {navigation
            .filter((item) => item.href !== "/apply")
            .map((item) => {
              const href = item.href;
              const active =
                pathname === href || pathname.startsWith(`${href}/`);

              return (
                <Link
                  aria-current={active ? "page" : undefined}
                  className={`nav-link${active ? " is-active" : ""}`}
                  href={href}
                  key={item.href}
                  onClick={closeMenu}
                >
                  {item.label}
                </Link>
              );
            })}

          <Link
            aria-current={pathname === "/apply" ? "page" : undefined}
            className="button button-small header-cta"
            href="/apply"
            onClick={closeMenu}
          >
            Apply to join <span aria-hidden="true">↗</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
