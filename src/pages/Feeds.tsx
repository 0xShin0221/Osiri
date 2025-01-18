import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { Rss, Plus } from "lucide-react";
import FeedCard from "@/components/rssFeed/FeedCard";
import { Badge } from "@/components/ui/badge";
import {
  AddFeedRequestDialog,
  CategoryFilter,
  FeedList,
  FeedSearch,
} from "@/components/rssFeed";
import { CATEGORY_GROUPS } from "@/mocks/categoryData";
import { useFeeds } from "@/hooks/useFeeds";

const ITEMS_PER_PAGE = 10;

export default function FeedsPage() {
  const { t } = useTranslation("feeds");
  const {
    followingFeeds,
    discoverFeeds,
    followedFeedIds,
    searchQuery,
    languageFilter,
    categoryFilter,
    languages,
    isLoading,
    setSearchQuery,
    setLanguageFilter,
    handleCategoryChange,
    toggleFeed,
    loadMore,
  } = useFeeds({ itemsPerPage: ITEMS_PER_PAGE });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{t("title")}</h1>
            <p className="text-muted-foreground">{t("description")}</p>
          </div>
          <AddFeedRequestDialog
            onSubmit={async (request) => {
              console.log("Feed request:", request);
            }}
          />
        </div>

        {/* Following Feeds Section */}
        <section>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Rss className="w-5 h-5" />
                    {t("following.title")}
                    <Badge variant="secondary">{followingFeeds.length}</Badge>
                  </CardTitle>
                  <CardDescription>
                    {t("following.description")}
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  onClick={() =>
                    document
                      .getElementById("discover-section")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {t("following.addMore")}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {followingFeeds.length > 0 ? (
                <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
                  {followingFeeds.map((feed) => (
                    <FeedCard
                      key={feed.id}
                      feed={feed}
                      isSelected={followedFeedIds.includes(feed.id)}
                      onToggle={toggleFeed}
                      isDefault={false}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Rss className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">
                    {searchQuery ||
                    categoryFilter !== "all" ||
                    languageFilter !== "all"
                      ? t("following.noMatchingFeeds")
                      : t("following.noFeeds")}
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    {searchQuery ||
                    categoryFilter !== "all" ||
                    languageFilter !== "all"
                      ? t("following.tryAdjustingFilters")
                      : t("following.startByDiscovering")}
                  </p>
                  <Button
                    className="mt-4"
                    onClick={() =>
                      document
                        .getElementById("discover-section")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    {t("following.browseFeeds")}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Discover Section */}
        <section id="discover-section">
          <Card>
            <CardHeader>
              <CardTitle>{t("discover.title")}</CardTitle>
              <CardDescription>{t("discover.description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Categories */}
              <CategoryFilter
                categoryFilter={categoryFilter}
                onCategoryChange={handleCategoryChange}
                categoryGroups={CATEGORY_GROUPS}
              />

              {/* Available Feeds */}
              <div className="space-y-4">
                {/* Global Search & Filters */}
                <FeedSearch
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  languageFilter={languageFilter}
                  onLanguageChange={setLanguageFilter}
                  languages={languages}
                />
                <h3 className="text-lg font-medium">
                  {t("discover.availableFeeds")}
                </h3>
                {isLoading ? (
                  <div className="text-center py-4 text-muted-foreground">
                    {t("loading")}
                  </div>
                ) : (
                  <FeedList
                    feeds={discoverFeeds}
                    selectedFeeds={followedFeedIds}
                    onToggleFeed={toggleFeed}
                    isLoading={isLoading}
                    onLoadMore={
                      discoverFeeds.length >= ITEMS_PER_PAGE
                        ? loadMore
                        : undefined
                    }
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
