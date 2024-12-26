import { Article, ArticleInsert, ArticleScrapingStatus, ServiceResponse } from "../types/models";
import { BaseRepository } from "./base.repository";

export class ArticleRepository extends BaseRepository {
  private readonly table = 'articles';

  async saveMany(articles: Omit<ArticleInsert, 'created_at' | 'updated_at'>[]): Promise<Article[]> {
    try {
      const now = new Date().toISOString();
      const articlesWithTimestamps = articles.map(article => ({
        ...article,
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
  async getUnprocessedArticles(limit: number = 50): Promise<ServiceResponse<Article[]>> {
    try {
      const { data, error } = await this.client
        .from(this.table)
        .select()
        .in('scraping_status', ['pending'])
        .lt('scraping_attempt_count', 3)  // Limit retry attempts
        .order('scraping_attempt_count', { ascending: true })
        .order('created_at', { ascending: true })
        // .limit(limit);

      if (error) throw error;

      return {
        success: true,
        data
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error getting unprocessed articles'
      };
    }
  }

  async updateScrapingStatus(
    id: string,
    status: ArticleScrapingStatus,
    error?: string
  ): Promise<ServiceResponse<void>> {
    try {
      const now = new Date().toISOString();
      const { data: currentArticle, error: fetchError } = await this.client
      .from(this.table)
      .select('scraping_attempt_count')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;
      const { error: updateError } = await this.client
        .from(this.table)
        .update({
          scraping_status: status,
          scraping_attempt_count: (currentArticle?.scraping_attempt_count ?? 0) + 1,
          last_scraping_attempt: now,
          scraping_error: error || null,
          updated_at: now
        })
        .eq('id', id);

      if (updateError) throw updateError;

      return {
        success: true
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error updating scraping status'
      };
    }
  }

  async updateScrapedContent(
    id: string, 
    content: string
  ): Promise<ServiceResponse<void>> {
    try {
      const now = new Date().toISOString();
      const { error } = await this.client
        .from(this.table)
        .update({
          content,
          scraping_status: 'processing' as ArticleScrapingStatus,
          last_scraping_attempt: now,
          updated_at: now
        })
        .eq('id', id);

      if (error) throw error;

      return {
        success: true
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error updating scraped content'
      };
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
