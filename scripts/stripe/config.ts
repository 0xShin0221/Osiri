// scripts/stripe/config.ts
import { LANGUAGES } from "../../src/lib/i18n/languages";
import { CurrencyConfig, Plan, PricingConfig } from "./types";

type LanguageCode = typeof LANGUAGES.SUPPORTED[number]["code"];
type Currency =
    | "usd"
    | "jpy"
    | "cny"
    | "krw"
    | "eur"
    | "inr"
    | "brl"
    | "bdt"
    | "rub"
    | "idr";

export const CURRENCY_CONFIG: Record<Currency, CurrencyConfig> = {
    usd: { symbol: "$", decimalPlaces: 2 },
    jpy: { symbol: "¥", decimalPlaces: 0 },
    cny: { symbol: "¥", decimalPlaces: 2 },
    krw: { symbol: "₩", decimalPlaces: 0 },
    eur: { symbol: "€", decimalPlaces: 2 },
    inr: { symbol: "₹", decimalPlaces: 2 },
    brl: { symbol: "R$", decimalPlaces: 2 },
    bdt: { symbol: "৳", decimalPlaces: 2 },
    rub: { symbol: "₽", decimalPlaces: 2 },
    idr: { symbol: "Rp", decimalPlaces: 3 },
} as const;

export const NOTIFICATION_TIERS = {
    FREE: 10,
    PRO: 30,
    PRO_PLUS: 100,
    BUSINESS: 200,
    BUSINESS_PLUS: 500,
} as const;

export const PRICE_CONFIG: Record<Currency, {
    pro: number;
    pro_plus: { base: number; metered: number };
    business: number;
    business_plus: { base: number; metered: number };
}> = {
    usd: {
        pro: 8.00,
        pro_plus: { base: 8.00, metered: 0.0025 },
        business: 22.00,
        business_plus: { base: 22.00, metered: 0.0015 },
    },
    jpy: {
        pro: 980,
        pro_plus: { base: 980, metered: 0.3 },
        business: 2980,
        business_plus: { base: 2980, metered: 0.2 },
    },
    cny: {
        pro: 55,
        pro_plus: { base: 55, metered: 0.025 },
        business: 160,
        business_plus: { base: 160, metered: 0.012 },
    },
    krw: {
        pro: 9000,
        pro_plus: { base: 9000, metered: 3.5 },
        business: 26000,
        business_plus: { base: 26000, metered: 2.5 },
    },
    eur: {
        pro: 7.50,
        pro_plus: { base: 7.50, metered: 0.0025 },
        business: 20.00,
        business_plus: { base: 20.00, metered: 0.0015 },
    },
    inr: {
        pro: 550,
        pro_plus: { base: 550, metered: 0.25 },
        business: 1600,
        business_plus: { base: 1600, metered: 0.12 },
    },
    brl: {
        pro: 40,
        pro_plus: { base: 40, metered: 0.012 },
        business: 110,
        business_plus: { base: 110, metered: 0.006 },
    },
    bdt: {
        pro: 650,
        pro_plus: { base: 650, metered: 0.25 },
        business: 2100,
        business_plus: { base: 2100, metered: 0.12 },
    },
    rub: {
        pro: 650,
        pro_plus: { base: 650, metered: 0.25 },
        business: 1900,
        business_plus: { base: 1900, metered: 0.12 },
    },
    idr: {
        pro: 120000,
        pro_plus: { base: 120000, metered: 0.035 },
        business: 350000,
        business_plus: { base: 350000, metered: 0.025 },
    },
} as const;

export const LANGUAGE_CURRENCY_MAP: Record<LanguageCode, Currency> = {
    en: "usd",
    ja: "jpy",
    zh: "cny",
    ko: "krw",
    fr: "eur",
    es: "eur",
    hi: "inr",
    pt: "brl",
    bn: "bdt",
    ru: "rub",
    id: "idr",
    de: "eur",
};

export const PLAN_SORT_ORDER = {
    "free": 1,
    "pro": 2,
    "pro_plus": 3,
    "business": 4,
    "business_plus": 5,
} as const;

export function getPlanSortOrder(planType: keyof typeof PLAN_SORT_ORDER) {
    return PLAN_SORT_ORDER[planType];
}

export function createPlansForLanguage(languageCode: LanguageCode): Plan[] {
    const currency = LANGUAGE_CURRENCY_MAP[languageCode];
    const prices = PRICE_CONFIG[currency];
    const config = CURRENCY_CONFIG[currency];

    return [
        {
            id: "free",
            name: "Free",
            description: "Basic free plan with essential features",
            basePrice: 0,
            currency,
            notificationsPerDay: NOTIFICATION_TIERS.FREE,
        },
        {
            id: "pro",
            name: "Pro",
            description: "Professional plan with advanced features",
            basePrice: Math.round(
                prices.pro * Math.pow(10, config.decimalPlaces),
            ),
            currency,
            notificationsPerDay: NOTIFICATION_TIERS.PRO,
        },
        {
            id: "pro_plus",
            name: "Pro+",
            description: "Pro plan with usage-based billing",
            basePrice: Math.round(
                prices.pro_plus.base * Math.pow(10, config.decimalPlaces),
            ),
            currency,
            notificationsPerDay: NOTIFICATION_TIERS.PRO_PLUS,
            metered: {
                unitAmount: prices.pro_plus.metered, // No longer multiply by Math.pow()
            },
        },
        {
            id: "business",
            name: "Business",
            description: "Enterprise-grade features and support",
            basePrice: Math.round(
                prices.business * Math.pow(10, config.decimalPlaces),
            ),
            currency,
            notificationsPerDay: NOTIFICATION_TIERS.BUSINESS,
        },
        {
            id: "business_plus",
            name: "Business+",
            description: "Enterprise plan with flexible usage",
            basePrice: Math.round(
                prices.business_plus.base * Math.pow(10, config.decimalPlaces),
            ),
            currency,
            notificationsPerDay: NOTIFICATION_TIERS.BUSINESS_PLUS,
            metered: {
                unitAmount: prices.business_plus.metered, // No longer multiply by Math.pow()
            },
        },
    ];
}

export function createConfigForLanguage(
    languageCode: LanguageCode,
): PricingConfig {
    return {
        currency: LANGUAGE_CURRENCY_MAP[languageCode],
        interval: "month",
        plans: createPlansForLanguage(languageCode),
    };
}
