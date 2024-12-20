import { articleRepository } from "../db/article.ts";
import { ProcessResult, RSSItem } from "../types.ts";

export async function processArticles(
  feedId: string,
  items: RSSItem[],
): Promise<ProcessResult[]> {
  const articleDataList = items.map((item) => ({
    feed_id: feedId,
    title: item.title,
    content: item.content,
    url: item.link,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));

  return await articleRepository.saveMany(articleDataList);
}
