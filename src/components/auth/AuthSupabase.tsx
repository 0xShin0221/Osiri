import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Session } from "@supabase/supabase-js";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/lib/supabase";
import { useTranslation } from "react-i18next";
import { authLocales } from "./locales";
import { PageLoading } from "../ui/page-loading";
import { getProfile } from "./FetchProfile";

interface AuthContainerProps {
  children?: React.ReactNode;
  theme?: "default" | "dark" | "muted";
  redirectTo?: string;
}

export function AuthContainer({ 
  children,
  theme = "default", 
  redirectTo = "/dashboard" 
}: AuthContainerProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const currentLang = i18n.language;


  useEffect(() => {
    const handleSession = async (session: Session | null) => {
      if (!session) {
        setIsLoading(false);
        return;
      }

      try {
        const profile = await getProfile(session.user.id);
        setSession(session);
        if(!profile){
          throw new Error("Profile not found");
        }

        if (!profile.onboarding_completed
          ) {
          navigate(`/${currentLang}/onboarding`);
        } else {
          navigate(`/${currentLang}${redirectTo}`);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        // If there's an error fetching the profile, we'll redirect to onboarding
        // This handles the case where the profile might not exist yet
        
      } finally {
        setIsLoading(false);
      }
    };

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSession(session);
    });

    // Setup auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSession(session);
    });

    return () => subscription.unsubscribe();
  }, [navigate, redirectTo, currentLang]);

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
        providers={["google", "github","twitter","linkedin"]}
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
    input: {
      borderRadius: '0.5rem',
      fontSize: '1rem',
    },
    label: {
      fontSize: '0.875rem',
      marginBottom: '0.5rem',
    },
    button: {
      borderRadius: '0.5rem',
      fontSize: '1rem',
    },
    anchor: {
      fontSize: '0.875rem',
    },
  }
};
