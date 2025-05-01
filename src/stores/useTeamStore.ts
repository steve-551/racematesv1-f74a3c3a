
import { create } from 'zustand';
import { supabase } from '@/lib/supabaseClient';
import { Racer } from '@/stores/useRacerStore';
import { toast } from 'sonner';

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
  platforms?: string[];
  owner_id?: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  profile_id: string;
  role: string;
  joined_at: string;
  profile?: Racer;
}

export interface TeamEvent {
  id: string;
  team_id: string;
  creator_id: string;
  title: string;
  description: string | null;
  event_type: string;
  start_time: string;
  end_time: string;
  created_at: string;
  updated_at: string;
}

type TeamState = {
  teams: Team[];
  currentTeam: Team | null;
  teamMembers: TeamMember[];
  teamEvents: TeamEvent[];
  suggestedTeams: Team[];
  isLoading: boolean;
  error: string | null;
  
  fetchTeams: () => Promise<void>;
  fetchTeamById: (id: string) => Promise<void>;
  fetchTeamMembers: (teamId: string) => Promise<void>;
  fetchTeamEvents: (teamId: string) => Promise<void>;
  fetchSuggestedTeams: () => Promise<void>;
  createTeam: (teamData: Partial<Team>) => Promise<Team | null>;
  updateTeam: (id: string, teamData: Partial<Team>) => Promise<void>;
  createTeamEvent: (eventData: Partial<TeamEvent>) => Promise<TeamEvent | null>;
  updateTeamEvent: (id: string, eventData: Partial<TeamEvent>) => Promise<void>;
  deleteTeamEvent: (id: string) => Promise<void>;
  addTeamMember: (teamId: string, profileId: string, role: string) => Promise<void>;
  removeTeamMember: (teamMemberId: string) => Promise<void>;
  joinTeam: (teamId: string, role: string) => Promise<void>;
  leaveTeam: (teamId: string) => Promise<void>;
};

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
    platforms: ['iRacing', 'ACC'],
    owner_id: 'current-user'
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
    platforms: ['GT7', 'Automobilista']
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
    platforms: ['Dirt Rally', 'rFactor']
  }
];

// Mock team members data
const MOCK_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'tm-1',
    team_id: '1',
    profile_id: 'current-user',
    role: 'Owner',
    joined_at: '2023-01-01T00:00:00Z',
    profile: {
      id: 'current-user',
      display_name: 'Current User',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CurrentUser'
    } as Racer
  },
  {
    id: 'tm-2',
    team_id: '1',
    profile_id: 'user-1',
    role: 'Driver',
    joined_at: '2023-01-02T00:00:00Z',
    profile: {
      id: 'user-1',
      display_name: 'Alex Johnson',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'
    } as Racer
  }
];

// Mock team events data
const MOCK_TEAM_EVENTS: TeamEvent[] = [
  {
    id: 'event-1',
    team_id: '1',
    creator_id: 'current-user',
    title: 'Weekly Team Practice',
    description: 'Regular practice session for the upcoming endurance race',
    event_type: 'practice',
    start_time: '2023-06-10T18:00:00Z',
    end_time: '2023-06-10T20:00:00Z',
    created_at: '2023-06-01T12:00:00Z',
    updated_at: '2023-06-01T12:00:00Z'
  }
];

export const useTeamStore = create<TeamState>((set, get) => ({
  teams: [],
  currentTeam: null,
  teamMembers: [],
  teamEvents: [],
  suggestedTeams: [],
  isLoading: false,
  error: null,
  
  fetchTeams: async () => {
    try {
      set({ isLoading: true, error: null });
      
      // Use mock data as workaround for Supabase errors
      set({ teams: MOCK_TEAMS, isLoading: false });
      
    } catch (error: any) {
      console.error('Error fetching teams:', error);
      set({ error: error.message, isLoading: false });
      // Use mock data as fallback
      set({ teams: MOCK_TEAMS, isLoading: false });
    }
  },

  fetchTeamById: async (id) => {
    try {
      set({ isLoading: true, error: null });
      
      // Find team from mock data
      const team = MOCK_TEAMS.find(team => team.id === id);
      set({ currentTeam: team || null, isLoading: false });
      
      // Also fetch team members and events when fetching a team
      if (team) {
        const teamMembers = MOCK_TEAM_MEMBERS.filter(member => member.team_id === id);
        const teamEvents = MOCK_TEAM_EVENTS.filter(event => event.team_id === id);
        set({ teamMembers, teamEvents });
      }
      
    } catch (error: any) {
      console.error('Error fetching team by ID:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  fetchTeamMembers: async (teamId) => {
    try {
      set({ isLoading: true, error: null });
      
      // Use mock team members 
      const teamMembers = MOCK_TEAM_MEMBERS.filter(member => member.team_id === teamId);
      set({ teamMembers, isLoading: false });
      
    } catch (error: any) {
      console.error('Error fetching team members:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  fetchTeamEvents: async (teamId) => {
    try {
      set({ isLoading: true, error: null });
      
      // Use mock team events
      const teamEvents = MOCK_TEAM_EVENTS.filter(event => event.team_id === teamId);
      set({ teamEvents, isLoading: false });
      
    } catch (error: any) {
      console.error('Error fetching team events:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  fetchSuggestedTeams: async () => {
    try {
      set({ isLoading: true, error: null });
      
      // Use mock data for suggested teams
      set({ suggestedTeams: MOCK_TEAMS.slice(0, 2), isLoading: false });
      
    } catch (error: any) {
      console.error('Error fetching suggested teams:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  createTeam: async (teamData) => {
    try {
      set({ isLoading: true, error: null });
      
      // Create a mock team instead of using Supabase
      const newTeam: Team = {
        id: `mock-${Date.now()}`,
        name: teamData.name || 'New Team',
        logo_url: `https://api.dicebear.com/7.x/identicon/svg?seed=${teamData.name}`,
        description: teamData.description || '',
        is_public: teamData.is_public !== undefined ? teamData.is_public : true,
        xp_level: 1,
        xp_points: 0,
        xp_tier: 'bronze',
        achievements: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        platforms: teamData.platforms || [],
        owner_id: 'current-user'
      };

      // Add the new team to state
      set(state => ({
        teams: [...state.teams, newTeam],
        currentTeam: newTeam,
        isLoading: false
      }));
      
      // Also create a team member entry for the creator
      const newTeamMember: TeamMember = {
        id: `tm-${Date.now()}`,
        team_id: newTeam.id,
        profile_id: 'current-user',
        role: 'Owner',
        joined_at: new Date().toISOString(),
        profile: {
          id: 'current-user',
          display_name: 'Current User',
          avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CurrentUser'
        } as Racer
      };
      
      set(state => ({
        teamMembers: [...state.teamMembers, newTeamMember]
      }));
      
      toast.success('Team created successfully!');
      return newTeam;
      
    } catch (error: any) {
      console.error('Error creating team:', error);
      set({ error: error.message, isLoading: false });
      toast.error('Failed to create team');
      return null;
    }
  },

  updateTeam: async (id, teamData) => {
    try {
      set({ isLoading: true, error: null });
      
      // Update team in local state
      set(state => ({
        teams: state.teams.map(team => 
          team.id === id ? { ...team, ...teamData } : team
        ),
        currentTeam: state.currentTeam && state.currentTeam.id === id 
          ? { ...state.currentTeam, ...teamData }
          : state.currentTeam,
        isLoading: false
      }));
      
      toast.success('Team updated successfully!');
      
    } catch (error: any) {
      console.error('Error updating team:', error);
      set({ error: error.message, isLoading: false });
      toast.error('Failed to update team');
    }
  },

  createTeamEvent: async (eventData) => {
    try {
      set({ isLoading: true, error: null });
      
      const newEvent: TeamEvent = {
        id: `mock-event-${Date.now()}`,
        team_id: eventData.team_id || '',
        creator_id: 'current-user',
        title: eventData.title || 'New Event',
        description: eventData.description || null,
        event_type: eventData.event_type || 'practice',
        start_time: eventData.start_time || new Date().toISOString(),
        end_time: eventData.end_time || new Date(Date.now() + 3600000).toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      set(state => ({
        teamEvents: [...state.teamEvents, newEvent],
        isLoading: false
      }));
      
      toast.success('Event created successfully!');
      return newEvent;
      
    } catch (error: any) {
      console.error('Error creating team event:', error);
      set({ error: error.message, isLoading: false });
      toast.error('Failed to create event');
      return null;
    }
  },

  updateTeamEvent: async (id, eventData) => {
    try {
      set({ isLoading: true, error: null });
      
      set(state => ({
        teamEvents: state.teamEvents.map(event => 
          event.id === id ? { ...event, ...eventData } : event
        ),
        isLoading: false
      }));
      
      toast.success('Event updated successfully!');
      
    } catch (error: any) {
      console.error('Error updating team event:', error);
      set({ error: error.message, isLoading: false });
      toast.error('Failed to update event');
    }
  },

  deleteTeamEvent: async (id) => {
    try {
      set({ isLoading: true, error: null });
      
      set(state => ({
        teamEvents: state.teamEvents.filter(event => event.id !== id),
        isLoading: false
      }));
      
      toast.success('Event deleted successfully!');
      
    } catch (error: any) {
      console.error('Error deleting team event:', error);
      set({ error: error.message, isLoading: false });
      toast.error('Failed to delete event');
    }
  },

  addTeamMember: async (teamId, profileId, role) => {
    try {
      set({ isLoading: true, error: null });
      
      const newMember: TeamMember = {
        id: `mock-member-${Date.now()}`,
        team_id: teamId,
        profile_id: profileId,
        role: role,
        joined_at: new Date().toISOString()
      };
      
      set(state => ({
        teamMembers: [...state.teamMembers, newMember],
        isLoading: false
      }));
      
      toast.success('Team member added successfully!');
      
    } catch (error: any) {
      console.error('Error adding team member:', error);
      set({ error: error.message, isLoading: false });
      toast.error('Failed to add team member');
    }
  },

  removeTeamMember: async (teamMemberId) => {
    try {
      set({ isLoading: true, error: null });
      
      set(state => ({
        teamMembers: state.teamMembers.filter(member => member.id !== teamMemberId),
        isLoading: false
      }));
      
      toast.success('Team member removed successfully!');
      
    } catch (error: any) {
      console.error('Error removing team member:', error);
      set({ error: error.message, isLoading: false });
      toast.error('Failed to remove team member');
    }
  },

  joinTeam: async (teamId, role) => {
    try {
      set({ isLoading: true, error: null });
      
      // Mock joining a team
      const newMember: TeamMember = {
        id: `mock-member-${Date.now()}`,
        team_id: teamId,
        profile_id: 'current-user',
        role: role,
        joined_at: new Date().toISOString()
      };
      
      set(state => ({
        teamMembers: [...state.teamMembers, newMember],
        isLoading: false
      }));
      
      toast.success('Joined team successfully!');
      
    } catch (error: any) {
      console.error('Error joining team:', error);
      set({ error: error.message, isLoading: false });
      toast.error('Failed to join team');
    }
  },

  leaveTeam: async (teamId) => {
    try {
      set({ isLoading: true, error: null });
      
      set(state => ({
        teamMembers: state.teamMembers.filter(
          member => !(member.team_id === teamId && member.profile_id === 'current-user')
        ),
        isLoading: false
      }));
      
      toast.success('Left team successfully!');
      
    } catch (error: any) {
      console.error('Error leaving team:', error);
      set({ error: error.message, isLoading: false });
      toast.error('Failed to leave team');
    }
  }
}));
