import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useOrganization } from "@/hooks/useOrganization";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "react-i18next";
import { PageLoading } from "@/components/ui/page-loading";

interface OrgAuthContainerProps {
  children: React.ReactNode;
}

export const OrgAuthContainer = ({ children }: OrgAuthContainerProps) => {
  const navigate = useNavigate();
  const { organization, isLoading } = useOrganization();
  const { session } = useAuth();
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  useEffect(() => {
    if (isLoading) return;

    if (!session?.user) return;

    if (!organization) {
      navigate(`/${currentLang}/settings`, { replace: true });
      return;
    }

    const isValid =
      organization.subscription_status === "active" ||
      (organization.subscription_status === "trialing" &&
        organization.trial_end_date &&
        new Date(organization.trial_end_date) > new Date());

    if (!isValid) {
      navigate(`/${currentLang}/settings`, { replace: true });
    }
  }, [session, organization, isLoading, navigate, currentLang]);

  if (isLoading) {
    return <PageLoading />;
  }

  if (!session?.user || !organization) {
    return null;
  }

  return <>{children}</>;
};
