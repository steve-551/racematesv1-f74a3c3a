
import { create } from 'zustand';
import { supabase } from '@/lib/supabaseClient';

export interface Stint {
  id: string;
  driver_id: string;
  team_id: string;
  event_id: string;
  start_time: string;
  end_time: string;
  color?: string;
  created_at: string;
  updated_at: string;
}

type StintState = {
  stints: Stint[];
  isLoading: boolean;
  error: string | null;
  
  createStint: (stint: Omit<Stint, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  fetchStintsForEvent: (eventId: string) => Promise<void>;
  fetchStintsByTeam: (teamId: string) => Promise<void>;
  updateStint: (id: string, updates: Partial<Stint>) => Promise<void>;
  deleteStint: (id: string) => Promise<void>;
};

export const useStintStore = create<StintState>((set) => ({
  stints: [],
  isLoading: false,
  error: null,
  
  createStint: async (stint) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('stints')
        .insert([stint])
        .select();
      
      if (error) {
        console.error('Error creating stint:', error);
        set({ error: error.message, isLoading: false });
        return;
      }
      
      if (data) {
        set(state => ({ 
          stints: [...state.stints, data[0]],
          isLoading: false
        }));
      }
    } catch (error: any) {
      console.error('Error creating stint:', error);
      set({ error: error.message, isLoading: false });
    }
  },
  
  fetchStintsForEvent: async (eventId) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('stints')
        .select('*')
        .eq('event_id', eventId);
      
      if (error) {
        console.error('Error fetching stints:', error);
        set({ error: error.message, isLoading: false });
        return;
      }
      
      set({ stints: data || [], isLoading: false });
    } catch (error: any) {
      console.error('Error fetching stints:', error);
      set({ error: error.message, isLoading: false });
    }
  },
  
  fetchStintsByTeam: async (teamId) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('stints')
        .select('*')
        .eq('team_id', teamId);
      
      if (error) {
        console.error('Error fetching team stints:', error);
        set({ error: error.message, isLoading: false });
        return;
      }
      
      set({ stints: data || [], isLoading: false });
    } catch (error: any) {
      console.error('Error fetching team stints:', error);
      set({ error: error.message, isLoading: false });
    }
  },
  
  updateStint: async (id, updates) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('stints')
        .update(updates)
        .eq('id', id)
        .select();
      
      if (error) {
        console.error('Error updating stint:', error);
        set({ error: error.message, isLoading: false });
        return;
      }
      
      if (data) {
        set(state => ({
          stints: state.stints.map(stint => 
            stint.id === id ? data[0] : stint
          ),
          isLoading: false
        }));
      }
    } catch (error: any) {
      console.error('Error updating stint:', error);
      set({ error: error.message, isLoading: false });
    }
  },
  
  deleteStint: async (id) => {
    try {
      set({ isLoading: true, error: null });
      
      const { error } = await supabase
        .from('stints')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting stint:', error);
        set({ error: error.message, isLoading: false });
        return;
      }
      
      set(state => ({
        stints: state.stints.filter(stint => stint.id !== id),
        isLoading: false
      }));
    } catch (error: any) {
      console.error('Error deleting stint:', error);
      set({ error: error.message, isLoading: false });
    }
  }
}));
