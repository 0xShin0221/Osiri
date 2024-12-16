import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { corsHeaders, handleWithCors } from "../_shared/cors.ts";
import { decodeBase64Url } from "jsr:@std/encoding";
import { unsubscribeFromNewsletter } from "../_shared/db.ts";

Deno.serve(handleWithCors(async (req) => {
  try {
    const { token } = await req.json();

    if (!token) {
      throw new Error("Invalid unsubscribe token");
    }


    const emailBytes = decodeBase64Url(token);
    const email = new TextDecoder().decode(emailBytes);
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

