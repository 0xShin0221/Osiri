import { LANGUAGES } from "@/lib/i18n/languages";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
export function useLanguage() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const changeLanguage = async (langCode: string) => {
    if (LANGUAGES.SUPPORTED.some((l) => l.code === langCode)) {
      const newPath = location.pathname.replace(/^\/[a-z]{2}/, "");
      await i18n.changeLanguage(langCode);
      navigate(`/${langCode}${newPath}`);
      document.documentElement.lang = langCode;
      localStorage.setItem("i18nextLng", langCode);
    }
  };

  return {
    currentLanguage: i18n.resolvedLanguage,
    changeLanguage,
    languages: LANGUAGES.SUPPORTED,
    isRTL: i18n.dir() === "rtl",
  };
}
