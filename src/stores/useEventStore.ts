
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type EventState = {
  events: Tables<'events'>[];
  createEvent: (event: Partial<Tables<'events'>>) => Promise<void>;
  fetchEvents: () => Promise<void>;
  updateEvent: (id: string, updates: Partial<Tables<'events'>>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  rsvpEvent: (eventId: string, status: 'yes' | 'no' | 'maybe', role?: string) => Promise<void>;
};

export const useEventStore = create<EventState>((set, get) => ({
  events: [],
  
  createEvent: async (event) => {
    const { data, error } = await supabase
      .from('events')
      .insert(event)
      .select();
    
    if (error) throw error;
    if (data) {
      set(state => ({ events: [...state.events, data[0]] }));
    }
  },

  fetchEvents: async () => {
    const { data, error } = await supabase
      .from('events')
      .select('*');
    
    if (error) throw error;
    if (data) {
      set({ events: data });
    }
  },

  updateEvent: async (id, updates) => {
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
  },

  deleteEvent: async (id) => {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    set(state => ({
      events: state.events.filter(event => event.id !== id)
    }));
  },

  rsvpEvent: async (eventId, status, role = 'Driver') => {
    const { data, error } = await supabase
      .from('event_rsvps')
      .upsert({ 
        event_id: eventId, 
        profile_id: (await supabase.auth.getUser()).data.user?.id,
        status,
        role 
      })
      .select();
    
    if (error) throw error;
  }
}));
