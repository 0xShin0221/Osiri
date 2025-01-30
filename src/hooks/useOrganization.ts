import { useCallback, useEffect, useState } from "react";
import type { Database } from "@/types/database.types";
import { OrganizationService } from "@/services/organization";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./useAuth";

type OrganizationUpdate =
    Database["public"]["Tables"]["organizations"]["Update"];
type OrganizationSubscriptionStatusRow =
    & Database["public"]["Views"]["organization_subscription_status"]["Row"]
    & {
        plan_id: string | null;
        plan_amount: number | null; // Add this line
    };

export function useOrganization() {
    const [organization, setOrganization] = useState<
        OrganizationSubscriptionStatusRow | null
    >(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const organizationService = new OrganizationService();
    const { session } = useAuth();

    const fetchOrganization = useCallback(async () => {
        if (!session?.user) {
            setIsLoading(false);
            setOrganization(null);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const { data: memberData, error: memberError } = await supabase
                .from("organization_members")
                .select("organization_id")
                .eq("user_id", session.user.id)
                .maybeSingle();

            if (memberError) {
                if (memberError.code === "PGRST116") {
                    setOrganization(null);
                    setIsLoading(false);
                    return;
                }
                throw memberError;
            }

            if (!memberData?.organization_id) {
                setOrganization(null);
                return;
            }

            const { data: org, error: orgError } = await supabase
                .from("organization_subscription_status")
                .select("*")
                .eq("id", memberData.organization_id)
                .single();

            if (orgError) throw orgError;
            setOrganization(org);
        } catch (err) {
            console.error("Error fetching organization:", err);
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to load organization",
            );
        } finally {
            setIsLoading(false);
        }
    }, [session?.user]);

    const createOrganization = async (name: string) => {
        if (!session?.user) return null;

        setError(null);
        try {
            const newOrg = await organizationService.createOrganization(
                name,
                session.user.id,
            );
            if (newOrg) {
                await fetchOrganization();
            }
            return newOrg;
        } catch (err) {
            console.error("Error creating organization:", err);
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to create organization",
            );
            return null;
        }
    };

    const updateOrganization = async (
        data: Pick<OrganizationUpdate, "name">,
    ) => {
        if (!organization?.id) return null;

        setError(null);
        try {
            const updatedOrg = await organizationService.updateOrganization(
                organization.id,
                data,
            );
            if (updatedOrg) {
                await fetchOrganization();
            }
            return updatedOrg;
        } catch (err) {
            console.error("Error updating organization:", err);
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to update organization",
            );
            return null;
        }
    };

    const startTrial = async () => {
        if (!organization?.id) return null;

        try {
            const { data, error } = await supabase
                .from("organizations")
                .update({
                    trial_start_date: new Date().toISOString(),
                    trial_end_date: new Date(
                        Date.now() + 7 * 24 * 60 * 60 * 1000,
                    ).toISOString(),
                    subscription_status: "trialing",
                })
                .eq("id", organization.id)
                .single();

            if (error) throw error;
            await fetchOrganization();
            return data;
        } catch (err) {
            console.error("Error starting trial:", err);
            setError(
                err instanceof Error ? err.message : "Failed to start trial",
            );
            return null;
        }
    };

    const changePlan = async (newPlanId: string) => {
        if (!organization?.id) return null;

        try {
            // Check current subscription status
            if (
                organization.stripe_status === "active" ||
                organization.stripe_status === "trialing"
            ) {
                // Cancel current subscription first
                const { error: cancelError } = await supabase
                    .functions.invoke("cancel-subscription", {
                        body: {
                            organizationId: organization.id,
                            subscriptionId: organization.subscription_id,
                        },
                    });

                if (cancelError) throw cancelError;
            }

            // Create new subscription
            const { error: updateError } = await supabase
                .from("organizations")
                .update({
                    plan_id: newPlanId,
                    subscription_status: "active",
                    trial_end_date: null,
                })
                .eq("id", organization.id)
                .single();

            if (updateError) throw updateError;

            // Create new Stripe subscription
            const { error: stripeError } = await supabase
                .functions.invoke("create-subscription", {
                    body: {
                        organizationId: organization.id,
                        planId: newPlanId,
                    },
                });

            if (stripeError) throw stripeError;

            await fetchOrganization();
            return true;
        } catch (err) {
            console.error("Error changing plan:", err);
            setError(
                err instanceof Error ? err.message : "Failed to change plan",
            );
            return null;
        }
    };

    const getCurrentSubscriptionDetails = useCallback(() => {
        if (!organization) return null;

        return {
            isActive: organization.stripe_status === "active",
            isTrialing: organization.stripe_status === "trialing",
            currentPlanId: organization.plan_id,
            subscriptionId: organization.subscription_id,
            willCancelAtPeriodEnd: organization.will_cancel === "true",
            currentPeriodEnd: organization.stripe_period_end,
        };
    }, [organization]);

    useEffect(() => {
        fetchOrganization();
    }, [fetchOrganization]);

    const isSubscriptionValid = useCallback(() => {
        if (!organization) return false;

        if (
            organization.subscription_status === "active" ||
            organization.stripe_status === "active"
        ) {
            return true;
        }

        if (organization.subscription_status === "trialing") {
            const trialEnd = organization.trial_end_date ||
                organization.stripe_trial_end;
            if (trialEnd) {
                return new Date(trialEnd) > new Date();
            }
        }

        return false;
    }, [organization]);

    const hasScheduledCancellation = useCallback(() => {
        return organization?.will_cancel === "true" ||
            Boolean(organization?.cancel_at);
    }, [organization]);

    const hasPaymentMethod = useCallback(() => {
        return Boolean(organization?.default_payment_method);
    }, [organization]);

    const getBillingDetails = useCallback(() => {
        if (!organization) return null;

        return {
            amount: organization.plan_amount,
            currency: organization.plan_currency,
            interval: organization.billing_interval,
            collection_method: organization.collection_method,
        };
    }, [organization]);

    return {
        organization,
        isLoading,
        error,
        createOrganization,
        updateOrganization,
        startTrial,
        changePlan,
        getCurrentSubscriptionDetails,
        isSubscriptionValid,
        hasScheduledCancellation,
        hasPaymentMethod,
        getBillingDetails,
        refetch: fetchOrganization,
    };
}
