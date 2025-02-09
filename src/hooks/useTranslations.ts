import { useEffect, useState } from "react";
import {
    TranslationService,
    TranslationWithRelations,
} from "@/services/translation";
import { supabase } from "@/lib/supabase";

interface UseTranslationsOptions {
    organizationId?: string | null;
}

export function useTranslations({ organizationId }: UseTranslationsOptions) {
    const [translations, setTranslations] = useState<
        TranslationWithRelations[]
    >([]);
    const [loading, setLoading] = useState(true);
    const translationService = new TranslationService();

    const fetchTranslations = async () => {
        if (!organizationId) return;

        setLoading(true);
        try {
            const data = await translationService.getLatestTranslations(
                organizationId,
            );
            setTranslations(data);
        } catch (error) {
            console.error("Error fetching translations:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTranslations();
    }, [organizationId]);

    useEffect(() => {
        if (!organizationId) return;

        const channel = supabase
            .channel("translation_changes")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "translations",
                    filter: `status=eq.completed`,
                },
                () => {
                    fetchTranslations();
                },
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [organizationId]);

    return {
        translations,
        loading,
        refetch: fetchTranslations,
    };
}
