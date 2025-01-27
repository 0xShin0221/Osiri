// supabase/functions/create-portal-session/index.ts
import { corsHeaders, handleWithCors } from "../_shared/cors.ts";
import { stripeRepository } from "../_shared/db/stripe.ts";
import Stripe from "npm:stripe";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2024-12-18.acacia",
  httpClient: Stripe.createFetchHttpClient(),
});

const handler = async (req: Request): Promise<Response> => {
  try {
    const { organizationId } = await req.json();

    if (!organizationId) {
      throw new Error("Missing organization ID");
    }

    // Get organization details
    const organization = await stripeRepository.getOrganization(organizationId);

    if (!organization.stripe_customer_id) {
      throw new Error("No Stripe customer found for this organization");
    }

    // Create billing portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: organization.stripe_customer_id,
      return_url: `${req.headers.get("origin")}/settings`,
    });

    return new Response(
      JSON.stringify({
        url: session.url,
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
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
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
