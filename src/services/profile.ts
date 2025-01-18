import { supabase } from "@/lib/supabase";
import type { Tables } from "@/types/database.types";

type Profile = Tables<"profiles">;

export class ProfileService {
    async getProfile(userId: string): Promise<Profile | null> {
        try {
            const { data: profile, error } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", userId)
                .single();

            if (error) throw error;
            return profile;
        } catch (error) {
            console.error("Error fetching profile:", error);
            return null;
        }
    }

    async createProfile(userId: string): Promise<Profile | null> {
        try {
            const { data: profile, error } = await supabase
                .from("profiles")
                .insert([{
                    id: userId,
                    onboarding_completed: false,
                }])
                .select()
                .single();

            if (error) {
                // If profile already exists, try to fetch it
                if (error.code === "23505") { // unique violation error code
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
        data: Partial<Omit<Profile, "id" | "created_at">>,
    ): Promise<Profile | null> {
        try {
            const { data: profile, error } = await supabase
                .from("profiles")
                .update({
                    ...data,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", userId)
                .select()
                .single();

            if (error) throw error;
            return profile;
        } catch (error) {
            console.error("Error updating profile:", error);
            return null;
        }
    }

    async getOrCreateProfile(userId: string): Promise<Profile | null> {
        try {
            let profile = await this.getProfile(userId);

            if (!profile) {
                profile = await this.createProfile(userId);
            }

            return profile;
        } catch (error) {
            console.error("Error in getOrCreateProfile:", error);
            return null;
        }
    }

    async updateOnboardingCompleted(userId: string): Promise<Profile | null> {
        return await this.updateProfile(userId, {
            onboarding_completed: true,
        });
    }
}
