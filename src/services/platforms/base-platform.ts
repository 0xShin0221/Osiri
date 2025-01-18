import { supabase } from "@/lib/supabase";
import type {
    Channel,
    NotificationPlatform,
    NotificationPlatformService,
    WorkspaceConnection,
} from "@/types/notification-platform";

export abstract class BasePlatform implements NotificationPlatformService {
    protected platform: NotificationPlatform;

    constructor(platform: NotificationPlatform) {
        this.platform = platform;
    }

    protected async getWorkspaceConnection(
        workspaceId: string,
    ): Promise<WorkspaceConnection> {
        const { data, error } = await supabase
            .from("workspace_connections")
            .select("*")
            .eq("id", workspaceId)
            .eq("platform", this.platform)
            .single();

        if (error) throw error;
        if (!data) {
            throw new Error(`No ${this.platform} workspace connection found`);
        }

        return data;
    }

    abstract getChannels(workspaceId: string): Promise<Channel[]>;
    abstract joinChannel(workspaceId: string, channelId: string): Promise<void>;
}
