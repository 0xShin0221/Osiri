// supabase/functions/slack-join-channel/index.ts
import { corsHeaders } from "../_shared/cors.ts";
import { supabase } from "../_shared/db/client.ts";
import { refreshSlackToken } from "../_shared/slack.ts";

const joinSlackChannel = async (accessToken: string, channelId: string) => {
  try {
    const response = await fetch("https://slack.com/api/conversations.join", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        channel: channelId,
      }),
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
    console.error("Error calling Slack API:", error);
    throw error;
  }
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { workspace_id, channel_id } = await req.json();

    if (!workspace_id || !channel_id) {
      throw new Error("Missing required parameters");
    }

    // Get workspace connection
    const { data: workspace, error: workspaceError } = await supabase
      .from("workspace_connections")
      .select("*")
      .eq("id", workspace_id)
      .single();

    if (workspaceError || !workspace?.access_token) {
      throw new Error("Workspace not found or missing access token");
    }

    // Always refresh token before using
    let accessToken: string;
    try {
      accessToken = await refreshSlackToken(workspace);
      console.log("Successfully refreshed Slack token");
    } catch (error) {
      console.error("Token refresh failed:", error);
      throw new Error("Failed to refresh Slack token");
    }

    const result = await joinSlackChannel(accessToken, channel_id);

    return new Response(
      JSON.stringify(result),
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
      JSON.stringify({
        error: (error as Error).message,
        ok: false,
      }),
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
