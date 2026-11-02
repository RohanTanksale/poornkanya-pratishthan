import { redirect } from "next/navigation";
import { signOutAdmin } from "@/app/admin/actions";
import { AdminAccessManager } from "@/app/admin/admin-access-manager";
import { ApplicationReview } from "@/app/admin/application-review";
import { MemberForm } from "@/app/admin/member-form";
import { getLeadership } from "@/lib/leadership";
import {
  createSupabaseServiceClient,
  getCurrentAdminEmail,
  getSuperAdminEmail,
} from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const adminEmail = await getCurrentAdminEmail();
  if (!adminEmail) redirect("/admin/login");

  const [members, accessResult, applicationsResult] = await Promise.all([
    getLeadership(),
    createSupabaseServiceClient()
      .from("admin_access")
      .select("email, granted_by, created_at")
      .order("created_at", { ascending: true }),
    createSupabaseServiceClient()
      .from("membership_applications")
      .select(
        "id, name, email, phone, city, age, education, interests, experience, availability, message, status, created_at",
      )
      .order("created_at", { ascending: false }),
  ]);
  if (accessResult.error) {
    throw new Error(`Unable to load admin access list: ${accessResult.error.message}`);
  }
  if (applicationsResult.error) {
    throw new Error(
      `Unable to load membership applications: ${applicationsResult.error.message}`,
    );
  }

  return (
    <main className="admin-page section-pad">
      <div className="admin-heading">
        <div>
          <p className="eyebrow">Poornakanya Pratishthan</p>
          <h1>Leadership admin</h1>
          <p>Signed in as {adminEmail}</p>
        </div>
        <form action={signOutAdmin}>
          <button className="button button-secondary" type="submit">
            Sign out
          </button>
        </form>
      </div>
      <div className="admin-dashboard-grid">
        <section className="admin-panel">
          <p className="eyebrow">Committee</p>
          <h2>Current members ({members.length})</h2>
          <ol className="admin-member-list">
            {members.map((member) => (
              <li key={member.id ?? member.name}>
                <span>{member.name}</span>
                <span>{member.role}</span>
              </li>
            ))}
          </ol>
        </section>
        <section className="admin-panel">
          <p className="eyebrow">Add a committee member</p>
          <h2>Member details</h2>
          <MemberForm />
        </section>
      </div>
      <section className="admin-panel admin-access-panel">
        <p className="eyebrow">Admin access</p>
        <h2>Manage administrators</h2>
        <p className="admin-access-note">
          Admins can grant or revoke access for existing Supabase Auth accounts.
          The super-admin account is protected and cannot be removed here.
        </p>
        <AdminAccessManager
          admins={accessResult.data}
          superAdminEmail={getSuperAdminEmail()}
        />
      </section>
      <section className="admin-panel admin-applications-panel">
        <p className="eyebrow">Membership</p>
        <h2>Applications ({applicationsResult.data.length})</h2>
        <p className="admin-access-note">
          Applications are private and are not automatically published or added
          to the leadership list.
        </p>
        <ApplicationReview applications={applicationsResult.data} />
      </section>
    </main>
  );
}
