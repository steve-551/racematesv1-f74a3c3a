
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert } from '@/integrations/supabase/types';

type StintState = {
  stints: Tables<'stints'>[];
  createStint: (stint: TablesInsert<'stints'>) => Promise<void>;
  fetchStintsForEvent: (eventId: string) => Promise<void>;
  updateStint: (id: string, updates: TablesInsert<'stints'>) => Promise<void>;
  deleteStint: (id: string) => Promise<void>;
};

export const useStintStore = create<StintState>((set, get) => ({
  stints: [],
  
  createStint: async (stint) => {
    try {
      // Ensure required fields are provided
      if (!stint.driver_id || !stint.team_id || !stint.event_id || !stint.start_time || !stint.end_time) {
        throw new Error('Missing required stint fields');
      }
      
      const { data, error } = await supabase
        .from('stints')
        .insert(stint)
        .select();
      
      if (error) throw error;
      if (data) {
        set(state => ({ stints: [...state.stints, data[0]] }));
      }
    } catch (error) {
      console.error('Error creating stint:', error);
      throw error;
    }
  },

  fetchStintsForEvent: async (eventId) => {
    try {
      const { data, error } = await supabase
        .from('stints')
        .select('*')
        .eq('event_id', eventId);
      
      if (error) throw error;
      if (data) {
        set({ stints: data });
      }
    } catch (error) {
      console.error('Error fetching stints:', error);
      throw error;
    }
  },

  updateStint: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('stints')
        .update(updates)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      if (data) {
        set(state => ({
          stints: state.stints.map(stint => 
            stint.id === id ? data[0] : stint
          )
        }));
      }
    } catch (error) {
      console.error('Error updating stint:', error);
      throw error;
    }
  },

  deleteStint: async (id) => {
    try {
      const { error } = await supabase
        .from('stints')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      set(state => ({
        stints: state.stints.filter(stint => stint.id !== id)
      }));
    } catch (error) {
      console.error('Error deleting stint:', error);
      throw error;
    }
  }
}));
