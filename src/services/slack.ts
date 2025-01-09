import { supabase } from "@/lib/supabase";

interface SlackChannel {
    id: string;
    name: string;
    is_private: boolean;
    topic?: {
        value: string;
    };
    num_members?: number;
}

interface WorkspaceConnection {
    id: string;
    access_token: string;
    workspace_name: string;
}

export class SlackService {
    // Get specific workspace connection
    private async getWorkspaceConnection(
        workspaceId: string,
    ): Promise<WorkspaceConnection> {
        const { data, error } = await supabase
            .from("workspace_connections")
            .select("id, access_token, workspace_name")
            .eq("id", workspaceId)
            .single();

        if (error) throw error;
        return data;
    }

    // Fetch all channels from a Slack workspace using Edge Function
    async getChannels(
        workspaceId: string,
    ): Promise<SlackChannel[]> {
        try {
            const workspace = await this.getWorkspaceConnection(workspaceId);
            if (!workspace) {
                throw new Error("No Slack workspace connection found");
            }

            // Call Edge Function
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

            // Sort channels: public channels first, then alphabetically
            return channels.sort((a: SlackChannel, b: SlackChannel) => {
                if (a.is_private !== b.is_private) {
                    return a.is_private ? 1 : -1;
                }
                return a.name.localeCompare(b.name);
            });
        } catch (error) {
            console.error("Error fetching Slack channels:", error);
            throw error;
        }
    }
}
