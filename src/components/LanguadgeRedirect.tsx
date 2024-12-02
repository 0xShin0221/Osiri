import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LANGUAGES } from "@/lib/i18n/languages";

interface LanguageRedirectProps {
  fallback?: React.ReactNode;
}

export const LanguageRedirect = ({ fallback }: LanguageRedirectProps) => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const userLang = i18n.resolvedLanguage || LANGUAGES.DEFAULT;
    const path = location.pathname;


    if (path === '/') {
      navigate(`/${userLang}`);
      return;
    }


    if (!path.match(/^\/[a-z]{2}/) && !fallback) {
      navigate(`/${userLang}${path}`);
      return;
    }
  }, [i18n.resolvedLanguage, navigate, location]);

  if (fallback && !location.pathname.match(/^\/[a-z]{2}/)) {
    return <>{fallback}</>;
  }

  return null;
};