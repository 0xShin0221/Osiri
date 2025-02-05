import { corsHeaders } from "../_shared/cors.ts";
import { supabase } from "../_shared/db/client.ts";
import { refreshSlackToken } from "../_shared/slack.ts";

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
      .select("*")
      .eq("id", workspace_id)
      .single();

    if (workspaceError || !workspace) {
      throw new Error("Workspace not found");
    }
    let accessToken = workspace.access_token;
    if (workspace.token_expires_at) {
      const expiresAt = new Date(workspace.token_expires_at);
      if (
        expiresAt.getTime() - Date.now() <= 3600000 && workspace.refresh_token
      ) {
        try {
          accessToken = await refreshSlackToken(workspace);
        } catch (error) {
          console.error("Token refresh failed, using existing token:", error);
        }
      }
    }
    const slackData = await getSlackChannels(accessToken);

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
//     "workspace_id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
//   }'
