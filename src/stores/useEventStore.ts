
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert } from '@/integrations/supabase/types';

type EventState = {
  events: Tables<'events'>[];
  createEvent: (event: TablesInsert<'events'>) => Promise<void>;
  fetchEvents: () => Promise<void>;
  updateEvent: (id: string, updates: TablesInsert<'events'>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  rsvpEvent: (eventId: string, status: 'yes' | 'no' | 'maybe', role?: string) => Promise<void>;
};

export const useEventStore = create<EventState>((set, get) => ({
  events: [],
  
  createEvent: async (event) => {
    try {
      // Ensure creator_id is set to the current user
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('User not authenticated');
      
      const eventWithCreator = {
        ...event,
        creator_id: userData.user.id
      };
      
      const { data, error } = await supabase
        .from('events')
        .insert(eventWithCreator)
        .select();
      
      if (error) throw error;
      if (data) {
        set(state => ({ events: [...state.events, data[0]] }));
      }
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  },

  fetchEvents: async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*');
      
      if (error) throw error;
      if (data) {
        set({ events: data });
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  },

  updateEvent: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('events')
        .update(updates)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      if (data) {
        set(state => ({
          events: state.events.map(event => 
            event.id === id ? data[0] : event
          )
        }));
      }
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  },

  deleteEvent: async (id) => {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      set(state => ({
        events: state.events.filter(event => event.id !== id)
      }));
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  },

  rsvpEvent: async (eventId, status, role = 'Driver') => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('event_rsvps')
        .upsert({ 
          event_id: eventId, 
          profile_id: userData.user.id,
          status,
          role 
        })
        .select();
      
      if (error) throw error;
    } catch (error) {
      console.error('Error RSVP-ing to event:', error);
      throw error;
    }
  }
}));
