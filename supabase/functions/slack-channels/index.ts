// supabase/functions/slack-channels/index.ts
import { corsHeaders } from "../_shared/cors.ts";
import { supabase } from "../_shared/db/client.ts";
import { refreshSlackToken } from "../_shared/slack.ts";

const getSlackChannels = async (accessToken: string) => {
  try {
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

    // Always refresh token before using
    let accessToken: string;
    try {
      accessToken = await refreshSlackToken(workspace);
      console.log("Successfully refreshed Slack token");
    } catch (error) {
      console.error("Token refresh failed:", error);
      throw new Error("Failed to refresh Slack token");
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
