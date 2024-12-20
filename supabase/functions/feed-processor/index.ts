// supabase/functions/feed-processor/index.ts
import { corsHeaders } from "../_shared/cors.ts";
import { fetchRSSFeed } from "../_shared/services/fetcher.ts";
import { processArticles } from "../_shared/services/processor.ts";
import { rssFeeds } from "../_shared/db/rssFeed.ts";

Deno.serve(async (req) => {
  try {
    const { feed } = await req.json();

    const items = await fetchRSSFeed(feed.url);
    const processResults = await processArticles(feed.id, items);

    await rssFeeds.updateLastFetched(feed.id);

    return new Response(
      JSON.stringify({
        feedId: feed.id,
        itemsProcessed: items.length,
        results: processResults,
        success: true,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Error processing feed:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      },
    );
  }
});
