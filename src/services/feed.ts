import { supabase } from "@/lib/supabase";

export class FeedService {
  async getFeeds(page: number, itemsPerPage: number, category?: string) {
    let query = supabase.from("rss_feeds").select("*");

    if (category && category !== "all") {
      query = query.contains("categories", [category]);
    }

    if (page === 1) {
      const { data, error } = await query;
      if (error) throw error;
      return data;
    }

    const { data, error } = await query.range(
      (page - 1) * itemsPerPage,
      page * itemsPerPage - 1,
    );
    if (error) throw error;
    return data;
  }

  async getOrganizationFeeds(userId: string) {
    // Get user's organization
    const { data: orgMember, error: orgError } = await supabase
      .from("organization_members")
      .select("organization_id")
      .eq("user_id", userId)
      .single();

    if (orgError) throw orgError;
    if (!orgMember) return { feedIds: [], feeds: [] };

    // Get organization's notification channels
    const { data: channels, error: channelsError } = await supabase
      .from("notification_channels")
      .select("feed_ids")
      .eq("organization_id", orgMember.organization_id);

    if (channelsError) throw channelsError;

    // Collect unique feed IDs
    const feedIds = [
      ...new Set(channels.flatMap((channel) => channel.feed_ids || [])),
    ];

    // Get feed details if there are any feed IDs
    if (feedIds.length > 0) {
      const { data: feeds, error: feedsError } = await supabase
        .from("rss_feeds")
        .select("*")
        .in("id", feedIds);

      if (feedsError) throw feedsError;
      return { feedIds, feeds: feeds || [] };
    }

    return { feedIds: [], feeds: [] };
  }

  async toggleOrganizationFeed(
    userId: string,
    feedId: string,
    currentFeedIds: string[],
  ) {
    // Get user's organization
    const { data: orgMember, error: orgError } = await supabase
      .from("organization_members")
      .select("organization_id")
      .eq("user_id", userId)
      .single();

    if (orgError) throw orgError;
    if (!orgMember) throw new Error("Organization not found");

    // Get existing channels for the organization
    const { data: channels, error: channelsError } = await supabase
      .from("notification_channels")
      .select("id, feed_ids")
      .eq("organization_id", orgMember.organization_id);

    if (channelsError) throw channelsError;

    // Update feed_ids for each channel
    for (const channel of channels) {
      const currentChannelFeedIds = channel.feed_ids || [];
      let newFeedIds: string[];

      if (currentFeedIds.includes(feedId)) {
        // Remove feed
        newFeedIds = currentChannelFeedIds.filter((id: string) =>
          id !== feedId
        );
      } else {
        // Add feed
        newFeedIds = [...currentChannelFeedIds, feedId];
      }

      const { error: updateError } = await supabase
        .from("notification_channels")
        .update({ feed_ids: newFeedIds })
        .eq("id", channel.id);

      if (updateError) throw updateError;
    }
  }
}
