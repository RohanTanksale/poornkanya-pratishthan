import "server-only";

import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";

function getPublicSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !anonKey) {
    throw new Error(
      "Supabase authentication is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }
  return { url, anonKey };
}

export function hasLeadershipDatabaseConfig() {
  const keys = [
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  ];
  const configured = keys.filter((value) => value?.trim());
  if (configured.length === 0) return false;
  if (configured.length !== keys.length) {
    throw new Error(
      "Supabase is partially configured. Set NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }
  return true;
}

export function hasAdminConfig() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() &&
      process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() &&
      process.env.SUPER_ADMIN_EMAIL?.trim(),
  );
}

export function getSuperAdminEmail() {
  return process.env.SUPER_ADMIN_EMAIL?.trim().toLowerCase() ?? "";
}

export function isSuperAdminEmail(email: string | undefined) {
  if (!email) return false;
  return email.trim().toLowerCase() === getSuperAdminEmail();
}

export async function isAuthorizedAdmin(email: string | undefined) {
  if (!email) return false;
  const normalizedEmail = email.trim().toLowerCase();
  if (isSuperAdminEmail(normalizedEmail)) return true;

  const { data, error } = await createSupabaseServiceClient()
    .from("admin_access")
    .select("email")
    .eq("email", normalizedEmail)
    .maybeSingle();

  if (error) {
    throw new Error(`Unable to verify admin access: ${error.message}`);
  }
  return Boolean(data);
}

export async function getCurrentAdminEmail() {
  if (!hasAdminConfig()) return null;
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    if (error.name === "AuthSessionMissingError") return null;
    throw new Error(`Unable to verify the admin session: ${error.message}`);
  }
  return (await isAuthorizedAdmin(data.user?.email))
    ? data.user?.email ?? null
    : null;
}

export async function createSupabaseServerClient() {
  const { url, anonKey } = getPublicSupabaseConfig();
  const cookieStore = await cookies();

  return createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Server Components cannot write cookies; the admin proxy refreshes sessions.
        }
      },
    },
  });
}

export function createSupabaseServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !serviceRoleKey) {
    throw new Error(
      "Supabase database access is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }
  return createClient<Database>(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
