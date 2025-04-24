
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Calendar, Car, Flag } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center dark:bg-background dark:text-foreground">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold mb-4">RaceMates Dashboard</h1>
        <div className="flex justify-center space-x-4">
          <Link to="/setups">
            <Button variant="secondary" className="p-6 flex flex-col items-center">
              <Car className="mb-2 h-8 w-8" />
              <span>Setup Vault</span>
            </Button>
          </Link>
          <Link to="/events">
            <Button variant="secondary" className="p-6 flex flex-col items-center">
              <Calendar className="mb-2 h-8 w-8" />
              <span>Event Browser</span>
            </Button>
          </Link>
          <Link to="/stints">
            <Button variant="secondary" className="p-6 flex flex-col items-center">
              <Flag className="mb-2 h-8 w-8" />
              <span>Stint Planner</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
