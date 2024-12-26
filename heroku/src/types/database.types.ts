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
      rss_feeds: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          language: Database["public"]["Enums"]["feed_language"]
          last_fetched_at: string | null
          name: string
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          language?: Database["public"]["Enums"]["feed_language"]
          last_fetched_at?: string | null
          name: string
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          language?: Database["public"]["Enums"]["feed_language"]
          last_fetched_at?: string | null
          name?: string
          updated_at?: string
          url?: string
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
    }
    Views: {
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
      translation_status:
        | "pending"
        | "processing"
        | "completed"
        | "failed"
        | "skipped"
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

