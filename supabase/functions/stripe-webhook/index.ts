import { Buffer } from "node:buffer";
import { stripeRepository } from "../_shared/db/stripe.ts";
import Stripe from "npm:stripe";
import { Database } from "../_shared/database.types.ts";

// Initialize Stripe with the fetch HTTP client
const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2024-12-18.acacia",
  httpClient: Stripe.createFetchHttpClient(),
});

// Create a buffer from string utility function
const createBuffer = (str: string): Uint8Array => {
  return new TextEncoder().encode(str);
};

// Get active subscriptions for a customer
async function getActiveSubscriptions(customerId: string) {
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: "active",
  });
  return subscriptions.data;
}

// Cancel all subscriptions except the newest one
async function cancelOldSubscriptions(
  customerId: string,
  newSubscriptionId: string,
) {
  const activeSubscriptions = await getActiveSubscriptions(customerId);

  for (const subscription of activeSubscriptions) {
    if (subscription.id !== newSubscriptionId) {
      await stripe.subscriptions.cancel(subscription.id);
      console.log(`Cancelled old subscription: ${subscription.id}`);
    }
  }
}

// Update organization subscription status
async function updateOrganizationSubscriptionStatus(
  organizationId: string,
  subscription: Stripe.Subscription,
) {
  let subscription_status: Database["public"]["Enums"]["subscription_status"];

  switch (subscription.status) {
    case "trialing":
      subscription_status = "trialing";
      break;
    case "active":
      subscription_status = "active";
      break;
    case "past_due":
      subscription_status = "past_due";
      break;
    case "canceled":
      subscription_status = "canceled";
      break;
    default:
      subscription_status = "canceled";
  }

  await stripeRepository.updateOrganizationSubscriptionStatus(
    organizationId,
    subscription_status,
  );

  // Update will_cancel flag if scheduled for cancellation
  if (subscription.cancel_at_period_end) {
    await stripeRepository.updateWillCancel(
      organizationId,
      subscription.cancel_at,
    );
  }
}

const handler = async (req: Request): Promise<Response> => {
  try {
    // Get the raw body as text
    const rawBody = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return new Response(
        JSON.stringify({ error: "No signature provided" }),
        { status: 400 },
      );
    }

    // Create buffer from the raw body
    const payload = Buffer.from(createBuffer(rawBody));

    let event: Stripe.Event;

    try {
      // Construct event with the buffer
      event = await stripe.webhooks.constructEventAsync(
        payload,
        signature,
        Deno.env.get("STRIPE_WEBHOOK_SECRET") || (() => {
          throw new Error("No webhook secret provided");
        })(),
      );
    } catch (err) {
      console.error("Signature verification failed:", err);
      return new Response(
        JSON.stringify({ error: "Webhook signature verification failed" }),
        { status: 400 },
      );
    }

    // Handle webhook events
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const organizationId = session.metadata?.organization_id;

        if (!organizationId) {
          console.error("No organization ID in session metadata");
          break;
        }

        if (!session.subscription) {
          console.error("No subscription in session");
          break;
        }

        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string,
        );

        const productId = subscription.items.data[0].price.product as string;
        const plan = await stripeRepository.getSubscriptionPlanByProductId(
          productId,
        );

        if (plan) {
          await stripeRepository.updateOrganizationPlan(
            organizationId,
            plan.id,
          );

          await updateOrganizationSubscriptionStatus(
            organizationId,
            subscription,
          );

          // Cancel old subscriptions
          await cancelOldSubscriptions(
            subscription.customer as string,
            subscription.id,
          );
        } else {
          console.error("No matching plan found for product:", productId);
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const organizationId = await stripeRepository
          .getOrganizationIdByCustomerId(customerId);

        if (!organizationId) {
          console.error("No organization found for customer:", customerId);
          break;
        }

        const productId = subscription.items.data[0].price.product as string;
        const plan = await stripeRepository.getSubscriptionPlanByProductId(
          productId,
        );

        if (plan) {
          await stripeRepository.updateOrganizationPlan(
            organizationId,
            plan.id,
          );

          await updateOrganizationSubscriptionStatus(
            organizationId,
            subscription,
          );

          // Cancel old subscriptions for subscription updates
          if (event.type === "customer.subscription.created") {
            await cancelOldSubscriptions(customerId, subscription.id);
          }
        } else {
          console.error("No matching plan found for product:", productId);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const organizationId = await stripeRepository
          .getOrganizationIdByCustomerId(customerId);

        if (!organizationId) {
          console.error("No organization found for customer:", customerId);
          break;
        }

        // Update subscription status to canceled
        await stripeRepository.updateOrganizationSubscriptionStatus(
          organizationId,
          "canceled",
        );

        // Clear will_cancel flag if it exists
        await stripeRepository.updateWillCancel(organizationId, null);

        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(
      JSON.stringify({ received: true }),
      { status: 200 },
    );
  } catch (err) {
    console.error("Webhook processing error:", err);
    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : "Unknown error occurred",
      }),
      { status: 500 },
    );
  }
};

Deno.serve(handler);
