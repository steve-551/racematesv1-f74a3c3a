
import { create } from 'zustand';
import { supabase } from '@/lib/supabaseClient';

// Define types for better TypeScript support
export type XpTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'pro';
export type LicenseClass = 'rookie' | 'D' | 'C' | 'B' | 'A' | 'pro' | 'black';
export type Platform = 'iRacing' | 'F1' | 'ACC' | 'GT7' | 'rFactor' | 'Automobilista' | 'RaceRoom';
export type RoleTag = 'Driver' | 'Strategist' | 'Team Manager' | 'Endurance Pro' | 'Sprint Specialist' | 'Coach';

interface RacerStats {
  irating: number | null;
  sr: number | null;
  licence: LicenseClass | null;
  tt: number | null;
  starts?: number;
  wins?: number;
  top5?: number;
  avg_finish?: number;
}

export interface Racer {
  id: string;
  display_name: string;
  avatar_url: string;
  region: string;
  timezone: string;
  platforms: Platform[];
  driving_styles: string[];
  role_tags: RoleTag[];
  xp_level: number;
  xp_points: number;
  xp_tier: XpTier;
  sim_platforms: string[];
  reputation: number;
  preferred_roles: string[];
  looking_for_team: boolean;
  // New fields
  full_name?: string;
  age?: number;
  bio?: string;
  career_summary?: string;
  achievements?: string;
  future_goals?: string;
  favorite_disciplines?: string[];
  favorite_car_types?: string[];
  series_focus?: string[];
  commitment_level?: string;
  availability_hours?: number;
  // Stats by discipline
  statsByDiscipline: {
    road: RacerStats;
    oval: RacerStats;
    dirt_oval: RacerStats;
    dirt_road: RacerStats;
    rx: RacerStats;
  };
}

interface RacerFilter {
  iRatingRange?: [number, number];
  platforms?: Platform[];
  drivingStyles?: string[];
  roleTags?: RoleTag[];
  region?: string;
  lookingForTeam?: boolean;
}

interface RacerStore {
  currentRacer: Racer | null;
  recommendedRacers: Racer[] | null;
  allRacers: Racer[] | null;
  filteredRacers: Racer[] | null;
  filters: RacerFilter;
  isLoading: boolean;
  error: string | null;
  mockMode: boolean;
  
  // Method definitions
  fetchRacerById: (id: string) => Promise<void>;
  fetchCurrentRacerProfile: () => Promise<void>;
  fetchRecommendedRacers: () => Promise<void>;
  fetchAllRacers: () => Promise<void>;
  updateRacerProfile: (profileData: any) => Promise<void>;
  toggleLookingForTeam: (value: boolean) => Promise<void>;
  setFilter: (filter: Partial<RacerFilter>) => void;
  resetFilters: () => void;
  applyFilters: () => void;
}

export const useRacerStore = create<RacerStore>((set, get) => ({
  currentRacer: null,
  recommendedRacers: null,
  allRacers: null,
  filteredRacers: null,
  filters: {},
  isLoading: false,
  error: null,
  mockMode: true, // Set to true for now until we have real data

  fetchRacerById: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const { mockMode } = get();

      if (mockMode) {
        const mockRacer = MOCK_RACERS.find((r) => r.id === id);
        if (mockRacer) {
          set({ currentRacer: mockRacer, isLoading: false });
        }
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id, 
          username as display_name,
          avatar_url,
          region,
          timezone,
          sim_platforms as platforms,
          driving_styles,
          preferred_roles as role_tags,
          xp_level,
          xp_points,
          xp_tier,
          reputation,
          looking_for_team,
          full_name,
          age,
          bio,
          career_summary,
          achievements,
          future_goals,
          favorite_disciplines,
          favorite_car_types,
          series_focus,
          commitment_level,
          availability_hours,
          road_stats,
          oval_stats,
          dirt_oval_stats,
          dirt_road_stats
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Failed to fetch racer:', error.message);
        set({ error: error.message, isLoading: false });
        return;
      }

      // Map the DB structure to our frontend structure
      const mappedRacer: Racer = {
        id: data.id,
        display_name: data.display_name || 'Unknown Racer',
        avatar_url: data.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default',
        region: data.region || 'Unknown',
        timezone: data.timezone || 'UTC',
        platforms: data.platforms || [],
        driving_styles: data.driving_styles || [],
        role_tags: (data.role_tags || []) as RoleTag[],
        xp_level: data.xp_level || 1,
        xp_points: data.xp_points || 0,
        xp_tier: (data.xp_tier || 'bronze') as XpTier,
        sim_platforms: data.platforms || [],
        reputation: data.reputation || 0,
        preferred_roles: data.role_tags || [],
        looking_for_team: data.looking_for_team || false,
        full_name: data.full_name,
        age: data.age,
        bio: data.bio,
        career_summary: data.career_summary,
        achievements: data.achievements,
        future_goals: data.future_goals,
        favorite_disciplines: data.favorite_disciplines,
        favorite_car_types: data.favorite_car_types,
        series_focus: data.series_focus,
        commitment_level: data.commitment_level,
        availability_hours: data.availability_hours,
        statsByDiscipline: {
          road: data.road_stats || { irating: null, sr: null, licence: null, tt: null },
          oval: data.oval_stats || { irating: null, sr: null, licence: null, tt: null },
          dirt_oval: data.dirt_oval_stats || { irating: null, sr: null, licence: null, tt: null },
          dirt_road: data.dirt_road_stats || { irating: null, sr: null, licence: null, tt: null },
          rx: { irating: null, sr: null, licence: null, tt: null } // RX stats not yet in DB
        }
      };

      set({ currentRacer: mappedRacer, isLoading: false });
    } catch (error) {
      console.error('Unexpected error in fetchRacerById:', error);
      set({ error: 'An unexpected error occurred', isLoading: false });
    }
  },

  fetchCurrentRacerProfile: async () => {
    try {
      set({ isLoading: true, error: null });
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        console.error('Unable to fetch user profile:', error?.message);
        set({ error: error?.message || 'User not found', isLoading: false });
        return;
      }

      await get().fetchRacerById(user.id);
    } catch (error) {
      console.error('Unexpected error in fetchCurrentRacerProfile:', error);
      set({ error: 'An unexpected error occurred', isLoading: false });
    }
  },

  fetchRecommendedRacers: async () => {
    try {
      set({ isLoading: true, error: null });
      const { mockMode } = get();

      if (mockMode) {
        // Return first 3 mock racers as recommendations
        set({ recommendedRacers: MOCK_RACERS.slice(0, 3), isLoading: false });
        return;
      }

      // For a real implementation, we would fetch data from Supabase here
      set({ recommendedRacers: MOCK_RACERS.slice(0, 3), isLoading: false });
    } catch (error) {
      console.error('Unexpected error in fetchRecommendedRacers:', error);
      set({ error: 'An unexpected error occurred', isLoading: false });
    }
  },

  fetchAllRacers: async () => {
    try {
      set({ isLoading: true, error: null });
      const { mockMode } = get();

      if (mockMode) {
        set({ allRacers: MOCK_RACERS, filteredRacers: MOCK_RACERS, isLoading: false });
        return;
      }

      // For a real implementation, we would fetch data from Supabase here
      set({ allRacers: MOCK_RACERS, filteredRacers: MOCK_RACERS, isLoading: false });
    } catch (error) {
      console.error('Unexpected error in fetchAllRacers:', error);
      set({ error: 'An unexpected error occurred', isLoading: false });
    }
  },

  updateRacerProfile: async (profileData) => {
    try {
      set({ isLoading: true, error: null });
      const { currentRacer } = get();

      if (!currentRacer) {
        set({ error: 'No racer profile found to update', isLoading: false });
        return;
      }

      // Convert display_name to username for the database
      const { display_name, ...otherData } = profileData;
      const dataToUpdate = {
        username: display_name,
        ...otherData
      };

      const { error } = await supabase
        .from('profiles')
        .update(dataToUpdate)
        .eq('id', currentRacer.id);

      if (error) {
        console.error('Failed to update racer profile:', error.message);
        set({ error: error.message, isLoading: false });
        return;
      }

      // Refresh the racer profile
      await get().fetchRacerById(currentRacer.id);
    } catch (error) {
      console.error('Unexpected error in updateRacerProfile:', error);
      set({ error: 'An unexpected error occurred', isLoading: false });
    }
  },

  toggleLookingForTeam: async (value) => {
    try {
      set({ isLoading: true, error: null });
      const { currentRacer } = get();

      if (!currentRacer) {
        set({ error: 'No racer profile found', isLoading: false });
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({ looking_for_team: value })
        .eq('id', currentRacer.id);

      if (error) {
        console.error('Failed to toggle looking for team status:', error.message);
        set({ error: error.message, isLoading: false });
        return;
      }

      // Update the local state
      set({
        currentRacer: { ...currentRacer, looking_for_team: value },
        isLoading: false
      });
    } catch (error) {
      console.error('Unexpected error in toggleLookingForTeam:', error);
      set({ error: 'An unexpected error occurred', isLoading: false });
    }
  },

  setFilter: (filter) => {
    set((state) => ({
      filters: { ...state.filters, ...filter }
    }));
  },

  resetFilters: () => {
    set((state) => ({
      filters: {},
      filteredRacers: state.allRacers
    }));
  },

  applyFilters: () => {
    const { allRacers, filters } = get();

    if (!allRacers) return;

    let filtered = [...allRacers];

    // Filter by iRating range
    if (filters.iRatingRange && Array.isArray(filters.iRatingRange) && filters.iRatingRange.length === 2) {
      filtered = filtered.filter(racer => {
        const iRating = racer.statsByDiscipline.road.irating;
        return iRating !== null &&
          iRating >= filters.iRatingRange![0] &&
          iRating <= filters.iRatingRange![1];
      });
    }

    // Filter by platforms
    if (filters.platforms && filters.platforms.length > 0) {
      filtered = filtered.filter(racer => 
        racer.platforms.some(platform => filters.platforms!.includes(platform))
      );
    }

    // Filter by driving styles
    if (filters.drivingStyles && filters.drivingStyles.length > 0) {
      filtered = filtered.filter(racer => 
        racer.driving_styles.some(style => filters.drivingStyles!.includes(style))
      );
    }

    // Filter by role tags
    if (filters.roleTags && filters.roleTags.length > 0) {
      filtered = filtered.filter(racer => 
        racer.role_tags.some(tag => filters.roleTags!.includes(tag))
      );
    }

    // Filter by region
    if (filters.region) {
      filtered = filtered.filter(racer => racer.region === filters.region);
    }

    // Filter by looking for team
    if (filters.lookingForTeam !== undefined) {
      filtered = filtered.filter(racer => racer.looking_for_team === filters.lookingForTeam);
    }

    set({ filteredRacers: filtered });
  }
}));

// ✅ Mock data fallback
const MOCK_RACERS: Racer[] = [
  {
    id: '1',
    display_name: 'SpeedRacer',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SpeedRacer',
    region: 'North America',
    timezone: 'EST',
    platforms: ['iRacing', 'ACC'],
    driving_styles: ['Endurance', 'GT3'],
    role_tags: ['Driver', 'Endurance Pro'],
    xp_level: 24,
    xp_points: 2345,
    xp_tier: 'gold',
    sim_platforms: ['iRacing', 'ACC'],
    reputation: 87,
    preferred_roles: ['Driver'],
    looking_for_team: true,
    full_name: 'Michael Johnson',
    age: 28,
    bio: 'Passionate racer with 5+ years of competitive sim racing experience',
    career_summary: 'Started racing in 2018, competed in multiple endurance events',
    achievements: '2nd place in 24h of Spa 2022, GT3 championship runner-up',
    future_goals: 'Win a major endurance event, join a professional sim racing team',
    favorite_disciplines: ['GT3', 'Endurance'],
    favorite_car_types: ['Ferrari 488 GT3', 'Porsche 911 RSR'],
    series_focus: ['VRS GT World Championship', 'Special Events'],
    commitment_level: 'High',
    availability_hours: 20,
    statsByDiscipline: {
      road: { irating: 2345, sr: 3.75, licence: 'A', tt: 1800, starts: 156, wins: 12, top5: 45, avg_finish: 5.6 },
      oval: { irating: 1900, sr: 2.9, licence: 'C', tt: 1100, starts: 35, wins: 2, top5: 8, avg_finish: 10.3 },
      dirt_oval: { irating: 0, sr: 0, licence: 'rookie', tt: 0, starts: 0, wins: 0, top5: 0, avg_finish: 0 },
      dirt_road: { irating: 0, sr: 0, licence: 'rookie', tt: 0, starts: 0, wins: 0, top5: 0, avg_finish: 0 },
      rx: { irating: 0, sr: 0, licence: 'rookie', tt: 0, starts: 0, wins: 0, top5: 0, avg_finish: 0 },
    },
  },
  {
    id: '2',
    display_name: 'DriftKing',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DriftKing',
    region: 'Europe',
    timezone: 'CET',
    platforms: ['F1', 'GT7'],
    driving_styles: ['Sprint', 'F1'],
    role_tags: ['Driver', 'Sprint Specialist'],
    xp_level: 18,
    xp_points: 1800,
    xp_tier: 'silver',
    sim_platforms: ['F1', 'GT7'],
    reputation: 92,
    preferred_roles: ['Driver'],
    looking_for_team: false,
    full_name: 'Lars Petersen',
    age: 24,
    bio: 'Formula racing specialist with focus on sprint events',
    career_summary: 'European competition specialist since 2020',
    achievements: 'F1 league champion 2023, Multiple podiums in sprint series',
    future_goals: 'Enter Formula E esports competition',
    favorite_disciplines: ['F1', 'Open Wheel'],
    favorite_car_types: ['F1', 'Indycar'],
    series_focus: ['F1 Grand Prix Series', 'GT Sprint Series'],
    commitment_level: 'Medium',
    availability_hours: 15,
    statsByDiscipline: {
      road: { irating: 3100, sr: 4.2, licence: 'A', tt: 2200, starts: 203, wins: 31, top5: 89, avg_finish: 4.2 },
      oval: { irating: 1200, sr: 2.1, licence: 'D', tt: 900, starts: 17, wins: 0, top5: 3, avg_finish: 12.7 },
      dirt_oval: { irating: 0, sr: 0, licence: 'rookie', tt: 0, starts: 0, wins: 0, top5: 0, avg_finish: 0 },
      dirt_road: { irating: 2400, sr: 3.5, licence: 'B', tt: 1950, starts: 42, wins: 5, top5: 18, avg_finish: 6.3 },
      rx: { irating: 0, sr: 0, licence: 'rookie', tt: 0, starts: 0, wins: 0, top5: 0, avg_finish: 0 },
    },
  },
  {
    id: '3',
    display_name: 'RallyMaster',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=RallyMaster',
    region: 'Oceania',
    timezone: 'AEST',
    platforms: ['rFactor', 'Automobilista'],
    driving_styles: ['Rally', 'Dirt'],
    role_tags: ['Driver', 'Team Manager'],
    xp_level: 31,
    xp_points: 3150,
    xp_tier: 'platinum',
    sim_platforms: ['rFactor', 'Automobilista'],
    reputation: 95,
    preferred_roles: ['Driver', 'Team Manager'],
    looking_for_team: true,
    full_name: 'Jack Williams',
    age: 32,
    bio: 'Rally and off-road specialist with team management experience',
    career_summary: 'Started in circuit racing, moved to rally in 2019',
    achievements: 'Rally championship wins, Dirt Rally 2.0 tournament finalist',
    future_goals: 'Build a competitive rally team, mentor new drivers',
    favorite_disciplines: ['Rally', 'RallyCross', 'Off-road'],
    favorite_car_types: ['WRC', 'Rally Cross'],
    series_focus: ['Dirt Rally Championship', 'Off-road Events'],
    commitment_level: 'High',
    availability_hours: 25,
    statsByDiscipline: {
      road: { irating: 1800, sr: 3.0, licence: 'B', tt: 1650, starts: 87, wins: 4, top5: 21, avg_finish: 8.2 },
      oval: { irating: 0, sr: 0, licence: 'rookie', tt: 0, starts: 0, wins: 0, top5: 0, avg_finish: 0 },
      dirt_oval: { irating: 2700, sr: 4.5, licence: 'A', tt: 2500, starts: 124, wins: 22, top5: 67, avg_finish: 5.4 },
      dirt_road: { irating: 3500, sr: 4.99, licence: 'A', tt: 3200, starts: 218, wins: 47, top5: 112, avg_finish: 3.8 },
      rx: { irating: 2900, sr: 4.2, licence: 'A', tt: 2600, starts: 87, wins: 14, top5: 43, avg_finish: 4.7 },
    },
  }
];
