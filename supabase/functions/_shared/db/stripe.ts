// supabase/functions/_shared/db/stripe.ts
import { supabase } from "./client.ts";
import type { Database } from "../database.types.ts";

type Organization = Database["public"]["Tables"]["organizations"]["Row"];
type SubscriptionPlan = Database["public"]["Tables"]["subscription_plans"]["Row"];

export const stripeRepository = {
  getOrganization: async (organizationId: string): Promise<Organization> => {
    const { data, error } = await supabase
      .from("organizations")
      .select("*")
      .eq("id", organizationId)
      .single();

    if (error) throw error;
    if (!data) throw new Error("Organization not found");
    return data;
  },

  getSubscriptionPlan: async (planId: string): Promise<SubscriptionPlan> => {
    const { data, error } = await supabase
      .from("subscription_plans")
      .select("*")
      .eq("id", planId)
      .eq("is_active", true)
      .single();

    if (error) throw error;
    if (!data) throw new Error("Subscription plan not found");
    return data;
  },

  updateOrganizationStripeCustomer: async (
    organizationId: string, 
    stripeCustomerId: string
  ): Promise<void> => {
    const { error } = await supabase
      .from("organizations")
      .update({ stripe_customer_id: stripeCustomerId })
      .eq("id", organizationId);

    if (error) throw error;
  }
};