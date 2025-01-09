import { corsHeaders } from "../_shared/cors.ts";
import { supabase } from "../_shared/db/client.ts";

const getSlackChannels = async (accessToken: string) => {
  try {
    // Create URL with query parameters
    const params = new URLSearchParams({
      types: "public_channel,private_channel",
      exclude_archived: "true",
      limit: "200",
    });

    const url = `https://slack.com/api/conversations.list?${params.toString()}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Slack API error: ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.ok) {
      throw new Error(`Slack API error: ${data.error}`);
    }

    return data;
  } catch (error) {
    console.error("Error fetching from Slack API:", error);
    throw error;
  }
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { workspace_id } = await req.json();

    // Get workspace connection
    const { data: workspace, error: workspaceError } = await supabase
      .from("workspace_connections")
      .select("access_token")
      .eq("id", workspace_id)
      .single();

    if (workspaceError || !workspace) {
      throw new Error("Workspace not found");
    }

    const slackData = await getSlackChannels(workspace.access_token);

    // Transform channels data
    const channels = slackData.channels
      .filter((channel: any) => !channel.is_archived)
      .map((channel: any) => ({
        id: channel.id,
        name: `#${channel.name}`,
        is_private: channel.is_private,
        topic: channel.topic,
        num_members: channel.num_members,
      }));

    return new Response(
      JSON.stringify({ channels }),
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
});

// 1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
// 2. Make an HTTP request:

// curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/slack-channels' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//  --data '{
//     "workspace_id": "0c24bc65-50aa-4391-afe2-b39b5726b6ec"
//   }'
