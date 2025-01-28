import { LANGUAGE_CURRENCY_MAP } from "@/lib/i18n/languages";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/database.types";

type SubscriptionPlan =
    Database["public"]["Tables"]["subscription_plans"]["Row"];
type FeedLanguage = Database["public"]["Enums"]["feed_language"];

interface CheckoutSession {
    url: string;
    session_id: string;
}

interface PortalSession {
    url: string;
}

type Organization =
    Database["public"]["Views"]["organization_subscription_status"]["Row"];

// Organization Subscription Type Guards
export const isTrialing = (org: Organization | null): boolean =>
    org?.subscription_status === "trialing";

export const isActive = (org: Organization | null): boolean =>
    org?.subscription_status === "active";

export const isPastDue = (org: Organization | null): boolean =>
    org?.subscription_status === "past_due";

export const isCanceled = (org: Organization | null): boolean =>
    org?.subscription_status === "canceled";

export const hasValidSubscription = (org: Organization | null): boolean => {
    if (!org) return false;
    if (isActive(org)) return true;
    if (isTrialing(org) && org.trial_end_date) {
        return new Date(org.trial_end_date) > new Date();
    }
    return false;
};

export class SubscriptionService {
    private async getStripePriceId(productId: string): Promise<string> {
        const { data: plan, error } = await supabase
            .from("subscription_plans")
            .select("stripe_base_price_id")
            .eq("stripe_product_id", productId)
            .single();

        if (error || !plan) {
            console.error("Error fetching stripe price ID:", error);
            throw new Error("Failed to get Stripe price ID");
        }

        return plan.stripe_base_price_id;
    }

    async createCheckoutSession(
        organizationId: string,
        priceId: string,
    ): Promise<CheckoutSession> {
        try {
            const { data, error } = await supabase.functions.invoke<
                CheckoutSession
            >(
                "stripe-create-checkout-session",
                {
                    body: {
                        organizationId,
                        priceId: await this.getStripePriceId(priceId),
                    },
                },
            );

            if (error) throw error;
            if (!data) {
                throw new Error("No data returned from checkout session");
            }
            return data;
        } catch (error) {
            console.error("Error creating checkout session:", error);
            throw error;
        }
    }

    async getSubscriptionPlans(
        language: FeedLanguage,
    ): Promise<SubscriptionPlan[]> {
        try {
            const currency = LANGUAGE_CURRENCY_MAP[language];

            const { data, error } = await supabase
                .from("subscription_plans")
                .select(`*`)
                .eq("currency", currency)
                .eq("has_usage_billing", false)
                .eq("is_active", true)
                .order("sort_order");

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error("Error fetching subscription plans:", error);
            throw error;
        }
    }

    async createPortalSession(organizationId: string): Promise<PortalSession> {
        try {
            const { data, error } = await supabase.functions.invoke<
                PortalSession
            >(
                "create-portal-session",
                {
                    body: { organizationId },
                },
            );

            if (error) throw error;
            if (!data) throw new Error("No data returned from portal session");
            return data;
        } catch (error) {
            console.error("Error creating portal session:", error);
            throw error;
        }
    }
}
