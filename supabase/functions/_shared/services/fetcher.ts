import axios from "npm:axios";
import Parser from "npm:rss-parser";
import { RSSItem } from "../types.ts";

const parser = new Parser();

const axiosInstance = axios.create({
  timeout: 10000,
  headers: {
    "User-Agent": "Mozilla/5.0 (compatible; RSSBot/1.0)",
  },
});

export async function fetchRSSFeed(url: string): Promise<RSSItem[]> {
  try {
    const { data } = await axiosInstance.get(url);
    const feed = await parser.parseString(data);
    console.log("Fetched RSS feed:", feed);

    return feed.items.map((item) => ({
      title: item.title ?? "",
      content: item.content ?? item.contentSnippet ?? "",
      link: item.link ?? "",
    }));
  } catch (error) {
    console.error(`Error fetching RSS from ${url}:`, error);
    throw error;
  }
}
