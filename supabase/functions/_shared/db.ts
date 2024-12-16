import { createClient } from "jsr:@supabase/supabase-js";
import {
  NewsletterSubscription,
  SupportedLanguage,
  WaitlistEntry,
} from "./types.ts";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_ANON_KEY") ?? "",
);

export const saveToWaitlist = async (
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
};

export const subscribeToNewsletter = async (
  email: string,
  language: SupportedLanguage,
): Promise<void> => {
  try {
    // Check for existing subscription
    const { data: existingSubscription, error: fetchError } = await supabase
      .from("newsletter_subscriptions")
      .select("*")
      .eq("email", email)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") { // PGRST116 is "no rows returned" error
      console.error("Error checking existing subscription:", fetchError);
      throw fetchError;
    }

    if (existingSubscription) {
      if (existingSubscription.status === "unsubscribed") {
        // Reactivate previously unsubscribed user
        const { error: updateError } = await supabase
          .from("newsletter_subscriptions")
          .update({
            status: "active",
            language: language,
          })
          .eq("email", email);

        if (updateError) {
          console.error("Error reactivating subscription:", updateError);
          throw updateError;
        }
      } else {
        // Already has an active subscription
        console.info(`User ${email} is already subscribed to the newsletter`);
        return;
      }
    } else {
      // Create new subscription
      const subscription: NewsletterSubscription = {
        email,
        language,
        status: "active",
      };

      const { error: insertError } = await supabase
        .from("newsletter_subscriptions")
        .insert(subscription);

      if (insertError) {
        console.error("Error creating subscription:", insertError);
        throw insertError;
      }
    }
  } catch (error) {
    console.error("Error in subscribeToNewsletter:", error);
    throw error;
  }
};

// Optional: Implement unsubscribe functionality
export const unsubscribeFromNewsletter = async (
  email: string,
): Promise<void> => {
  const { error } = await supabase
    .from("newsletter_subscriptions")
    .update({ status: "unsubscribed" })
    .eq("email", email);

  if (error) {
    console.error("Error unsubscribing from newsletter:", error);
    throw error;
  }
};
