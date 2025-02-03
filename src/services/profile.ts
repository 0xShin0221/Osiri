import { supabase } from "@/lib/supabase";
import { Database } from "@/types/database.types";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export class ProfileService {
    async getProfile(userId: string): Promise<ProfileRow | null> {
        try {
            const { data: profile, error } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", userId)
                .maybeSingle();

            if (error) throw error;
            return profile;
        } catch (error) {
            console.error("Error fetching profile:", error);
            return null;
        }
    }

    async createProfile(userId: string): Promise<ProfileRow | null> {
        try {
            const { data: { user }, error: userError } = await supabase.auth
                .getUser();
            if (userError) throw userError;

            const newProfile: ProfileInsert = {
                id: userId,
                email: user?.email ?? null,
                onboarding_completed: false,
            };

            const { data: profile, error } = await supabase
                .from("profiles")
                .insert([newProfile])
                .select()
                .single();

            if (error) {
                if (error.code === "23505") {
                    return await this.getProfile(userId);
                }
                throw error;
            }

            return profile;
        } catch (error) {
            console.error("Error creating profile:", error);
            return null;
        }
    }

    async updateProfile(
        userId: string,
        data: Omit<ProfileUpdate, "id" | "created_at">,
    ): Promise<ProfileRow | null> {
        try {
            const { data: profile, error } = await supabase
                .from("profiles")
                .update({
                    ...data,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", userId)
                .select()
                .maybeSingle();

            if (error) throw error;
            return profile;
        } catch (error) {
            console.error("Error updating profile:", error);
            return null;
        }
    }

    async getOrCreateProfile(userId: string): Promise<ProfileRow | null> {
        try {
            const profile = await this.getProfile(userId);
            if (!profile) {
                return await this.createProfile(userId);
            }
            return profile;
        } catch (error) {
            console.error("Error in getOrCreateProfile:", error);
            return null;
        }
    }
}
