import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/app/admin/login/admin-login-form";
import { getCurrentAdminEmail, hasAdminConfig } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await getCurrentAdminEmail()) redirect("/admin");
  const configured = hasAdminConfig();

  return (
    <main className="admin-page section-pad" id="main-content">
      <section className="admin-panel admin-login-panel">
        <p className="eyebrow">Poornakanya Pratishthan</p>
        <h1>Admin sign in</h1>
        <p>Sign in with an authorized committee administrator account.</p>
        {!configured ? (
          <p className="admin-form-message is-note" role="note">
            Admin access is not configured yet. Follow the Supabase setup steps
            in the project README before signing in.
          </p>
        ) : null}
        <AdminLoginForm />
      </section>
    </main>
  );
}
