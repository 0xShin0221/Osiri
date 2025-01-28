// supabase/functions/stripe-webhook/index.ts
import { stripeRepository } from "../_shared/db/stripe.ts";
import Stripe from "npm:stripe";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2024-12-18.acacia",
  httpClient: Stripe.createFetchHttpClient(),
});

const handler = async (req: Request): Promise<Response> => {
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");
    
    if (!signature) {
      throw new Error("No signature provided");
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      Deno.env.get("STRIPE_WEBHOOK_SECRET") || ""
    );

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const organizationId = session.metadata?.organization_id;
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        const productId = subscription.items.data[0].price.product as string;
        
        // Get subscription plan by stripe product id
        const plan = await stripeRepository.getSubscriptionPlanByProductId(productId);
        
        if (organizationId && plan) {
          // Update organization's plan_id
          await stripeRepository.updateOrganizationPlan(organizationId, plan.id);
        }
        break;
      }
      
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const organizationId = await stripeRepository.getOrganizationIdByCustomerId(subscription.customer as string);
        const productId = subscription.items.data[0].price.product as string;
        
        // Get subscription plan by stripe product id
        const plan = await stripeRepository.getSubscriptionPlanByProductId(productId);
        
        if (organizationId && plan) {
          // Update organization's plan_id
          await stripeRepository.updateOrganizationPlan(organizationId, plan.id);
        }
        break;
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
    });
  } catch (err) {
    console.error('Webhook error:', err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 400 }
    );
  }
};

Deno.serve(handler);