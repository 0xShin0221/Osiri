import {
    bn,
    de,
    enUS,
    es,
    fr,
    hi,
    id,
    ja,
    ko,
    pt,
    ru,
    zhCN,
} from "date-fns/locale";
import { type FeedLanguage, LANGUAGES } from "@/lib/i18n/languages";
import type { Locale } from "date-fns";

export const getDateLocale = (language: string): Locale => {
    const currentLang = language as FeedLanguage || LANGUAGES.DEFAULT;

    switch (currentLang) {
        case "ja":
            return ja;
        case "zh":
            return zhCN;
        case "ko":
            return ko;
        case "fr":
            return fr;
        case "es":
            return es;
        case "hi":
            return hi;
        case "pt":
            return pt;
        case "bn":
            return bn;
        case "ru":
            return ru;
        case "id":
            return id;
        case "de":
            return de;
        default:
            return enUS;
    }
};
