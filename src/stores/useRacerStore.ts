import { create } from 'zustand';
import { supabase } from '@/lib/supabaseClient';

interface RacerStats {
  irating: number | null;
  sr: number | null;
  licence: string | null;
  tt: number | null;
}

interface Racer {
  id: string;
  display_name: string;
  avatar_url: string;
  region: string;
  timezone: string;
  platforms: string[];
  driving_styles: string[];
  role_tags: string[];
  xp_level: number;
  xp_points: number;
  xp_tier: string;
  reputation: number;
  looking_for_team: boolean;
  statsByDiscipline: {
    road: RacerStats;
    oval: RacerStats;
    dirt_oval: RacerStats;
    dirt_road: RacerStats;
    rx: RacerStats;
  };
}

interface RacerStore {
  currentRacer: Racer | null;
  mockMode: boolean;
  fetchRacerById: (id: string) => Promise<void>;
}

export const useRacerStore = create<RacerStore>((set) => ({
  currentRacer: null,
  mockMode: false, // We will control this later
  
  fetchRacerById: async (id) => {
    const { mockMode } = useRacerStore.getState();

    if (mockMode) {
      console.warn('Mock mode enabled — fetching mock racer');
      // Load mock data instead
      const mockRacer = MOCK_RACERS.find(r => r.id === id);
      if (mockRacer) {
        set({ currentRacer: mockRacer });
      }
      return;
    }

    const { data, error } = await supabase
      .from('users')
      .select(`
        id,
        display_name,
        avatar_url,
        region,
        timezone,
        platforms,
        driving_styles,
        role_tags,
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
      return;
    }

    const mappedStatsByDiscipline = {
      road: {
        irating: data.irating_road,
        sr: data.sr_road,
        licence: data.licence_road,
        tt: data.ttrating_road,
      },
      oval: {
        irating: data.irating_oval,
        sr: data.sr_oval,
        licence: data.licence_oval,
        tt: data.ttrating_oval,
      },
      dirt_oval: {
        irating: data.irating_dirt_oval,
        sr: data.sr_dirt_oval,
        licence: data.licence_dirt_oval,
        tt: data.ttrating_dirt_oval,
      },
      dirt_road: {
        irating: data.irating_dirt_road,
        sr: data.sr_dirt_road,
        licence: data.licence_dirt_road,
        tt: data.ttrating_dirt_road,
      },
      rx: {
        irating: data.irating_rx,
        sr: data.sr_rx,
        licence: data.licence_rx,
        tt: data.ttrating_rx,
      },
    };

    set({
      currentRacer: {
        id: data.id,
        display_name: data.display_name,
        avatar_url: data.avatar_url,
        region: data.region,
        timezone: data.timezone,
        platforms: data.platforms || [],
        driving_styles: data.driving_styles || [],
        role_tags: data.role_tags || [],
        xp_level: data.xp_level || 0,
        xp_points: data.xp_points || 0,
        xp_tier: data.xp_tier || 'Bronze',
        reputation: data.reputation || 0,
        looking_for_team: data.looking_for_team || false,
        statsByDiscipline: mappedStatsByDiscipline,
      },
    });
  },
}));
// ✅ Paste the mock racers below this line
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
    }
  },
  // ...add more racers here
];
