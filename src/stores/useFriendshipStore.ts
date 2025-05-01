
import { create } from 'zustand';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';

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

// Mock data for friends
const MOCK_FRIENDS = [
  {
    id: 'mock-friend-1',
    requestor_id: 'user-1',
    addressee_id: 'current-user',
    status: 'accepted' as const,
    created_at: '2023-01-15T12:00:00Z',
    updated_at: '2023-01-15T12:05:00Z',
    requestor: {
      id: 'user-1',
      display_name: 'Alex Johnson',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'
    }
  },
  {
    id: 'mock-friend-2',
    requestor_id: 'current-user',
    addressee_id: 'user-2',
    status: 'accepted' as const,
    created_at: '2023-02-20T15:30:00Z',
    updated_at: '2023-02-20T16:00:00Z',
    addressee: {
      id: 'user-2',
      display_name: 'Chris Miller',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chris'
    }
  }
] as FriendRequest[];

// Mock data for friend requests
const MOCK_FRIEND_REQUESTS = [
  {
    id: 'mock-request-1',
    requestor_id: 'user-3',
    addressee_id: 'current-user',
    status: 'pending' as const,
    created_at: '2023-03-10T09:15:00Z',
    updated_at: '2023-03-10T09:15:00Z',
    requestor: {
      id: 'user-3',
      display_name: 'Sam Wilson',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam'
    }
  }
] as FriendRequest[];

export const useFriendshipStore = create<FriendshipState>((set, get) => ({
  friends: [],
  friendRequests: [],
  sentRequests: [],
  isLoading: false,
  error: null,
  
  sendFriendRequest: async (addresseeId: string) => {
    try {
      set({ isLoading: true, error: null });
      
      // Mock implementation for sending a friend request
      const newRequest: FriendRequest = {
        id: `mock-request-${Date.now()}`,
        requestor_id: 'current-user',
        addressee_id: addresseeId,
        status: 'pending' as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        addressee: {
          id: addresseeId,
          display_name: 'New Friend',
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${addresseeId}`
        }
      };
      
      // Add to sent requests
      set(state => ({ 
        sentRequests: [...state.sentRequests, newRequest],
        isLoading: false
      }));
      
      toast.success("Friend request sent successfully!");
      
    } catch (error: any) {
      console.error('Error sending friend request:', error);
      set({ error: error.message, isLoading: false });
      toast.error("Failed to send friend request");
    }
  },
  
  fetchFriends: async () => {
    try {
      set({ isLoading: true, error: null });
      
      // Use mock data instead of Supabase
      set({ friends: MOCK_FRIENDS, isLoading: false });
      
    } catch (error: any) {
      console.error('Error fetching friends:', error);
      set({ error: error.message, isLoading: false });
    }
  },
  
  fetchFriendRequests: async () => {
    try {
      set({ isLoading: true, error: null });
      
      // Use mock data instead of Supabase
      set({ friendRequests: MOCK_FRIEND_REQUESTS, isLoading: false });
      
    } catch (error: any) {
      console.error('Error fetching friend requests:', error);
      set({ error: error.message, isLoading: false });
    }
  },
  
  fetchSentRequests: async () => {
    try {
      set({ isLoading: true, error: null });
      
      // Use empty mock data for sent requests
      set({ sentRequests: [], isLoading: false });
      
    } catch (error: any) {
      console.error('Error fetching sent requests:', error);
      set({ error: error.message, isLoading: false });
    }
  },
  
  respondToFriendRequest: async (requestId: string, status: 'accepted' | 'rejected' | 'blocked') => {
    try {
      set({ isLoading: true, error: null });
      
      // Update the local state based on response
      if (status === 'accepted') {
        set(state => {
          const request = state.friendRequests.find(req => req.id === requestId);
          
          if (request) {
            const acceptedRequest: FriendRequest = {
              ...request,
              status: 'accepted',
              updated_at: new Date().toISOString()
            };
            
            return {
              friends: [...state.friends, acceptedRequest],
              friendRequests: state.friendRequests.filter(req => req.id !== requestId),
              isLoading: false,
              error: null,
              sentRequests: state.sentRequests
            };
          }
          
          return { ...state, isLoading: false };
        });
        
        toast.success("Friend request accepted!");
      } else {
        set(state => ({
          friendRequests: state.friendRequests.filter(req => req.id !== requestId),
          isLoading: false,
          error: null,
          friends: state.friends,
          sentRequests: state.sentRequests
        }));
        
        if (status === 'rejected') toast.info("Friend request rejected");
        if (status === 'blocked') toast.info("User blocked");
      }
      
    } catch (error: any) {
      console.error(`Error ${status} friend request:`, error);
      set({ error: error.message, isLoading: false });
      toast.error(`Failed to ${status} friend request`);
    }
  },
  
  removeFriend: async (friendshipId: string) => {
    try {
      set({ isLoading: true, error: null });
      
      set(state => ({
        friends: state.friends.filter(friend => friend.id !== friendshipId),
        isLoading: false,
        error: null,
        friendRequests: state.friendRequests,
        sentRequests: state.sentRequests
      }));
      
      toast.success("Friend removed successfully");
      
    } catch (error: any) {
      console.error('Error removing friend:', error);
      set({ error: error.message, isLoading: false });
      toast.error("Failed to remove friend");
    }
  },
  
  checkFriendship: async (profileId: string) => {
    try {
      // Check in friends list
      const { friends } = get();
      
      // For mock implementation
      if (profileId === 'user-1' || profileId === 'user-2') {
        return 'accepted';
      }
      
      // Check in pending requests
      const { sentRequests } = get();
      if (sentRequests.some(req => req.addressee_id === profileId)) {
        return 'pending';
      }
      
      return null;
    } catch (error: any) {
      console.error('Error checking friendship status:', error);
      return null;
    }
  }
}));
