// scripts/constants.ts
import type { Plan, PlanId } from "./types/models";
import { Database } from "./types/database.types";
import { PLAN_TRANSLATIONS } from "./translations";

export type Currency = Database["public"]["Enums"]["subscription_currency"];
export type FeedLanguage = Database["public"]["Enums"]["feed_language"];

export const CURRENCY_CONFIG: Record<
    Currency,
    { symbol: string; decimalPlaces: number }
> = {
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
};

export const NOTIFICATION_TIERS = {
    FREE: 10,
    PRO: 30,
    PRO_PLUS: 100,
    BUSINESS: 200,
    BUSINESS_PLUS: 500,
} as const;

export const PLAN_SORT_ORDER: Record<PlanId, number> = {
    free: 1,
    pro: 2,
    pro_plus: 3,
    business: 4,
    business_plus: 5,
};

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

function calculateBasePrice(price: number, currency: Currency): number {
    const config = CURRENCY_CONFIG[currency];
    return Math.round(price * Math.pow(10, config.decimalPlaces));
}

export function createPlansForLanguage(
    language: FeedLanguage,
    currency: Currency,
): Plan[] {
    const prices = PRICE_CONFIG[currency];

    return [
        {
            id: "free",
            ...PLAN_TRANSLATIONS.free[language],
            base_price_amount: 0,
            currency,
            base_notifications_per_day: NOTIFICATION_TIERS.FREE,
            sort_order: PLAN_SORT_ORDER.free,
        },
        {
            id: "pro",
            ...PLAN_TRANSLATIONS.pro[language],
            base_price_amount: calculateBasePrice(prices.pro, currency),
            currency,
            base_notifications_per_day: NOTIFICATION_TIERS.PRO,
            sort_order: PLAN_SORT_ORDER.pro,
        },
        {
            id: "pro_plus",
            ...PLAN_TRANSLATIONS.pro_plus[language],
            base_price_amount: calculateBasePrice(
                prices.pro_plus.base,
                currency,
            ),
            currency,
            base_notifications_per_day: NOTIFICATION_TIERS.PRO_PLUS,
            sort_order: PLAN_SORT_ORDER.pro_plus,
            metered: {
                unitAmount: prices.pro_plus.metered,
            },
        },
        {
            id: "business",
            ...PLAN_TRANSLATIONS.business[language],
            base_price_amount: calculateBasePrice(prices.business, currency),
            currency,
            base_notifications_per_day: NOTIFICATION_TIERS.BUSINESS,
            sort_order: PLAN_SORT_ORDER.business,
        },
        {
            id: "business_plus",
            ...PLAN_TRANSLATIONS.business_plus[language],
            base_price_amount: calculateBasePrice(
                prices.business_plus.base,
                currency,
            ),
            currency,
            base_notifications_per_day: NOTIFICATION_TIERS.BUSINESS_PLUS,
            sort_order: PLAN_SORT_ORDER.business_plus,
            metered: {
                unitAmount: prices.business_plus.metered,
            },
        },
    ];
}
