import { useCallback, useEffect, useState } from "react";
import { SubscriptionService } from "@/services/subscription";
import { useOrganization } from "./useOrganization";
import { Database } from "@/types/database.types";

interface UseSubscriptionReturn {
    isLoading: boolean;
    error: string | null;
    plans: SubscriptionPlan[] | null;
    handleCheckout: (priceId: string) => Promise<void>;
    handlePortal: () => Promise<void>;
}
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

export function useSubscription(): UseSubscriptionReturn {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [plans, setPlans] = useState<SubscriptionPlan[] | null>(null);
    const { organization } = useOrganization();
    const subscriptionService = new SubscriptionService();

    const fetchPlans = useCallback(async () => {
        try {
            const fetchedPlans = await subscriptionService
                .getSubscriptionPlans();
            setPlans(fetchedPlans);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to fetch plans",
            );
        }
    }, []);

    const handleCheckout = useCallback(async (priceId: string) => {
        if (!organization?.id) return;

        setIsLoading(true);
        setError(null);

        try {
            const { url } = await subscriptionService.createCheckoutSession(
                organization.id,
                priceId,
            );

            if (url) {
                window.location.href = url;
            }
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to start checkout",
            );
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [organization?.id]);

    const handlePortal = useCallback(async () => {
        if (!organization?.id) return;

        setIsLoading(true);
        setError(null);

        try {
            const { url } = await subscriptionService.createPortalSession(
                organization.id,
            );

            if (url) {
                window.location.href = url;
            }
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to open billing portal",
            );
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [organization?.id]);

    useEffect(() => {
        fetchPlans();
    }, [fetchPlans]);

    return {
        isLoading,
        error,
        plans,
        handleCheckout,
        handlePortal,
    };
}
