import { supabase } from "@/lib/supabase";
import { Database } from "@/types/database.types";

type OrganizationInsert =
    Database["public"]["Tables"]["organizations"]["Insert"];
type OrganizationUpdate =
    Database["public"]["Tables"]["organizations"]["Update"];
type OrganizationMemberRow =
    Database["public"]["Tables"]["organization_members"]["Row"];

type MemberRoleEnum = Database["public"]["Enums"]["member_role"];

type OrganizationSubscriptionStatusRow =
    Database["public"]["Views"]["organization_subscription_status"]["Row"];

interface MemberWithProfile extends OrganizationMemberRow {
    user: {
        id: string;
        email: string | null;
    };
}

export class OrganizationService {
    async getOrganization(
        organizationId: string,
    ): Promise<OrganizationSubscriptionStatusRow | null> {
        try {
            const { data, error } = await supabase
                .from("organization_subscription_status")
                .select("*")
                .eq("id", organizationId)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error("Error fetching organization:", error);
            return null;
        }
    }

    async createOrganization(
        name: string,
        userId: string,
        subscriptionData?: Partial<
            Pick<
                OrganizationInsert,
                "trial_start_date" | "trial_end_date" | "subscription_status"
            >
        >,
    ): Promise<OrganizationSubscriptionStatusRow | null> {
        try {
            const defaultTrialData: Required<
                Pick<
                    OrganizationInsert,
                    | "trial_start_date"
                    | "trial_end_date"
                    | "subscription_status"
                >
            > = {
                trial_start_date: new Date().toISOString(),
                trial_end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                    .toISOString(),
                subscription_status: "trialing",
            };

            const { data: orgData, error: orgError } = await supabase
                .from("organizations")
                .insert([{
                    name: name.trim(),
                    ...defaultTrialData,
                    ...subscriptionData,
                }])
                .select()
                .single();

            if (orgError) throw orgError;

            const { error: memberError } = await supabase
                .from("organization_members")
                .insert([{
                    user_id: userId,
                    organization_id: orgData.id,
                    role: "admin" as MemberRoleEnum,
                }]);

            if (memberError) throw memberError;

            return await this.getOrganization(orgData.id);
        } catch (error) {
            console.error("Error creating organization:", error);
            return null;
        }
    }

    async updateOrganization(
        organizationId: string,
        data: Partial<OrganizationUpdate>,
    ): Promise<OrganizationSubscriptionStatusRow | null> {
        try {
            const { error: updateError } = await supabase
                .from("organizations")
                .update(data)
                .eq("id", organizationId);

            if (updateError) throw updateError;

            return await this.getOrganization(organizationId);
        } catch (error) {
            console.error("Error updating organization:", error);
            return null;
        }
    }

    async getUserOrganization(
        userId: string,
    ): Promise<OrganizationSubscriptionStatusRow | null> {
        try {
            const { data: member, error: memberError } = await supabase
                .from("organization_members")
                .select("organization_id")
                .eq("user_id", userId)
                .single();

            if (memberError) throw memberError;
            if (!member) return null;

            return await this.getOrganization(member.organization_id);
        } catch (error) {
            console.error("Error fetching user organization:", error);
            return null;
        }
    }

    async getOrganizationMembers(
        organizationId: string,
    ): Promise<MemberWithProfile[]> {
        try {
            const { data: members, error: membersError } = await supabase
                .from("organization_members")
                .select("*")
                .eq("organization_id", organizationId);

            if (membersError) throw membersError;
            if (!members || members.length === 0) return [];

            const userIds = members.map((member) => member.user_id);
            const { data: profiles, error: profilesError } = await supabase
                .from("profiles")
                .select("id, email")
                .in("id", userIds);

            if (profilesError) throw profilesError;

            const profileMap = new Map(
                profiles?.map((profile) => [profile.id, profile]) ?? [],
            );

            return members.map((member) => ({
                ...member,
                user: {
                    id: member.user_id!,
                    email: profileMap.get(member.user_id!)?.email ?? null,
                },
            }));
        } catch (error) {
            console.error("Error fetching organization members:", error);
            return [];
        }
    }

    async removeMember(organizationId: string, userId: string): Promise<void> {
        try {
            const { data: member, error: memberError } = await supabase
                .from("organization_members")
                .select("role")
                .eq("organization_id", organizationId)
                .eq("user_id", userId)
                .single();

            if (memberError) throw memberError;
            if (member?.role === "owner") {
                throw new Error("Cannot remove organization owner");
            }

            const { error } = await supabase
                .from("organization_members")
                .delete()
                .eq("organization_id", organizationId)
                .eq("user_id", userId);

            if (error) throw error;
        } catch (error) {
            console.error("Error removing member:", error);
            throw error;
        }
    }

    async updateMemberRole(
        organizationId: string,
        userId: string,
        role: MemberRoleEnum,
    ): Promise<void> {
        try {
            const { data: member, error: memberError } = await supabase
                .from("organization_members")
                .select("role")
                .eq("organization_id", organizationId)
                .eq("user_id", userId)
                .single();

            if (memberError) throw memberError;
            if (member?.role === "owner") {
                throw new Error("Cannot modify owner's role");
            }

            const { error } = await supabase
                .from("organization_members")
                .update({ role })
                .eq("organization_id", organizationId)
                .eq("user_id", userId);

            if (error) throw error;
        } catch (error) {
            console.error("Error updating member role:", error);
            throw error;
        }
    }
}
