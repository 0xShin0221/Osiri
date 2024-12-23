import { RssFeed, RssFeedUpdate } from '../types/models';
import { BaseRepository } from './base.repository';

export class FeedRepository extends BaseRepository {
  private readonly table = 'rss_feeds';

  async getActiveBatch(limit: number = 5): Promise<RssFeed[]> {
    try {
      const { data, error } = await this.client
        .from(this.table)
        .select()
        .eq('is_active', true)
        .order('last_fetched_at', { ascending: true, nullsFirst: true })
        .limit(limit);

      if (error) throw error;
      return data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async hasMoreActiveFeeds(lastId: string): Promise<boolean> {
    try {
      const { count, error } = await this.client
        .from(this.table)
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)
        .gt('id', lastId);

      if (error) throw error;
      return (count || 0) > 0;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async updateLastFetched(id: string): Promise<void> {
    try {
      const { error } = await this.client
        .from(this.table)
        .update({ 
          last_fetched_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        } satisfies RssFeedUpdate)
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      this.handleError(error);
    }
  }

  async findById(id: string): Promise<RssFeed | null> {
    try {
      const { data, error } = await this.client
        .from(this.table)
        .select()
        .eq('id', id)
        .single();

      if (error) {
        if (this.isPostgrestError(error) && error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }
      return data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async markAsInactive(id: string): Promise<void> {
    try {
      const { error } = await this.client
        .from(this.table)
        .update({ 
          is_active: false,
          updated_at: new Date().toISOString()
        } satisfies RssFeedUpdate)
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getFeedStatus(id: string): Promise<{ isActive: boolean; lastFetched: Date | null } | null> {
    try {
      const { data, error } = await this.client
        .from(this.table)
        .select('is_active, last_fetched_at')
        .eq('id', id)
        .single();

      if (error) {
        if (this.isPostgrestError(error) && error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }

      return {
        isActive: data.is_active,
        lastFetched: data.last_fetched_at ? new Date(data.last_fetched_at) : null
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async updateFeedUrl(id: string, newUrl: string): Promise<void> {
    try {
      const { error } = await this.client
        .from(this.table)
        .update({ 
          url: newUrl,
          updated_at: new Date().toISOString()
        } satisfies RssFeedUpdate)
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      this.handleError(error);
    }
  }
}