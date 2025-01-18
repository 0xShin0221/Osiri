import { useCallback, useEffect, useMemo, useState } from "react";
import { FeedService } from "@/services/feed";
import type { Tables } from "@/types/database.types";
import { useAuth } from "@/hooks/useAuth";

type RssFeed = Tables<"rss_feeds">;
type FeedCategory = Tables<"rss_feeds">["categories"][number];

interface UseFeedsOptions {
  itemsPerPage?: number;
}

export function useFeeds({ itemsPerPage = 10 }: UseFeedsOptions = {}) {
  const [allFeeds, setAllFeeds] = useState<RssFeed[]>([]);
  const [organizationFollowingFeeds, setOrganizationFollowingFeeds] = useState<
    RssFeed[]
  >([]);
  const [followedFeedIds, setFollowedFeedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [languageFilter, setLanguageFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<FeedCategory | "all">(
    "all",
  );
  const [isLoading, setIsLoading] = useState(true);

  const { user } = useAuth();
  const feedService = useMemo(() => new FeedService(), []);

  // Fetch organization's followed feeds
  useEffect(() => {
    async function fetchOrgFeeds() {
      if (!user) return;

      try {
        const { feedIds, feeds } = await feedService.getOrganizationFeeds(
          user.id,
        );
        setFollowedFeedIds(feedIds);
        setOrganizationFollowingFeeds(feeds);
      } catch (error) {
        console.error("Error fetching organization feeds:", error);
      }
    }

    fetchOrgFeeds();
  }, [user, feedService]);

  // Fetch available feeds for discovery
  useEffect(() => {
    async function fetchFeeds() {
      setIsLoading(true);
      try {
        const feeds = await feedService.getFeeds(
          currentPage,
          itemsPerPage,
          categoryFilter === "all" ? undefined : categoryFilter,
        );
        if (currentPage === 1) {
          setAllFeeds(feeds || []);
        } else {
          setAllFeeds((prev) => [...prev, ...(feeds || [])]);
        }
      } catch (error) {
        console.error("Error fetching feeds:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchFeeds();
  }, [currentPage, categoryFilter, itemsPerPage, feedService]);

  const filterFeeds = useCallback((feeds: RssFeed[]) => {
    return feeds.filter((feed) => {
      const matchesSearch =
        feed.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feed.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesLanguage = languageFilter === "all" ||
        feed.language === languageFilter;

      const matchesCategory = categoryFilter === "all" ||
        feed.categories.includes(categoryFilter);

      return matchesSearch && matchesLanguage && matchesCategory;
    });
  }, [searchQuery, languageFilter, categoryFilter]);

  const filteredFollowingFeeds = useMemo(
    () => organizationFollowingFeeds,
    [organizationFollowingFeeds],
  );

  const filteredDiscoverFeeds = useMemo(
    () =>
      filterFeeds(allFeeds).filter((feed) =>
        !followedFeedIds.includes(feed.id)
      ),
    [allFeeds, followedFeedIds, filterFeeds],
  );

  const languages = useMemo(() => {
    const uniqueLanguages = [
      ...new Set(
        [...allFeeds, ...organizationFollowingFeeds].map((feed) =>
          feed.language
        ),
      ),
    ];
    return uniqueLanguages.sort();
  }, [allFeeds, organizationFollowingFeeds]);

  const toggleFeed = async (feedId: string) => {
    if (!user) return;

    try {
      await feedService.toggleOrganizationFeed(
        user.id,
        feedId,
        followedFeedIds,
      );

      if (followedFeedIds.includes(feedId)) {
        setFollowedFeedIds((prev) => prev.filter((id) => id !== feedId));
        setOrganizationFollowingFeeds((prev) =>
          prev.filter((feed) => feed.id !== feedId)
        );
      } else {
        setFollowedFeedIds((prev) => [...prev, feedId]);

        const feed = allFeeds.find((f) => f.id === feedId);
        if (feed) {
          setOrganizationFollowingFeeds((prev) => [...prev, feed]);
        }
      }
    } catch (error) {
      console.error("Error toggling organization feed:", error);
    }
  };

  const loadMore = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handleCategoryChange = (category: FeedCategory | "all") => {
    setCategoryFilter(category);
    setCurrentPage(1);
    setAllFeeds([]);
  };

  return {
    allFeeds,
    followingFeeds: filteredFollowingFeeds,
    discoverFeeds: filteredDiscoverFeeds,
    followedFeedIds,
    searchQuery,
    languageFilter,
    categoryFilter,
    languages,
    isLoading,
    currentPage,
    setSearchQuery,
    setLanguageFilter,
    handleCategoryChange,
    toggleFeed,
    loadMore,
  };
}
