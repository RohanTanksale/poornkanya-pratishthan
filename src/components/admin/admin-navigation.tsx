"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type AdminNavigationItem =
  | {
      label: string;
      href: string;
      availability: "available" | "prototype";
    }
  | { label: string; availability: "planned" };

type AdminNavigationGroup = {
  label: string;
  items: AdminNavigationItem[];
};

const navigationGroups: AdminNavigationGroup[] = [
  {
    label: "Workspace",
    items: [
      { label: "Overview", href: "/admin", availability: "available" },
      {
        label: "Membership Applications",
        href: "/admin#applications",
        availability: "available",
      },
      {
        label: "Leadership Management",
        href: "/admin#leadership",
        availability: "available",
      },
      { label: "Admin Access", href: "/admin#admin-access", availability: "available" },
    ],
  },
  {
    label: "Content",
    items: [
      { label: "Website Pages", availability: "planned" },
      { label: "Events", href: "/admin/events", availability: "prototype" },
      { label: "Programmes", availability: "planned" },
      { label: "Gallery", availability: "planned" },
      { label: "Announcements", availability: "planned" },
    ],
  },
  {
    label: "Tools",
    items: [
      { label: "Contact Enquiries", availability: "planned" },
      { label: "Media Library", availability: "planned" },
      { label: "SEO Settings", availability: "planned" },
      { label: "Admin Activity", availability: "planned" },
    ],
  },
];

export function AdminNavigation() {
  const pathname = usePathname();

  return (
    <nav aria-label="CMS modules" className="admin-navigation">
      {navigationGroups.map((group) => (
        <section className="admin-navigation-group" key={group.label}>
          <h2>{group.label}</h2>
          <ul>
            {group.items.map((item) => (
              <li key={item.label}>
                {item.availability !== "planned" ? (
                  <Link
                    aria-current={
                      pathname === item.href ||
                      (item.href === "/admin" && pathname === "/admin")
                        ? "page"
                        : undefined
                    }
                    href={item.href}
                  >
                    <span>{item.label}</span>
                    <span
                      className={`admin-module-status ${
                        item.availability === "available"
                          ? "is-available"
                          : "is-prototype"
                      }`}
                    >
                      {item.availability === "available" ? "Available" : "Prototype"}
                    </span>
                  </Link>
                ) : (
                  <span aria-disabled="true" className="admin-navigation-planned">
                    <span>{item.label}</span>
                    <span className="admin-module-status">Planned</span>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </nav>
  );
}
