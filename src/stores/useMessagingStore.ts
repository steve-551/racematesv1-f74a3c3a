
import { create } from 'zustand';
import { supabase } from '@/lib/supabaseClient';

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

export const useMessagingStore = create<MessagingState>((set, get) => ({
  directMessages: {},
  teamMessages: {},
  activeConversations: [],
  isLoading: false,
  error: null,
  
  sendDirectMessage: async (recipientId: string, content: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error('User not authenticated');
      }
      
      const senderId = userData.user.id;
      
      const { data, error } = await supabase
        .from('direct_messages')
        .insert([{
          sender_id: senderId,
          recipient_id: recipientId,
          content
        }])
        .select(`
          *,
          sender:sender_id(id, display_name, avatar_url),
          recipient:recipient_id(id, display_name, avatar_url)
        `);
      
      if (error) {
        console.error('Error sending direct message:', error);
        set({ error: error.message, isLoading: false });
        return;
      }
      
      // Update state with new message
      const newMessage = data[0];
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
      
    } catch (error: any) {
      console.error('Error sending direct message:', error);
      set({ error: error.message, isLoading: false });
    }
  },
  
  fetchDirectMessages: async (userId: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error('User not authenticated');
      }
      
      const currentUserId = userData.user.id;
      
      // Fetch conversations between the current user and the selected user
      const { data, error } = await supabase
        .from('direct_messages')
        .select(`
          *,
          sender:sender_id(id, display_name, avatar_url),
          recipient:recipient_id(id, display_name, avatar_url)
        `)
        .or(`sender_id.eq.${currentUserId}.and.recipient_id.eq.${userId},sender_id.eq.${userId}.and.recipient_id.eq.${currentUserId}`)
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('Error fetching direct messages:', error);
        set({ error: error.message, isLoading: false });
        return;
      }
      
      set(state => ({
        directMessages: {
          ...state.directMessages,
          [userId]: data || []
        },
        isLoading: false
      }));
      
      // Mark messages as read
      const unreadMessages = data?.filter(msg => 
        !msg.read_at && 
        msg.recipient_id === currentUserId
      );
      
      if (unreadMessages && unreadMessages.length > 0) {
        for (const message of unreadMessages) {
          await get().markMessageAsRead(message.id);
        }
      }
      
    } catch (error: any) {
      console.error('Error fetching direct messages:', error);
      set({ error: error.message, isLoading: false });
    }
  },
  
  sendTeamMessage: async (teamId: string, content: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error('User not authenticated');
      }
      
      const senderId = userData.user.id;
      
      const { data, error } = await supabase
        .from('team_chats')
        .insert([{
          team_id: teamId,
          sender_id: senderId,
          content
        }])
        .select(`
          *,
          sender:sender_id(id, display_name, avatar_url)
        `);
      
      if (error) {
        console.error('Error sending team message:', error);
        set({ error: error.message, isLoading: false });
        return;
      }
      
      // Update state with new message
      const newMessage = data[0];
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
      
    } catch (error: any) {
      console.error('Error sending team message:', error);
      set({ error: error.message, isLoading: false });
    }
  },
  
  fetchTeamMessages: async (teamId: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('team_chats')
        .select(`
          *,
          sender:sender_id(id, display_name, avatar_url)
        `)
        .eq('team_id', teamId)
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('Error fetching team messages:', error);
        set({ error: error.message, isLoading: false });
        return;
      }
      
      set(state => ({
        teamMessages: {
          ...state.teamMessages,
          [teamId]: data || []
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
      
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error('User not authenticated');
      }
      
      const userId = userData.user.id;
      
      // Find all users that the current user has exchanged messages with
      const { data, error } = await supabase
        .from('direct_messages')
        .select(`
          distinct sender_id, recipient_id,
          sender:sender_id(id, display_name, avatar_url),
          recipient:recipient_id(id, display_name, avatar_url)
        `)
        .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching active conversations:', error);
        set({ error: error.message, isLoading: false });
        return;
      }
      
      if (data) {
        // Extract unique conversation partners
        const uniqueConversations = new Set<string>();
        data.forEach(msg => {
          const partnerId = msg.sender_id === userId ? msg.recipient_id : msg.sender_id;
          uniqueConversations.add(partnerId);
        });
        
        set({ activeConversations: Array.from(uniqueConversations), isLoading: false });
      }
      
    } catch (error: any) {
      console.error('Error fetching active conversations:', error);
      set({ error: error.message, isLoading: false });
    }
  },
  
  markMessageAsRead: async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('direct_messages')
        .update({ read_at: new Date().toISOString() })
        .eq('id', messageId);
      
      if (error) {
        console.error('Error marking message as read:', error);
      }
    } catch (error: any) {
      console.error('Error marking message as read:', error);
    }
  }
}));
