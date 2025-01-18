import { BaseRepository } from "./base.repository";
import { ArticleCategory, ServiceResponse } from "../types/models";


export class CategoryRepository extends BaseRepository {
  private readonly table = "article_categories";
  private readonly relationsTable = "article_category_relations";

  async getCategories(): Promise<ServiceResponse<ArticleCategory[]>> {
    try {
      const { data, error } = await this.client
        .from(this.table)
        .select()
        .order("name");

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }

  async getCategoriesForArticle(articleId: string): Promise<ServiceResponse<ArticleCategory[]>> {
    try {
      const { data, error } = await this.client
        .from(this.relationsTable)
        .select(`
          category:article_categories (
            id,
            name,
            description
          )
        `)
        .eq("article_id", articleId);

      if (error) throw error;
      return {
        success: true,
        data: data?.map(d => d.category as ArticleCategory) ?? []
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }

  async addCategoryToArticle(
    articleId: string,
    categoryId: string
  ): Promise<ServiceResponse<void>> {
    try {
      const { error } = await this.client
        .from(this.relationsTable)
        .insert({
          article_id: articleId,
          category_id: categoryId
        });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }

  async getArticlesByCategory(
    categoryId: string,
    limit: number = 40,
    offset: number = 0
  ): Promise<ServiceResponse<{ articles: any[]; total: number }>> {
    try {
      const { data: articles, error, count } = await this.client
        .from(this.relationsTable)
        .select(`
          article:articles (
            id,
            title,
            content,
            created_at
          )
        `, { count: "exact" })
        .eq("category_id", categoryId)
        .order("created_at", { foreignTable: "articles", ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return {
        success: true,
        data: {
          articles: articles.map(a => a.article),
          total: count ?? 0
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }
}