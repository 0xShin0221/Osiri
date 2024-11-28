import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";
import { LANGUAGES } from "./languages";

i18n
  .use(LanguageDetector)
  .use(Backend)
  .use(initReactI18next)
  .init({
    supportedLngs: LANGUAGES.SUPPORTED.map((l: { code: string }) => l.code),
    backend: {
      // for all available options read the backend's repository readme file
      loadPath: "/i18n/{{lng}}/{{ns}}.json",
    },
    fallbackLng: LANGUAGES.DEFAULT,

    returnEmptyString: false,

    // have a common namespace used around the full app
    ns: ["home"],
    defaultNS: "home",

    // keySeparator: false, // we use content as keys

    interpolation: {
      escapeValue: false,
    },
    debug: true,
  });

export default i18n;
