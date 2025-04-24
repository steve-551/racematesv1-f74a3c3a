
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEventStore } from '@/stores/useEventStore';
import { useEffect } from 'react';
import { format } from 'date-fns';

const EventBrowser: React.FC = () => {
  const { events, fetchEvents, rsvpEvent } = useEventStore();

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="container mx-auto p-4 dark:bg-background dark:text-foreground min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Event Browser</h1>
      <Button className="mb-4">Create New Event</Button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map(event => (
          <Card key={event.id} className="p-4">
            <h2 className="text-xl font-semibold">{event.title}</h2>
            <p>{format(new Date(event.start_time), 'PPP')}</p>
            <p>{event.sim_platform} - {event.car_class}</p>
            <div className="mt-2 flex space-x-2">
              <Button onClick={() => rsvpEvent(event.id, 'yes')}>Going</Button>
              <Button variant="secondary" onClick={() => rsvpEvent(event.id, 'maybe')}>Maybe</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EventBrowser;
