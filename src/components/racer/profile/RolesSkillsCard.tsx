
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import RoleTag from '@/components/racer/RoleTag';
import { Racer } from '@/stores/useRacerStore';

interface RolesSkillsCardProps {
  currentRacer: Racer;
}

const RolesSkillsCard: React.FC<RolesSkillsCardProps> = ({ currentRacer }) => {
  return (
    <Card className="racing-card">
      <CardHeader className="pb-2">
        <CardTitle className="font-rajdhani">Roles & Skills</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          {currentRacer.role_tags.map(role => (
            <RoleTag key={role} role={role} />
          ))}
        </div>
        
        <div className="mt-4">
          <h3 className="text-md font-semibold">Driving Styles</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {currentRacer.driving_styles.map((style, idx) => (
              <span key={idx} className="px-3 py-1 bg-gray-800 text-white rounded-md text-sm">
                {style}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RolesSkillsCard;
