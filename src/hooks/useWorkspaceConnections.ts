// src/hooks/useWorkspaceConnections.ts
import { useEffect, useState } from "react";
import { WorkspaceService } from "@/services/workspace";
import type { Tables } from "@/types/database.types";
import { useProfile } from "./useProfile";
import type { Session } from "@supabase/supabase-js";

type WorkspaceConnection = Tables<"workspace_connections">;

interface UseWorkspaceConnectionsOptions {
    session: Session | null;
}

export function useWorkspaceConnections(
    { session }: UseWorkspaceConnectionsOptions,
) {
    const [connections, setConnections] = useState<WorkspaceConnection[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const workspaceService = new WorkspaceService();
    const { profile } = useProfile({ session });

    const fetchConnections = async () => {
        if (!profile) return;

        setLoading(true);
        setError(null);
        try {
            const data = await workspaceService.getWorkspaceConnections();
            setConnections(data);
        } catch (err) {
            console.error("Error fetching workspace connections:", err);
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to load workspace connections",
            );
        } finally {
            setLoading(false);
        }
    };

    const addConnection = async (
        platform: WorkspaceConnection["platform"],
        workspaceId: string,
        accessToken: string,
    ) => {
        if (!profile) return null;

        try {
            const newConnection = await workspaceService
                .createWorkspaceConnection({
                    platform,
                    workspace_id: workspaceId,
                    access_token: accessToken,
                });
            setConnections((prev) => [...prev, newConnection]);
            return newConnection;
        } catch (err) {
            console.error("Error adding workspace connection:", err);
            throw err;
        }
    };

    const removeConnection = async (connectionId: string) => {
        try {
            await workspaceService.deleteWorkspaceConnection(connectionId);
            setConnections((prev) =>
                prev.filter((conn) => conn.id !== connectionId)
            );
        } catch (err) {
            console.error("Error removing workspace connection:", err);
            throw err;
        }
    };

    useEffect(() => {
        if (profile) {
            fetchConnections();
        }
    }, [profile?.user_id]);

    return {
        connections,
        loading,
        error,
        fetchConnections,
        addConnection,
        removeConnection,
    };
}
