import { createClient } from "jsr:@supabase/supabase-js";

interface WaitlistEntry {
  email: string;
  name?: string;
  company?: string;
  role?: string;
  language: string;
}

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_ANON_KEY") ?? "",
);

export const saveToWaitlist = async (
  email: string,
  language: string,
  data?: Record<string, any>,
): Promise<void> => {
  const waitlistEntry: WaitlistEntry = {
    email,
    name: data?.name || "",
    company: data?.company,
    role: data?.role,
    language,
  };

  const { error } = await supabase
    .from("waitlist")
    .insert(waitlistEntry);

  if (error) {
    console.error("Error saving to waitlist:", error);
    throw error;
  }
};
