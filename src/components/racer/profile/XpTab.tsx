
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import XpProgressBar from '@/components/racer/XpProgressBar';
import { Racer } from '@/stores/useRacerStore';

interface XpTabProps {
  currentRacer: Racer;
}

const XpTab: React.FC<XpTabProps> = ({ currentRacer }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <Card className="racing-card lg:col-span-2">
        <CardHeader>
          <CardTitle className="font-rajdhani">XP History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-gray-800 pb-2">
              <span>Event Participation: 24h Le Mans</span>
              <span className="text-green-400">+250 XP</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-800 pb-2">
              <span>Setup Shared: GT3 Monza</span>
              <span className="text-green-400">+50 XP</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-800 pb-2">
              <span>Profile Completion</span>
              <span className="text-green-400">+100 XP</span>
            </div>
            <div className="flex justify-between items-center">
              <span>iRating Milestone: 2000+</span>
              <span className="text-green-400">+200 XP</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="racing-card lg:col-span-1">
        <CardHeader>
          <CardTitle className="font-rajdhani">Tier Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm">Current Tier</span>
              <span className={`text-sm font-semibold text-${currentRacer.xp_tier}`}>
                {currentRacer.xp_tier.toUpperCase()}
              </span>
            </div>
            <XpProgressBar
              level={currentRacer.xp_level}
              points={currentRacer.xp_points}
              tier={currentRacer.xp_tier}
              size="md"
              showLabels={false}
            />
          </div>
          
          <h4 className="font-semibold mb-2">Tier Thresholds</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Bronze</span>
              <span>&lt; 1500 XP</span>
            </div>
            <div className="flex justify-between">
              <span>Silver</span>
              <span>1500 - 1999 XP</span>
            </div>
            <div className="flex justify-between">
              <span>Gold</span>
              <span>2000 - 2499 XP</span>
            </div>
            <div className="flex justify-between">
              <span>Platinum</span>
              <span>2500 - 2999 XP</span>
            </div>
            <div className="flex justify-between">
              <span>Pro</span>
              <span>3000+ XP</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default XpTab;
