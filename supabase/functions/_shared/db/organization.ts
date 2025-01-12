import type { Database } from "../database.types.ts";
import { supabase } from "./client.ts";

type Organization = Database["public"]["Tables"]["organizations"]["Row"];
type OrganizationMember =
  Database["public"]["Tables"]["organization_members"]["Row"];

export const createOrganization = async (
  name: string,
): Promise<Organization> => {
  const { data, error } = await supabase
    .from("organizations")
    .insert({ name })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const createOrganizationMemberAsAdmin = async (
  organizationId: string,
  userId: string,
): Promise<void> => {
  const { error } = await supabase
    .from("organization_members")
    .insert({
      organization_id: organizationId,
      user_id: userId,
      role: "admin",
    });

  if (error) throw error;
};

export const getOrganizationByUserId = async (
  userId: string,
): Promise<(OrganizationMember & { organizations: Organization })[]> => {
  const { data, error } = await supabase
    .from("organization_members")
    .select(`
      *,
      organizations (
        id,
        name,
        created_at,
        updated_at
      )
    `)
    .eq("user_id", userId);

  if (error) throw error;
  return data;
};
