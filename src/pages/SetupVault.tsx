
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSetupStore } from '@/stores/useSetupStore';
import { useEffect } from 'react';

const SetupVault: React.FC = () => {
  const { setups, fetchSetups } = useSetupStore();

  useEffect(() => {
    fetchSetups();
  }, []);

  return (
    <div className="container mx-auto p-4 dark:bg-background dark:text-foreground min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Setup Vault</h1>
      <Button className="mb-4">Upload New Setup</Button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {setups.map(setup => (
          <Card key={setup.id} className="p-4">
            <h2 className="text-xl font-semibold">{setup.title}</h2>
            <p>{setup.car_model} - {setup.track_name}</p>
            <p>{setup.sim_platform}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SetupVault;
