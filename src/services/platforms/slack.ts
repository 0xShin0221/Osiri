import type { Channel } from "@/types/notification-platform";
import { BasePlatform } from "./base-platform";

export class SlackPlatform extends BasePlatform {
    constructor() {
        super("slack");
    }

    async joinChannel(workspaceId: string, channelId: string): Promise<void> {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/slack-join-channel`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization":
                            `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
                    },
                    body: JSON.stringify({
                        workspace_id: workspaceId,
                        channel_id: channelId,
                    }),
                },
            );

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to join channel");
            }

            const data = await response.json();
            if (!data.ok) {
                throw new Error(`Failed to join channel: ${data.error}`);
            }
        } catch (error) {
            console.error("Error joining Slack channel:", error);
            throw error;
        }
    }

    async getChannels(workspaceId: string): Promise<Channel[]> {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/slack-channels`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization":
                            `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
                    },
                    body: JSON.stringify({
                        workspace_id: workspaceId,
                    }),
                },
            );

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to fetch channels");
            }

            const { channels } = await response.json();
            return this.sortChannels(channels);
        } catch (error) {
            console.error("Error fetching Slack channels:", error);
            throw error;
        }
    }

    private sortChannels(channels: Channel[]): Channel[] {
        return channels.sort((a, b) => {
            if (a.is_private !== b.is_private) {
                return a.is_private ? 1 : -1;
            }
            return a.name.localeCompare(b.name);
        });
    }
}
