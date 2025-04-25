
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert } from '@/integrations/supabase/types';

export type XpTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'pro';
export type LicenseClass = 'rookie' | 'D' | 'C' | 'B' | 'A' | 'pro' | 'black';
export type Platform = 'iRacing' | 'F1' | 'ACC' | 'GT7' | 'rFactor' | 'Automobilista' | 'RaceRoom';
export type RoleTag = 'Driver' | 'Strategist' | 'Team Manager' | 'Endurance Pro' | 'Sprint Specialist' | 'Coach';

export interface RacerProfile {
  id: string;
  user_id: string;
  display_name: string;
  avatar_url: string;
  platforms: Platform[];
  region: string;
  timezone: string;
  driving_styles: string[];
  role_tags: RoleTag[];
  iracing_stats: {
    irating: number;
    safety_rating: number;
    license_class: LicenseClass;
    tt_rating: number;
  };
  xp_level: number;
  xp_points: number;
  xp_tier: XpTier;
  reputation: number;
  looking_for_team: boolean;
  onboarding_complete: boolean;
}

type RacerState = {
  racers: RacerProfile[];
  currentRacer: RacerProfile | null;
  recommendedRacers: RacerProfile[];
  fetchRacers: (filters?: Partial<RacerProfile>) => Promise<void>;
  fetchRacerById: (id: string) => Promise<void>;
  fetchCurrentRacerProfile: () => Promise<void>;
  updateRacerProfile: (updates: Partial<RacerProfile>) => Promise<void>;
  toggleLookingForTeam: (value: boolean) => Promise<void>;
  fetchRecommendedRacers: () => Promise<void>;
};

// Helper function to determine XP tier based on points
const getXpTier = (points: number): XpTier => {
  if (points < 1500) return 'bronze';
  if (points < 2000) return 'silver';
  if (points < 2500) return 'gold';
  if (points < 3000) return 'platinum';
  return 'pro';
};

// Mock data - in a real app, this would come from Supabase
const MOCK_RACERS: RacerProfile[] = [
  {
    id: '1',
    user_id: 'user1',
    display_name: 'SpeedRacer',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SpeedRacer',
    platforms: ['iRacing', 'ACC'],
    region: 'North America',
    timezone: 'EST',
    driving_styles: ['Endurance', 'GT3'],
    role_tags: ['Driver', 'Endurance Pro'],
    iracing_stats: {
      irating: 2345,
      safety_rating: 3.75,
      license_class: 'A',
      tt_rating: 1800
    },
    xp_level: 24,
    xp_points: 2345,
    xp_tier: 'gold',
    reputation: 87,
    looking_for_team: true,
    onboarding_complete: true
  },
  {
    id: '2',
    user_id: 'user2',
    display_name: 'DriftKing',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DriftKing',
    platforms: ['F1', 'GT7'],
    region: 'Europe',
    timezone: 'CET',
    driving_styles: ['Sprint', 'F1'],
    role_tags: ['Driver', 'Coach'],
    iracing_stats: {
      irating: 3500,
      safety_rating: 4.2,
      license_class: 'pro',
      tt_rating: 2200
    },
    xp_level: 42,
    xp_points: 3200,
    xp_tier: 'pro',
    reputation: 95,
    looking_for_team: false,
    onboarding_complete: true
  },
  {
    id: '3',
    user_id: 'user3',
    display_name: 'RallyMaster',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=RallyMaster',
    platforms: ['iRacing', 'rFactor'],
    region: 'Asia',
    timezone: 'JST',
    driving_styles: ['Rally', 'Dirt'],
    role_tags: ['Driver', 'Strategist'],
    iracing_stats: {
      irating: 1850,
      safety_rating: 2.8,
      license_class: 'B',
      tt_rating: 1500
    },
    xp_level: 18,
    xp_points: 1850,
    xp_tier: 'silver',
    reputation: 72,
    looking_for_team: true,
    onboarding_complete: true
  },
  {
    id: '4',
    user_id: 'user4',
    display_name: 'OvalPro',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=OvalPro',
    platforms: ['iRacing'],
    region: 'North America',
    timezone: 'CST',
    driving_styles: ['Oval', 'NASCAR'],
    role_tags: ['Driver', 'Team Manager'],
    iracing_stats: {
      irating: 4200,
      safety_rating: 4.8,
      license_class: 'pro',
      tt_rating: 2800
    },
    xp_level: 56,
    xp_points: 4200,
    xp_tier: 'pro',
    reputation: 98,
    looking_for_team: false,
    onboarding_complete: true
  },
  {
    id: '5',
    user_id: 'user5',
    display_name: 'DragStrip',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DragStrip',
    platforms: ['RaceRoom', 'GT7'],
    region: 'Europe',
    timezone: 'GMT',
    driving_styles: ['Drag', 'Street'],
    role_tags: ['Driver'],
    iracing_stats: {
      irating: 1200,
      safety_rating: 2.2,
      license_class: 'D',
      tt_rating: 1100
    },
    xp_level: 12,
    xp_points: 1200,
    xp_tier: 'bronze',
    reputation: 65,
    looking_for_team: true,
    onboarding_complete: true
  }
];

export const useRacerStore = create<RacerState>((set, get) => ({
  racers: MOCK_RACERS,
  currentRacer: null,
  recommendedRacers: [],
  
  fetchRacers: async (filters = {}) => {
    try {
      // In a real app, this would be a Supabase query
      // For now, we'll just use our mock data and apply filters in memory
      const filteredRacers = MOCK_RACERS.filter(racer => {
        for (const [key, value] of Object.entries(filters)) {
          if (value === undefined) continue;
          
          if (key === 'platforms' && Array.isArray(value)) {
            const platformFilters = value as Platform[];
            if (!racer.platforms.some(p => platformFilters.includes(p))) {
              return false;
            }
          } else if (key === 'driving_styles' && Array.isArray(value)) {
            const styleFilters = value as string[];
            if (!racer.driving_styles.some(s => styleFilters.includes(s))) {
              return false;
            }
          } else if (key === 'role_tags' && Array.isArray(value)) {
            const roleFilters = value as RoleTag[];
            if (!racer.role_tags.some(r => roleFilters.includes(r))) {
              return false;
            }
          } else if (key === 'iracing_stats.license_class') {
            if (racer.iracing_stats.license_class !== value) {
              return false;
            }
          } else if (key === 'iracing_stats.irating') {
            // Fix: Check if value is specifically a tuple with two numbers
            // This is the proper way to check if something is a [min, max] range
            if (Array.isArray(value) && value.length === 2) {
              // Ensure both elements are numbers before using them as a range
              const min = Number(value[0]);
              const max = Number(value[1]);
              
              if (!isNaN(min) && !isNaN(max)) {
                if (racer.iracing_stats.irating < min || racer.iracing_stats.irating > max) {
                  return false;
                }
              }
            }
          } else if (key === 'looking_for_team') {
            if (racer.looking_for_team !== value) {
              return false;
            }
          } else if (key === 'region') {
            if (racer.region !== value) {
              return false;
            }
          }
        }
        return true;
      });
      
      set({ racers: filteredRacers });
    } catch (error) {
      console.error('Error fetching racers:', error);
    }
  },

  fetchRacerById: async (id) => {
    try {
      // In a real app, this would query Supabase
      const racer = MOCK_RACERS.find(r => r.id === id) || null;
      if (racer) {
        set({ currentRacer: racer });
      }
    } catch (error) {
      console.error('Error fetching racer by ID:', error);
    }
  },

  fetchCurrentRacerProfile: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error('No authenticated user found');
        return;
      }
      
      // In a real app, we'd query Supabase for the actual user profile
      // Since we're mocking, we'll just set it to the first mock racer
      const mockCurrentRacer = { ...MOCK_RACERS[0], user_id: user.id };
      set({ currentRacer: mockCurrentRacer });
    } catch (error) {
      console.error('Error fetching current racer profile:', error);
    }
  },

  updateRacerProfile: async (updates) => {
    try {
      const { currentRacer } = get();
      if (!currentRacer) {
        throw new Error('No current racer profile found');
      }
      
      // Mock update - in a real app, this would update Supabase
      const updatedRacer = { ...currentRacer, ...updates };
      
      // Update XP tier if XP points were updated
      if (updates.xp_points) {
        updatedRacer.xp_tier = getXpTier(updatedRacer.xp_points);
      }
      
      set({ currentRacer: updatedRacer });
    } catch (error) {
      console.error('Error updating racer profile:', error);
    }
  },

  toggleLookingForTeam: async (value) => {
    try {
      await get().updateRacerProfile({ looking_for_team: value });
    } catch (error) {
      console.error('Error toggling looking for team status:', error);
    }
  },

  fetchRecommendedRacers: async () => {
    try {
      const { currentRacer } = get();
      if (!currentRacer) {
        throw new Error('No current racer profile found');
      }
      
      // Mock recommendation logic - in a real app, this would use more sophisticated recommendations
      const recommendations = MOCK_RACERS.filter(racer => 
        // Don't recommend the current user
        racer.id !== currentRacer.id &&
        // Recommend users with similar platforms or region
        (
          racer.platforms.some(p => currentRacer.platforms.includes(p)) ||
          racer.region === currentRacer.region ||
          racer.driving_styles.some(s => currentRacer.driving_styles.includes(s))
        )
      ).slice(0, 3);
      
      set({ recommendedRacers: recommendations });
    } catch (error) {
      console.error('Error fetching recommended racers:', error);
    }
  },
}));
