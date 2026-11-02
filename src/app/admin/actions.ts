"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { leadershipRoles } from "@/data/leadership";
import {
  createSupabaseServerClient,
  createSupabaseServiceClient,
  hasAdminConfig,
  isAuthorizedAdmin,
  isSuperAdminEmail,
} from "@/lib/supabase/server";
import {
  getMembershipApplicationsPage,
  membershipApplicationsPageSize,
  type MembershipApplicationFilters,
} from "@/lib/admin-applications";

export type AdminActionState = {
  error?: string;
  success?: string;
};

const applicationStatuses = [
  "pending",
  "reviewed",
  "accepted",
  "declined",
] as const;

function getFormText(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

export async function signInAdmin(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  if (!hasAdminConfig()) {
    return {
      error:
        "Admin access is not configured. Set up Supabase and SUPER_ADMIN_EMAIL first.",
    };
  }

  const email = getFormText(formData, "email").toLowerCase();
  const passwordValue = formData.get("password");
  const password = typeof passwordValue === "string" ? passwordValue : "";
  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    email.length > 254 ||
    !password ||
    password.length > 1024
  ) {
    return { error: "Enter a valid email address and password." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { error: "Sign-in failed. Check your credentials and try again." };
  }

  const { data, error: userError } = await supabase.auth.getUser();
  if (userError) {
    throw new Error(`Unable to verify the admin account: ${userError.message}`);
  }
  if (!(await isAuthorizedAdmin(data.user?.email))) {
    await supabase.auth.signOut();
    return { error: "This account is not authorized to access the admin panel." };
  }

  redirect("/admin");
}

export async function signOutAdmin() {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(`Unable to sign out: ${error.message}`);
  redirect("/admin/login");
}

export async function addLeadershipMember(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  if (!hasAdminConfig()) {
    return { error: "Admin access is not configured." };
  }

  const authClient = await createSupabaseServerClient();
  const { data, error: authError } = await authClient.auth.getUser();
  if (authError) {
    throw new Error(`Unable to verify the admin session: ${authError.message}`);
  }
  if (!(await isAuthorizedAdmin(data.user?.email))) {
    return { error: "Your session is not authorized to add committee members." };
  }

  const name = getFormText(formData, "name");
  const roleValue = getFormText(formData, "role");
  const role = leadershipRoles.find((allowedRole) => allowedRole === roleValue);
  const photoSrcValue = getFormText(formData, "photoSrc");
  const photoSrc = photoSrcValue || null;

  if (!name || name.length > 100) {
    return { error: "Enter a name of 1 to 100 characters." };
  }
  if (!role) {
    return { error: "Choose an official committee designation." };
  }
  if (
    photoSrc &&
    (photoSrc.length > 300 ||
      !/^\/images\/(?:[A-Za-z0-9._-]+\/)*[A-Za-z0-9._-]+\.(?:avif|gif|jpe?g|png|webp)$/i.test(
        photoSrc,
      ) ||
      photoSrc.split("/").includes(".."))
  ) {
    return {
      error:
        "Use a local image path under /images/ (JPG, PNG, WebP, GIF or AVIF).",
    };
  }

  const serviceClient = createSupabaseServiceClient();
  const { data: latest, error: orderError } = await serviceClient
    .from("leadership_members")
    .select("display_order")
    .order("display_order", { ascending: false })
    .limit(1);
  if (orderError) {
    return { error: `Unable to check member order: ${orderError.message}` };
  }

  const { error } = await serviceClient.from("leadership_members").insert({
    name,
    role,
    photo_src: photoSrc,
    display_order: (latest[0]?.display_order ?? 0) + 1,
  });
  if (error) {
    if (error.code === "23505") {
      return { error: "A committee member with that name already exists." };
    }
    return { error: `Unable to add member: ${error.message}` };
  }

  for (const path of ["/en", "/leadership"]) {
    revalidatePath(path);
  }
  return { success: `${name} was added to the committee.` };
}

async function getAuthorizedAdminEmail() {
  if (!hasAdminConfig()) return null;

  const authClient = await createSupabaseServerClient();
  const { data, error } = await authClient.auth.getUser();
  if (error) {
    throw new Error(`Unable to verify the admin session: ${error.message}`);
  }
  if (!(await isAuthorizedAdmin(data.user?.email))) return null;
  return data.user?.email?.trim().toLowerCase() ?? null;
}

export async function searchMembershipApplications(
  filters: MembershipApplicationFilters,
) {
  const reviewer = await getAuthorizedAdminEmail();
  if (!reviewer) {
    return { error: "Your session is not authorized to view applications." };
  }

  if (
    typeof filters !== "object" ||
    filters === null ||
    typeof filters.query !== "string" ||
    filters.query.length > 80 ||
    !Number.isInteger(filters.page) ||
    filters.page < 1 ||
    filters.page > 100_000
  ) {
    return { error: "Enter a valid application search." };
  }

  const status = applicationStatuses.find(
    (allowedStatus) => allowedStatus === filters.status,
  );
  if (filters.status !== "" && !status) {
    return { error: "Choose a valid application status." };
  }

  const result = await getMembershipApplicationsPage({
    page: filters.page,
    query: filters.query.trim(),
    status: status ?? "",
  });
  if (!result.ok) {
    return { error: result.message };
  }

  return {
    ...result.value,
    pageSize: membershipApplicationsPageSize,
  };
}

export async function grantAdminAccess(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const grantedBy = await getAuthorizedAdminEmail();
  if (!grantedBy) {
    return { error: "Your session is not authorized to grant admin access." };
  }

  const email = getFormText(formData, "email").toLowerCase();
  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    email.length > 254
  ) {
    return { error: "Enter a valid email address." };
  }
  if (isSuperAdminEmail(email)) {
    return { error: "The super-admin account is already protected." };
  }

  const serviceClient = createSupabaseServiceClient();
  const perPage = 1000;
  let page = 1;
  let authUserExists = false;
  while (!authUserExists) {
    const { data, error } = await serviceClient.auth.admin.listUsers({
      page,
      perPage,
    });
    if (error) {
      throw new Error(`Unable to check Supabase accounts: ${error.message}`);
    }
    authUserExists = data.users.some(
      (user) => user.email?.toLowerCase() === email,
    );
    if (data.users.length < perPage) break;
    page += 1;
  }
  if (!authUserExists) {
    return {
      error:
        "No Supabase Auth account exists for this email. Create the account in Supabase Authentication first.",
    };
  }

  const { error } = await serviceClient.from("admin_access").insert({
    email,
    granted_by: grantedBy,
  });
  if (error) {
    if (error.code === "23505") {
      return { error: "This account already has admin access." };
    }
    return { error: `Unable to grant admin access: ${error.message}` };
  }

  revalidatePath("/admin");
  return { success: `Admin access granted to ${email}.` };
}

export async function revokeAdminAccess(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const revokedBy = await getAuthorizedAdminEmail();
  if (!revokedBy) {
    return { error: "Your session is not authorized to revoke admin access." };
  }

  const email = getFormText(formData, "email").toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return { error: "Invalid admin email address." };
  }
  if (isSuperAdminEmail(email)) {
    return { error: "The super-admin account is protected and cannot be removed." };
  }

  const { data, error } = await createSupabaseServiceClient()
    .from("admin_access")
    .delete()
    .eq("email", email)
    .select("email");
  if (error) {
    return { error: `Unable to revoke admin access: ${error.message}` };
  }
  if (data.length === 0) {
    return { error: "That account does not currently have admin access." };
  }

  revalidatePath("/admin");
  return { success: `Admin access revoked for ${email}.` };
}

export async function updateMembershipApplicationStatus(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const reviewer = await getAuthorizedAdminEmail();
  if (!reviewer) {
    return { error: "Your session is not authorized to review applications." };
  }

  const id = getFormText(formData, "id");
  const statusValue = getFormText(formData, "status");
  const status = applicationStatuses.find(
    (allowedStatus) => allowedStatus === statusValue,
  );
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    return { error: "Invalid application." };
  }
  if (!status) {
    return { error: "Choose a valid application status." };
  }

  const { data, error } = await createSupabaseServiceClient()
    .from("membership_applications")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("id");
  if (error) {
    return { error: `Unable to update application status: ${error.message}` };
  }
  if (data.length === 0) {
    return { error: "Application not found." };
  }

  revalidatePath("/admin");
  return { success: `Application marked ${status}.` };
}
