
import { create } from 'zustand';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';

export interface DirectMessage {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  read_at: string | null;
  created_at: string;
  sender?: {
    id: string;
    display_name: string;
    avatar_url: string;
  };
  recipient?: {
    id: string;
    display_name: string;
    avatar_url: string;
  };
}

export interface TeamChatMessage {
  id: string;
  team_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  sender?: {
    id: string;
    display_name: string;
    avatar_url: string;
  };
}

interface MessagingState {
  directMessages: { [userId: string]: DirectMessage[] };
  teamMessages: { [teamId: string]: TeamChatMessage[] };
  activeConversations: string[];
  isLoading: boolean;
  error: string | null;
  
  sendDirectMessage: (recipientId: string, content: string) => Promise<void>;
  sendTeamMessage: (teamId: string, content: string) => Promise<void>;
  fetchDirectMessages: (userId: string) => Promise<void>;
  fetchTeamMessages: (teamId: string) => Promise<void>;
  fetchActiveConversations: () => Promise<void>;
  markMessageAsRead: (messageId: string) => Promise<void>;
}

// Mock messages for testing
const createMockDirectMessages = (recipientId: string) => {
  return [
    {
      id: `msg-1-${recipientId}`,
      sender_id: 'current-user',
      recipient_id: recipientId,
      content: 'Hey, how are you doing?',
      read_at: null,
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: `msg-2-${recipientId}`,
      sender_id: recipientId,
      recipient_id: 'current-user',
      content: 'Hi! I\'m good, thanks for asking. How about you?',
      read_at: null,
      created_at: new Date(Date.now() - 3000000).toISOString(),
    },
    {
      id: `msg-3-${recipientId}`,
      sender_id: 'current-user',
      recipient_id: recipientId,
      content: 'Doing great! Are you ready for the race this weekend?',
      read_at: null,
      created_at: new Date(Date.now() - 2400000).toISOString(),
    }
  ] as DirectMessage[];
};

export const useMessagingStore = create<MessagingState>((set, get) => ({
  directMessages: {},
  teamMessages: {},
  activeConversations: [],
  isLoading: false,
  error: null,
  
  sendDirectMessage: async (recipientId: string, content: string) => {
    try {
      set({ isLoading: true, error: null });
      
      // Mock implementation for sending a message
      const newMessage: DirectMessage = {
        id: `msg-${Date.now()}`,
        sender_id: 'current-user',
        recipient_id: recipientId,
        content,
        read_at: null,
        created_at: new Date().toISOString(),
      };
      
      // Update state with new message
      set(state => {
        const existingMessages = state.directMessages[recipientId] || [];
        return {
          directMessages: {
            ...state.directMessages,
            [recipientId]: [...existingMessages, newMessage]
          },
          isLoading: false
        };
      });
      
      toast.success('Message sent!');
      
    } catch (error: any) {
      console.error('Error sending direct message:', error);
      set({ error: error.message, isLoading: false });
      toast.error('Failed to send message');
    }
  },
  
  fetchDirectMessages: async (userId: string) => {
    try {
      set({ isLoading: true, error: null });
      
      // Check if we already have messages for this user
      const { directMessages } = get();
      if (!directMessages[userId]) {
        // Use mock messages if none exist
        set(state => ({
          directMessages: {
            ...state.directMessages,
            [userId]: createMockDirectMessages(userId)
          },
          isLoading: false
        }));
      } else {
        set({ isLoading: false });
      }
      
    } catch (error: any) {
      console.error('Error fetching direct messages:', error);
      set({ error: error.message, isLoading: false });
    }
  },
  
  sendTeamMessage: async (teamId: string, content: string) => {
    try {
      set({ isLoading: true, error: null });
      
      // Mock implementation for sending a team message
      const newMessage: TeamChatMessage = {
        id: `team-msg-${Date.now()}`,
        team_id: teamId,
        sender_id: 'current-user',
        content,
        created_at: new Date().toISOString(),
      };
      
      // Update state with new message
      set(state => {
        const existingMessages = state.teamMessages[teamId] || [];
        return {
          teamMessages: {
            ...state.teamMessages,
            [teamId]: [...existingMessages, newMessage]
          },
          isLoading: false
        };
      });
      
      toast.success('Team message sent!');
      
    } catch (error: any) {
      console.error('Error sending team message:', error);
      set({ error: error.message, isLoading: false });
      toast.error('Failed to send team message');
    }
  },
  
  fetchTeamMessages: async (teamId: string) => {
    try {
      set({ isLoading: true, error: null });
      
      // Use mock team messages
      set(state => ({
        teamMessages: {
          ...state.teamMessages,
          [teamId]: []
        },
        isLoading: false
      }));
      
    } catch (error: any) {
      console.error('Error fetching team messages:', error);
      set({ error: error.message, isLoading: false });
    }
  },
  
  fetchActiveConversations: async () => {
    try {
      set({ isLoading: true, error: null });
      
      // Use mock active conversations
      set({ 
        activeConversations: ['user-1', 'user-2'],
        isLoading: false 
      });
      
    } catch (error: any) {
      console.error('Error fetching active conversations:', error);
      set({ error: error.message, isLoading: false });
    }
  },
  
  markMessageAsRead: async (messageId: string) => {
    try {
      // Find the message in all conversations and mark it as read
      set(state => {
        const updatedDirectMessages = { ...state.directMessages };
        
        // Check each conversation
        Object.keys(updatedDirectMessages).forEach(userId => {
          updatedDirectMessages[userId] = updatedDirectMessages[userId].map(message => {
            if (message.id === messageId) {
              return { ...message, read_at: new Date().toISOString() };
            }
            return message;
          });
        });
        
        return { directMessages: updatedDirectMessages };
      });
      
    } catch (error: any) {
      console.error('Error marking message as read:', error);
    }
  }
}));
