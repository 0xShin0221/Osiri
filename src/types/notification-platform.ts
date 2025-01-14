import type { Database, Tables } from "@/types/database.types";

export type NotificationPlatform =
    Database["public"]["Enums"]["notification_platform"];
export type WorkspaceConnection = Tables<"workspace_connections">;

export interface Channel {
    id: string;
    name: string;
    is_private?: boolean;
    topic?: {
        value?: string;
    };
    num_members?: number;
}

export interface NotificationPlatformService {
    getChannels(workspaceId: string): Promise<Channel[]>;
    joinChannel(workspaceId: string, channelId: string): Promise<void>;
}
