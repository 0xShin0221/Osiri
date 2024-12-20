import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders, handleWithCors } from "../_shared/cors.ts";
import { decodeBase64Url } from "jsr:@std/encoding";
import { newsletter } from "../_shared/db/newsletter.ts";

Deno.serve(handleWithCors(async (req) => {
  try {
    const { token } = await req.json();

    if (!token) {
      throw new Error("Invalid unsubscribe token");
    }

    const emailBytes = decodeBase64Url(token);
    const email = new TextDecoder().decode(emailBytes);
    await newsletter.unsubscribe(email);

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.error("Unsubscribe error:", error);
    return new Response(JSON.stringify({ error: "Invalid request" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
}));
