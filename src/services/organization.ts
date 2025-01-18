import { supabase } from "@/lib/supabase";
import type { Tables } from "@/types/database.types";

type Organization = Tables<"organizations">;
type OrganizationMember = Tables<"organization_members">;
interface MemberWithProfile extends OrganizationMember {
    user: {
        id: string;
        email: string | null;
    };
}

export class OrganizationService {
    async getOrganization(
        organizationId: string,
    ): Promise<Organization | null> {
        try {
            const { data, error } = await supabase
                .from("organizations")
                .select(`
          *,
          organization_members (
            user_id,
            role
          )
        `)
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
    ): Promise<Organization | null> {
        try {
            // Insert new organization
            const { data: orgData, error: orgError } = await supabase
                .from("organizations")
                .insert([{ name: name.trim() }])
                .select()
                .single();

            if (orgError) throw orgError;

            // Create organization member record
            const { error: memberError } = await supabase
                .from("organization_members")
                .insert([
                    {
                        user_id: userId,
                        organization_id: orgData.id,
                        role: "admin",
                    },
                ]);

            if (memberError) throw memberError;

            return await this.getOrganization(orgData.id);
        } catch (error) {
            console.error("Error creating organization:", error);
            return null;
        }
    }

    async updateOrganization(
        organizationId: string,
        data: Partial<Organization>,
    ): Promise<Organization | null> {
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

    async getUserOrganization(userId: string): Promise<Organization | null> {
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
            // First, get organization members
            const { data: members, error: membersError } = await supabase
                .from("organization_members")
                .select("*")
                .eq("organization_id", organizationId);

            if (membersError) throw membersError;
            if (!members || members.length === 0) return [];

            // Then, get profiles for all members
            const userIds = members.map((member) => member.user_id);
            const { data: profiles, error: profilesError } = await supabase
                .from("profiles")
                .select("id, email")
                .in("id", userIds);

            if (profilesError) throw profilesError;

            // Create a map of profiles for easy lookup
            const profileMap = new Map(
                profiles?.map((profile) => [profile.id, profile]) ?? [],
            );

            // Combine member data with profile data
            return members.map((member) => ({
                ...member,
                user: {
                    id: member.user_id,
                    email: profileMap.get(member.user_id)?.email ?? null,
                },
            }));
        } catch (error) {
            console.error("Error fetching organization members:", error);
            return [];
        }
    }

    async removeMember(organizationId: string, userId: string): Promise<void> {
        try {
            // Check if user is owner before removal
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
        role: OrganizationMember["role"],
    ): Promise<void> {
        try {
            // Check if target user is owner
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
