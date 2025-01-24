// scripts/stripe/types.ts
import { LANGUAGES } from "../../src/lib/i18n/languages";

export type SupportedLanguage = typeof LANGUAGES.SUPPORTED[number]["code"];

export type CurrencyConfig = {
    symbol: string;

    decimalPlaces: number;
};

export type MeteredPricing = {
    unitAmount: number;
};

export type Plan = {
    id: string;
    name: string;
    description: string;
    basePrice: number;
    currency: string;
    notificationsPerDay: number;
    metered?: MeteredPricing;
};

export type PricingConfig = {
    currency: string;
    interval: "month" | "year";
    plans: Plan[];
};
