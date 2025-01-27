// supabase/functions/stripe-create-checkout-session/index.ts
import { corsHeaders, handleWithCors } from "../_shared/cors.ts";
import { stripeRepository } from "../_shared/db/stripe.ts";
import Stripe from "npm:stripe";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2024-12-18.acacia",
  httpClient: Stripe.createFetchHttpClient(),
});

const handler = async (req: Request): Promise<Response> => {
  try {
    const { organizationId, priceId } = await req.json();

    if (!organizationId || !priceId) {
      throw new Error("Missing required parameters");
    }

    // Get organization and subscription plan
    const organization = await stripeRepository.getOrganization(organizationId);
    const plan = await stripeRepository.getSubscriptionPlan(priceId);

    if (!plan.stripe_base_price_id) {
      throw new Error("Invalid stripe price ID");
    }

    // Create or get customer
    let customerId = organization.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        name: organization.name,
        metadata: {
          organization_id: organizationId,
        },
      });
      customerId = customer.id;

      // Update organization with Stripe customer ID
      await stripeRepository.updateOrganizationStripeCustomer(
        organizationId,
        customerId,
      );
    }

    // Get origin for success/cancel URLs
    const origin = req.headers.get("origin");
    if (!origin) {
      throw new Error("Origin header is required");
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: plan.stripe_base_price_id,
          quantity: 1,
        },
      ],
      success_url: `${origin}/settings?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/settings`,
      metadata: {
        organization_id: organizationId,
      },
    } as Stripe.Checkout.SessionCreateParams);

    return new Response(
      JSON.stringify({
        url: session.url,
        session_id: session.id,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 200,
      },
    );
  } catch (error) {
    console.error("Checkout session creation error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error
          ? error.message
          : "An unknown error occurred",
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 400,
      },
    );
  }
};

Deno.serve(handleWithCors(handler));
