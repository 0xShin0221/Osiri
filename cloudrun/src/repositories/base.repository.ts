import {
  createClient,
  PostgrestError,
  SupabaseClient,
} from "@supabase/supabase-js";
import type { Database } from "../types/database.types";
import { ConfigManager } from "../lib/config";

export abstract class BaseRepository {
  protected client: SupabaseClient<Database>;

  constructor() {
    const config = ConfigManager.getInstance();
    const { url, serviceKey } = config.getSupabaseConfig();
    this.client = createClient<Database>(url, serviceKey);
  }

  protected isPostgrestError(error: unknown): error is PostgrestError {
    return (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      typeof (error as PostgrestError).code === "string"
    );
  }

  protected handleError(error: unknown): never {
    console.error("Database error:", error);

    if (this.isPostgrestError(error)) {
      throw new Error(`Database error: ${error.message}`);
    }

    if (error instanceof Error) {
      throw new Error(`Unexpected error: ${error.message}`);
    }

    throw new Error("An unknown error occurred");
  }
}
