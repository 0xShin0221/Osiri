import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export const getProfile = async (userId: string) => {
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 1000;

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const { data: existingProfile, error: fetchError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (existingProfile) {
        return existingProfile as Profile;
      }

      if (fetchError?.code === "PGRST116") {
        const { data: newProfile, error: insertError } = await supabase
          .from("profiles")
          .insert([
            {
              user_id: userId,
              onboarding_completed: false,
            },
          ])
          .select()
          .single();

        if (insertError) {
          if (insertError.code === "23503" && attempt < MAX_RETRIES - 1) {
            console.log(
              `Attempt ${
                attempt + 1
              }: Waiting for user record to be created...`,
            );
            await sleep(RETRY_DELAY);
            continue;
          }
          throw insertError;
        }

        return newProfile as Profile;
      }

      if (fetchError) throw fetchError;
    } catch (error) {
      if (attempt === MAX_RETRIES - 1) {
        console.error("Error in getProfile after all retries:", error);
        throw error;
      }
    }
  }

  throw new Error("Failed to get or create profile after maximum retries");
};
