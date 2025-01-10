import { type ReactElement, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";

interface LanguageRedirectProps {
  fallback?: ReactElement | null;
}

export const LanguageRedirect: React.FC<LanguageRedirectProps> = ({
  fallback = null,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { i18n } = useTranslation();
  const currentLang = i18n.resolvedLanguage;

  useEffect(() => {
    const currentPath = location.pathname.replace(/^\//, "");
    navigate(`/${currentLang}/${currentPath}`, { replace: true });
  }, [navigate, location, currentLang]);

  return fallback;
};
