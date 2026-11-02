import Link from "next/link";

type AdminNavigationItem =
  | { label: string; href: string; available: true }
  | { label: string; available: false };

type AdminNavigationGroup = {
  label: string;
  items: AdminNavigationItem[];
};

const navigationGroups: AdminNavigationGroup[] = [
  {
    label: "Workspace",
    items: [
      { label: "Overview", href: "/admin", available: true },
      {
        label: "Membership Applications",
        href: "/admin#applications",
        available: true,
      },
      {
        label: "Leadership Management",
        href: "/admin#leadership",
        available: true,
      },
      { label: "Admin Access", href: "/admin#admin-access", available: true },
    ],
  },
  {
    label: "Content",
    items: [
      { label: "Website Pages", available: false },
      { label: "Events", available: false },
      { label: "Programmes", available: false },
      { label: "Gallery", available: false },
      { label: "Announcements", available: false },
    ],
  },
  {
    label: "Tools",
    items: [
      { label: "Contact Enquiries", available: false },
      { label: "Media Library", available: false },
      { label: "SEO Settings", available: false },
      { label: "Admin Activity", available: false },
    ],
  },
];

export function AdminNavigation() {
  return (
    <nav aria-label="CMS modules" className="admin-navigation">
      {navigationGroups.map((group) => (
        <section className="admin-navigation-group" key={group.label}>
          <h2>{group.label}</h2>
          <ul>
            {group.items.map((item) => (
              <li key={item.label}>
                {item.available ? (
                  <Link
                    aria-current={item.href === "/admin" ? "page" : undefined}
                    href={item.href}
                  >
                    <span>{item.label}</span>
                    <span className="admin-module-status is-available">
                      Available
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
