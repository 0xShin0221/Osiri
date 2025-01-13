import type { SlackOAuthResponse } from "../types.ts";
import { supabase } from "./client.ts";
import type { Database } from "../database.types.ts";

// Define types
type WorkspaceConnection =
  Database["public"]["Tables"]["workspace_connections"]["Row"];
type WorkspaceConnectionInsert =
  Database["public"]["Tables"]["workspace_connections"]["Insert"];

// Create a new workspace connection
export const createWorkspaceConnection = async (
  organizationId: string,
  slackData: SlackOAuthResponse,
  platform: Database["public"]["Enums"]["notification_platform"],
): Promise<WorkspaceConnection> => {
  const workspaceConnection: WorkspaceConnectionInsert = {
    organization_id: organizationId,
    platform,
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

// Add a new workspace connection
export const addWorkspaceConnection = async (
  organizationId: string,
  platform: Database["public"]["Enums"]["notification_platform"],
  workspaceId: string,
  workspaceName: string,
  accessToken: string,
  refreshToken?: string | null,
  tokenExpiresAt?: string | null,
): Promise<WorkspaceConnection> => {
  const workspaceConnection: WorkspaceConnectionInsert = {
    organization_id: organizationId,
    platform,
    workspace_id: workspaceId,
    workspace_name: workspaceName,
    access_token: accessToken,
    refresh_token: refreshToken || null,
    token_expires_at: tokenExpiresAt || null,
    is_active: true,
  };

  const { data, error } = await supabase
    .from("workspace_connections")
    .insert(workspaceConnection)
    .select()
    .single();

  if (error) throw error;
  return data;
};
