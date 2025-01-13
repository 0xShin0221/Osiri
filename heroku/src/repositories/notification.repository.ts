import { BaseRepository } from "./base.repository";
import type { Database } from "../types/database.types";
import type { ServiceResponse } from "../types/models";

export class NotificationRepository extends BaseRepository {
  private readonly channelsTable = 'notification_channels';
  private readonly logsTable = 'notification_logs';
  private readonly connectionsTable = 'workspace_connections';

  async getActiveChannels(): Promise<ServiceResponse<Database['public']['Tables']['notification_channels']['Row'][]>> {
    try {
      const { data, error } = await this.client
        .from(this.channelsTable)
        .select()
        .eq('is_active', true);

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getChannelById(channelId: string): Promise<ServiceResponse<Database['public']['Tables']['notification_channels']['Row']>> {
    try {
      const { data, error } = await this.client
        .from(this.channelsTable)
        .select()
        .eq('id', channelId)
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getWorkspaceConnection(connectionId: string): Promise<ServiceResponse<Database['public']['Tables']['workspace_connections']['Row']>> {
    try {
      const { data, error } = await this.client
        .from(this.connectionsTable)
        .select()
        .eq('id', connectionId)
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async logNotification(
    channelId: string,
    status: Database['public']['Enums']['notification_status'],
    recipient: string,
    error?: string
  ): Promise<ServiceResponse<void>> {
    try {
      const { error: insertError } = await this.client
        .from(this.logsTable)
        .insert({
          channel_id: channelId,
          status,
          recipient,
          error,
          platform: 'slack'
        });

      if (insertError) throw insertError;
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}