import { useCallback, useEffect, useState } from "react";
import type { Database } from "@/types/database.types";
import { OrganizationService } from "@/services/organization";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./useAuth";

type OrganizationUpdate =
    Database["public"]["Tables"]["organizations"]["Update"];
type OrganizationSubscriptionStatusRow =
    Database["public"]["Views"]["organization_subscription_status"]["Row"];

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
