
import { create } from 'zustand';
import { supabase } from '@/lib/supabaseClient';

export interface Event {
  id: string;
  creator_id: string;
  team_id?: string;
  title: string;
  description?: string;
  race_format: string;
  car_class: string;
  sim_platform: string;
  start_time: string;
  end_time?: string;
  estimated_duration?: number;
  visibility: string;
  created_at: string;
  updated_at: string;
}

export interface EventRSVP {
  id: string;
  event_id: string;
  profile_id: string;
  status: 'yes' | 'no' | 'maybe';
  role: string;
  team_id?: string;
  created_at: string;
  updated_at: string;
}

type EventState = {
  events: Event[];
  rsvps: { [eventId: string]: EventRSVP[] };
  isLoading: boolean;
  error: string | null;
  
  createEvent: (event: Omit<Event, 'id' | 'creator_id' | 'created_at' | 'updated_at'>) => Promise<Event | null>;
  fetchEvents: () => Promise<void>;
  fetchRSVPs: (eventId: string) => Promise<void>;
  updateEvent: (id: string, updates: Partial<Event>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  rsvpEvent: (eventId: string, status: 'yes' | 'no' | 'maybe', role?: string) => Promise<void>;
};

export const useEventStore = create<EventState>((set, get) => ({
  events: [],
  rsvps: {},
  isLoading: false,
  error: null,
  
  createEvent: async (event) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error('User not authenticated');
      }
      
      const newEvent = {
        ...event,
        creator_id: userData.user.id
      };
      
      const { data, error } = await supabase
        .from('events')
        .insert([newEvent])
        .select();
      
      if (error) {
        console.error('Error creating event:', error);
        set({ error: error.message, isLoading: false });
        return null;
      }
      
      if (data) {
        set(state => ({ 
          events: [...state.events, data[0]],
          isLoading: false
        }));
        return data[0];
      }
      
      return null;
    } catch (error: any) {
      console.error('Error creating event:', error);
      set({ error: error.message, isLoading: false });
      return null;
    }
  },
  
  fetchEvents: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('events')
        .select('*');
      
      if (error) {
        console.error('Error fetching events:', error);
        set({ error: error.message, isLoading: false });
        return;
      }
      
      set({ events: data || [], isLoading: false });
    } catch (error: any) {
      console.error('Error fetching events:', error);
      set({ error: error.message, isLoading: false });
    }
  },
  
  fetchRSVPs: async (eventId) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('event_rsvps')
        .select('*')
        .eq('event_id', eventId);
      
      if (error) {
        console.error('Error fetching event RSVPs:', error);
        set({ error: error.message, isLoading: false });
        return;
      }
      
      set(state => ({
        rsvps: {
          ...state.rsvps,
          [eventId]: data || []
        },
        isLoading: false
      }));
    } catch (error: any) {
      console.error('Error fetching event RSVPs:', error);
      set({ error: error.message, isLoading: false });
    }
  },
  
  updateEvent: async (id, updates) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('events')
        .update(updates)
        .eq('id', id)
        .select();
      
      if (error) {
        console.error('Error updating event:', error);
        set({ error: error.message, isLoading: false });
        return;
      }
      
      if (data) {
        set(state => ({
          events: state.events.map(event => 
            event.id === id ? data[0] : event
          ),
          isLoading: false
        }));
      }
    } catch (error: any) {
      console.error('Error updating event:', error);
      set({ error: error.message, isLoading: false });
    }
  },
  
  deleteEvent: async (id) => {
    try {
      set({ isLoading: true, error: null });
      
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting event:', error);
        set({ error: error.message, isLoading: false });
        return;
      }
      
      set(state => ({
        events: state.events.filter(event => event.id !== id),
        isLoading: false
      }));
    } catch (error: any) {
      console.error('Error deleting event:', error);
      set({ error: error.message, isLoading: false });
    }
  },
  
  rsvpEvent: async (eventId, status, role = 'Driver') => {
    try {
      set({ isLoading: true, error: null });
      
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error('User not authenticated');
      }
      
      const { error } = await supabase
        .from('event_rsvps')
        .upsert({ 
          event_id: eventId, 
          profile_id: userData.user.id,
          status,
          role 
        });
      
      if (error) {
        console.error('Error RSVPing to event:', error);
        set({ error: error.message, isLoading: false });
        return;
      }
      
      // Refresh RSVPs
      await get().fetchRSVPs(eventId);
      set({ isLoading: false });
    } catch (error: any) {
      console.error('Error RSVPing to event:', error);
      set({ error: error.message, isLoading: false });
    }
  }
}));
