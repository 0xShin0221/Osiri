import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

export const LANGUAGES = {
  DEFAULT: "en",
  SUPPORTED: [
    { code: "en", label: "English", dir: "ltr" },
    { code: "ja", label: "日本語", dir: "ltr" },
    { code: "zh", label: "中文", dir: "ltr" },
    { code: "ko", label: "한국어", dir: "ltr" },
    { code: "fr", label: "Français", dir: "ltr" },
  ] as const,
} as const;

i18n
  .use(LanguageDetector)
  .use(Backend)
  .use(initReactI18next)
  .init({
    supportedLngs: LANGUAGES.SUPPORTED.map((l) => l.code),
    backend: {
      // for all available options read the backend's repository readme file
      loadPath: "/i18n/{{lng}}/{{ns}}.json",
    },
    fallbackLng: LANGUAGES.DEFAULT,

    returnEmptyString: false,

    // have a common namespace used around the full app
    ns: ["common"],
    defaultNS: "common",

    // keySeparator: false, // we use content as keys

    interpolation: {
      escapeValue: false,
    },
    debug: true,
  });

export default i18n;
