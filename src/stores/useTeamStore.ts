
import { create } from 'zustand';
import { supabase } from '@/lib/supabaseClient';
import { RacerProfile } from '@/stores/useRacerStore';

export interface Team {
  id: string;
  name: string;
  logo_url: string;
  description: string;
  is_public: boolean;
  xp_level: number;
  xp_points: number;
  xp_tier: string;
  achievements: string;
  created_at: string;
  updated_at: string;
  platforms?: string[]; // Added this property
}

export interface TeamMember {
  id: string;
  team_id: string;
  profile_id: string;
  role: string;
  joined_at: string;
  profile?: RacerProfile;
}

type TeamState = {
  teams: Team[];
  currentTeam: Team | null;
  teamMembers: TeamMember[];
  suggestedTeams: Team[];
  isLoading: boolean;
  error: string | null;
  
  fetchTeams: () => Promise<void>;
  fetchTeamById: (id: string) => Promise<void>;
  fetchSuggestedTeams: () => Promise<void>;
  fetchTeamMembers: (teamId: string) => Promise<void>;
  createTeam: (teamData: Partial<Team>) => Promise<Team | null>;
  updateTeam: (id: string, teamData: Partial<Team>) => Promise<void>;
  joinTeam: (teamId: string, role: string) => Promise<void>;
  leaveTeam: (teamId: string) => Promise<void>;
};

// Mock data for teams
const MOCK_TEAMS: Team[] = [
  {
    id: '1',
    name: 'Apex Hunters',
    logo_url: 'https://api.dicebear.com/7.x/identicon/svg?seed=ApexHunters',
    description: 'Professional endurance racing team focused on GT3 competition',
    is_public: true,
    xp_level: 42,
    xp_points: 3200,
    xp_tier: 'platinum',
    achievements: 'Winner of 24h Nürburgring 2023, GT3 Championship runners-up',
    created_at: '2023-01-01',
    updated_at: '2023-01-01',
    platforms: ['iRacing', 'ACC'] // Added platforms
  },
  {
    id: '2',
    name: 'Drift Masters',
    logo_url: 'https://api.dicebear.com/7.x/identicon/svg?seed=DriftMasters',
    description: 'Specializing in drift competitions and exhibitions',
    is_public: true,
    xp_level: 35,
    xp_points: 2800,
    xp_tier: 'gold',
    achievements: 'Top 3 in Formula Drift Japan Series, Multiple podiums in drift events',
    created_at: '2023-02-15',
    updated_at: '2023-02-15',
    platforms: ['GT7', 'Automobilista'] // Added platforms
  },
  {
    id: '3',
    name: 'Rally Legends',
    logo_url: 'https://api.dicebear.com/7.x/identicon/svg?seed=RallyLegends',
    description: 'Dirt and rally specialists with a focus on endurance events',
    is_public: false,
    xp_level: 50,
    xp_points: 4100,
    xp_tier: 'pro',
    achievements: 'WRC-2 team champions, Multiple Dakar Rally stage wins',
    created_at: '2022-11-03',
    updated_at: '2022-11-03',
    platforms: ['Dirt Rally', 'rFactor'] // Added platforms
  }
];

export const useTeamStore = create<TeamState>((set, get) => ({
  teams: [],
  currentTeam: null,
  teamMembers: [],
  suggestedTeams: [],
  isLoading: false,
  error: null,
  
  fetchTeams: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('teams')
        .select('*');
        
      if (error) {
        console.error('Error fetching teams:', error);
        set({ error: error.message, isLoading: false });
        return;
      }

      set({ teams: data || MOCK_TEAMS, isLoading: false });
    } catch (error: any) {
      console.error('Error fetching teams:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  fetchTeamById: async (id) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching team by ID:', error);
        set({ error: error.message, isLoading: false });
        return;
      }

      set({ currentTeam: data || null, isLoading: false });
    } catch (error: any) {
      console.error('Error fetching team by ID:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  fetchTeamMembers: async (teamId) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('team_members')
        .select(`
          *,
          profile:profile_id (id, display_name, avatar_url, region, role_tags)
        `)
        .eq('team_id', teamId);

      if (error) {
        console.error('Error fetching team members:', error);
        set({ error: error.message, isLoading: false });
        return;
      }

      set({ teamMembers: data || [], isLoading: false });
    } catch (error: any) {
      console.error('Error fetching team members:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  fetchSuggestedTeams: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) {
        console.error('Error fetching suggested teams:', error);
        set({ error: error.message, isLoading: false });
        return;
      }

      set({ suggestedTeams: data || MOCK_TEAMS.slice(0, 2), isLoading: false });
    } catch (error: any) {
      console.error('Error fetching suggested teams:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  createTeam: async (teamData) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('teams')
        .insert([teamData])
        .select()
        .single();

      if (error) {
        console.error('Error creating team:', error);
        set({ error: error.message, isLoading: false });
        return null;
      }
      
      // Add creator as a team manager
      const { error: memberError } = await supabase
        .from('team_members')
        .insert([{
          team_id: data.id,
          profile_id: (await supabase.auth.getUser()).data.user?.id,
          role: 'manager'
        }]);
        
      if (memberError) {
        console.error('Error adding team member:', memberError);
      }

      // Update the teams list
      set(state => ({
        teams: [...state.teams, data],
        currentTeam: data,
        isLoading: false
      }));
      
      return data;
    } catch (error: any) {
      console.error('Error creating team:', error);
      set({ error: error.message, isLoading: false });
      return null;
    }
  },

  updateTeam: async (id, teamData) => {
    try {
      set({ isLoading: true, error: null });
      
      const { error } = await supabase
        .from('teams')
        .update(teamData)
        .eq('id', id);

      if (error) {
        console.error('Error updating team:', error);
        set({ error: error.message, isLoading: false });
        return;
      }

      // Update the team in state
      set(state => ({
        teams: state.teams.map(team => 
          team.id === id ? { ...team, ...teamData } : team
        ),
        currentTeam: state.currentTeam && state.currentTeam.id === id 
          ? { ...state.currentTeam, ...teamData }
          : state.currentTeam,
        isLoading: false
      }));
    } catch (error: any) {
      console.error('Error updating team:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  joinTeam: async (teamId, role) => {
    try {
      set({ isLoading: true, error: null });
      
      const { error } = await supabase
        .from('team_members')
        .insert([{
          team_id: teamId,
          profile_id: (await supabase.auth.getUser()).data.user?.id,
          role
        }]);

      if (error) {
        console.error('Error joining team:', error);
        set({ error: error.message, isLoading: false });
        return;
      }
      
      // Refresh team members
      await get().fetchTeamMembers(teamId);
      set({ isLoading: false });
    } catch (error: any) {
      console.error('Error joining team:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  leaveTeam: async (teamId) => {
    try {
      set({ isLoading: true, error: null });
      
      const { error } = await supabase
        .from('team_members')
        .delete()
        .match({ 
          team_id: teamId,
          profile_id: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) {
        console.error('Error leaving team:', error);
        set({ error: error.message, isLoading: false });
        return;
      }
      
      // Refresh team members
      await get().fetchTeamMembers(teamId);
      set({ isLoading: false });
    } catch (error: any) {
      console.error('Error leaving team:', error);
      set({ error: error.message, isLoading: false });
    }
  }
}));
