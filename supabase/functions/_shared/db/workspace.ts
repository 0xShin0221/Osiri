import type { SlackOAuthResponse } from "../types.ts";
import { supabase } from "./client.ts";
import type { Database } from "../database.types.ts";
type WorkspaceConnectionInsert =
  Database["public"]["Tables"]["workspace_connections"]["Insert"];

export const createWorkspaceConnection = async (
  organizationId: string,
  slackData: SlackOAuthResponse,
) => {
  const workspaceConnection: WorkspaceConnectionInsert = {
    organization_id: organizationId,
    platform: "slack",
    workspace_id: slackData.team.id,
    workspace_name: slackData.team.name,
    access_token: slackData.access_token,
    token_expires_at: null,
    is_active: true,
  };

  // Insert into database with error handling
  const { data, error } = await supabase
    .from("workspace_connections")
    .insert(workspaceConnection)
    .select()
    .single();

  if (error) throw error;
  return data;
};
