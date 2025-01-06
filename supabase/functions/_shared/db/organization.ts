import { supabase } from "./client.ts";

export const createOrganization = async (name: string) => {
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
) => {
  const { error } = await supabase
    .from("organization_members")
    .insert({
      organization_id: organizationId,
      user_id: userId,
      role: "admin",
    });

  if (error) throw error;
}