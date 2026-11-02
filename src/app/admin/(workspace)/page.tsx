import { redirect } from "next/navigation";
import { AdminAccessManager } from "@/app/admin/admin-access-manager";
import { ApplicationReview } from "@/app/admin/application-review";
import { MemberForm } from "@/app/admin/member-form";
import { getLeadership } from "@/lib/leadership";
import {
  createSupabaseServiceClient,
  getCurrentAdminEmail,
  getSuperAdminEmail,
} from "@/lib/supabase/server";
import {
  getMembershipApplicationsPage,
  membershipApplicationsPageSize,
} from "@/lib/admin-applications";

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
    getMembershipApplicationsPage({ page: 1, query: "", status: "" }),
  ]);
  if (accessResult.error) {
    throw new Error(`Unable to load admin access list: ${accessResult.error.message}`);
  }
  if (!applicationsResult.ok) {
    throw new Error(applicationsResult.message);
  }

  return (
    <div className="admin-overview">
      <header className="admin-overview-heading">
        <div>
          <p className="eyebrow">Overview</p>
          <h1>Admin dashboard</h1>
          <p>Signed in as {adminEmail}</p>
        </div>
      </header>
      <section aria-label="Current record totals" className="admin-summary-grid">
        <article className="admin-summary-card">
          <span>Membership applications</span>
          <strong>{applicationsResult.value.total}</strong>
        </article>
        <article className="admin-summary-card">
          <span>Leadership members</span>
          <strong>{members.length}</strong>
        </article>
      </section>
      <p className="admin-module-note">
        Membership review, leadership listing and member addition, and admin
        access are available. Other CMS modules are planned and do not yet
        support content editing.
      </p>
      <div className="admin-dashboard-grid">
        <section aria-labelledby="admin-leadership-title" className="admin-panel" id="leadership">
          <p className="eyebrow">Committee</p>
          <h2 id="admin-leadership-title">Leadership management</h2>
          <p className="admin-access-note">
            Existing records can be viewed and new members added. Editing,
            deletion, ordering, and photo uploads are not available here.
          </p>
          {members.length ? (
            <ol className="admin-member-list">
              {members.map((member) => (
                <li key={member.id ?? member.name}>
                  <span>{member.name}</span>
                  <span>{member.role}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="admin-application-empty">
              No leadership records are available.
            </p>
          )}
        </section>
        <section aria-labelledby="admin-member-form-title" className="admin-panel">
          <p className="eyebrow">Add a committee member</p>
          <h2 id="admin-member-form-title">Member details</h2>
          <MemberForm />
        </section>
      </div>
      <section
        aria-labelledby="admin-access-title"
        className="admin-panel admin-access-panel"
        id="admin-access"
      >
        <p className="eyebrow">Admin access</p>
        <h2 id="admin-access-title">Manage administrators</h2>
        <p className="admin-access-note">
          Admins can grant or revoke access for existing Supabase Auth accounts.
          The super-admin account is protected and cannot be removed here.
        </p>
        <AdminAccessManager
          admins={accessResult.data}
          superAdminEmail={getSuperAdminEmail()}
        />
      </section>
      <section
        aria-labelledby="admin-applications-title"
        className="admin-panel admin-applications-panel"
        id="applications"
      >
        <p className="eyebrow">Membership</p>
        <h2 id="admin-applications-title">Membership applications</h2>
        <p className="admin-access-note">
          Applications are private and are not automatically published or added
          to the leadership list.
        </p>
        <ApplicationReview
          applications={applicationsResult.value.applications}
          page={applicationsResult.value.page}
          pageCount={applicationsResult.value.pageCount}
          pageSize={membershipApplicationsPageSize}
          total={applicationsResult.value.total}
        />
      </section>
    </div>
  );
}
