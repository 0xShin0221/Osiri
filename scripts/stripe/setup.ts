// scripts/stripe/setup.ts
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { LANGUAGES } from "../../src/lib/i18n/languages";
import { Plan } from "./types";
import { Database } from "../../src/types/database.types";
import { createConfigForLanguage } from "./config";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-12-18.acacia",
});

const supabase = createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

async function createPlan(
    plan: Plan,
    language: typeof LANGUAGES.SUPPORTED[number]["code"],
) {
    console.log(`Creating plan: ${plan.name} for ${language}`);

    const planId = `${plan.id}_${language}`;
    const productName = `${plan.name} (${language.toUpperCase()})`;

    // Create product
    const product = await stripe.products.create({
        id: planId,
        name: productName,
        description: plan.description,
        metadata: {
            language,
            planType: plan.id,
        },
    });

    // Create base price (non-metered)
    const basePrice = await stripe.prices.create({
        product: product.id,
        currency: plan.currency,
        unit_amount: plan.basePrice,
        recurring: {
            interval: "month",
        },
        metadata: {
            language,
            planType: plan.id,
        },
    });

    // Create metered price if applicable
    let meteredPrice: Stripe.Response<Stripe.Price> | null = null;
    if (plan.metered) {
        meteredPrice = await stripe.prices.create({
            product: product.id,
            currency: plan.currency,
            recurring: {
                interval: "month",
                usage_type: "metered",
            },
            billing_scheme: "per_unit",
            unit_amount_decimal: plan.metered.unitAmount.toString(), // Changed from unit_amount
            metadata: {
                language,
                planType: plan.id,
            },
        });
    }

    console.log({
        language,
        planType: plan.id,
        productId: product.id,
        basePriceId: basePrice.id,
        meteredPriceId: meteredPrice?.id,
    });
}

async function setup() {
    for (const { code } of LANGUAGES.SUPPORTED) {
        const config = createConfigForLanguage(code);
        for (const plan of config.plans) {
            await createPlan(plan, code);
        }
    }
}

setup().catch(console.error);
