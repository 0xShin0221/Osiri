import { handleWithCors } from "../_shared/cors.ts";
import { createOrganization } from "../_shared/db/organization.ts";
import { createWorkspaceConnection } from "../_shared/db/workspace.ts";
import { SlackOAuthResponse } from "../_shared/types.ts";

const getEnvVars = () => {
  const vars = {
    supabaseUrl: Deno.env.get("SUPABASE_URL") ?? "",
    supabaseKey: Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    slackId: Deno.env.get("SLACK_CLIENT_ID") ?? "",
    slackSecret: Deno.env.get("SLACK_CLIENT_SECRET") ?? "",
  };

  Object.entries(vars).forEach(([key, value]) => {
    if (!value) throw new Error(`Missing ${key}`);
  });

  return vars as Record<string, string>;
};

const getSlackToken = async (
  code: string,
  clientId: string,
  clientSecret: string,
): Promise<SlackOAuthResponse> => {
  const response = await fetch("https://slack.com/api/oauth.v2.access", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });
  return response.json();
};

Deno.serve(handleWithCors(async (req) => {
  const vars = getEnvVars();
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const lang = url.searchParams.get("lang");
  const host = req.headers.get("x-forwarded-host");

  if (!code || !lang) {
    return new Response(
      JSON.stringify({
        error: !code ? "No code provided" : "No lang provided",
      }),
      { status: 400 },
    );
  }

  try {
    const slackData = await getSlackToken(code, vars.slackId, vars.slackSecret);
    const org = await createOrganization(slackData.team.name);
    await createWorkspaceConnection(org.id, slackData);

    return Response.redirect(
      `https://${host}/${lang}/onboarding?platform=slack&status=success&organization_id=${org.id}`,
    );
  } catch (error) {
    console.error(error);
    return Response.redirect(
      `https://${host}/${lang}/onboarding?platform=slack&status=error`,
    );
  }
}));
