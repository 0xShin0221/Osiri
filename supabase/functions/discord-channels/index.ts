// supabase/functions/discord-channels/index.ts
import { corsHeaders } from "../_shared/cors.ts";
import { supabase } from "../_shared/db/client.ts";

const getDiscordChannels = async (accessToken: string, guildId: string) => {
  try {
    const response = await fetch(
      `https://discord.com/api/v10/guilds/${guildId}/channels`,
      {
        method: "GET",
        headers: {
          "Authorization": `Bot ${accessToken}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Discord API error: ${response.status} - ${errorText}`);
    }

    const channels = await response.json();

    // Filter and transform channels data
    return channels
      .filter((channel: any) =>
        channel.type === 0 && // 0 is TEXT channel type
        !channel.archived
      )
      .map((channel: any) => ({
        id: channel.id,
        name: `#${channel.name}`,
        is_private: channel.type === 0,
        topic: channel.topic || "",
        position: channel.position,
      }));
  } catch (error) {
    console.error("Error fetching from Discord API:", error);
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

    console.log("Workspace found:", workspace);

    const botToken = Deno.env.get("DISCORD_BOT_TOKEN");
    if (!botToken) {
      throw new Error("Discord bot token not configured");
    }

    const channels = await getDiscordChannels(botToken, workspace.workspace_id);

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
    console.error("Error in request:", error);
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
