// stripe/plan.ts
import { createPlansForLanguage } from "../constants";
import { LANGUAGES } from "../../src/lib/i18n/languages";
import { Currency, FeedLanguage, StripeResult } from "../types/models";
import { planSchema, ValidatedPlan } from "../supabase/plans/schema";
import { getStripeInstance } from "./client";

// Sleep utility for rate limiting
async function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function createStripePlan(
    plan: ValidatedPlan,
    language: FeedLanguage,
): Promise<StripeResult> {
    const stripe = getStripeInstance();
    console.log(`\n=== Creating plan: ${plan.id} for ${language} ===`);
    const productName = `${plan.name} (${language})`;

    // Step 1: Create Stripe product
    console.log("Creating Stripe product...");
    const product = await stripe.products.create({
        name: productName,
        description: plan.description,
        metadata: { language, planType: plan.id },
    });
    console.log("Created product:", product.id);
    await sleep(1000);

    // Step 2: Create base price
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

    // Step 3: Create metered price if applicable
    let meteredPriceID = "";
    if (plan.metered) {
        console.log("Creating metered price...");

        // The metered price should be used directly as it's already in the correct format
        const rawMeteredPrice = plan.metered.unitAmount;
        const unitAmountDecimal = (rawMeteredPrice * 100).toString();
        console.log(
            `Setting metered price for ${plan.currency}: ${unitAmountDecimal} per unit`,
        );

        const meteredPriceResponse = await stripe.prices.create({
            product: product.id,
            currency: plan.currency,
            recurring: {
                interval: "month",
                usage_type: "metered",
            },
            billing_scheme: "per_unit",
            unit_amount_decimal: unitAmountDecimal,
            metadata: { language, planType: plan.id },
        });
        console.log("Created metered price:", meteredPriceResponse.id);
        meteredPriceID = meteredPriceResponse.id;
        await sleep(1000);
    }
    return {
        id: plan.id,
        name: plan.name,
        description: plan.description,
        language,
        currency: plan.currency,
        stripe_product_id: product.id,
        stripe_base_price_id: basePrice.id,
        stripe_metered_price_id: meteredPriceID,
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

        const plans = createPlansForLanguage(language, currency as Currency);

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
