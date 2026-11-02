import "server-only";

import { createSupabaseServiceClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

export type MembershipApplication =
  Database["public"]["Tables"]["membership_applications"]["Row"];

export const membershipApplicationsPageSize = 20;

export type MembershipApplicationFilters = {
  page: number;
  query: string;
  status: "" | MembershipApplication["status"];
};

export type MembershipApplicationPage = {
  applications: MembershipApplication[];
  total: number;
  page: number;
  pageCount: number;
};

type MembershipApplicationPageResult =
  | { ok: true; value: MembershipApplicationPage }
  | { ok: false; message: string };

const applicationColumns =
  "id, name, email, phone, city, age, education, interests, experience, availability, message, status, created_at, updated_at";

function escapeLikePattern(value: string) {
  return value.replace(/[\\%_*]/g, "\\$&");
}

export async function getMembershipApplicationsPage(
  filters: MembershipApplicationFilters,
): Promise<MembershipApplicationPageResult> {
  const supabase = createSupabaseServiceClient();
  const countQuery = supabase
    .from("membership_applications")
    .select("id", { count: "exact", head: true });
  const applicationsQuery = supabase
    .from("membership_applications")
    .select(applicationColumns)
    .order("created_at", { ascending: false });

  if (filters.status) {
    countQuery.eq("status", filters.status);
    applicationsQuery.eq("status", filters.status);
  }

  const query = filters.query.trim();
  if (query) {
    const pattern = `%${escapeLikePattern(query)}%`;
    countQuery.ilike("name", pattern);
    applicationsQuery.ilike("name", pattern);
  }

  const { count, error: countError } = await countQuery;
  if (countError) {
    console.error("Unable to count membership applications:", countError.message);
    return { ok: false, message: "Unable to load membership applications." };
  }
  if (count === null) {
    console.error("Supabase did not return a membership application count.");
    return { ok: false, message: "Unable to load membership applications." };
  }

  const pageCount = Math.max(
    1,
    Math.ceil(count / membershipApplicationsPageSize),
  );
  const page = Math.min(filters.page, pageCount);
  const firstRow = (page - 1) * membershipApplicationsPageSize;
  const { data, error } = await applicationsQuery.range(
    firstRow,
    firstRow + membershipApplicationsPageSize - 1,
  );

  if (error) {
    console.error("Unable to load membership applications:", error.message);
    return { ok: false, message: "Unable to load membership applications." };
  }

  return {
    ok: true,
    value: {
      applications: data,
      total: count,
      page,
      pageCount,
    },
  };
}
