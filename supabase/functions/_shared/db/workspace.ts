import { SlackOAuthResponse } from "../types.ts";
import { supabase } from "./client.ts";

export const createWorkspaceConnection = async (
  organizationId: string,
  slackData: SlackOAuthResponse,
) => {
  const { data, error } = await supabase
    .from("workspace_connections")
    .insert({
      organization_id: organizationId,
      platform: "slack",
      workspace_id: slackData.team.id,
      access_token: slackData.access_token,
      token_expires_at: null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};
