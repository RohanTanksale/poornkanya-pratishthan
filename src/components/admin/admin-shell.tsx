import Link from "next/link";
import { signOutAdmin } from "@/app/admin/actions";
import { AdminNavigation } from "@/components/admin/admin-navigation";

export function AdminShell({
  adminEmail,
  children,
}: {
  adminEmail: string;
  children: React.ReactNode;
}) {
  return (
    <div className="admin-workspace">
      <header className="admin-shell-header">
        <Link aria-label="Poornakanya Pratishthan CMS overview" className="admin-shell-brand" href="/admin">
          <span aria-hidden="true" className="admin-shell-monogram">
            PP
          </span>
          <span>
            <strong>Poornakanya</strong>
            <small>Content management</small>
          </span>
        </Link>
        <details className="admin-mobile-navigation">
          <summary>Menu</summary>
          <AdminNavigation />
        </details>
        <div className="admin-shell-account">
          <span className="admin-shell-user">{adminEmail}</span>
          <form action={signOutAdmin}>
            <button className="button button-secondary" type="submit">
              Sign out
            </button>
          </form>
        </div>
      </header>
      <div className="admin-workspace-body">
        <aside aria-label="Admin sidebar" className="admin-sidebar">
          <AdminNavigation />
        </aside>
        <div className="admin-content-column">
          <div className="admin-breadcrumbs">
            <nav aria-label="Breadcrumb">
              <ol>
                <li>
                  <Link href="/admin">Admin</Link>
                </li>
                <li aria-current="page">Overview</li>
              </ol>
            </nav>
          </div>
          <main className="admin-main" id="main-content">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
