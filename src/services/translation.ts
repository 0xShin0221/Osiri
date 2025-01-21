import { supabase } from "@/lib/supabase";
import type { Tables } from "@/types/database.types";

export type TranslationWithRelations = Tables<"translations"> & {
    article: Tables<"articles"> & {
        feed: Tables<"rss_feeds">;
    };
    notification_logs?: Tables<"notification_logs">[];
};

export class TranslationService {
    async getLatestTranslations(
        organizationId: string,
    ): Promise<TranslationWithRelations[]> {
        try {
            const { data: translations, error } = await supabase
                .from("translations")
                .select(`
                    *,
                    article:articles (
                        *,
                        feed:rss_feeds (*)
                    )
                `)
                .eq("status", "completed")
                .order("created_at", { ascending: false })
                .limit(10);

            if (error) {
                console.error("Error fetching translations:", error);
                throw error;
            }

            if (!translations?.length) {
                console.log("No translations found");
                return [];
            }

            const { data: logs } = await supabase
                .from("notification_logs")
                .select("*")
                .eq("organization_id", organizationId)
                .eq("status", "success")
                .in("article_id", translations.map((t) => t.article_id))
                .order("created_at", { ascending: false });

            const translationsWithLogs = translations.map((trans) => ({
                ...trans,
                notification_logs: logs?.filter((log) =>
                    log.article_id === trans.article_id
                ) || [],
            }));

            return translationsWithLogs;
        } catch (error) {
            console.error("Error fetching translations:", error);
            return [];
        }
    }
}
