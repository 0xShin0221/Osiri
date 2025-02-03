// supabase/functions/_shared/db/stripe.ts
import { supabase } from "./client.ts";
import type { Database } from "../database.types.ts";

type Organization = Database["public"]["Tables"]["organizations"]["Row"];
type SubscriptionPlan =
  Database["public"]["Tables"]["subscription_plans"]["Row"];

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

  getSubscriptionBasePlan: async (
    planId: string,
  ): Promise<SubscriptionPlan> => {
    const { data, error } = await supabase
      .from("subscription_plans")
      .select("*")
      .eq("stripe_base_price_id", planId)
      .single();

    if (error) throw error;
    if (!data) throw new Error("Subscription plan not found");
    return data;
  },

  updateOrganizationStripeCustomer: async (
    organizationId: string,
    stripeCustomerId: string,
  ): Promise<void> => {
    const { error } = await supabase
      .from("organizations")
      .update({ stripe_customer_id: stripeCustomerId })
      .eq("id", organizationId);

    if (error) throw error;
  },
  async getSubscriptionPlanByProductId(productId: string) {
    const { data, error } = await supabase
      .from("subscription_plans")
      .select("*")
      .eq("stripe_product_id", productId)
      .single();

    if (error) throw error;
    return data;
  },

  async updateOrganizationPlan(organizationId: string, planId: string) {
    const { error } = await supabase
      .from("organizations")
      .update({ plan_id: planId })
      .eq("id", organizationId);

    if (error) throw error;
  },

  async getOrganizationIdByCustomerId(customerId: string) {
    const { data, error } = await supabase
      .from("organizations")
      .select("id")
      .eq("stripe_customer_id", customerId)
      .single();

    if (error) throw error;
    return data.id;
  },

  async updateOrganizationSubscriptionStatus(
    organizationId: string,
    subscription_status: Database["public"]["Enums"]["subscription_status"],
  ) {
    const { error } = await supabase
      .from("organizations")
      .update({ subscription_status })
      .eq("id", organizationId);

    if (error) throw error;
  },
};
