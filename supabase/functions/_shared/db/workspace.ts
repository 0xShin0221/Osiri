// workspace.ts
import type { DiscordOAuthResponse, SlackOAuthResponse } from "../types.ts";
import { supabase } from "./client.ts";
import type { Database } from "../database.types.ts";

type WorkspaceConnection =
  Database["public"]["Tables"]["workspace_connections"]["Row"];
type WorkspaceConnectionInsert =
  Database["public"]["Tables"]["workspace_connections"]["Insert"];
type NotificationPlatform =
  Database["public"]["Enums"]["notification_platform"];

// Create a workspace connection from OAuth response
export const createWorkspaceConnection = async (
  organizationId: string,
  oauthData: SlackOAuthResponse | DiscordOAuthResponse,
  platform: NotificationPlatform,
): Promise<WorkspaceConnection> => {
  let workspaceConnection: WorkspaceConnectionInsert;

  if (platform === "slack") {
    const slackData = oauthData as SlackOAuthResponse;
    workspaceConnection = {
      organization_id: organizationId,
      platform,
      workspace_id: slackData.team.id,
      workspace_name: slackData.team.name,
      access_token: slackData.access_token,
      token_expires_at: slackData.expires_in
        ? new Date(Date.now() + slackData.expires_in * 1000).toISOString()
        : null,
      refresh_token: slackData.refresh_token || null,
      is_active: true,
    };
  } else if (platform === "discord") {
    const discordData = oauthData as DiscordOAuthResponse;
    workspaceConnection = {
      organization_id: organizationId,
      platform,
      workspace_id: discordData.guild.id,
      workspace_name: discordData.guild.name,
      access_token: discordData.access_token,
      token_expires_at: new Date(Date.now() + discordData.expires_in * 1000)
        .toISOString(),
      refresh_token: discordData.refresh_token,
      is_active: true,
    };
  } else {
    throw new Error(`Unsupported platform: ${platform}`);
  }

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
  platform: NotificationPlatform,
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
