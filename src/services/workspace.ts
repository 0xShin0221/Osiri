// src/services/workspace.ts
import { supabase } from "@/lib/supabase";
import type { Tables, TablesInsert } from "@/types/database.types";

type WorkspaceConnection = Tables<"workspace_connections">;
type WorkspaceConnectionInsert = TablesInsert<"workspace_connections">;

export class WorkspaceService {
    async getWorkspaceConnections(): Promise<WorkspaceConnection[]> {
        const { data, error } = await supabase
            .from("workspace_connections")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;
        return data;
    }

    async createWorkspaceConnection(
        connection: Partial<WorkspaceConnectionInsert>,
    ): Promise<WorkspaceConnection> {
        const { data, error } = await supabase
            .from("workspace_connections")
            .insert([connection])
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    async deleteWorkspaceConnection(id: string): Promise<void> {
        const { error } = await supabase
            .from("workspace_connections")
            .delete()
            .eq("id", id);

        if (error) throw error;
    }
}
