import { Article, ArticleInsert } from "../types/models";
import { BaseRepository } from "./base.repository";

export class ArticleRepository extends BaseRepository {
  private readonly table = 'articles';

  async saveMany(articles: Omit<ArticleInsert, 'created_at' | 'updated_at'>[]): Promise<Article[]> {
    try {
      const now = new Date().toISOString();
      const articlesWithTimestamps = articles.map(article => ({
        ...article,
        created_at: now,
        updated_at: now
      }));

      const { data, error } = await this.client
        .from(this.table)
        .upsert(articlesWithTimestamps, {
          onConflict: 'url',
          ignoreDuplicates: true
        })
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async findByUrl(url: string): Promise<Article | null> {
    try {
      const { data, error } = await this.client
        .from(this.table)
        .select()
        .eq('url', url)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }
      return data;
    } catch (error) {
      return this.handleError(error);
    }
  }
}
