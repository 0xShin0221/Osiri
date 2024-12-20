import { supabase } from "./client.ts";
import { ProcessResult } from "../types.ts";

export interface ArticleData {
  feed_id: string;
  title: string;
  content: string;
  url: string;
  created_at: string;
  updated_at: string;
}

export const articleRepository = {
  /**
   * Save a single article to the database
   */
  saveOne: async (articleData: ArticleData): Promise<void> => {
    const { error } = await supabase
      .from("articles")
      .upsert(articleData, {
        onConflict: "url",
        ignoreDuplicates: true,
      });

    if (error) {
      console.error("Error saving article:", error);
      throw error;
    }
  },

  /**
   * Save multiple articles to the database
   */
  saveMany: async (articlesData: ArticleData[]): Promise<ProcessResult[]> => {
    const results: ProcessResult[] = [];

    for (const articleData of articlesData) {
      try {
        await articleRepository.saveOne(articleData);
        results.push({
          url: articleData.url,
          success: true,
        });
      } catch (error) {
        results.push({
          url: articleData.url,
          success: false,
          error: error.message,
        });
      }
    }

    return results;
  },
};
