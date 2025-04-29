
import { create } from 'zustand';
import { supabase } from '@/lib/supabaseClient';

export interface Setup {
  id: string;
  owner_id: string;
  team_id?: string;
  title: string;
  description?: string;
  car_model: string;
  track_name: string;
  sim_platform: string;
  setup_data?: string;
  visibility: 'private' | 'team' | 'friends' | 'public';
  created_at: string;
  updated_at: string;
}

export interface SetupFile {
  id: string;
  setup_id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  created_at: string;
}

type SetupState = {
  setups: Setup[];
  setupFiles: { [setupId: string]: SetupFile[] };
  isLoading: boolean;
  error: string | null;
  
  createSetup: (setup: Omit<Setup, 'id' | 'created_at' | 'updated_at'>) => Promise<Setup | null>;
  uploadSetupFile: (setupId: string, file: File) => Promise<void>;
  fetchSetups: (teamId?: string) => Promise<void>;
  fetchSetupFiles: (setupId: string) => Promise<void>;
  updateSetup: (id: string, updates: Partial<Setup>) => Promise<void>;
  deleteSetup: (id: string) => Promise<void>;
  shareSetupWithTeam: (setupId: string, teamId: string) => Promise<void>;
  shareSetupWithFriend: (setupId: string, friendId: string) => Promise<void>;
};

export const useSetupStore = create<SetupState>((set, get) => ({
  setups: [],
  setupFiles: {},
  isLoading: false,
  error: null,
  
  createSetup: async (setup) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error('User not authenticated');
      }
      
      const newSetup = {
        ...setup,
        owner_id: userData.user.id
      };
      
      const { data, error } = await supabase
        .from('setups')
        .insert([newSetup])
        .select();
      
      if (error) {
        console.error('Error creating setup:', error);
        set({ error: error.message, isLoading: false });
        return null;
      }
      
      if (data) {
        set(state => ({ 
          setups: [...state.setups, data[0]],
          isLoading: false
        }));
        return data[0];
      }
      
      return null;
    } catch (error: any) {
      console.error('Error creating setup:', error);
      set({ error: error.message, isLoading: false });
      return null;
    }
  },
  
  uploadSetupFile: async (setupId, file) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error('User not authenticated');
      }
      
      const filePath = `${userData.user.id}/${setupId}/${file.name}`;
      
      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('setups')
        .upload(filePath, file);
        
      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        set({ error: uploadError.message, isLoading: false });
        return;
      }
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('setups')
        .getPublicUrl(filePath);
        
      // Save file reference to database
      const { error: dbError } = await supabase
        .from('setup_files')
        .insert([{
          setup_id: setupId,
          file_name: file.name,
          file_path: filePath,
          file_type: file.type,
          file_size: file.size
        }]);
        
      if (dbError) {
        console.error('Error saving file reference:', dbError);
        set({ error: dbError.message, isLoading: false });
        return;
      }
      
      // Refresh setup files
      await get().fetchSetupFiles(setupId);
      set({ isLoading: false });
    } catch (error: any) {
      console.error('Error uploading setup file:', error);
      set({ error: error.message, isLoading: false });
    }
  },
  
  fetchSetups: async (teamId) => {
    try {
      set({ isLoading: true, error: null });
      
      let query = supabase.from('setups').select('*');
      
      // If teamId is provided, filter by team
      if (teamId) {
        query = query.eq('team_id', teamId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching setups:', error);
        set({ error: error.message, isLoading: false });
        return;
      }
      
      set({ setups: data || [], isLoading: false });
    } catch (error: any) {
      console.error('Error fetching setups:', error);
      set({ error: error.message, isLoading: false });
    }
  },
  
  fetchSetupFiles: async (setupId) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('setup_files')
        .select('*')
        .eq('setup_id', setupId);
      
      if (error) {
        console.error('Error fetching setup files:', error);
        set({ error: error.message, isLoading: false });
        return;
      }
      
      set(state => ({
        setupFiles: {
          ...state.setupFiles,
          [setupId]: data || []
        },
        isLoading: false
      }));
    } catch (error: any) {
      console.error('Error fetching setup files:', error);
      set({ error: error.message, isLoading: false });
    }
  },
  
  updateSetup: async (id, updates) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('setups')
        .update(updates)
        .eq('id', id)
        .select();
      
      if (error) {
        console.error('Error updating setup:', error);
        set({ error: error.message, isLoading: false });
        return;
      }
      
      if (data) {
        set(state => ({
          setups: state.setups.map(setup => 
            setup.id === id ? data[0] : setup
          ),
          isLoading: false
        }));
      }
    } catch (error: any) {
      console.error('Error updating setup:', error);
      set({ error: error.message, isLoading: false });
    }
  },
  
  deleteSetup: async (id) => {
    try {
      set({ isLoading: true, error: null });
      
      const { error } = await supabase
        .from('setups')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting setup:', error);
        set({ error: error.message, isLoading: false });
        return;
      }
      
      set(state => ({
        setups: state.setups.filter(setup => setup.id !== id),
        isLoading: false
      }));
    } catch (error: any) {
      console.error('Error deleting setup:', error);
      set({ error: error.message, isLoading: false });
    }
  },
  
  shareSetupWithTeam: async (setupId, teamId) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error('User not authenticated');
      }
      
      const { error } = await supabase
        .from('setup_shares')
        .insert([{
          setup_id: setupId,
          shared_by_id: userData.user.id,
          shared_with_team_id: teamId
        }]);
      
      if (error) {
        console.error('Error sharing setup with team:', error);
        set({ error: error.message, isLoading: false });
        return;
      }
      
      set({ isLoading: false });
    } catch (error: any) {
      console.error('Error sharing setup with team:', error);
      set({ error: error.message, isLoading: false });
    }
  },
  
  shareSetupWithFriend: async (setupId, friendId) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error('User not authenticated');
      }
      
      const { error } = await supabase
        .from('setup_shares')
        .insert([{
          setup_id: setupId,
          shared_by_id: userData.user.id,
          shared_with_id: friendId
        }]);
      
      if (error) {
        console.error('Error sharing setup with friend:', error);
        set({ error: error.message, isLoading: false });
        return;
      }
      
      set({ isLoading: false });
    } catch (error: any) {
      console.error('Error sharing setup with friend:', error);
      set({ error: error.message, isLoading: false });
    }
  }
}));
