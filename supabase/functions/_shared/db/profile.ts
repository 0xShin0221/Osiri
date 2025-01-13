import { supabase } from "./client.ts";

export const updateOnboardingCompleted = async (userId: string) => {
  const { error } = await supabase
    .from("profiles")
    .update({ onboarding_completed: true })
    .eq("id", userId);

  if (error) throw error;
};
