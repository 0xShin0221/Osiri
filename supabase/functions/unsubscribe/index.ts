// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { corsHeaders, handleWithCors } from "../_shared/cors.ts";
import { decodeBase64 } from "jsr:@std/encoding";
import { unsubscribeFromNewsletter } from "../_shared/db.ts";
console.log("Hello from Functions!")

Deno.serve(handleWithCors(async (req) => {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get('token');

    if (!token) {
      throw new Error("Invalid unsubscribe token");
    }

    const email = decodeBase64(token);
    await unsubscribeFromNewsletter(email);

    // Redirect to unsubscribe confirmation page
    return new Response(null, {
      status: 302,
      headers: {
        ...corsHeaders,
        'Location': 'https://osiri.xyz/unsubscribe/success'
      },
    });

  } catch (error) {
    console.error("Unsubscribe error:", error);
    return new Response(JSON.stringify({ error: "Invalid request" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
}));

