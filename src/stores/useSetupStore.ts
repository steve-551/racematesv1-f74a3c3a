
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type SetupState = {
  setups: Tables<'setups'>[];
  createSetup: (setup: Partial<Tables<'setups'>>) => Promise<void>;
  fetchSetups: () => Promise<void>;
  updateSetup: (id: string, updates: Partial<Tables<'setups'>>) => Promise<void>;
  deleteSetup: (id: string) => Promise<void>;
};

export const useSetupStore = create<SetupState>((set, get) => ({
  setups: [],
  
  createSetup: async (setup) => {
    const { data, error } = await supabase
      .from('setups')
      .insert(setup)
      .select();
    
    if (error) throw error;
    if (data) {
      set(state => ({ setups: [...state.setups, data[0]] }));
    }
  },

  fetchSetups: async () => {
    const { data, error } = await supabase
      .from('setups')
      .select('*');
    
    if (error) throw error;
    if (data) {
      set({ setups: data });
    }
  },

  updateSetup: async (id, updates) => {
    const { data, error } = await supabase
      .from('setups')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    if (data) {
      set(state => ({
        setups: state.setups.map(setup => 
          setup.id === id ? data[0] : setup
        )
      }));
    }
  },

  deleteSetup: async (id) => {
    const { error } = await supabase
      .from('setups')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    set(state => ({
      setups: state.setups.filter(setup => setup.id !== id)
    }));
  }
}));
