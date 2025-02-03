import { corsHeaders } from "../_shared/cors.ts";

Deno.serve(async () => {
  try {
    const API_URL = Deno.env.get("APP_API_URL");
    const API_KEY = Deno.env.get("APP_API_KEY");

    if (!API_URL || !API_KEY) {
      throw new Error(
        "Missing environment variables APP_API_URL or APP_API_KEY",
      );
    }

    const response = await fetch(`${API_URL}/batch/run`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Request failed: ${response.status} ${response.statusText}`,
      );
    }

    const result = await response.json();

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Error:", error as Error);

    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      },
    );
  }
});
