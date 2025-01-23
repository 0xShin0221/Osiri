export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      article_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      article_category_relations: {
        Row: {
          article_id: string
          category_id: string
        }
        Insert: {
          article_id: string
          category_id: string
        }
        Update: {
          article_id?: string
          category_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_category_relations_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_category_relations_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "article_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      articles: {
        Row: {
          content: string | null
          created_at: string
          feed_id: string
          id: string
          last_scraping_attempt: string | null
          og_description: string | null
          og_image: string | null
          og_title: string | null
          published_at: string | null
          scraping_attempt_count: number
          scraping_error: string | null
          scraping_status: Database["public"]["Enums"]["article_scraping_status"]
          title: string
          updated_at: string
          url: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          feed_id: string
          id?: string
          last_scraping_attempt?: string | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          published_at?: string | null
          scraping_attempt_count?: number
          scraping_error?: string | null
          scraping_status?: Database["public"]["Enums"]["article_scraping_status"]
          title: string
          updated_at?: string
          url: string
        }
        Update: {
          content?: string | null
          created_at?: string
          feed_id?: string
          id?: string
          last_scraping_attempt?: string | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          published_at?: string | null
          scraping_attempt_count?: number
          scraping_error?: string | null
          scraping_status?: Database["public"]["Enums"]["article_scraping_status"]
          title?: string
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "articles_feed_id_fkey"
            columns: ["feed_id"]
            isOneToOne: false
            referencedRelation: "rss_feeds"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_subscriptions: {
        Row: {
          created_at: string
          email: string
          id: string
          language: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          language: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          language?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      notification_channel_feeds: {
        Row: {
          channel_id: string | null
          created_at: string | null
          feed_id: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          channel_id?: string | null
          created_at?: string | null
          feed_id?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          channel_id?: string | null
          created_at?: string | null
          feed_id?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_channel_feeds_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "inactive_channels"
            referencedColumns: ["channel_id"]
          },
          {
            foreignKeyName: "notification_channel_feeds_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "notification_channels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_channel_feeds_feed_id_fkey"
            columns: ["feed_id"]
            isOneToOne: false
            referencedRelation: "rss_feeds"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_channels: {
        Row: {
          category_ids: string[] | null
          channel_identifier: string
          channel_identifier_id: string | null
          created_at: string | null
          error_count: number | null
          id: string
          is_active: boolean
          last_error: string | null
          last_notified_at: string | null
          notification_language: Database["public"]["Enums"]["feed_language"]
          organization_id: string
          platform: Database["public"]["Enums"]["notification_platform"]
          schedule_id: string | null
          updated_at: string | null
          workspace_connection_id: string | null
        }
        Insert: {
          category_ids?: string[] | null
          channel_identifier: string
          channel_identifier_id?: string | null
          created_at?: string | null
          error_count?: number | null
          id?: string
          is_active?: boolean
          last_error?: string | null
          last_notified_at?: string | null
          notification_language: Database["public"]["Enums"]["feed_language"]
          organization_id: string
          platform: Database["public"]["Enums"]["notification_platform"]
          schedule_id?: string | null
          updated_at?: string | null
          workspace_connection_id?: string | null
        }
        Update: {
          category_ids?: string[] | null
          channel_identifier?: string
          channel_identifier_id?: string | null
          created_at?: string | null
          error_count?: number | null
          id?: string
          is_active?: boolean
          last_error?: string | null
          last_notified_at?: string | null
          notification_language?: Database["public"]["Enums"]["feed_language"]
          organization_id?: string
          platform?: Database["public"]["Enums"]["notification_platform"]
          schedule_id?: string | null
          updated_at?: string | null
          workspace_connection_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_channels_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "monthly_org_notifications"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "notification_channels_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_notification_stats"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "notification_channels_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_subscription_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_channels_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_channels_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "notification_schedules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_channels_workspace_connection_id_fkey"
            columns: ["workspace_connection_id"]
            isOneToOne: false
            referencedRelation: "workspace_connections"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_logs: {
        Row: {
          article_id: string | null
          channel_id: string
          created_at: string | null
          error: string | null
          id: string
          organization_id: string
          platform: Database["public"]["Enums"]["notification_platform"]
          recipient: string
          status: Database["public"]["Enums"]["notification_status"]
          updated_at: string | null
        }
        Insert: {
          article_id?: string | null
          channel_id: string
          created_at?: string | null
          error?: string | null
          id?: string
          organization_id: string
          platform: Database["public"]["Enums"]["notification_platform"]
          recipient: string
          status: Database["public"]["Enums"]["notification_status"]
          updated_at?: string | null
        }
        Update: {
          article_id?: string | null
          channel_id?: string
          created_at?: string | null
          error?: string | null
          id?: string
          organization_id?: string
          platform?: Database["public"]["Enums"]["notification_platform"]
          recipient?: string
          status?: Database["public"]["Enums"]["notification_status"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_logs_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_logs_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "inactive_channels"
            referencedColumns: ["channel_id"]
          },
          {
            foreignKeyName: "notification_logs_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "notification_channels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "monthly_org_notifications"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "notification_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_notification_stats"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "notification_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_subscription_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_schedules: {
        Row: {
          created_at: string | null
          cron_expression: string | null
          id: string
          name: string
          schedule_type: Database["public"]["Enums"]["notification_schedule_type"]
          timezone: Database["public"]["Enums"]["utc_offset"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          cron_expression?: string | null
          id?: string
          name: string
          schedule_type: Database["public"]["Enums"]["notification_schedule_type"]
          timezone: Database["public"]["Enums"]["utc_offset"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          cron_expression?: string | null
          id?: string
          name?: string
          schedule_type?: Database["public"]["Enums"]["notification_schedule_type"]
          timezone?: Database["public"]["Enums"]["utc_offset"]
          updated_at?: string | null
        }
        Relationships: []
      }
      organization_feed_follows: {
        Row: {
          created_at: string
          feed_id: string
          id: string
          organization_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          feed_id: string
          id?: string
          organization_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          feed_id?: string
          id?: string
          organization_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_feed_follows_feed_id_fkey"
            columns: ["feed_id"]
            isOneToOne: false
            referencedRelation: "rss_feeds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_feed_follows_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "monthly_org_notifications"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "organization_feed_follows_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_notification_stats"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "organization_feed_follows_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_subscription_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_feed_follows_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_members: {
        Row: {
          created_at: string | null
          id: string
          organization_id: string | null
          role: Database["public"]["Enums"]["member_role"]
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          organization_id?: string | null
          role: Database["public"]["Enums"]["member_role"]
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          organization_id?: string | null
          role?: Database["public"]["Enums"]["member_role"]
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "monthly_org_notifications"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_notification_stats"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_subscription_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string | null
          id: string
          last_usage_reset: string | null
          name: string
          notifications_used_this_month: number | null
          plan_id: string | null
          stripe_customer_id: string | null
          subscription_status:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          trial_end_date: string | null
          trial_start_date: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_usage_reset?: string | null
          name: string
          notifications_used_this_month?: number | null
          plan_id?: string | null
          stripe_customer_id?: string | null
          subscription_status?:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          trial_end_date?: string | null
          trial_start_date?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          last_usage_reset?: string | null
          name?: string
          notifications_used_this_month?: number | null
          plan_id?: string | null
          stripe_customer_id?: string | null
          subscription_status?:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          trial_end_date?: string | null
          trial_start_date?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organizations_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          id: string
          onboarding_completed: boolean | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id: string
          onboarding_completed?: boolean | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          onboarding_completed?: boolean | null
          updated_at?: string
        }
        Relationships: []
      }
      rss_feeds: {
        Row: {
          categories: Database["public"]["Enums"]["feed_category"][]
          content_status:
            | Database["public"]["Enums"]["feed_content_status"]
            | null
          created_at: string
          description: string | null
          health_status:
            | Database["public"]["Enums"]["feed_health_status"]
            | null
          id: string
          is_active: boolean
          language: Database["public"]["Enums"]["feed_language"]
          last_fetched_at: string | null
          name: string
          site_icon: string | null
          updated_at: string
          url: string
        }
        Insert: {
          categories?: Database["public"]["Enums"]["feed_category"][]
          content_status?:
            | Database["public"]["Enums"]["feed_content_status"]
            | null
          created_at?: string
          description?: string | null
          health_status?:
            | Database["public"]["Enums"]["feed_health_status"]
            | null
          id?: string
          is_active?: boolean
          language?: Database["public"]["Enums"]["feed_language"]
          last_fetched_at?: string | null
          name: string
          site_icon?: string | null
          updated_at?: string
          url: string
        }
        Update: {
          categories?: Database["public"]["Enums"]["feed_category"][]
          content_status?:
            | Database["public"]["Enums"]["feed_content_status"]
            | null
          created_at?: string
          description?: string | null
          health_status?:
            | Database["public"]["Enums"]["feed_health_status"]
            | null
          id?: string
          is_active?: boolean
          language?: Database["public"]["Enums"]["feed_language"]
          last_fetched_at?: string | null
          name?: string
          site_icon?: string | null
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      subscription_plan_limits: {
        Row: {
          max_notifications_per_day: number
          plan_id: string
          usage_rate: number | null
        }
        Insert: {
          max_notifications_per_day: number
          plan_id: string
          usage_rate?: number | null
        }
        Update: {
          max_notifications_per_day?: number
          plan_id?: string
          usage_rate?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "subscription_plan_limits_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: true
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plans: {
        Row: {
          base_notifications_per_day: number
          created_at: string | null
          description: string | null
          has_usage_billing: boolean | null
          id: string
          is_active: boolean | null
          name: string
          sort_order: number | null
          stripe_base_price_id: string | null
          stripe_metered_price_id: string | null
          stripe_product_id: string | null
          updated_at: string | null
        }
        Insert: {
          base_notifications_per_day: number
          created_at?: string | null
          description?: string | null
          has_usage_billing?: boolean | null
          id?: string
          is_active?: boolean | null
          name: string
          sort_order?: number | null
          stripe_base_price_id?: string | null
          stripe_metered_price_id?: string | null
          stripe_product_id?: string | null
          updated_at?: string | null
        }
        Update: {
          base_notifications_per_day?: number
          created_at?: string | null
          description?: string | null
          has_usage_billing?: boolean | null
          id?: string
          is_active?: boolean | null
          name?: string
          sort_order?: number | null
          stripe_base_price_id?: string | null
          stripe_metered_price_id?: string | null
          stripe_product_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      translations: {
        Row: {
          article_id: string
          attempt_count: number
          content: string | null
          created_at: string | null
          error: string | null
          id: string
          key_point1: string | null
          key_point2: string | null
          key_point3: string | null
          key_point4: string | null
          key_point5: string | null
          last_attempt: string | null
          status: Database["public"]["Enums"]["translation_status"]
          summary: string | null
          target_language: Database["public"]["Enums"]["feed_language"]
          title: string | null
          updated_at: string | null
        }
        Insert: {
          article_id: string
          attempt_count?: number
          content?: string | null
          created_at?: string | null
          error?: string | null
          id?: string
          key_point1?: string | null
          key_point2?: string | null
          key_point3?: string | null
          key_point4?: string | null
          key_point5?: string | null
          last_attempt?: string | null
          status?: Database["public"]["Enums"]["translation_status"]
          summary?: string | null
          target_language: Database["public"]["Enums"]["feed_language"]
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          article_id?: string
          attempt_count?: number
          content?: string | null
          created_at?: string | null
          error?: string | null
          id?: string
          key_point1?: string | null
          key_point2?: string | null
          key_point3?: string | null
          key_point4?: string | null
          key_point5?: string | null
          last_attempt?: string | null
          status?: Database["public"]["Enums"]["translation_status"]
          summary?: string | null
          target_language?: Database["public"]["Enums"]["feed_language"]
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "translations_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
      waitlist: {
        Row: {
          company: string | null
          created_at: string
          email: string
          id: string
          language: string
          name: string
          role: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          id?: string
          language: string
          name: string
          role?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          language?: string
          name?: string
          role?: string | null
        }
        Relationships: []
      }
      workspace_connections: {
        Row: {
          access_token: string | null
          created_at: string | null
          id: string
          is_active: boolean
          is_disconnected: boolean
          organization_id: string | null
          platform: Database["public"]["Enums"]["notification_platform"]
          refresh_token: string | null
          token_expires_at: string | null
          updated_at: string | null
          workspace_id: string | null
          workspace_name: string | null
        }
        Insert: {
          access_token?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean
          is_disconnected?: boolean
          organization_id?: string | null
          platform: Database["public"]["Enums"]["notification_platform"]
          refresh_token?: string | null
          token_expires_at?: string | null
          updated_at?: string | null
          workspace_id?: string | null
          workspace_name?: string | null
        }
        Update: {
          access_token?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean
          is_disconnected?: boolean
          organization_id?: string | null
          platform?: Database["public"]["Enums"]["notification_platform"]
          refresh_token?: string | null
          token_expires_at?: string | null
          updated_at?: string | null
          workspace_id?: string | null
          workspace_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workspace_connections_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "monthly_org_notifications"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "workspace_connections_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_notification_stats"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "workspace_connections_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_subscription_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workspace_connections_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      inactive_channels: {
        Row: {
          channel_id: string | null
          channel_identifier: string | null
          last_notification_date: string | null
          last_used: string | null
          organization_id: string | null
          organization_name: string | null
          platform: Database["public"]["Enums"]["notification_platform"] | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_channels_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "monthly_org_notifications"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "notification_channels_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_notification_stats"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "notification_channels_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_subscription_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_channels_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      monthly_org_notifications: {
        Row: {
          failed_notifications: number | null
          month: string | null
          organization_id: string | null
          organization_name: string | null
          successful_notifications: number | null
          total_notifications: number | null
        }
        Relationships: []
      }
      organization_notification_stats: {
        Row: {
          avg_daily_notifications: number | null
          base_notifications_per_day: number | null
          failed_notifications: number | null
          limit_reached: boolean | null
          max_notifications_per_day: number | null
          month: string | null
          notifications_used_this_month: number | null
          organization_id: string | null
          organization_name: string | null
          plan_name: string | null
          successful_notifications: number | null
          total_notifications: number | null
        }
        Relationships: []
      }
      organization_subscription_status: {
        Row: {
          created_at: string | null
          has_usage_billing: boolean | null
          id: string | null
          last_usage_reset: string | null
          max_notifications_per_day: number | null
          name: string | null
          notifications_used_this_month: number | null
          plan_id: string | null
          plan_name: string | null
          stripe_base_price_id: string | null
          stripe_customer_id: string | null
          stripe_metered_price_id: string | null
          stripe_status: string | null
          subscription_end_date: string | null
          subscription_status:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          trial_end_date: string | null
          trial_start_date: string | null
          updated_at: string | null
          usage_rate: number | null
        }
        Relationships: [
          {
            foreignKeyName: "organizations_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      pending_translations: {
        Row: {
          article_id: string | null
          original_content: string | null
          original_title: string | null
          source_language: Database["public"]["Enums"]["feed_language"] | null
          target_language: Database["public"]["Enums"]["feed_language"] | null
          translation_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "translations_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      create_smart_translation_tasks: {
        Args: {
          p_article_ids: string[]
        }
        Returns: {
          article_id: string
          attempt_count: number
          content: string | null
          created_at: string | null
          error: string | null
          id: string
          key_point1: string | null
          key_point2: string | null
          key_point3: string | null
          key_point4: string | null
          key_point5: string | null
          last_attempt: string | null
          status: Database["public"]["Enums"]["translation_status"]
          summary: string | null
          target_language: Database["public"]["Enums"]["feed_language"]
          title: string | null
          updated_at: string | null
        }[]
      }
      create_smart_translation_tasks_with_logging: {
        Args: {
          p_article_ids: string[]
        }
        Returns: {
          article_id: string
          attempt_count: number
          content: string | null
          created_at: string | null
          error: string | null
          id: string
          key_point1: string | null
          key_point2: string | null
          key_point3: string | null
          key_point4: string | null
          key_point5: string | null
          last_attempt: string | null
          status: Database["public"]["Enums"]["translation_status"]
          summary: string | null
          target_language: Database["public"]["Enums"]["feed_language"]
          title: string | null
          updated_at: string | null
        }[]
      }
      create_translation_tasks: {
        Args: {
          p_article_ids: string[]
          p_target_languages: Database["public"]["Enums"]["feed_language"][]
        }
        Returns: {
          article_id: string
          attempt_count: number
          content: string | null
          created_at: string | null
          error: string | null
          id: string
          key_point1: string | null
          key_point2: string | null
          key_point3: string | null
          key_point4: string | null
          key_point5: string | null
          last_attempt: string | null
          status: Database["public"]["Enums"]["translation_status"]
          summary: string | null
          target_language: Database["public"]["Enums"]["feed_language"]
          title: string | null
          updated_at: string | null
        }[]
      }
      create_translation_tasks_with_logging: {
        Args: {
          p_article_ids: string[]
          p_target_languages: Database["public"]["Enums"]["feed_language"][]
        }
        Returns: {
          article_id: string
          attempt_count: number
          content: string | null
          created_at: string | null
          error: string | null
          id: string
          key_point1: string | null
          key_point2: string | null
          key_point3: string | null
          key_point4: string | null
          key_point5: string | null
          last_attempt: string | null
          status: Database["public"]["Enums"]["translation_status"]
          summary: string | null
          target_language: Database["public"]["Enums"]["feed_language"]
          title: string | null
          updated_at: string | null
        }[]
      }
      get_articles_for_translation: {
        Args: {
          max_articles: number
        }
        Returns: {
          id: string
          title: string
          content: string
          source_language: Database["public"]["Enums"]["feed_language"]
        }[]
      }
      get_channel_notification_stats: {
        Args: {
          p_days?: number
        }
        Returns: {
          organization_name: string
          channel_identifier: string
          platform: Database["public"]["Enums"]["notification_platform"]
          total_notifications: number
          successful_notifications: number
          failed_notifications: number
          last_notification: string
          avg_daily_notifications: number
        }[]
      }
      get_required_translation_languages: {
        Args: {
          p_article_ids: string[]
        }
        Returns: {
          article_id: string
          source_language: Database["public"]["Enums"]["feed_language"]
          required_languages: Database["public"]["Enums"]["feed_language"][]
        }[]
      }
      increment_attempt_count: {
        Args: {
          row_id: string
        }
        Returns: number
      }
    }
    Enums: {
      article_scraping_status:
        | "pending"
        | "processing"
        | "completed"
        | "failed"
        | "skipped"
      feed_category:
        | "learning_productivity"
        | "critical_thinking"
        | "mental_models"
        | "personal_development"
        | "self_improvement"
        | "productivity_tools"
        | "time_management"
        | "startup_news"
        | "venture_capital"
        | "entrepreneurship"
        | "product_management"
        | "leadership"
        | "business_strategy"
        | "business_finance"
        | "small_business"
        | "e_commerce"
        | "tech_news"
        | "software_development"
        | "web_development"
        | "mobile_development"
        | "devops"
        | "cybersecurity"
        | "cloud_computing"
        | "open_source"
        | "blockchain"
        | "engineering_general"
        | "system_design"
        | "backend_engineering"
        | "frontend_engineering"
        | "data_engineering"
        | "infrastructure"
        | "civil_engineering"
        | "mechanical_engineering"
        | "electrical_engineering"
        | "machine_learning"
        | "artificial_intelligence"
        | "data_science"
        | "deep_learning"
        | "nlp"
        | "computer_vision"
        | "data_mining"
        | "big_data"
        | "ai_ethics"
        | "ux_design"
        | "ui_design"
        | "product_design"
        | "design_systems"
        | "web_design"
        | "interaction_design"
        | "graphic_design"
        | "motion_graphics"
        | "3d_design"
        | "interior_design"
        | "architecture"
        | "furniture_design"
        | "lighting_design"
        | "sustainable_design"
        | "commercial_design"
        | "residential_design"
        | "landscape_design"
        | "computer_science"
        | "neuroscience"
        | "psychology"
        | "cognitive_science"
        | "data_analytics"
        | "research_papers"
        | "physics"
        | "chemistry"
        | "biology"
        | "digital_marketing"
        | "growth_marketing"
        | "content_marketing"
        | "seo"
        | "social_media"
        | "marketing_analytics"
        | "email_marketing"
        | "affiliate_marketing"
        | "public_relations"
        | "art_and_culture"
        | "visual_arts"
        | "performing_arts"
        | "literature"
        | "film_and_cinema"
        | "music"
        | "fashion"
        | "beauty"
        | "food_and_beverage"
        | "travel"
        | "lifestyle"
        | "home_and_garden"
        | "parenting"
        | "health_and_fitness"
        | "news"
        | "world_news"
        | "business_news"
        | "tech_news_general"
        | "science_news"
        | "android"
        | "ios"
        | "personal_finance"
        | "investing"
        | "real_estate"
        | "economics"
        | "web_development_frontend"
        | "web_development_backend"
        | "mobile_app_development"
        | "game_development"
        | "software_engineering"
        | "space"
        | "television"
        | "sports"
        | "podcasts"
        | "video"
        | "comics"
        | "gaming_general"
      feed_content_status:
        | "verified"
        | "unverified"
        | "low_quality"
        | "spam"
        | "duplicate"
        | "inappropriate"
      feed_health_status:
        | "active"
        | "error"
        | "invalid_format"
        | "not_found"
        | "timeout"
        | "rate_limited"
        | "blocked"
        | "pending_check"
      feed_language:
        | "en"
        | "ja"
        | "zh"
        | "ko"
        | "fr"
        | "es"
        | "hi"
        | "pt"
        | "bn"
        | "ru"
        | "id"
        | "de"
      member_role:
        | "admin"
        | "member"
        | "viewer"
        | "guest"
        | "owner"
        | "moderator"
        | "editor"
        | "support"
        | "external_contributor"
      notification_platform:
        | "slack"
        | "twitter"
        | "discord"
        | "line"
        | "chatwork"
        | "kakaotalk"
        | "wechat"
        | "facebook_messenger"
        | "google_chat"
        | "whatsapp"
        | "telegram"
        | "webhook"
        | "email"
      notification_schedule_type:
        | "realtime"
        | "daily_morning"
        | "daily_evening"
        | "weekday_morning"
        | "weekday_evening"
        | "weekly_monday"
        | "weekly_sunday"
        | "custom"
      notification_status:
        | "pending"
        | "success"
        | "failed"
        | "retrying"
        | "skipped"
      subscription_status: "trialing" | "active" | "past_due" | "canceled"
      translation_status:
        | "pending"
        | "processing"
        | "completed"
        | "failed"
        | "skipped"
      utc_offset:
        | "UTC+14"
        | "UTC+13"
        | "UTC+12"
        | "UTC+11"
        | "UTC+10"
        | "UTC+9"
        | "UTC+8"
        | "UTC+7"
        | "UTC+6"
        | "UTC+5"
        | "UTC+4"
        | "UTC+3"
        | "UTC+2"
        | "UTC+1"
        | "UTC+0"
        | "UTC-1"
        | "UTC-2"
        | "UTC-3"
        | "UTC-4"
        | "UTC-5"
        | "UTC-6"
        | "UTC-7"
        | "UTC-8"
        | "UTC-9"
        | "UTC-10"
        | "UTC-11"
        | "UTC-12"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

