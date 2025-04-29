
import { create } from 'zustand';
import { supabase } from '@/lib/supabaseClient';

export interface FriendRequest {
  id: string;
  requestor_id: string;
  addressee_id: string;
  status: 'pending' | 'accepted' | 'rejected' | 'blocked';
  created_at: string;
  updated_at: string;
  requestor?: {
    id: string;
    display_name: string;
    avatar_url: string;
  };
  addressee?: {
    id: string;
    display_name: string;
    avatar_url: string;
  };
}

interface FriendshipState {
  friends: FriendRequest[];
  friendRequests: FriendRequest[];
  sentRequests: FriendRequest[];
  isLoading: boolean;
  error: string | null;
  
  sendFriendRequest: (addresseeId: string) => Promise<void>;
  fetchFriends: () => Promise<void>;
  fetchFriendRequests: () => Promise<void>;
  fetchSentRequests: () => Promise<void>;
  respondToFriendRequest: (requestId: string, status: 'accepted' | 'rejected' | 'blocked') => Promise<void>;
  removeFriend: (friendshipId: string) => Promise<void>;
  checkFriendship: (profileId: string) => Promise<string | null>;
}

export const useFriendshipStore = create<FriendshipState>((set, get) => ({
  friends: [],
  friendRequests: [],
  sentRequests: [],
  isLoading: false,
  error: null,
  
  sendFriendRequest: async (addresseeId: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error('User not authenticated');
      }
      
      const requestorId = userData.user.id;
      
      // Check if a request already exists
      const { data: existingRequests } = await supabase
        .from('friendships')
        .select('*')
        .or(`requestor_id.eq.${requestorId},addressee_id.eq.${requestorId}`)
        .or(`requestor_id.eq.${addresseeId},addressee_id.eq.${addresseeId}`);
      
      if (existingRequests && existingRequests.length > 0) {
        throw new Error('A friend request already exists between these users');
      }
      
      // Create new friend request
      const { data, error } = await supabase
        .from('friendships')
        .insert([{
          requestor_id: requestorId,
          addressee_id: addresseeId,
          status: 'pending'
        }])
        .select();
      
      if (error) {
        console.error('Error sending friend request:', error);
        set({ error: error.message, isLoading: false });
        return;
      }
      
      // Update sent requests
      set(state => ({ 
        sentRequests: [...state.sentRequests, data[0]],
        isLoading: false
      }));
      
    } catch (error: any) {
      console.error('Error sending friend request:', error);
      set({ error: error.message, isLoading: false });
    }
  },
  
  fetchFriends: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error('User not authenticated');
      }
      
      const userId = userData.user.id;
      
      // Fetch friendships where status is 'accepted'
      const { data, error } = await supabase
        .from('friendships')
        .select(`
          *,
          requestor:requestor_id(id, display_name, avatar_url),
          addressee:addressee_id(id, display_name, avatar_url)
        `)
        .or(`requestor_id.eq.${userId},addressee_id.eq.${userId}`)
        .eq('status', 'accepted');
      
      if (error) {
        console.error('Error fetching friends:', error);
        set({ error: error.message, isLoading: false });
        return;
      }
      
      set({ friends: data || [], isLoading: false });
    } catch (error: any) {
      console.error('Error fetching friends:', error);
      set({ error: error.message, isLoading: false });
    }
  },
  
  fetchFriendRequests: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error('User not authenticated');
      }
      
      const userId = userData.user.id;
      
      // Fetch friend requests addressed to the current user
      const { data, error } = await supabase
        .from('friendships')
        .select(`
          *,
          requestor:requestor_id(id, display_name, avatar_url)
        `)
        .eq('addressee_id', userId)
        .eq('status', 'pending');
      
      if (error) {
        console.error('Error fetching friend requests:', error);
        set({ error: error.message, isLoading: false });
        return;
      }
      
      set({ friendRequests: data || [], isLoading: false });
    } catch (error: any) {
      console.error('Error fetching friend requests:', error);
      set({ error: error.message, isLoading: false });
    }
  },
  
  fetchSentRequests: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error('User not authenticated');
      }
      
      const userId = userData.user.id;
      
      // Fetch requests sent by the current user
      const { data, error } = await supabase
        .from('friendships')
        .select(`
          *,
          addressee:addressee_id(id, display_name, avatar_url)
        `)
        .eq('requestor_id', userId)
        .eq('status', 'pending');
      
      if (error) {
        console.error('Error fetching sent requests:', error);
        set({ error: error.message, isLoading: false });
        return;
      }
      
      set({ sentRequests: data || [], isLoading: false });
    } catch (error: any) {
      console.error('Error fetching sent requests:', error);
      set({ error: error.message, isLoading: false });
    }
  },
  
  respondToFriendRequest: async (requestId: string, status: 'accepted' | 'rejected' | 'blocked') => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('friendships')
        .update({ status })
        .eq('id', requestId)
        .select();
      
      if (error) {
        console.error(`Error ${status} friend request:`, error);
        set({ error: error.message, isLoading: false });
        return;
      }
      
      // Update state based on response
      if (status === 'accepted') {
        set(state => ({
          friends: [...state.friends, data[0]],
          friendRequests: state.friendRequests.filter(req => req.id !== requestId),
          isLoading: false
        }));
      } else {
        set(state => ({
          friendRequests: state.friendRequests.filter(req => req.id !== requestId),
          isLoading: false
        }));
      }
    } catch (error: any) {
      console.error(`Error ${status} friend request:`, error);
      set({ error: error.message, isLoading: false });
    }
  },
  
  removeFriend: async (friendshipId: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const { error } = await supabase
        .from('friendships')
        .delete()
        .eq('id', friendshipId);
      
      if (error) {
        console.error('Error removing friend:', error);
        set({ error: error.message, isLoading: false });
        return;
      }
      
      set(state => ({
        friends: state.friends.filter(friend => friend.id !== friendshipId),
        isLoading: false
      }));
    } catch (error: any) {
      console.error('Error removing friend:', error);
      set({ error: error.message, isLoading: false });
    }
  },
  
  checkFriendship: async (profileId: string) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error('User not authenticated');
      }
      
      const userId = userData.user.id;
      
      // Check if a friendship exists between users
      const { data } = await supabase
        .from('friendships')
        .select('id, status')
        .or(`requestor_id.eq.${userId}.and.addressee_id.eq.${profileId},addressee_id.eq.${userId}.and.requestor_id.eq.${profileId}`);
      
      if (data && data.length > 0) {
        return data[0].status;
      } else {
        return null;
      }
    } catch (error: any) {
      console.error('Error checking friendship status:', error);
      return null;
    }
  }
}));
