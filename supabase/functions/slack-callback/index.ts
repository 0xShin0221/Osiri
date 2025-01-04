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
    appDomain: Deno.env.get("APP_DOMAIN") ?? "loalhost:5173",
  };

  Object.entries(vars).forEach(([key, value]) => {
    if (!value) throw new Error(`Missing ${key}`);
  });

  return vars as Record<string, string>;
};

const getSlackToken = async (
  lang: string,
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
      redirect_uri: `${
        Deno.env.get("SUPABASE_URL")
      }/functions/v1/slack-callback?lang=${lang}`,
    }),
  });
  return response.json();
};

Deno.serve(handleWithCors(async (req) => {
  const vars = getEnvVars();
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const lang = url.searchParams.get("lang");

  if (!code || !lang) {
    return new Response(
      JSON.stringify({
        error: code ? "Missing lang" : "Missing code",
      }),
      { status: 400 },
    );
  }

  try {
    const slackData = await getSlackToken(
      lang,
      code,
      vars.slackId,
      vars.slackSecret,
    );
    if (!slackData.ok || !slackData.team?.name) {
      throw new Error(`Invalid Slack response: ${JSON.stringify(slackData)}`);
    }
    const org = await createOrganization(slackData.team.name);
    await createWorkspaceConnection(org.id, slackData);

    return new Response(
      JSON.stringify({
        status: "success",
        organizationId: org.id,
      }),
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return Response.redirect(
      `https://${vars.appDomain}/onboarding?platform=slack&status=error`,
    );
  }
}));
