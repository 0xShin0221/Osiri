import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PageLoading } from "../ui/page-loading";

export function AuthCallback() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  useEffect(() => {
    const handleCallback = async () => {
      // Redirect to dashboard with current language prefix
      navigate(`/${currentLang}/dashboard`, { replace: true });
    };

    handleCallback();
  }, [navigate, currentLang]);

  // Show loading state while processing
  return <PageLoading />;
}
