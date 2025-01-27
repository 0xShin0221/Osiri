import type { Database } from "./database.types";

export type PlanId = "free" | "pro" | "pro_plus" | "business" | "business_plus";

export type Currency = Database["public"]["Enums"]["subscription_currency"];
export type FeedLanguage = Database["public"]["Enums"]["feed_language"];

export type StripeResult = {
    id: string;
    name: string;
    description: string;
    language: FeedLanguage;
    currency: Currency;
    base_price_amount: number;
    stripe_product_id: string;
    stripe_base_price_id: string;
    stripe_metered_price_id: string | null;
    base_notifications_per_day: number;
    has_usage_billing: boolean;
    sort_order: number;
};

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
    base_price_amount: number;
    currency: Currency;
    base_notifications_per_day: number;
    sort_order: number;
    metered?: {
        unitAmount: number;
    };
};

export type StripeIds = {
    stripe_product_id: string;
    stripe_base_price_id: string;
    stripe_metered_price_id: string | null;
};

export type SubscriptionPlan =
    Database["public"]["Tables"]["subscription_plans"]["Row"];
