import Stripe from "stripe";
import { createPlansForLanguage } from "../constants";
import { LANGUAGES } from "../../src/lib/i18n/languages";
import { FeedLanguage, StripeResult } from "../types/models";
import { planSchema, ValidatedPlan } from "../supabase/plans/schema";
import * as dotenv from "dotenv";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-12-18.acacia",
});

async function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function createStripePlan(
    plan: ValidatedPlan,
    language: FeedLanguage,
): Promise<StripeResult> {
    console.log(`\n=== Creating plan: ${plan.id} for ${language} ===`);
    const productName = `${plan.name} (${language})`;

    console.log("Creating Stripe product...");
    const product = await stripe.products.create({
        name: productName,
        description: plan.description,
        metadata: { language, planType: plan.id },
    });
    console.log("Created product:", product.id);
    await sleep(1000);

    console.log("Creating base price...");
    const basePrice = await stripe.prices.create({
        product: product.id,
        currency: plan.currency,
        unit_amount: plan.base_price_amount,
        recurring: { interval: "month" },
        metadata: { language, planType: plan.id },
    });
    console.log("Created base price:", basePrice.id);
    await sleep(1000);

    let meteredPrice: Stripe.Response<Stripe.Price> | null = null;
    if (plan.metered) {
        console.log("Creating metered price...");
        meteredPrice = await stripe.prices.create({
            product: product.id,
            currency: plan.currency,
            recurring: {
                interval: "month",
                usage_type: "metered",
            },
            billing_scheme: "per_unit",
            unit_amount_decimal: plan.metered.unitAmount.toString(),
            metadata: { language, planType: plan.id },
        });
        console.log("Created metered price:", meteredPrice.id);
        await sleep(1000);
    }

    return {
        id: plan.id,
        name: plan.name,
        description: plan.description,
        language,
        currency: plan.currency,
        base_price_amount: plan.base_price_amount,
        stripe_product_id: product.id,
        stripe_base_price_id: basePrice.id,
        stripe_metered_price_id: meteredPrice?.id || null,
        base_notifications_per_day: plan.base_notifications_per_day,
        has_usage_billing: !!plan.metered,
        sort_order: plan.sort_order,
    };
}

export async function createStripePlans(): Promise<StripeResult[]> {
    const results: StripeResult[] = [];

    for (const { code, currency } of LANGUAGES.SUPPORTED) {
        const language = code as FeedLanguage;
        if (!language) {
            throw new Error(`Invalid language code: ${code}`);
        }

        const plans = createPlansForLanguage(language, currency);
        for (const plan of plans) {
            try {
                const validatedPlan = planSchema.parse(plan);
                const result = await createStripePlan(validatedPlan, language);
                results.push(result);
                await sleep(3000);
            } catch (error) {
                console.error(
                    `Failed to create plan ${plan.id} for ${language}:`,
                    error,
                );
                throw error;
            }
        }
        await sleep(5000);
    }

    return results;
}
