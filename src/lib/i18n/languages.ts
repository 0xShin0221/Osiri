import { Database } from "@/types/database.types";

export type FeedLanguage = Database["public"]["Enums"]["feed_language"];
export type Currency = Database["public"]["Enums"]["subscription_currency"];

export const LANGUAGES = {
  DEFAULT: "en" as const,
  SUPPORTED: [
    {
      code: "en" as FeedLanguage,
      label: "English",
      dir: "ltr",
      currency: "usd" as Currency,
    },
    {
      code: "ja" as FeedLanguage,
      label: "日本語",
      dir: "ltr",
      currency: "jpy" as Currency,
    },
    {
      code: "zh" as FeedLanguage,
      label: "中文",
      dir: "ltr",
      currency: "cny" as Currency,
    },
    {
      code: "ko" as FeedLanguage,
      label: "한국어",
      dir: "ltr",
      currency: "krw" as Currency,
    },
    {
      code: "fr" as FeedLanguage,
      label: "Français",
      dir: "ltr",
      currency: "eur" as Currency,
    },
    {
      code: "es" as FeedLanguage,
      label: "Español",
      dir: "ltr",
      currency: "eur" as Currency,
    },
    {
      code: "hi" as FeedLanguage,
      label: "हिंदी",
      dir: "ltr",
      currency: "inr" as Currency,
    },
    {
      code: "pt" as FeedLanguage,
      label: "Português",
      dir: "ltr",
      currency: "brl" as Currency,
    },
    {
      code: "bn" as FeedLanguage,
      label: "বাংলা",
      dir: "ltr",
      currency: "bdt" as Currency,
    },
    {
      code: "ru" as FeedLanguage,
      label: "Русский",
      dir: "ltr",
      currency: "rub" as Currency,
    },
    {
      code: "id",
      label: "Bahasa Indonesia",
      dir: "ltr",
      currency: "idr" as Currency,
    },
    { code: "de", label: "Deutsch", dir: "ltr", currency: "eur" as Currency },
  ] as const,
} as const;

export const LANGUAGE_CURRENCY_MAP = Object.fromEntries(
  LANGUAGES.SUPPORTED.map(({ code, currency }) => [code, currency]),
) as Record<FeedLanguage, Currency>;
