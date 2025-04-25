
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
}

interface Racer {
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
  mockMode: false,

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
          irating_road, sr_road, licence_road, ttrating_road,
          irating_oval, sr_oval, licence_oval, ttrating_oval,
          irating_dirt_oval, sr_dirt_oval, licence_dirt_oval, ttrating_dirt_oval,
          irating_dirt_road, sr_dirt_road, licence_dirt_road, ttrating_dirt_road,
          irating_rx, sr_rx, licence_rx, ttrating_rx
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Failed to fetch racer:', error.message);
        set({ error: error.message, isLoading: false });
        return;
      }

      const mappedStatsByDiscipline = {
        road: {
          irating: data.irating_road,
          sr: data.sr_road,
          licence: data.licence_road as LicenseClass | null,
          tt: data.ttrating_road,
        },
        oval: {
          irating: data.irating_oval,
          sr: data.sr_oval,
          licence: data.licence_oval as LicenseClass | null,
          tt: data.ttrating_oval,
        },
        dirt_oval: {
          irating: data.irating_dirt_oval,
          sr: data.sr_dirt_oval,
          licence: data.licence_dirt_oval as LicenseClass | null,
          tt: data.ttrating_dirt_oval,
        },
        dirt_road: {
          irating: data.irating_dirt_road,
          sr: data.sr_dirt_road,
          licence: data.licence_dirt_road as LicenseClass | null,
          tt: data.ttrating_dirt_road,
        },
        rx: {
          irating: data.irating_rx,
          sr: data.sr_rx,
          licence: data.licence_rx as LicenseClass | null,
          tt: data.ttrating_rx,
        },
      };

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
        reputation: data.reputation || 0,
        looking_for_team: data.looking_for_team || false,
        statsByDiscipline: mappedStatsByDiscipline,
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
          reputation,
          looking_for_team
        `)
        .limit(5);

      if (error) {
        console.error('Failed to fetch recommended racers:', error.message);
        set({ error: error.message, isLoading: false });
        return;
      }

      const recommendedRacers = data.map(racer => ({
        id: racer.id,
        display_name: racer.display_name || 'Unknown Racer',
        avatar_url: racer.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default',
        region: racer.region || 'Unknown',
        timezone: racer.timezone || 'UTC',
        platforms: racer.platforms || [],
        driving_styles: racer.driving_styles || [],
        role_tags: (racer.role_tags || []) as RoleTag[],
        xp_level: 0,
        xp_points: 0,
        xp_tier: 'bronze' as XpTier,
        reputation: racer.reputation || 0,
        looking_for_team: racer.looking_for_team || false,
        statsByDiscipline: {
          road: { irating: null, sr: null, licence: null, tt: null },
          oval: { irating: null, sr: null, licence: null, tt: null },
          dirt_oval: { irating: null, sr: null, licence: null, tt: null },
          dirt_road: { irating: null, sr: null, licence: null, tt: null },
          rx: { irating: null, sr: null, licence: null, tt: null },
        }
      }));

      set({ recommendedRacers, isLoading: false });
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
        set({ allRacers: MOCK_RACERS, filteredRacers: MOCK_RACERS, isLoading: true });
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
          irating_road
        `);

      if (error) {
        console.error('Failed to fetch all racers:', error.message);
        set({ error: error.message, isLoading: false });
        return;
      }

      const allRacers = data.map(racer => ({
        id: racer.id,
        display_name: racer.display_name || 'Unknown Racer',
        avatar_url: racer.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default',
        region: racer.region || 'Unknown',
        timezone: racer.timezone || 'UTC',
        platforms: racer.platforms || [],
        driving_styles: racer.driving_styles || [],
        role_tags: (racer.role_tags || []) as RoleTag[],
        xp_level: racer.xp_level || 1,
        xp_points: racer.xp_points || 0,
        xp_tier: (racer.xp_tier || 'bronze') as XpTier,
        reputation: racer.reputation || 0,
        looking_for_team: racer.looking_for_team || false,
        statsByDiscipline: {
          road: { irating: racer.irating_road, sr: null, licence: null, tt: null },
          oval: { irating: null, sr: null, licence: null, tt: null },
          dirt_oval: { irating: null, sr: null, licence: null, tt: null },
          dirt_road: { irating: null, sr: null, licence: null, tt: null },
          rx: { irating: null, sr: null, licence: null, tt: null },
        }
      }));

      set({ allRacers, filteredRacers: allRacers, isLoading: false });
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
    reputation: 87,
    looking_for_team: true,
    statsByDiscipline: {
      road: { irating: 2345, sr: 3.75, licence: 'A', tt: 1800 },
      oval: { irating: 1900, sr: 2.9, licence: 'C', tt: 1100 },
      dirt_oval: { irating: 0, sr: 0, licence: 'rookie', tt: 0 },
      dirt_road: { irating: 0, sr: 0, licence: 'rookie', tt: 0 },
      rx: { irating: 0, sr: 0, licence: 'rookie', tt: 0 },
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
    reputation: 92,
    looking_for_team: false,
    statsByDiscipline: {
      road: { irating: 3100, sr: 4.2, licence: 'A', tt: 2200 },
      oval: { irating: 1200, sr: 2.1, licence: 'D', tt: 900 },
      dirt_oval: { irating: 0, sr: 0, licence: 'rookie', tt: 0 },
      dirt_road: { irating: 2400, sr: 3.5, licence: 'B', tt: 1950 },
      rx: { irating: 0, sr: 0, licence: 'rookie', tt: 0 },
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
    reputation: 95,
    looking_for_team: true,
    statsByDiscipline: {
      road: { irating: 1800, sr: 3.0, licence: 'B', tt: 1650 },
      oval: { irating: 0, sr: 0, licence: 'rookie', tt: 0 },
      dirt_oval: { irating: 2700, sr: 4.5, licence: 'A', tt: 2500 },
      dirt_road: { irating: 3500, sr: 4.99, licence: 'A', tt: 3200 },
      rx: { irating: 2900, sr: 4.2, licence: 'A', tt: 2600 },
    },
  }
];
