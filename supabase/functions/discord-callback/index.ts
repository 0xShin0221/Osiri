import { handleWithCors } from "../_shared/cors.ts";
import {
  createOrganization,
  createOrganizationMemberAsAdmin,
  getOrganizationByUserId,
} from "../_shared/db/organization.ts";
import { updateOnboardingCompleted } from "../_shared/db/profile.ts";
import {
  addWorkspaceConnection,
  createWorkspaceConnection,
} from "../_shared/db/workspace.ts";

interface DiscordOAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  guild_id: string;
  guild: {
    id: string;
    name: string;
  };
}

const getEnvVars = () => {
  const vars = {
    supabaseUrl: Deno.env.get("SUPABASE_URL") ?? "",
    supabaseKey: Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    discordId: Deno.env.get("DISCORD_CLIENT_ID") ?? "",
    discordSecret: Deno.env.get("DISCORD_CLIENT_SECRET") ?? "",
    appDomain: Deno.env.get("APP_DOMAIN") ?? "localhost:5173",
  };

  Object.entries(vars).forEach(([key, value]) => {
    if (!value) throw new Error(`Missing ${key}`);
  });

  return vars as Record<string, string>;
};

const getDiscordToken = async (
  code: string,
  clientId: string,
  clientSecret: string,
  redirectUri: string,
): Promise<DiscordOAuthResponse> => {
  console.log("Requesting Discord token with params:", {
    code: code.substring(0, 4) + "...", // Only show first 4 chars
    clientId,
    redirectUri,
  });

  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    code,
    grant_type: "authorization_code",
    redirect_uri: redirectUri,
  });

  console.log("Token request URL:", "https://discord.com/api/oauth2/token");
  console.log("Token request body:", params.toString());

  const response = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Discord OAuth error response:", {
      status: response.status,
      statusText: response.statusText,
      body: errorText,
    });
    throw new Error(`Discord OAuth failed: ${errorText}`);
  }

  const data = await response.json();
  console.log("Discord OAuth success response:", {
    ...data,
    access_token: data.access_token?.substring(0, 4) + "...",
    refresh_token: data.refresh_token?.substring(0, 4) + "...",
  });

  return data;
};

const getGuildInfo = async (guildId: string, accessToken: string) => {
  console.log("Fetching guild info for ID:", guildId);

  const response = await fetch(
    `https://discord.com/api/v10/guilds/${guildId}`,
    {
      headers: {
        Authorization: `Bot ${accessToken}`,
      },
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Guild info error response:", {
      status: response.status,
      statusText: response.statusText,
      body: errorText,
    });
    throw new Error(`Failed to fetch guild info: ${errorText}`);
  }

  const data = await response.json();
  console.log("Guild info success response:", data);
  return data;
};

Deno.serve(handleWithCors(async (req) => {
  console.log("Received request:", {
    url: req.url,
    method: req.method,
    headers: Object.fromEntries(req.headers.entries()),
  });

  try {
    const vars = getEnvVars();
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const guildId = url.searchParams.get("guild_id");
    const lang_userId = url.searchParams.get("lang_userId");

    console.log("URL parameters:", {
      code: code?.substring(0, 4) + "...",
      guildId,
      lang_userId,
    });

    if (!code || !lang_userId) {
      console.error("Missing required parameters:", { code, lang_userId });
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        { status: 400 },
      );
    }

    const [lang, userId] = lang_userId.split("_");
    if (!lang || !userId) {
      console.error("Invalid lang_userId format:", { lang_userId });
      return new Response(
        JSON.stringify({ error: "Invalid lang_userId format" }),
        { status: 400 },
      );
    }

    try {
      const redirectUri =
        `${vars.supabaseUrl}/functions/v1/discord-callback?lang_userId=${lang_userId}`;
      console.log("Redirect URI:", redirectUri);

      const discordData = await getDiscordToken(
        code,
        vars.discordId,
        vars.discordSecret,
        redirectUri,
      );

      console.log("Checking existing organization for user:", userId);
      const existingOrg = await getOrganizationByUserId(userId);
      console.log("Existing organization:", existingOrg);

      if (existingOrg.length > 0 && existingOrg[0].organization_id) {
        console.log("Adding workspace connection to existing organization");
        const tokenExpiresAt = discordData.expires_in
          ? new Date(Date.now() + discordData.expires_in * 1000).toISOString()
          : null;

        await addWorkspaceConnection(
          existingOrg[0].organization_id,
          "discord",
          discordData.guild.id,
          discordData.guild.name,
          discordData.access_token,
          discordData.refresh_token || null,
          tokenExpiresAt,
        );
      } else {
        console.log("Creating new organization");
        const org = await createOrganization(discordData.guild.name);
        console.log("Created organization:", org);

        await createOrganizationMemberAsAdmin(org.id, userId);
        await createWorkspaceConnection(org.id, discordData, "discord");
        await updateOnboardingCompleted(userId);
      }

      const redirectUrl = `https://${vars.appDomain}/${lang}/setchannel`;
      console.log("Redirecting to:", redirectUrl);
      return Response.redirect(redirectUrl);
    } catch (error) {
      console.error("Error in Discord connection process:", error);
      // Detailed error response
      return new Response(
        JSON.stringify({
          error: "Failed to connect Discord",
          details: (error as Error).message,
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }
  } catch (error) {
    console.error("Critical error:", error);
    return new Response(
      JSON.stringify({
        error: "Critical error occurred",
        details: (error as Error).message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
}));
