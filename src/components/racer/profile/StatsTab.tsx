
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LicenseClassBadge from '@/components/racer/LicenseClassBadge';
import { Racer } from '@/stores/useRacerStore';

interface StatsDisciplineContentProps {
  stats: any;
}

const StatsDisciplineContent: React.FC<StatsDisciplineContentProps> = ({ stats }) => {
  if (!stats.irating && !stats.sr && !stats.licence) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No data available for this discipline.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="bg-gray-800 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Ratings & License</h3>
          {stats.licence && (
            <LicenseClassBadge licenseClass={stats.licence} size="lg" />
          )}
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-xs text-gray-400">iRating</p>
            <p className="text-2xl font-bold">{stats.irating || '-'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Safety Rating</p>
            <p className="text-2xl font-bold">{stats.sr ? stats.sr.toFixed(2) : '-'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Time Trial Rating</p>
            <p className="text-2xl font-bold">{stats.tt || '-'}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Race Statistics</h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-xs text-gray-400">Races</p>
            <p className="text-2xl font-bold">{stats.starts || '-'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Wins</p>
            <p className="text-2xl font-bold">{stats.wins || '-'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Top 5</p>
            <p className="text-2xl font-bold">{stats.top5 || '-'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Avg. Finish</p>
            <p className="text-2xl font-bold">{stats.avg_finish ? stats.avg_finish.toFixed(1) : '-'}</p>
          </div>
        </div>
        
        {stats.wins && stats.starts && (
          <div className="mt-4">
            <p className="text-sm text-gray-400">Win Rate: {((stats.wins / stats.starts) * 100).toFixed(1)}%</p>
            <div className="h-2 bg-gray-700 rounded-full mt-1">
              <div 
                className="h-full bg-green-500 rounded-full" 
                style={{ width: `${(stats.wins / stats.starts) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface StatsTabProps {
  currentRacer: Racer;
}

const StatsTab: React.FC<StatsTabProps> = ({ currentRacer }) => {
  return (
    <div className="grid grid-cols-1 gap-8">
      <Card className="racing-card">
        <CardHeader>
          <CardTitle className="font-rajdhani">Racing Statistics by Discipline</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="road" className="w-full">
            <TabsList className="w-full justify-start mb-4">
              <TabsTrigger value="road">Road</TabsTrigger>
              <TabsTrigger value="oval">Oval</TabsTrigger>
              <TabsTrigger value="dirt_road">Dirt Road</TabsTrigger>
              <TabsTrigger value="dirt_oval">Dirt Oval</TabsTrigger>
              <TabsTrigger value="rx">Rallycross</TabsTrigger>
            </TabsList>
            
            <TabsContent value="road">
              <StatsDisciplineContent stats={currentRacer.statsByDiscipline.road} />
            </TabsContent>
            
            <TabsContent value="oval">
              <StatsDisciplineContent stats={currentRacer.statsByDiscipline.oval} />
            </TabsContent>
            
            <TabsContent value="dirt_road">
              <StatsDisciplineContent stats={currentRacer.statsByDiscipline.dirt_road} />
            </TabsContent>
            
            <TabsContent value="dirt_oval">
              <StatsDisciplineContent stats={currentRacer.statsByDiscipline.dirt_oval} />
            </TabsContent>
            
            <TabsContent value="rx">
              <StatsDisciplineContent stats={currentRacer.statsByDiscipline.rx} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsTab;
