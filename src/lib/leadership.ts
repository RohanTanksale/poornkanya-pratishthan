import "server-only";

import { leadership as defaultLeadership, type Leader } from "@/data/leadership";
import {
  createSupabaseServiceClient,
  hasLeadershipDatabaseConfig,
} from "@/lib/supabase/server";

export async function getLeadership(): Promise<Leader[]> {
  if (!hasLeadershipDatabaseConfig()) {
    console.log("Using local leadership data:", defaultLeadership);
    return defaultLeadership;
  }

  const supabase = createSupabaseServiceClient();

  const { data, error } = await supabase
    .from("leadership_members")
    .select("id, name, role, photo_src")
    .order("display_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    throw new Error(`Unable to load leadership members: ${error.message}`);
  }

  console.log(
    "LEADERSHIP DATA FROM SUPABASE:",
    data?.map(({ name, role }) => ({ name, role })),
  );

  return data.map((member) => ({
    id: member.id,
    name: member.name,
    role: member.role,
    photoSrc: member.photo_src ?? undefined,
  }));
}