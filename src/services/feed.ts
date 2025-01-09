import { supabase } from "@/lib/supabase";
import type { Tables } from "@/types/database.types";

type RssFeed = Tables<"rss_feeds">;
interface OrganizationFeedsResult {
  feedIds: string[];
  feeds: RssFeed[];
}

export class FeedService {
  // Get all available feeds with pagination and optional category filter
  async getFeeds(page: number, itemsPerPage: number, category?: string) {
    try {
      let query = supabase.from("rss_feeds").select("*");

      if (category && category !== "all") {
        query = query.contains("categories", [category]);
      }

      // Handle first page differently to get all results for initial load
      if (page === 1) {
        const { data, error } = await query;
        if (error) throw error;
        return data;
      }

      // Paginated results for subsequent pages
      const { data, error } = await query.range(
        (page - 1) * itemsPerPage,
        page * itemsPerPage - 1,
      );
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching feeds:", error);
      throw error;
    }
  }

  // Get all feeds followed by the organization
  async getOrganizationFeeds(userId: string): Promise<OrganizationFeedsResult> {
    try {
      // Get user's organization membership
      const { data: orgMember, error: orgError } = await supabase
        .from("organization_members")
        .select("organization_id")
        .eq("user_id", userId)
        .single();

      if (orgError) throw orgError;
      if (!orgMember) return { feedIds: [], feeds: [] };

      // Get organization's followed feeds
      const { data: followedFeeds, error: followsError } = await supabase
        .from("organization_feed_follows")
        .select("feed_id")
        .eq("organization_id", orgMember.organization_id);

      if (followsError) throw followsError;

      // Extract feed IDs
      const feedIds = followedFeeds.map((follow) => follow.feed_id);

      // If no feeds are found, return empty result
      if (feedIds.length === 0) {
        return { feedIds: [], feeds: [] };
      }

      // Get feed details for all followed feeds
      const { data: feeds, error: feedsError } = await supabase
        .from("rss_feeds")
        .select("*")
        .in("id", feedIds);

      if (feedsError) throw feedsError;

      return { feedIds, feeds: feeds || [] };
    } catch (error) {
      console.error("Error fetching organization feeds:", error);
      throw error;
    }
  }

  // Toggle feed subscription for organization
  async toggleOrganizationFeed(
    userId: string,
    feedId: string,
    currentFeedIds: string[],
  ) {
    // 1. Get organization ID
    const { data: orgMember, error: orgError } = await supabase
      .from("organization_members")
      .select("organization_id")
      .eq("user_id", userId)
      .single();

    if (orgError) {
      console.error("Error getting organization:", orgError);
      throw orgError;
    }

    // 2. Determine if we're adding or removing
    const isAdding = !currentFeedIds.includes(feedId);

    try {
      if (isAdding) {
        // Add feed follow relationship
        const { error: followError } = await supabase
          .from("organization_feed_follows")
          .insert({
            organization_id: orgMember.organization_id,
            feed_id: feedId,
          });

        if (followError) {
          console.error("Error following feed:", followError);
          throw followError;
        }
      } else {
        // Remove feed follow relationship
        const { error: unfollowError } = await supabase
          .from("organization_feed_follows")
          .delete()
          .eq("organization_id", orgMember.organization_id)
          .eq("feed_id", feedId);

        if (unfollowError) {
          console.error("Error unfollowing feed:", unfollowError);
          throw unfollowError;
        }

        // Get channels with this feed
        const { data: channels, error: channelsError } = await supabase
          .from("notification_channels")
          .select("id")
          .eq("organization_id", orgMember.organization_id);

        if (channelsError) {
          console.error("Error getting channels:", channelsError);
          throw channelsError;
        }

        // Remove feed from all channels
        for (const channel of channels) {
          const { error: removeError } = await supabase
            .from("notification_channel_feeds")
            .delete()
            .eq("channel_id", channel.id)
            .eq("feed_id", feedId);

          if (removeError) {
            console.error("Error removing feed from channel:", removeError);
          }
        }
      }
    } catch (error) {
      console.error("Error in feed toggle operation:", error);
      throw error;
    }
  }
}
