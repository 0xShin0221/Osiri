// scripts/constants.ts
import type { Plan, PlanId } from "./types/models";
import { Database } from "./types/database.types";
import { PLAN_TRANSLATIONS } from "./translations";

export type Currency = Database["public"]["Enums"]["subscription_currency"];
export type FeedLanguage = Database["public"]["Enums"]["feed_language"];

export const CURRENCY_CONFIG: Record<
    Currency,
    { symbol: string; decimalPlaces: number; smallestUnitMultiplier: number }
> = {
    usd: { symbol: "$", decimalPlaces: 2, smallestUnitMultiplier: 100 }, // 1 USD = 100 cents
    jpy: { symbol: "¥", decimalPlaces: 0, smallestUnitMultiplier: 1 }, // JPY has no sub-units
    cny: { symbol: "¥", decimalPlaces: 2, smallestUnitMultiplier: 100 }, // 1 CNY = 100 fen
    krw: { symbol: "₩", decimalPlaces: 0, smallestUnitMultiplier: 1 }, // KRW has no sub-units
    eur: { symbol: "€", decimalPlaces: 2, smallestUnitMultiplier: 100 }, // 1 EUR = 100 cents
    inr: { symbol: "₹", decimalPlaces: 2, smallestUnitMultiplier: 100 }, // 1 INR = 100 paise
    brl: { symbol: "R$", decimalPlaces: 2, smallestUnitMultiplier: 100 }, // 1 BRL = 100 centavos
    bdt: { symbol: "৳", decimalPlaces: 2, smallestUnitMultiplier: 100 }, // 1 BDT = 100 poisha
    rub: { symbol: "₽", decimalPlaces: 2, smallestUnitMultiplier: 100 }, // 1 RUB = 100 kopeks
    idr: { symbol: "Rp", decimalPlaces: 2, smallestUnitMultiplier: 100 }, // 1 IDR = 100 sen
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

function calculateBasePrice(price: number): number {
    return Math.round(price);
}

export const PRICE_CONFIG: Record<Currency, {
    pro: number;
    pro_plus: { base: number; metered: number };
    business: number;
    business_plus: { base: number; metered: number };
}> = {
    usd: {
        pro: 8,
        pro_plus: { base: 8, metered: 0.0025 },
        business: 22,
        business_plus: { base: 22, metered: 0.0015 },
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
        pro: 8,
        pro_plus: { base: 8, metered: 0.0025 },
        business: 20,
        business_plus: { base: 20, metered: 0.0015 },
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
            base_price_amount: calculateBasePrice(prices.pro),
            currency,
            base_notifications_per_day: NOTIFICATION_TIERS.PRO,
            sort_order: PLAN_SORT_ORDER.pro,
        },
        {
            id: "pro_plus",
            ...PLAN_TRANSLATIONS.pro_plus[language],
            base_price_amount: calculateBasePrice(
                prices.pro_plus.base,
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
            base_price_amount: calculateBasePrice(prices.business),
            currency,
            base_notifications_per_day: NOTIFICATION_TIERS.BUSINESS,
            sort_order: PLAN_SORT_ORDER.business,
        },
        {
            id: "business_plus",
            ...PLAN_TRANSLATIONS.business_plus[language],
            base_price_amount: calculateBasePrice(
                prices.business_plus.base,
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
