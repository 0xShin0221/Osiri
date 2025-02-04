import type { Plan, PlanId } from "./types/models";
import { Database } from "./types/database.types";
import { PLAN_TRANSLATIONS } from "./translations";

export type Currency = Database["public"]["Enums"]["subscription_currency"];
export type FeedLanguage = Database["public"]["Enums"]["feed_language"];

/**
 * Currency configuration for Stripe
 * Reference: https://stripe.com/docs/currencies
 */
export const CURRENCY_CONFIG: Record<
    Currency,
    {
        symbol: string;
        decimalPlaces: number;
        zeroDecimal: boolean; // Whether the currency uses zero decimal places in Stripe
    }
> = {
    usd: { symbol: "$", decimalPlaces: 2, zeroDecimal: false },
    jpy: { symbol: "¥", decimalPlaces: 0, zeroDecimal: true },
    cny: { symbol: "¥", decimalPlaces: 2, zeroDecimal: false },
    krw: { symbol: "₩", decimalPlaces: 0, zeroDecimal: true },
    eur: { symbol: "€", decimalPlaces: 2, zeroDecimal: false },
    inr: { symbol: "₹", decimalPlaces: 2, zeroDecimal: false },
    brl: { symbol: "R$", decimalPlaces: 2, zeroDecimal: false },
    bdt: { symbol: "৳", decimalPlaces: 2, zeroDecimal: false },
    rub: { symbol: "₽", decimalPlaces: 2, zeroDecimal: false },
    idr: { symbol: "Rp", decimalPlaces: 0, zeroDecimal: true },
};

export const NOTIFICATION_TIERS = {
    FREE: 5,
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

/**
 * Calculates the amount for Stripe in the smallest currency unit
 * Reference: https://stripe.com/docs/currencies#zero-decimal
 */
export function calculateStripeAmount(
    displayAmount: number,
    currency: Currency,
): number {
    const config = CURRENCY_CONFIG[currency];

    // Zero-decimal currencies (JPY, KRW, IDR) don't need conversion
    if (config.zeroDecimal) {
        return Math.round(displayAmount);
    }

    // Other currencies need to be converted to their smallest unit
    return Math.round(displayAmount * 100);
}

/**
 * Formats price for display with appropriate currency symbol and decimal places
 */
export function formatDisplayPrice(amount: number, currency: Currency): string {
    const config = CURRENCY_CONFIG[currency];
    return new Intl.NumberFormat("ja-JP", {
        style: "currency",
        currency: currency.toUpperCase(),
        minimumFractionDigits: config.decimalPlaces,
        maximumFractionDigits: config.decimalPlaces,
    }).format(amount);
}

/**
 * Price configuration for all plans and currencies
 */
export const PRICE_CONFIG: Record<Currency, {
    pro: number;
    pro_plus: { base: number; metered: number };
    business: number;
    business_plus: { base: number; metered: number };
}> = {
    usd: {
        pro: 8,
        pro_plus: { base: 8, metered: 0.025 }, // Base currency (in cents)
        business: 22,
        business_plus: { base: 22, metered: 0.015 },
    },
    jpy: {
        pro: 980,
        pro_plus: { base: 980, metered: 0.03 }, // Japanese Yen is the minimum unit
        business: 2980,
        business_plus: { base: 2980, metered: 0.02 },
    },
    cny: {
        pro: 55,
        pro_plus: { base: 55, metered: 0.2 }, // Divided by 100 for fen (minimum unit)
        business: 160,
        business_plus: { base: 160, metered: 0.12 },
    },
    krw: {
        pro: 9000,
        pro_plus: { base: 9000, metered: 4 }, // Korean Won is the minimum unit
        business: 26000,
        business_plus: { base: 26000, metered: 3 },
    },
    eur: {
        pro: 8,
        pro_plus: { base: 8, metered: 0.025 }, // Divided by 100 for cents (minimum unit)
        business: 22,
        business_plus: { base: 20, metered: 0.015 },
    },
    inr: {
        pro: 550,
        pro_plus: { base: 550, metered: 2.5 }, // Divided by 100 for paise (minimum unit)
        business: 1600,
        business_plus: { base: 1600, metered: 1.2 },
    },
    brl: {
        pro: 40,
        pro_plus: { base: 40, metered: 0.12 }, // Divided by 100 for centavo (minimum unit)
        business: 110,
        business_plus: { base: 110, metered: 0.06 },
    },
    bdt: {
        pro: 650,
        pro_plus: { base: 650, metered: 2.5 }, // Divided by 100 for poisha (minimum unit)
        business: 2100,
        business_plus: { base: 2100, metered: 1.2 },
    },
    rub: {
        pro: 650,
        pro_plus: { base: 650, metered: 2.5 }, // Divided by 100 for kopek (minimum unit)
        business: 1900,
        business_plus: { base: 1900, metered: 1.2 },
    },
    idr: {
        pro: 120000,
        pro_plus: { base: 120000, metered: 4 }, // Indonesian Rupiah is the minimum unit
        business: 350000,
        business_plus: { base: 350000, metered: 2 },
    },
} as const;

/**
 * Creates plans for a specific language and currency
 */
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
            base_price_amount: calculateStripeAmount(prices.pro, currency),
            currency,
            base_notifications_per_day: NOTIFICATION_TIERS.PRO,
            sort_order: PLAN_SORT_ORDER.pro,
        },
        {
            id: "pro_plus",
            ...PLAN_TRANSLATIONS.pro_plus[language],
            base_price_amount: calculateStripeAmount(
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
            base_price_amount: calculateStripeAmount(prices.business, currency),
            currency,
            base_notifications_per_day: NOTIFICATION_TIERS.BUSINESS,
            sort_order: PLAN_SORT_ORDER.business,
        },
        {
            id: "business_plus",
            ...PLAN_TRANSLATIONS.business_plus[language],
            base_price_amount: calculateStripeAmount(
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
