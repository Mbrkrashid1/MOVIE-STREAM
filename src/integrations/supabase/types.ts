export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      ad_impressions: {
        Row: {
          ad_id: string
          completed: boolean | null
          content_id: string | null
          created_at: string | null
          id: string
          placement_type: string
          user_id: string | null
          watched_seconds: number | null
        }
        Insert: {
          ad_id: string
          completed?: boolean | null
          content_id?: string | null
          created_at?: string | null
          id?: string
          placement_type: string
          user_id?: string | null
          watched_seconds?: number | null
        }
        Update: {
          ad_id?: string
          completed?: boolean | null
          content_id?: string | null
          created_at?: string | null
          id?: string
          placement_type?: string
          user_id?: string | null
          watched_seconds?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ad_impressions_ad_id_fkey"
            columns: ["ad_id"]
            isOneToOne: false
            referencedRelation: "ads"
            referencedColumns: ["id"]
          },
        ]
      }
      ad_placements: {
        Row: {
          ad_id: string
          content_id: string
          created_at: string | null
          id: string
          placement_type: string
          time_offset: number | null
        }
        Insert: {
          ad_id: string
          content_id: string
          created_at?: string | null
          id?: string
          placement_type: string
          time_offset?: number | null
        }
        Update: {
          ad_id?: string
          content_id?: string
          created_at?: string | null
          id?: string
          placement_type?: string
          time_offset?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ad_placements_ad_id_fkey"
            columns: ["ad_id"]
            isOneToOne: false
            referencedRelation: "ads"
            referencedColumns: ["id"]
          },
        ]
      }
      ads: {
        Row: {
          created_at: string | null
          cta_text: string | null
          cta_url: string | null
          description: string | null
          duration: number | null
          id: string
          is_skippable: boolean | null
          skip_after_seconds: number | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          video_url: string
        }
        Insert: {
          created_at?: string | null
          cta_text?: string | null
          cta_url?: string | null
          description?: string | null
          duration?: number | null
          id?: string
          is_skippable?: boolean | null
          skip_after_seconds?: number | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          video_url: string
        }
        Update: {
          created_at?: string | null
          cta_text?: string | null
          cta_url?: string | null
          description?: string | null
          duration?: number | null
          id?: string
          is_skippable?: boolean | null
          skip_after_seconds?: number | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          video_url?: string
        }
        Relationships: []
      }
      advertiser_profiles: {
        Row: {
          business_type: string | null
          company_name: string
          created_at: string
          id: string
          total_spend: number | null
          updated_at: string
          user_id: string
          verification_status: string
        }
        Insert: {
          business_type?: string | null
          company_name: string
          created_at?: string
          id?: string
          total_spend?: number | null
          updated_at?: string
          user_id: string
          verification_status?: string
        }
        Update: {
          business_type?: string | null
          company_name?: string
          created_at?: string
          id?: string
          total_spend?: number | null
          updated_at?: string
          user_id?: string
          verification_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "advertiser_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_participants: {
        Row: {
          chat_room_id: string
          id: string
          joined_at: string
          last_read_at: string | null
          user_id: string
        }
        Insert: {
          chat_room_id: string
          id?: string
          joined_at?: string
          last_read_at?: string | null
          user_id: string
        }
        Update: {
          chat_room_id?: string
          id?: string
          joined_at?: string
          last_read_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_participants_chat_room_id_fkey"
            columns: ["chat_room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_rooms: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          movie_id: string | null
          name: string | null
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          movie_id?: string | null
          name?: string | null
          type?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          movie_id?: string | null
          name?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_rooms_movie_id_fkey"
            columns: ["movie_id"]
            isOneToOne: false
            referencedRelation: "content"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          comment: string
          content_id: string
          created_at: string
          id: string
          user_id: string | null
          username: string
        }
        Insert: {
          comment: string
          content_id: string
          created_at?: string
          id?: string
          user_id?: string | null
          username: string
        }
        Update: {
          comment?: string
          content_id?: string
          created_at?: string
          id?: string
          user_id?: string | null
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "content"
            referencedColumns: ["id"]
          },
        ]
      }
      content: {
        Row: {
          backdrop_url: string | null
          category: string
          created_at: string | null
          description: string | null
          duration: number | null
          id: string
          is_featured: boolean | null
          is_sample: boolean | null
          language: string | null
          release_year: number | null
          thumbnail_url: string | null
          title: string
          type: string
          updated_at: string | null
          video_url: string
          views: number | null
        }
        Insert: {
          backdrop_url?: string | null
          category: string
          created_at?: string | null
          description?: string | null
          duration?: number | null
          id?: string
          is_featured?: boolean | null
          is_sample?: boolean | null
          language?: string | null
          release_year?: number | null
          thumbnail_url?: string | null
          title: string
          type: string
          updated_at?: string | null
          video_url: string
          views?: number | null
        }
        Update: {
          backdrop_url?: string | null
          category?: string
          created_at?: string | null
          description?: string | null
          duration?: number | null
          id?: string
          is_featured?: boolean | null
          is_sample?: boolean | null
          language?: string | null
          release_year?: number | null
          thumbnail_url?: string | null
          title?: string
          type?: string
          updated_at?: string | null
          video_url?: string
          views?: number | null
        }
        Relationships: []
      }
      creator_earnings: {
        Row: {
          amount_naira: number
          created_at: string
          creator_id: string
          date: string
          description: string | null
          earning_type: string
          id: string
          status: string | null
          video_id: string | null
        }
        Insert: {
          amount_naira: number
          created_at?: string
          creator_id: string
          date?: string
          description?: string | null
          earning_type: string
          id?: string
          status?: string | null
          video_id?: string | null
        }
        Update: {
          amount_naira?: number
          created_at?: string
          creator_id?: string
          date?: string
          description?: string | null
          earning_type?: string
          id?: string
          status?: string | null
          video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "creator_earnings_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "creator_earnings_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_profiles: {
        Row: {
          channel_description: string | null
          channel_name: string | null
          created_at: string
          id: string
          kyc_documents: Json | null
          kyc_status: string
          monetization_enabled: boolean | null
          subscriber_count: number | null
          total_views: number | null
          total_watch_time_minutes: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          channel_description?: string | null
          channel_name?: string | null
          created_at?: string
          id?: string
          kyc_documents?: Json | null
          kyc_status?: string
          monetization_enabled?: boolean | null
          subscriber_count?: number | null
          total_views?: number | null
          total_watch_time_minutes?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          channel_description?: string | null
          channel_name?: string | null
          created_at?: string
          id?: string
          kyc_documents?: Json | null
          kyc_status?: string
          monetization_enabled?: boolean | null
          subscriber_count?: number | null
          total_views?: number | null
          total_watch_time_minutes?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "creator_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      episodes: {
        Row: {
          created_at: string | null
          duration: number | null
          episode_number: number
          id: string
          season_number: number
          series_id: string
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          video_url: string
          views: number | null
        }
        Insert: {
          created_at?: string | null
          duration?: number | null
          episode_number: number
          id?: string
          season_number?: number
          series_id: string
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          video_url: string
          views?: number | null
        }
        Update: {
          created_at?: string | null
          duration?: number | null
          episode_number?: number
          id?: string
          season_number?: number
          series_id?: string
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          video_url?: string
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "episodes_series_id_fkey"
            columns: ["series_id"]
            isOneToOne: false
            referencedRelation: "content"
            referencedColumns: ["id"]
          },
        ]
      }
      friendships: {
        Row: {
          created_at: string
          friend_id: string
          id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          friend_id: string
          id?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          friend_id?: string
          id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          audio_url: string | null
          chat_room_id: string
          content: string
          created_at: string
          id: string
          message_type: string
          movie_reference_id: string | null
          sender_id: string
          updated_at: string
        }
        Insert: {
          audio_url?: string | null
          chat_room_id: string
          content: string
          created_at?: string
          id?: string
          message_type?: string
          movie_reference_id?: string | null
          sender_id: string
          updated_at?: string
        }
        Update: {
          audio_url?: string | null
          chat_room_id?: string
          content?: string
          created_at?: string
          id?: string
          message_type?: string
          movie_reference_id?: string | null
          sender_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_chat_room_id_fkey"
            columns: ["chat_room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_movie_reference_id_fkey"
            columns: ["movie_reference_id"]
            isOneToOne: false
            referencedRelation: "content"
            referencedColumns: ["id"]
          },
        ]
      }
      payout_requests: {
        Row: {
          admin_notes: string | null
          amount_naira: number
          creator_id: string
          id: string
          payment_details: Json
          payment_method: string
          processed_at: string | null
          requested_at: string
          status: string | null
          transaction_reference: string | null
        }
        Insert: {
          admin_notes?: string | null
          amount_naira: number
          creator_id: string
          id?: string
          payment_details: Json
          payment_method: string
          processed_at?: string | null
          requested_at?: string
          status?: string | null
          transaction_reference?: string | null
        }
        Update: {
          admin_notes?: string | null
          amount_naira?: number
          creator_id?: string
          id?: string
          payment_details?: Json
          payment_method?: string
          processed_at?: string | null
          requested_at?: string
          status?: string | null
          transaction_reference?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payout_requests_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_settings: {
        Row: {
          description: string | null
          id: string
          setting_key: string
          setting_value: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          description?: string | null
          id?: string
          setting_key: string
          setting_value: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          description?: string | null
          id?: string
          setting_key?: string
          setting_value?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "platform_settings_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          id: string
          is_online: boolean | null
          last_seen: string | null
          updated_at: string
          user_role: Database["public"]["Enums"]["user_role"] | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          is_online?: boolean | null
          last_seen?: string | null
          updated_at?: string
          user_role?: Database["public"]["Enums"]["user_role"] | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          is_online?: boolean | null
          last_seen?: string | null
          updated_at?: string
          user_role?: Database["public"]["Enums"]["user_role"] | null
          username?: string | null
        }
        Relationships: []
      }
      video_analytics: {
        Row: {
          ad_revenue_naira: number | null
          cpm_rate: number | null
          created_at: string
          date: string
          id: string
          impressions: number | null
          video_id: string
          views: number | null
          watch_time_minutes: number | null
        }
        Insert: {
          ad_revenue_naira?: number | null
          cpm_rate?: number | null
          created_at?: string
          date: string
          id?: string
          impressions?: number | null
          video_id: string
          views?: number | null
          watch_time_minutes?: number | null
        }
        Update: {
          ad_revenue_naira?: number | null
          cpm_rate?: number | null
          created_at?: string
          date?: string
          id?: string
          impressions?: number | null
          video_id?: string
          views?: number | null
          watch_time_minutes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "video_analytics_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      videos: {
        Row: {
          category: string
          comment_count: number | null
          created_at: string
          creator_id: string
          description: string | null
          duration_seconds: number | null
          id: string
          language: string | null
          like_count: number | null
          monetization_enabled: boolean | null
          status: string | null
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          upload_date: string
          video_url: string
          view_count: number | null
          watch_time_minutes: number | null
        }
        Insert: {
          category: string
          comment_count?: number | null
          created_at?: string
          creator_id: string
          description?: string | null
          duration_seconds?: number | null
          id?: string
          language?: string | null
          like_count?: number | null
          monetization_enabled?: boolean | null
          status?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          upload_date?: string
          video_url: string
          view_count?: number | null
          watch_time_minutes?: number | null
        }
        Update: {
          category?: string
          comment_count?: number | null
          created_at?: string
          creator_id?: string
          description?: string | null
          duration_seconds?: number | null
          id?: string
          language?: string | null
          like_count?: number | null
          monetization_enabled?: boolean | null
          status?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          upload_date?: string
          video_url?: string
          view_count?: number | null
          watch_time_minutes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "videos_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: "creator" | "viewer" | "advertiser" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["creator", "viewer", "advertiser", "admin"],
    },
  },
} as const
