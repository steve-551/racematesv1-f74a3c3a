
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useStintStore } from '@/stores/useStintStore';
import { useEffect } from 'react';

const StintPlanner: React.FC = () => {
  const { stints, fetchStintsForEvent } = useStintStore();

  useEffect(() => {
    // For MVP, we'll fetch stints for a hardcoded event
    // In a real implementation, this would be dynamically selected
    fetchStintsForEvent('some-event-id');
  }, []);

  return (
    <div className="container mx-auto p-4 dark:bg-background dark:text-foreground min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Stint Planner</h1>
      <Button className="mb-4">Add Stint</Button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stints.map(stint => (
          <Card key={stint.id} className="p-4" style={{backgroundColor: stint.color}}>
            <h2 className="text-xl font-semibold">Driver Stint</h2>
            <p>Start: {new Date(stint.start_time).toLocaleString()}</p>
            <p>End: {new Date(stint.end_time).toLocaleString()}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StintPlanner;
