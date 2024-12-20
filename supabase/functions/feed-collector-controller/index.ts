import { corsHeaders } from "../_shared/cors.ts";
import { FeedCollectorService } from "../_shared/services/feedController.ts";

Deno.serve(async () => {
  try {
    const collector = new FeedCollectorService();
    const result = await collector.processBatch();

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      },
    );
  }
});
