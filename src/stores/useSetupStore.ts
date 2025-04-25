
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert } from '@/integrations/supabase/types';

type SetupState = {
  setups: Tables<'setups'>[];
  createSetup: (setup: TablesInsert<'setups'>) => Promise<void>;
  fetchSetups: () => Promise<void>;
  updateSetup: (id: string, updates: TablesInsert<'setups'>) => Promise<void>;
  deleteSetup: (id: string) => Promise<void>;
};

export const useSetupStore = create<SetupState>((set, get) => ({
  setups: [],
  
  createSetup: async (setup) => {
    try {
      // Ensure owner_id is set to the current user
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('User not authenticated');
      
      const setupWithOwner = {
        ...setup,
        owner_id: userData.user.id
      };
      
      const { data, error } = await supabase
        .from('setups')
        .insert(setupWithOwner)
        .select();
      
      if (error) throw error;
      if (data) {
        set(state => ({ setups: [...state.setups, data[0]] }));
      }
    } catch (error) {
      console.error('Error creating setup:', error);
      throw error;
    }
  },

  fetchSetups: async () => {
    try {
      const { data, error } = await supabase
        .from('setups')
        .select('*');
      
      if (error) throw error;
      if (data) {
        set({ setups: data });
      }
    } catch (error) {
      console.error('Error fetching setups:', error);
      throw error;
    }
  },

  updateSetup: async (id, updates) => {
    try {
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
    } catch (error) {
      console.error('Error updating setup:', error);
      throw error;
    }
  },

  deleteSetup: async (id) => {
    try {
      const { error } = await supabase
        .from('setups')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      set(state => ({
        setups: state.setups.filter(setup => setup.id !== id)
      }));
    } catch (error) {
      console.error('Error deleting setup:', error);
      throw error;
    }
  }
}));
