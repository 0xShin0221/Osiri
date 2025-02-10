import fs from "fs/promises";
import { getStripeInstance } from "./client";

export async function setupWebhooks(baseUrl: string) {
    try {
        const stripe = getStripeInstance();
        console.log("Setting up Stripe webhooks...");

        // Delete existing webhooks
        const webhooks = await stripe.webhookEndpoints.list();
        for (const webhook of webhooks.data) {
            await stripe.webhookEndpoints.del(webhook.id);
            console.log(`Deleted existing webhook: ${webhook.id}`);
        }

        // Create new webhook
        const endpoint = await stripe.webhookEndpoints.create({
            url: `${baseUrl}/functions/v1/stripe-webhook`,
            enabled_events: [
                "checkout.session.completed",
                "customer.subscription.created",
                "customer.subscription.updated",
                "customer.subscription.deleted",
                "invoice.paid",
                "invoice.payment_failed",
            ],
            description: "Webhook for subscription management",
        });

        console.log("Created webhook endpoint:", {
            id: endpoint.id,
            url: endpoint.url,
            secret: endpoint.secret,
        });

        const envContent = await fs.readFile("../.env", "utf-8");
        // const newEnvContent = envContent +
        //     `\nSTRIPE_WEBHOOK_SECRET=${endpoint.secret}`;
        // await fs.writeFile(".env", newEnvContent);
        console.log("Added webhook secret to .env file");

        return endpoint;
    } catch (error) {
        console.error("Failed to setup webhook:", error);
        throw error;
    }
}
