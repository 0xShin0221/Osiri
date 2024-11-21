import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function LanguageRedirect() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  useEffect(() => {
    const resolvedLang = i18n.resolvedLanguage;
    const currentPath = window.location.pathname.replace(/^\/[a-z]{2}/, "");

    navigate(`/${resolvedLang}${currentPath}`, { replace: true });
  }, [navigate, i18n.resolvedLanguage]);

  return null;
}
