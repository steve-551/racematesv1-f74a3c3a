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
