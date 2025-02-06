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

// discord-callback/index.ts
const getDiscordToken = async (
  code: string,
  clientId: string,
  clientSecret: string,
  redirectUri: string,
): Promise<DiscordOAuthResponse> => {
  console.log("Requesting Discord token with params:", {
    code: code.substring(0, 4) + "...",
    clientId,
    redirectUri,
  });

  const response = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
    }),
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
    const state = url.searchParams.get("state");
    const guildId = url.searchParams.get("guild_id");

    console.log("URL parameters:", {
      code: code?.substring(0, 4) + "...",
      state,
      guildId,
    });

    if (!code || !state) {
      console.error("Missing required parameters:", { code, state });
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        { status: 400 },
      );
    }

    const [lang, userId] = state.split("_");
    if (!lang || !userId) {
      console.error("Invalid state format:", { state });
      return new Response(
        JSON.stringify({ error: "Invalid state format" }),
        { status: 400 },
      );
    }

    try {
      const redirectUri = `${vars.supabaseUrl}/functions/v1/discord-callback`;
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
      return new Response(
        JSON.stringify({
          error: "Failed to connect Discord",
          details: (error as Error).message,
          stack: (error as Error).stack,
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
        stack: (error as Error).stack,
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
