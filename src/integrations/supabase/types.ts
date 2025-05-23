export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      availability_slots: {
        Row: {
          created_at: string | null
          day_of_week: string | null
          end_time: string | null
          id: string
          start_time: string | null
          timezone: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          day_of_week?: string | null
          end_time?: string | null
          id?: string
          start_time?: string | null
          timezone?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          day_of_week?: string | null
          end_time?: string | null
          id?: string
          start_time?: string | null
          timezone?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "availability_slots_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          chat_room_id: string
          created_at: string
          id: string
          is_pinned: boolean
          message: string
          sender_id: string
          updated_at: string
        }
        Insert: {
          chat_room_id: string
          created_at?: string
          id?: string
          is_pinned?: boolean
          message: string
          sender_id: string
          updated_at?: string
        }
        Update: {
          chat_room_id?: string
          created_at?: string
          id?: string
          is_pinned?: boolean
          message?: string
          sender_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_chat_room_id_fkey"
            columns: ["chat_room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_read_status: {
        Row: {
          chat_room_id: string
          created_at: string
          id: string
          last_read_message_id: string | null
          profile_id: string
          updated_at: string
        }
        Insert: {
          chat_room_id: string
          created_at?: string
          id?: string
          last_read_message_id?: string | null
          profile_id: string
          updated_at?: string
        }
        Update: {
          chat_room_id?: string
          created_at?: string
          id?: string
          last_read_message_id?: string | null
          profile_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_read_status_chat_room_id_fkey"
            columns: ["chat_room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_read_status_last_read_message_id_fkey"
            columns: ["last_read_message_id"]
            isOneToOne: false
            referencedRelation: "chat_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_read_status_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_rooms: {
        Row: {
          created_at: string
          id: string
          room_type: string
          team_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          room_type: string
          team_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          room_type?: string
          team_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_rooms_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      direct_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          read_at: string | null
          recipient_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          read_at?: string | null
          recipient_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          read_at?: string | null
          recipient_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "direct_messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "direct_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      driver_availability: {
        Row: {
          created_at: string
          end_time: string
          event_id: string
          id: string
          profile_id: string
          start_time: string
        }
        Insert: {
          created_at?: string
          end_time: string
          event_id: string
          id?: string
          profile_id: string
          start_time: string
        }
        Update: {
          created_at?: string
          end_time?: string
          event_id?: string
          id?: string
          profile_id?: string
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "driver_availability_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "driver_availability_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      event_rsvps: {
        Row: {
          created_at: string
          event_id: string
          id: string
          profile_id: string
          role: string
          status: string
          team_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          profile_id: string
          role?: string
          status: string
          team_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          profile_id?: string
          role?: string
          status?: string
          team_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_rsvps_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_rsvps_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_rsvps_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          car_class: string
          created_at: string
          creator_id: string
          description: string | null
          end_time: string | null
          estimated_duration: number | null
          id: string
          race_format: string
          sim_platform: Database["public"]["Enums"]["sim_platform"]
          start_time: string
          team_id: string | null
          title: string
          updated_at: string
          visibility: string
        }
        Insert: {
          car_class: string
          created_at?: string
          creator_id: string
          description?: string | null
          end_time?: string | null
          estimated_duration?: number | null
          id?: string
          race_format: string
          sim_platform: Database["public"]["Enums"]["sim_platform"]
          start_time: string
          team_id?: string | null
          title: string
          updated_at?: string
          visibility?: string
        }
        Update: {
          car_class?: string
          created_at?: string
          creator_id?: string
          description?: string | null
          end_time?: string | null
          estimated_duration?: number | null
          id?: string
          race_format?: string
          sim_platform?: Database["public"]["Enums"]["sim_platform"]
          start_time?: string
          team_id?: string | null
          title?: string
          updated_at?: string
          visibility?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      friends: {
        Row: {
          created_at: string
          id: string
          receiver_id: string
          sender_id: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          receiver_id: string
          sender_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          receiver_id?: string
          sender_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "friends_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friends_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      friendships: {
        Row: {
          addressee_id: string
          created_at: string
          id: string
          requestor_id: string
          status: string
          updated_at: string
        }
        Insert: {
          addressee_id: string
          created_at?: string
          id?: string
          requestor_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          addressee_id?: string
          created_at?: string
          id?: string
          requestor_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "friendships_addressee_id_fkey"
            columns: ["addressee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friendships_requestor_id_fkey"
            columns: ["requestor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      iracing_ratings: {
        Row: {
          discipline: Database["public"]["Enums"]["discipline_type"]
          id: string
          irating: number | null
          licence_class: Database["public"]["Enums"]["licence_class"] | null
          profile_id: string
          safety_rating: number | null
          time_trial_rating: number | null
        }
        Insert: {
          discipline: Database["public"]["Enums"]["discipline_type"]
          id?: string
          irating?: number | null
          licence_class?: Database["public"]["Enums"]["licence_class"] | null
          profile_id: string
          safety_rating?: number | null
          time_trial_rating?: number | null
        }
        Update: {
          discipline?: Database["public"]["Enums"]["discipline_type"]
          id?: string
          irating?: number | null
          licence_class?: Database["public"]["Enums"]["licence_class"] | null
          profile_id?: string
          safety_rating?: number | null
          time_trial_rating?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "iracing_ratings_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notice_board_posts: {
        Row: {
          author_id: string
          category: string
          content: string
          created_at: string
          expires_at: string | null
          id: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          category: string
          content: string
          created_at?: string
          expires_at?: string | null
          id?: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          category?: string
          content?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notice_board_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notice_board_replies: {
        Row: {
          author_id: string
          content: string
          created_at: string
          id: string
          post_id: string
          updated_at: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          id?: string
          post_id: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          id?: string
          post_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notice_board_replies_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notice_board_replies_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "notice_board_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          content: string | null
          created_at: string
          id: string
          is_read: boolean
          recipient_id: string
          reference_id: string | null
          reference_type: string | null
          title: string
          type: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          recipient_id: string
          reference_id?: string | null
          reference_type?: string | null
          title: string
          type: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          recipient_id?: string
          reference_id?: string | null
          reference_type?: string | null
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      private_chat_participants: {
        Row: {
          chat_room_id: string
          created_at: string
          id: string
          profile_id: string
        }
        Insert: {
          chat_room_id: string
          created_at?: string
          id?: string
          profile_id: string
        }
        Update: {
          chat_room_id?: string
          created_at?: string
          id?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "private_chat_participants_chat_room_id_fkey"
            columns: ["chat_room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "private_chat_participants_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          achievements: string | null
          age: number | null
          availability_hours: number | null
          avatar_url: string | null
          bio: string | null
          career_summary: string | null
          commitment_level: string | null
          cover_url: string | null
          created_at: string
          dirt_oval_stats: Json | null
          dirt_road_stats: Json | null
          disciplines:
            | Database["public"]["Enums"]["driving_discipline"][]
            | null
          display_name: string | null
          driving_styles:
            | Database["public"]["Enums"]["driving_style_enum"][]
            | null
          favorite_car_types: string[] | null
          favorite_disciplines: string[] | null
          formula_car_stats: Json | null
          full_name: string | null
          future_goals: string | null
          id: string
          iracing_stats: Json | null
          irating_dirt_oval: number | null
          irating_dirt_road: number | null
          irating_oval: number | null
          irating_road: number | null
          irating_rx: number | null
          licence_dirt_oval: string | null
          licence_dirt_road: string | null
          licence_oval: string | null
          licence_road: string | null
          licence_rx: string | null
          looking_for_team: boolean | null
          onboarding_complete: boolean | null
          oval_stats: Json | null
          platforms: string[] | null
          preferred_roles: Database["public"]["Enums"]["team_role"][] | null
          region: string | null
          reputation: number | null
          road_stats: Json | null
          role_tags: string[] | null
          series_focus: string[] | null
          sim_platforms: Database["public"]["Enums"]["sim_platform"][] | null
          skill_level: Database["public"]["Enums"]["skill_level"] | null
          sports_car_stats: Json | null
          sr_dirt_oval: number | null
          sr_dirt_road: number | null
          sr_oval: number | null
          sr_road: number | null
          sr_rx: number | null
          statsByDiscipline: Json | null
          timezone: string | null
          ttrating_dirt_oval: number | null
          ttrating_dirt_road: number | null
          ttrating_oval: number | null
          ttrating_road: number | null
          ttrating_rx: number | null
          updated_at: string
          username: string
          xp_level: number | null
          xp_points: number | null
          xp_tier: string | null
        }
        Insert: {
          achievements?: string | null
          age?: number | null
          availability_hours?: number | null
          avatar_url?: string | null
          bio?: string | null
          career_summary?: string | null
          commitment_level?: string | null
          cover_url?: string | null
          created_at?: string
          dirt_oval_stats?: Json | null
          dirt_road_stats?: Json | null
          disciplines?:
            | Database["public"]["Enums"]["driving_discipline"][]
            | null
          display_name?: string | null
          driving_styles?:
            | Database["public"]["Enums"]["driving_style_enum"][]
            | null
          favorite_car_types?: string[] | null
          favorite_disciplines?: string[] | null
          formula_car_stats?: Json | null
          full_name?: string | null
          future_goals?: string | null
          id: string
          iracing_stats?: Json | null
          irating_dirt_oval?: number | null
          irating_dirt_road?: number | null
          irating_oval?: number | null
          irating_road?: number | null
          irating_rx?: number | null
          licence_dirt_oval?: string | null
          licence_dirt_road?: string | null
          licence_oval?: string | null
          licence_road?: string | null
          licence_rx?: string | null
          looking_for_team?: boolean | null
          onboarding_complete?: boolean | null
          oval_stats?: Json | null
          platforms?: string[] | null
          preferred_roles?: Database["public"]["Enums"]["team_role"][] | null
          region?: string | null
          reputation?: number | null
          road_stats?: Json | null
          role_tags?: string[] | null
          series_focus?: string[] | null
          sim_platforms?: Database["public"]["Enums"]["sim_platform"][] | null
          skill_level?: Database["public"]["Enums"]["skill_level"] | null
          sports_car_stats?: Json | null
          sr_dirt_oval?: number | null
          sr_dirt_road?: number | null
          sr_oval?: number | null
          sr_road?: number | null
          sr_rx?: number | null
          statsByDiscipline?: Json | null
          timezone?: string | null
          ttrating_dirt_oval?: number | null
          ttrating_dirt_road?: number | null
          ttrating_oval?: number | null
          ttrating_road?: number | null
          ttrating_rx?: number | null
          updated_at?: string
          username: string
          xp_level?: number | null
          xp_points?: number | null
          xp_tier?: string | null
        }
        Update: {
          achievements?: string | null
          age?: number | null
          availability_hours?: number | null
          avatar_url?: string | null
          bio?: string | null
          career_summary?: string | null
          commitment_level?: string | null
          cover_url?: string | null
          created_at?: string
          dirt_oval_stats?: Json | null
          dirt_road_stats?: Json | null
          disciplines?:
            | Database["public"]["Enums"]["driving_discipline"][]
            | null
          display_name?: string | null
          driving_styles?:
            | Database["public"]["Enums"]["driving_style_enum"][]
            | null
          favorite_car_types?: string[] | null
          favorite_disciplines?: string[] | null
          formula_car_stats?: Json | null
          full_name?: string | null
          future_goals?: string | null
          id?: string
          iracing_stats?: Json | null
          irating_dirt_oval?: number | null
          irating_dirt_road?: number | null
          irating_oval?: number | null
          irating_road?: number | null
          irating_rx?: number | null
          licence_dirt_oval?: string | null
          licence_dirt_road?: string | null
          licence_oval?: string | null
          licence_road?: string | null
          licence_rx?: string | null
          looking_for_team?: boolean | null
          onboarding_complete?: boolean | null
          oval_stats?: Json | null
          platforms?: string[] | null
          preferred_roles?: Database["public"]["Enums"]["team_role"][] | null
          region?: string | null
          reputation?: number | null
          road_stats?: Json | null
          role_tags?: string[] | null
          series_focus?: string[] | null
          sim_platforms?: Database["public"]["Enums"]["sim_platform"][] | null
          skill_level?: Database["public"]["Enums"]["skill_level"] | null
          sports_car_stats?: Json | null
          sr_dirt_oval?: number | null
          sr_dirt_road?: number | null
          sr_oval?: number | null
          sr_road?: number | null
          sr_rx?: number | null
          statsByDiscipline?: Json | null
          timezone?: string | null
          ttrating_dirt_oval?: number | null
          ttrating_dirt_road?: number | null
          ttrating_oval?: number | null
          ttrating_road?: number | null
          ttrating_rx?: number | null
          updated_at?: string
          username?: string
          xp_level?: number | null
          xp_points?: number | null
          xp_tier?: string | null
        }
        Relationships: []
      }
      race_strategies: {
        Row: {
          created_at: string
          description: string | null
          event_id: string
          fuel_strategy: string | null
          id: string
          pit_strategy: string | null
          qualifying_strategy: string | null
          team_id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          event_id: string
          fuel_strategy?: string | null
          id?: string
          pit_strategy?: string | null
          qualifying_strategy?: string | null
          team_id: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          event_id?: string
          fuel_strategy?: string | null
          id?: string
          pit_strategy?: string | null
          qualifying_strategy?: string | null
          team_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "race_strategies_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "team_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "race_strategies_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      racer_matches: {
        Row: {
          created_at: string | null
          id: string
          match_percentage: number | null
          match_status: string
          matched_profile_id: string | null
          profile_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          match_percentage?: number | null
          match_status?: string
          matched_profile_id?: string | null
          profile_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          match_percentage?: number | null
          match_status?: string
          matched_profile_id?: string | null
          profile_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "racer_matches_matched_profile_id_fkey"
            columns: ["matched_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "racer_matches_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reputation: {
        Row: {
          created_at: string | null
          event_id: string | null
          id: string
          notes: string | null
          rating: string
          reviewer_id: string | null
          target_user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          notes?: string | null
          rating: string
          reviewer_id?: string | null
          target_user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          notes?: string | null
          rating?: string
          reviewer_id?: string | null
          target_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reputation_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reputation_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reputation_target_user_id_fkey"
            columns: ["target_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      setup_comments: {
        Row: {
          comment: string
          created_at: string
          id: string
          profile_id: string
          setup_id: string
          updated_at: string
        }
        Insert: {
          comment: string
          created_at?: string
          id?: string
          profile_id: string
          setup_id: string
          updated_at?: string
        }
        Update: {
          comment?: string
          created_at?: string
          id?: string
          profile_id?: string
          setup_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "setup_comments_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "setup_comments_setup_id_fkey"
            columns: ["setup_id"]
            isOneToOne: false
            referencedRelation: "setups"
            referencedColumns: ["id"]
          },
        ]
      }
      setup_files: {
        Row: {
          created_at: string
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id: string
          setup_id: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id?: string
          setup_id: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          setup_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "setup_files_setup_id_fkey"
            columns: ["setup_id"]
            isOneToOne: false
            referencedRelation: "setups"
            referencedColumns: ["id"]
          },
        ]
      }
      setup_reactions: {
        Row: {
          created_at: string
          id: string
          profile_id: string
          reaction_type: string
          setup_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          profile_id: string
          reaction_type: string
          setup_id: string
        }
        Update: {
          created_at?: string
          id?: string
          profile_id?: string
          reaction_type?: string
          setup_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "setup_reactions_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "setup_reactions_setup_id_fkey"
            columns: ["setup_id"]
            isOneToOne: false
            referencedRelation: "setups"
            referencedColumns: ["id"]
          },
        ]
      }
      setup_shares: {
        Row: {
          created_at: string
          id: string
          profile_id: string
          setup_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          profile_id: string
          setup_id: string
        }
        Update: {
          created_at?: string
          id?: string
          profile_id?: string
          setup_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "setup_shares_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "setup_shares_setup_id_fkey"
            columns: ["setup_id"]
            isOneToOne: false
            referencedRelation: "setups"
            referencedColumns: ["id"]
          },
        ]
      }
      setups: {
        Row: {
          car_model: string
          created_at: string
          description: string | null
          id: string
          owner_id: string
          setup_data: string | null
          sim_platform: Database["public"]["Enums"]["sim_platform"]
          team_id: string | null
          title: string
          track_name: string
          updated_at: string
          visibility: string
        }
        Insert: {
          car_model: string
          created_at?: string
          description?: string | null
          id?: string
          owner_id: string
          setup_data?: string | null
          sim_platform: Database["public"]["Enums"]["sim_platform"]
          team_id?: string | null
          title: string
          track_name: string
          updated_at?: string
          visibility?: string
        }
        Update: {
          car_model?: string
          created_at?: string
          description?: string | null
          id?: string
          owner_id?: string
          setup_data?: string | null
          sim_platform?: Database["public"]["Enums"]["sim_platform"]
          team_id?: string | null
          title?: string
          track_name?: string
          updated_at?: string
          visibility?: string
        }
        Relationships: [
          {
            foreignKeyName: "setups_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "setups_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      stint_schedules: {
        Row: {
          created_at: string
          event_id: string
          id: string
          team_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          team_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          team_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "stint_schedules_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "team_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stint_schedules_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      stints: {
        Row: {
          color: string | null
          created_at: string
          driver_id: string
          end_time: string
          event_id: string
          id: string
          start_time: string
          team_id: string
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          driver_id: string
          end_time: string
          event_id: string
          id?: string
          start_time: string
          team_id: string
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          driver_id?: string
          end_time?: string
          event_id?: string
          id?: string
          start_time?: string
          team_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "stints_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stints_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stints_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_chats: {
        Row: {
          content: string
          created_at: string
          id: string
          sender_id: string
          team_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          sender_id: string
          team_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          sender_id?: string
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_chats_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_chats_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_events: {
        Row: {
          created_at: string
          creator_id: string
          description: string | null
          end_time: string
          event_type: string
          id: string
          start_time: string
          team_id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          creator_id: string
          description?: string | null
          end_time: string
          event_type: string
          id?: string
          start_time: string
          team_id: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          creator_id?: string
          description?: string | null
          end_time?: string
          event_type?: string
          id?: string
          start_time?: string
          team_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_events_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_events_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_invites: {
        Row: {
          created_at: string | null
          id: string
          invited_by_user_id: string | null
          invited_user_id: string | null
          message: string | null
          responded_at: string | null
          status: string | null
          team_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          invited_by_user_id?: string | null
          invited_user_id?: string | null
          message?: string | null
          responded_at?: string | null
          status?: string | null
          team_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          invited_by_user_id?: string | null
          invited_user_id?: string | null
          message?: string | null
          responded_at?: string | null
          status?: string | null
          team_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_invites_invited_by_user_id_fkey"
            columns: ["invited_by_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_invites_invited_user_id_fkey"
            columns: ["invited_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_invites_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          id: string
          joined_at: string
          profile_id: string
          role: Database["public"]["Enums"]["team_role"]
          team_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          profile_id: string
          role: Database["public"]["Enums"]["team_role"]
          team_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          profile_id?: string
          role?: Database["public"]["Enums"]["team_role"]
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          achievements: string | null
          created_at: string
          description: string | null
          id: string
          is_public: boolean | null
          logo_url: string | null
          name: string
          owner_id: string
          platforms: string[] | null
          updated_at: string
          xp_level: number | null
          xp_points: number | null
          xp_tier: string | null
        }
        Insert: {
          achievements?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          logo_url?: string | null
          name: string
          owner_id: string
          platforms?: string[] | null
          updated_at?: string
          xp_level?: number | null
          xp_points?: number | null
          xp_tier?: string | null
        }
        Update: {
          achievements?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          logo_url?: string | null
          name?: string
          owner_id?: string
          platforms?: string[] | null
          updated_at?: string
          xp_level?: number | null
          xp_points?: number | null
          xp_tier?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teams_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_tags: {
        Row: {
          created_at: string | null
          id: string
          tag: string
          tag_type: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          tag: string
          tag_type?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          tag?: string
          tag_type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_tags_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_xp: {
        Row: {
          created_at: string
          id: string
          profile_id: string
          total_xp: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          profile_id: string
          total_xp?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          profile_id?: string
          total_xp?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_xp_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          available_now: boolean | null
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          driving_styles: string[] | null
          email: string | null
          full_name: string | null
          id: string
          irating_dirt_oval: number | null
          irating_dirt_road: number | null
          irating_oval: number | null
          irating_road: number | null
          irating_rx: number | null
          is_onboarded: boolean | null
          level: number | null
          licence_dirt_oval: string | null
          licence_dirt_road: string | null
          licence_oval: string | null
          licence_road: string | null
          licence_rx: string | null
          looking_for_team: boolean | null
          platforms: string[] | null
          region: string | null
          sr_dirt_oval: number | null
          sr_dirt_road: number | null
          sr_oval: number | null
          sr_road: number | null
          sr_rx: number | null
          team_roles: string[] | null
          thumbs_down: number | null
          thumbs_up: number | null
          timezone: string | null
          ttrating_dirt_oval: number | null
          ttrating_dirt_road: number | null
          ttrating_oval: number | null
          ttrating_road: number | null
          ttrating_rx: number | null
          updated_at: string | null
          username: string
          xp: number | null
        }
        Insert: {
          available_now?: boolean | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          driving_styles?: string[] | null
          email?: string | null
          full_name?: string | null
          id: string
          irating_dirt_oval?: number | null
          irating_dirt_road?: number | null
          irating_oval?: number | null
          irating_road?: number | null
          irating_rx?: number | null
          is_onboarded?: boolean | null
          level?: number | null
          licence_dirt_oval?: string | null
          licence_dirt_road?: string | null
          licence_oval?: string | null
          licence_road?: string | null
          licence_rx?: string | null
          looking_for_team?: boolean | null
          platforms?: string[] | null
          region?: string | null
          sr_dirt_oval?: number | null
          sr_dirt_road?: number | null
          sr_oval?: number | null
          sr_road?: number | null
          sr_rx?: number | null
          team_roles?: string[] | null
          thumbs_down?: number | null
          thumbs_up?: number | null
          timezone?: string | null
          ttrating_dirt_oval?: number | null
          ttrating_dirt_road?: number | null
          ttrating_oval?: number | null
          ttrating_road?: number | null
          ttrating_rx?: number | null
          updated_at?: string | null
          username: string
          xp?: number | null
        }
        Update: {
          available_now?: boolean | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          driving_styles?: string[] | null
          email?: string | null
          full_name?: string | null
          id?: string
          irating_dirt_oval?: number | null
          irating_dirt_road?: number | null
          irating_oval?: number | null
          irating_road?: number | null
          irating_rx?: number | null
          is_onboarded?: boolean | null
          level?: number | null
          licence_dirt_oval?: string | null
          licence_dirt_road?: string | null
          licence_oval?: string | null
          licence_road?: string | null
          licence_rx?: string | null
          looking_for_team?: boolean | null
          platforms?: string[] | null
          region?: string | null
          sr_dirt_oval?: number | null
          sr_dirt_road?: number | null
          sr_oval?: number | null
          sr_road?: number | null
          sr_rx?: number | null
          team_roles?: string[] | null
          thumbs_down?: number | null
          thumbs_up?: number | null
          timezone?: string | null
          ttrating_dirt_oval?: number | null
          ttrating_dirt_road?: number | null
          ttrating_oval?: number | null
          ttrating_road?: number | null
          ttrating_rx?: number | null
          updated_at?: string | null
          username?: string
          xp?: number | null
        }
        Relationships: []
      }
      xp_actions: {
        Row: {
          action_type: string
          created_at: string
          description: string
          id: string
          xp_value: number
        }
        Insert: {
          action_type: string
          created_at?: string
          description: string
          id?: string
          xp_value: number
        }
        Update: {
          action_type?: string
          created_at?: string
          description?: string
          id?: string
          xp_value?: number
        }
        Relationships: []
      }
      xp_history: {
        Row: {
          action_type: string | null
          amount: number | null
          created_at: string | null
          description: string | null
          id: string
          related_event_id: string | null
          related_setup_id: string | null
          user_id: string | null
        }
        Insert: {
          action_type?: string | null
          amount?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          related_event_id?: string | null
          related_setup_id?: string | null
          user_id?: string | null
        }
        Update: {
          action_type?: string | null
          amount?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          related_event_id?: string | null
          related_setup_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "xp_history_related_event_id_fkey"
            columns: ["related_event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "xp_history_related_setup_id_fkey"
            columns: ["related_setup_id"]
            isOneToOne: false
            referencedRelation: "setups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "xp_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      xp_transactions: {
        Row: {
          action_id: string
          created_at: string
          id: string
          profile_id: string
          reference_id: string | null
          reference_type: string | null
          xp_amount: number
        }
        Insert: {
          action_id: string
          created_at?: string
          id?: string
          profile_id: string
          reference_id?: string | null
          reference_type?: string | null
          xp_amount: number
        }
        Update: {
          action_id?: string
          created_at?: string
          id?: string
          profile_id?: string
          reference_id?: string | null
          reference_type?: string | null
          xp_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "xp_transactions_action_id_fkey"
            columns: ["action_id"]
            isOneToOne: false
            referencedRelation: "xp_actions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "xp_transactions_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
      discipline_type: "Road" | "Oval" | "DirtOval" | "DirtRoad" | "RallyX"
      driving_discipline:
        | "GT3"
        | "GT4"
        | "LMP"
        | "F1"
        | "NASCAR"
        | "Oval"
        | "RallyX"
        | "Dirt"
        | "Touring"
        | "Endurance"
      driving_style:
        | "Clean"
        | "Aggressive"
        | "Strategic"
        | "Defensive"
        | "Consistent"
        | "Quick"
        | "Methodical"
      driving_style_enum: "strategic" | "clean" | "consistent"
      licence_class: "Rookie" | "D" | "C" | "B" | "A" | "Pro" | "Pro WC"
      sim_platform:
        | "iRacing"
        | "ACC"
        | "GT7"
        | "rFactor"
        | "F1"
        | "Automobilista"
        | "RaceRoom"
      skill_level:
        | "Beginner"
        | "Intermediate"
        | "Advanced"
        | "Expert"
        | "Pro"
        | "Pro WC"
      team_role: "Driver" | "Strategist" | "Manager" | "Coach" | "Engineer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      discipline_type: ["Road", "Oval", "DirtOval", "DirtRoad", "RallyX"],
      driving_discipline: [
        "GT3",
        "GT4",
        "LMP",
        "F1",
        "NASCAR",
        "Oval",
        "RallyX",
        "Dirt",
        "Touring",
        "Endurance",
      ],
      driving_style: [
        "Clean",
        "Aggressive",
        "Strategic",
        "Defensive",
        "Consistent",
        "Quick",
        "Methodical",
      ],
      driving_style_enum: ["strategic", "clean", "consistent"],
      licence_class: ["Rookie", "D", "C", "B", "A", "Pro", "Pro WC"],
      sim_platform: [
        "iRacing",
        "ACC",
        "GT7",
        "rFactor",
        "F1",
        "Automobilista",
        "RaceRoom",
      ],
      skill_level: [
        "Beginner",
        "Intermediate",
        "Advanced",
        "Expert",
        "Pro",
        "Pro WC",
      ],
      team_role: ["Driver", "Strategist", "Manager", "Coach", "Engineer"],
    },
  },
} as const
