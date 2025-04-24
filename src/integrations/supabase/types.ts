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
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          disciplines:
            | Database["public"]["Enums"]["driving_discipline"][]
            | null
          driving_styles: Database["public"]["Enums"]["driving_style"][] | null
          id: string
          onboarding_complete: boolean | null
          preferred_roles: Database["public"]["Enums"]["team_role"][] | null
          sim_platforms: Database["public"]["Enums"]["sim_platform"][] | null
          skill_level: Database["public"]["Enums"]["skill_level"] | null
          timezone: string | null
          updated_at: string
          username: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          disciplines?:
            | Database["public"]["Enums"]["driving_discipline"][]
            | null
          driving_styles?: Database["public"]["Enums"]["driving_style"][] | null
          id: string
          onboarding_complete?: boolean | null
          preferred_roles?: Database["public"]["Enums"]["team_role"][] | null
          sim_platforms?: Database["public"]["Enums"]["sim_platform"][] | null
          skill_level?: Database["public"]["Enums"]["skill_level"] | null
          timezone?: string | null
          updated_at?: string
          username: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          disciplines?:
            | Database["public"]["Enums"]["driving_discipline"][]
            | null
          driving_styles?: Database["public"]["Enums"]["driving_style"][] | null
          id?: string
          onboarding_complete?: boolean | null
          preferred_roles?: Database["public"]["Enums"]["team_role"][] | null
          sim_platforms?: Database["public"]["Enums"]["sim_platform"][] | null
          skill_level?: Database["public"]["Enums"]["skill_level"] | null
          timezone?: string | null
          updated_at?: string
          username?: string
        }
        Relationships: []
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
          created_at: string
          id: string
          logo_url: string | null
          name: string
          owner_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name: string
          owner_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name?: string
          owner_id?: string
          updated_at?: string
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
