import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Session } from "@supabase/supabase-js";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/lib/supabase";
import { useTranslation } from "react-i18next";
import { authLocales } from "./locales";
import { PageLoading } from "../ui/page-loading";
import { ProfileService } from "@/services/profile";

interface AuthContainerProps {
  children?: React.ReactNode;
  theme?: "default" | "dark" | "muted";
  redirectTo?: string;
}

export function AuthContainer({ 
  children,
  theme = "default"
}: AuthContainerProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  useEffect(() => {
    let mounted = true;

    const handleSession = async (session: Session | null) => {
      if (!session) {
        setIsLoading(false);
        return;
      }

      try {
        const profile = await ProfileService.getOrCreateProfile(session.user.id);
        if (!mounted) return;
        if (profile) {
          setSession(session);
          if (!profile.onboarding_completed) {
            navigate(`/${currentLang}/onboarding`);
          }
        } else {
          console.error("Something went wrong with the profile creation or fetching");
          throw new Error("Profile creation or fetching failed");
        }
      } catch (error) {
        console.error('Error handling session:', error);
        throw new Error("Error handling session");
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSession(session);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, currentLang]);

  if (isLoading) {
    return <PageLoading />;
  }

  if (session) {
    return <>{children}</>;
  }

  return (
    <div className="container max-w-md mx-auto p-4">
      <Auth
        supabaseClient={supabase}
        appearance={appearance}
        theme={theme}
        localization={{
          variables: authLocales[currentLang as keyof typeof authLocales] || authLocales.en
        }}
        providers={["google", "github", "twitter", "linkedin"]}
        redirectTo={`${window.location.origin}/auth/callback`}
        socialLayout="horizontal"
      />
    </div>
  );
}

const appearance = {
  theme: ThemeSupa,
  variables: {
    default: {
      colors: {
        brand: '#2563eb',
        brandAccent: '#1d4ed8',
        brandButtonText: "white",
        inputBackground: "white",
        inputBorder: "#e2e8f0",
        inputBorderHover: "#cbd5e1",
        inputBorderFocus: "#2563eb",
        inputText: "#1e293b",
        inputLabelText: "#475569",
        inputPlaceholder: "#94a3b8"
      },
    },
    dark: {
      colors: {
        brand: '#3b82f6',
        brandAccent: '#2563eb',
        brandButtonText: "white",
        inputBackground: "#1e293b",
        inputBorder: "#334155",
        inputBorderHover: "#475569",
        inputBorderFocus: "#3b82f6",
        inputText: "#f8fafc",
        inputLabelText: "#cbd5e1",
        inputPlaceholder: "#64748b"
      },
    },
  },
  style: {
    input: { borderRadius: '0.5rem', fontSize: '1rem' },
    label: { fontSize: '0.875rem', marginBottom: '0.5rem' },
    button: { borderRadius: '0.5rem', fontSize: '1rem' },
    anchor: { fontSize: '0.875rem' },
  }
};