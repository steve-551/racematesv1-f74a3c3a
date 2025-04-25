
import { create } from 'zustand';
import { RacerProfile } from './useRacerStore';

export interface Team {
  id: string;
  name: string;
  logo_url: string;
  description: string;
  platforms: string[];
  region: string;
  member_count: number;
  is_recruiting: boolean;
  xp_level: number;
  xp_points: number;
  xp_tier: string;
  reputation: number;
  members: {
    racer_id: string;
    role: string;
    joined_at: string;
  }[];
  created_at: string;
}

type TeamState = {
  teams: Team[];
  currentTeam: Team | null;
  suggestedTeams: Team[];
  fetchTeams: () => Promise<void>;
  fetchTeamById: (id: string) => Promise<void>;
  fetchSuggestedTeams: () => Promise<void>;
};

// Mock data for teams
const MOCK_TEAMS: Team[] = [
  {
    id: '1',
    name: 'Apex Hunters',
    logo_url: 'https://api.dicebear.com/7.x/identicon/svg?seed=ApexHunters',
    description: 'Professional endurance racing team focused on GT3 competition',
    platforms: ['iRacing', 'ACC'],
    region: 'North America',
    member_count: 8,
    is_recruiting: true,
    xp_level: 42,
    xp_points: 3200,
    xp_tier: 'platinum',
    reputation: 92,
    members: [
      {
        racer_id: '1',
        role: 'Team Manager',
        joined_at: '2023-01-01'
      },
      {
        racer_id: '2',
        role: 'Driver',
        joined_at: '2023-01-15'
      }
    ],
    created_at: '2023-01-01'
  },
  {
    id: '2',
    name: 'Drift Masters',
    logo_url: 'https://api.dicebear.com/7.x/identicon/svg?seed=DriftMasters',
    description: 'Specializing in drift competitions and exhibitions',
    platforms: ['F1', 'GT7'],
    region: 'Europe',
    member_count: 5,
    is_recruiting: true,
    xp_level: 35,
    xp_points: 2800,
    xp_tier: 'gold',
    reputation: 85,
    members: [],
    created_at: '2023-02-15'
  },
  {
    id: '3',
    name: 'Rally Legends',
    logo_url: 'https://api.dicebear.com/7.x/identicon/svg?seed=RallyLegends',
    description: 'Dirt and rally specialists with a focus on endurance events',
    platforms: ['rFactor', 'RaceRoom'],
    region: 'Global',
    member_count: 12,
    is_recruiting: false,
    xp_level: 50,
    xp_points: 4100,
    xp_tier: 'pro',
    reputation: 97,
    members: [],
    created_at: '2022-11-03'
  }
];

export const useTeamStore = create<TeamState>((set, get) => ({
  teams: MOCK_TEAMS,
  currentTeam: null,
  suggestedTeams: [],
  
  fetchTeams: async () => {
    try {
      // In a real app, this would be a Supabase query
      set({ teams: MOCK_TEAMS });
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  },

  fetchTeamById: async (id) => {
    try {
      // In a real app, this would query Supabase
      const team = MOCK_TEAMS.find(t => t.id === id) || null;
      if (team) {
        set({ currentTeam: team });
      }
    } catch (error) {
      console.error('Error fetching team by ID:', error);
    }
  },

  fetchSuggestedTeams: async () => {
    try {
      // In a real app, this would use more sophisticated recommendations
      // Based on the user's profile, region, platforms, etc.
      const suggestedTeams = MOCK_TEAMS.filter(team => team.is_recruiting).slice(0, 2);
      set({ suggestedTeams });
    } catch (error) {
      console.error('Error fetching suggested teams:', error);
    }
  }
}));
