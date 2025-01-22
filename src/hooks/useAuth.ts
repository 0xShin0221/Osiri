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
            const { data: orgMembers, error: orgError } = await supabase
                .from("organization_members")
                .select("organization_id")
                .eq("user_id", baseUser.id)
                .limit(1);

            if (orgError) {
                if (orgError.code === "PGRST116") {
                    setUser({
                        ...baseUser,
                        organization_id: undefined,
                    });
                    return;
                }
                throw orgError;
            }
            const orgMember = orgMembers?.[0];
            setUser({
                ...baseUser,
                organization_id: orgMember?.organization_id,
            });
        } catch (error) {
            if ((error as { code?: string })?.code !== "PGRST116") {
                console.error("Error fetching organization data:", error);
            }

            setUser({
                ...baseUser,
                organization_id: undefined,
            });
        }
    };

    useEffect(() => {
        let mounted = true;

        const initializeAuth = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (!mounted) return;

                setSession(session);
                await fetchUserWithOrg(session?.user ?? null);
            } catch (error) {
                console.error("Error initializing auth:", error);
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        initializeAuth();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (!mounted) return;

            setSession(session);
            await fetchUserWithOrg(session?.user ?? null);
            setLoading(false);
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    const signIn = async (email: string, password: string) => {
        setLoading(true);
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;
            return data;
        } finally {
            setLoading(false);
        }
    };

    const signUp = async (email: string, password: string) => {
        setLoading(true);
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            });
            if (error) throw error;
            return data;
        } finally {
            setLoading(false);
        }
    };

    const signOut = async () => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            setUser(null);
            setSession(null);
        } finally {
            setLoading(false);
        }
    };

    const resetPassword = async (email: string) => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });
            if (error) throw error;
        } finally {
            setLoading(false);
        }
    };

    const updatePassword = async (newPassword: string) => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword,
            });
            if (error) throw error;
        } finally {
            setLoading(false);
        }
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
