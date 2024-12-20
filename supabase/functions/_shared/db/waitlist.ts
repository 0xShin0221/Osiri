import { supabase } from "./client.ts";
import { SupportedLanguage, WaitlistEntry } from "../types.ts";

export const waitlist = {
  save: async (
    email: string,
    language: SupportedLanguage,
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
  },
};
