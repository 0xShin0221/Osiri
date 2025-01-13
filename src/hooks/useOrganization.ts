import { useCallback, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { OrganizationService } from "@/services/organization";
import type { Tables } from "@/types/database.types";

type Organization = Tables<"organizations">;

interface UseOrganizationOptions {
    session: Session | null;
}

export function useOrganization({ session }: UseOrganizationOptions) {
    const [organization, setOrganization] = useState<Organization | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const organizationService = new OrganizationService();

    const fetchOrganization = useCallback(async () => {
        if (!session?.user) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const org = await organizationService.getUserOrganization(
                session.user.id,
            );
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
                setOrganization(newOrg);
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

    const updateOrganization = async (data: Partial<Organization>) => {
        if (!organization?.id) return null;

        setError(null);
        try {
            const updatedOrg = await organizationService.updateOrganization(
                organization.id,
                data,
            );
            if (updatedOrg) {
                setOrganization(updatedOrg);
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

    useEffect(() => {
        fetchOrganization();
    }, [fetchOrganization]);

    return {
        organization,
        isLoading,
        error,
        createOrganization,
        updateOrganization,
        refetch: fetchOrganization,
    };
}
