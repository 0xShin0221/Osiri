import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';

import { Database } from '@/types/database.types';
import { ProfileService } from '@/services/profile';

type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

interface UseProfileOptions {
  session: Session | null;
  redirectToOnboarding?: boolean;
}

export function useProfile({ 
  session, 
  redirectToOnboarding = true 
}: UseProfileOptions) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      if (!session?.user) {
        setIsLoading(false);
        return;
      }

      try {
        const userProfile = await ProfileService.getOrCreateProfile(session.user.id);
        
        if (!mounted) return;
        
        if (userProfile) {
          setProfile(userProfile);
          if (redirectToOnboarding && !userProfile.onboarding_completed) {
            navigate('/onboarding');
          }
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadProfile();
    return () => { mounted = false };
  }, [session, navigate, redirectToOnboarding]);

  const updateProfile = async (update: Omit<ProfileUpdate, 'user_id'>) => {
    if (!session?.user) {
      console.error('No active session');
      return null;
    }

    const updatedProfile = await ProfileService.updateProfile(
      session.user.id, 
      update
    );

    if (updatedProfile) {
      setProfile(updatedProfile);
    }

    return updatedProfile;
  };

  return {
    profile,
    isLoading,
    updateProfile,
  };
}