// src/hooks/useAuth.ts
import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

interface UserWithOrg extends User {
    organization_id?: string;
}

export function useAuth() {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<UserWithOrg | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUserWithOrg = async (baseUser: User | null) => {
        if (!baseUser) {
            setUser(null);
            return;
        }

        try {
            const { data: orgMember, error: orgError } = await supabase
                .from("organization_members")
                .select("organization_id")
                .eq("user_id", baseUser.id)
                .single();

            if (orgError) throw orgError;

            // Combine user data with organization info
            setUser({
                ...baseUser,
                organization_id: orgMember?.organization_id,
            });
        } catch (error) {
            console.error("Error fetching organization:", error);
            // Still set the user, just without organization info
            setUser(baseUser);
        }
    };

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            fetchUserWithOrg(session?.user ?? null);
            setLoading(false);
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setSession(session);
            await fetchUserWithOrg(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signIn = async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
        return data;
    };

    const signUp = async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });
        if (error) throw error;
        return data;
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    };

    const resetPassword = async (email: string) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
    };

    const updatePassword = async (newPassword: string) => {
        const { error } = await supabase.auth.updateUser({
            password: newPassword,
        });
        if (error) throw error;
    };

    return {
        session,
        user,
        loading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updatePassword,
    };
}
