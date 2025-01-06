import { handleWithCors } from "../_shared/cors.ts";
import {
  createOrganization,
  createOrganizationMemberAsAdmin,
} from "../_shared/db/organization.ts";
import { updateOnboardingCompleted } from "../_shared/db/profile.ts";
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
  userId: string,
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
      redirect_uri: `${Deno.env.get("SUPABASE_URL")}/functions/v1/slack-callback?lang_userId=${lang}_${userId}`,
    }),
  });
  return response.json();
};

Deno.serve(handleWithCors(async (req) => {
  const vars = getEnvVars();
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const lang_userId = url.searchParams.get("lang_userId");

  if (!code || !lang_userId) {
    return new Response(JSON.stringify({ error: "Missing required parameters" }), { status: 400 });
  }

  const [lang, userId] = lang_userId.split('_');
  if (!lang || !userId) {
    return new Response(JSON.stringify({ error: "Invalid lang_userId format" }), { status: 400 });
  }

  try {
    const slackData = await getSlackToken(
      lang,
      code,
      userId,
      vars.slackId,
      vars.slackSecret,
    );
    if (!slackData.ok || !slackData.team?.name) {
      throw new Error(`Invalid Slack response: ${JSON.stringify(slackData)}`);
    }
    const org = await createOrganization(slackData.team.name);
    await createOrganizationMemberAsAdmin(org.id, userId);
    await createWorkspaceConnection(org.id, slackData);
    await updateOnboardingCompleted (userId);

    return Response.redirect(
      `https://${vars.appDomain}/${lang}/setchannel`,
    );
  } catch (error) {
    console.error(error);
    throw new Error("Failed to connect Slack");
  }
}));
