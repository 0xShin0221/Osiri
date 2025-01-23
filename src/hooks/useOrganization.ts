import { useCallback, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { OrganizationService } from "@/services/organization";
import type { Tables } from "@/types/database.types";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./useAuth";

type Organization = Tables<"organizations">;
type SubscriptionLimits = Tables<"subscription_limits">;

interface OrganizationWithLimits extends Organization {
    subscription_limits?: SubscriptionLimits;
}

export function useOrganization() {
    const [organization, setOrganization] = useState<
        OrganizationWithLimits | null
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
            if (!memberData) return;
            const { data: org, error: orgError } = await supabase
                .from("organizations")
                .select(`
                    *,
                    subscription_limits (*)
                `)
                .eq("id", memberData.organization_id)
                .single();

            if (orgError) throw orgError;
            setOrganization(org);
        } catch (err) {
            if (err instanceof Error && (err as any).code !== "PGRST116") {
                console.error("Error fetching organization:", err);
                setError(err.message);
            } else {
                setError("Failed to load organization");
            }
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
            if (!newOrg) return null;
            await supabase.from("subscription_limits").insert({
                organization_id: newOrg.id,
                max_channels: 1,
                max_feeds_per_channel: 5,
                max_notifications_per_day: 100,
                notification_frequency_minutes: 60,
            });

            await fetchOrganization();
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

    const updateOrganization = async (data: Partial<Organization>) => {
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

    useEffect(() => {
        fetchOrganization();
    }, [fetchOrganization]);

    const isSubscriptionValid = useCallback(() => {
        if (!organization) return false;

        if (organization.subscription_status === "active") {
            return true;
        }

        if (
            organization.subscription_status === "trialing" &&
            organization.trial_end_date
        ) {
            return new Date(organization.trial_end_date) > new Date();
        }

        return false;
    }, [organization]);

    return {
        organization,
        isLoading,
        error,
        createOrganization,
        updateOrganization,
        startTrial,
        isSubscriptionValid,
        refetch: fetchOrganization,
    };
}
