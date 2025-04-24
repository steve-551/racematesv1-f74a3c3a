
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type StintState = {
  stints: Tables<'stints'>[];
  createStint: (stint: Partial<Tables<'stints'>>) => Promise<void>;
  fetchStintsForEvent: (eventId: string) => Promise<void>;
  updateStint: (id: string, updates: Partial<Tables<'stints'>>) => Promise<void>;
  deleteStint: (id: string) => Promise<void>;
};

export const useStintStore = create<StintState>((set, get) => ({
  stints: [],
  
  createStint: async (stint) => {
    const { data, error } = await supabase
      .from('stints')
      .insert(stint)
      .select();
    
    if (error) throw error;
    if (data) {
      set(state => ({ stints: [...state.stints, data[0]] }));
    }
  },

  fetchStintsForEvent: async (eventId) => {
    const { data, error } = await supabase
      .from('stints')
      .select('*')
      .eq('event_id', eventId);
    
    if (error) throw error;
    if (data) {
      set({ stints: data });
    }
  },

  updateStint: async (id, updates) => {
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
  },

  deleteStint: async (id) => {
    const { error } = await supabase
      .from('stints')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    set(state => ({
      stints: state.stints.filter(stint => stint.id !== id)
    }));
  }
}));
