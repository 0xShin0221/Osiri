import { supabase } from "@/lib/supabase";
import { Database } from "@/types/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export class ProfileService {
  static async getProfile(userId: string): Promise<Profile | null> {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    return profile;
  }

  static async createProfile(userId: string): Promise<Profile | null> {
    const profileData: ProfileInsert = {
      user_id: userId,
      onboarding_completed: false,
    };

    const { data: profile, error } = await supabase
      .from('profiles')
      .insert([profileData])
      .select()
      .single();

    if (error) {
      // If profile already exists, try to fetch it
      if (error.code === '23505') {
        return await this.getProfile(userId);
      }
      console.error('Error creating profile:', error);
      return null;
    }

    return profile;
  }

  static async updateProfile(
    userId: string, 
    update: Omit<ProfileUpdate, 'user_id'>
  ): Promise<Profile | null> {
    const { data: profile, error } = await supabase
      .from('profiles')
      .update({
        ...update,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      return null;
    }

    return profile;
  }

  static async getOrCreateProfile(userId: string): Promise<Profile | null> {
    const existingProfile = await this.getProfile(userId);
    if (existingProfile) return existingProfile;
    
    return await this.createProfile(userId);
  }
}