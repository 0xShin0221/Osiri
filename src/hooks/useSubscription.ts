import { useCallback, useEffect, useState } from "react";
import { SubscriptionService } from "@/services/subscription";
import { useOrganization } from "./useOrganization";
import { Database } from "@/types/database.types";
import { useTranslation } from "react-i18next";
import { LANGUAGES } from "@/lib/i18n/languages";

interface UseSubscriptionReturn {
    isLoading: boolean;
    error: string | null;
    plans: SubscriptionPlan[] | null;
    handleCheckout: (priceId: string) => Promise<void>;
    handlePortal: () => Promise<void>;
}

type FeedLanguage = Database["public"]["Enums"]["feed_language"];
type SubscriptionPlan =
    Database["public"]["Tables"]["subscription_plans"]["Row"];

export function useSubscription(): UseSubscriptionReturn {
    const { i18n } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [plans, setPlans] = useState<SubscriptionPlan[] | null>(null);
    const { organization } = useOrganization();
    const subscriptionService = new SubscriptionService();

    const fetchPlans = useCallback(async () => {
        try {
            const language: FeedLanguage =
                i18n.resolvedLanguage as FeedLanguage ||
                LANGUAGES.DEFAULT;
            const fetchedPlans = await subscriptionService.getSubscriptionPlans(
                language,
            );

            if (!fetchedPlans?.length) {
                const defaultPlans = await subscriptionService
                    .getSubscriptionPlans(
                        LANGUAGES.DEFAULT,
                    );
                setPlans(defaultPlans);
                return;
            }
            setPlans(fetchedPlans);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to fetch plans",
            );
        }
    }, [i18n.resolvedLanguage]);

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
