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
