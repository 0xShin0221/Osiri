// supabase/functions/discord-join-channel/index.ts
import { corsHeaders } from "../_shared/cors.ts";
import { supabase } from "../_shared/db/client.ts";

const joinDiscordChannel = async (
  botToken: string,
  channelId: string,
) => {
  try {
    const response = await fetch(
      `https://discord.com/api/v10/channels/${channelId}`,
      {
        method: "GET",
        headers: {
          "Authorization": `Bot ${botToken}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Discord API error: ${response.status} - ${errorText}`);
    }

    const channelInfo = await response.json();

    return {
      ok: true,
      channel: channelInfo,
    };
  } catch (error) {
    console.error("Error calling Discord API:", error);
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

    const { data: workspace, error: workspaceError } = await supabase
      .from("workspace_connections")
      .select("*")
      .eq("id", workspace_id)
      .single();

    if (workspaceError || !workspace) {
      throw new Error("Workspace not found");
    }

    const botToken = Deno.env.get("DISCORD_BOT_TOKEN");
    if (!botToken) {
      throw new Error("Discord bot token not configured");
    }

    const result = await joinDiscordChannel(
      botToken,
      channel_id,
    );

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
    console.error("Error in request:", error);
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
