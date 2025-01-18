import { useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useOnboardingStore } from "../../stores/onboardingStore";
import InterestSelection from "./InterestSelection";
import PlatformSetup from "./PlatformSetup";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";

export default function OnboardingLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { step, handleOAuthCallback } = useOnboardingStore();
  const { t } = useTranslation("onboarding");
  const { session } = useAuth();
  const { updateProfile } = useProfile({
    session,
    redirectToOnboarding: false,
  });

  useEffect(() => {
    if (location.search.includes("code=")) {
      const params = new URLSearchParams(location.search);
      handleOAuthCallback(params)
        .then(() => {
          navigate("/onboarding", { replace: true });
        })
        .catch((error) => {
          console.error("OAuth callback error:", error);
        });
    }
  }, [location.search, handleOAuthCallback, navigate]);

  const handleSkipOnboarding = async () => {
    try {
      const updated = await updateProfile({
        onboarding_completed: true,
      });

      if (updated) {
        navigate("/dashboard", { replace: true });
      }
    } catch (error) {
      console.error("Failed to skip onboarding:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Progress indicator */}
      <div className="max-w-xl mx-auto pt-8 px-2">
        <Progress value={step === 1 ? 50 : 100} className="mb-2" />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span className={step === 1 ? "text-primary font-medium" : ""}>
            1. {t("steps.interests")}
          </span>
          <span className={step === 2 ? "text-primary font-medium" : ""}>
            2. {t("steps.notifications")}
          </span>
        </div>
      </div>
      <div className="w-full">
        <div className="container flex justify-end py-4">
          <Button
            variant="ghost"
            className="text-sm text-muted-foreground hover:text-primary"
            onClick={handleSkipOnboarding}
          >
            {t("skip")} →
          </Button>
        </div>
      </div>

      {/* Current step content */}
      <div className="container py-8">
        {step === 1 ? <InterestSelection /> : <PlatformSetup />}
      </div>
    </div>
  );
}
