import { supabase } from "@/lib/supabase";
import { Database } from "@/types/database.types";

type SubscriptionPlanLimits =
    Database["public"]["Tables"]["subscription_plan_limits"]["Row"];

type SubscriptionPlan =
    & Database["public"]["Tables"]["subscription_plans"]["Row"]
    & {
        subscription_plan_limits:
            | Pick<
                SubscriptionPlanLimits,
                "max_notifications_per_day" | "usage_rate"
            >
            | null;
    };

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
    async createCheckoutSession(
        organizationId: string,
        priceId: string,
    ): Promise<CheckoutSession> {
        try {
            const { data, error } = await supabase.functions.invoke<
                CheckoutSession
            >(
                "create-checkout-session",
                {
                    body: { organizationId, priceId },
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

    async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
        try {
            const { data, error } = await supabase
                .from("subscription_plans")
                .select(`
          *,
          subscription_plan_limits (
            max_notifications_per_day,
            usage_rate
          )
        `)
                .eq("is_active", true)
                .order("sort_order");

            if (error) throw error;
            return data as SubscriptionPlan[];
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
