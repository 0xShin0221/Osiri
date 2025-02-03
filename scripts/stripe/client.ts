// stripe/utils/client.ts
import Stripe from "stripe";

let stripeInstance: Stripe | null = null;

export function initializeStripe(secretKey: string): Stripe {
    if (!stripeInstance) {
        if (!secretKey.trim()) {
            throw new Error("Stripe secret key cannot be empty");
        }
        stripeInstance = new Stripe(secretKey, {
            apiVersion: "2024-12-18.acacia",
        });
    }
    return stripeInstance;
}

export function getStripeInstance(): Stripe {
    if (!stripeInstance) {
        throw new Error(
            "Stripe has not been initialized. Call initializeStripe first.",
        );
    }
    return stripeInstance;
}
