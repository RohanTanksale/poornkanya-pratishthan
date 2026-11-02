import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { getCurrentAdminEmail } from "@/lib/supabase/server";
import "./admin-workspace.css";

export const dynamic = "force-dynamic";

export default async function AdminWorkspaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adminEmail = await getCurrentAdminEmail();
  if (!adminEmail) redirect("/admin/login");

  return <AdminShell adminEmail={adminEmail}>{children}</AdminShell>;
}
