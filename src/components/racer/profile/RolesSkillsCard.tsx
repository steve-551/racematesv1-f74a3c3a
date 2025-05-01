
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Racer } from '@/stores/useRacerStore';
import RoleTag from '@/components/racer/RoleTag';

interface RolesSkillsCardProps {
  currentRacer: Racer;
  isEditing?: boolean;
  formData?: any;
  handleCheckboxChange?: (name: 'role_tags' | 'driving_styles', value: string, checked: boolean) => void;
}

const RolesSkillsCard: React.FC<RolesSkillsCardProps> = ({ 
  currentRacer,
  isEditing = false,
  formData,
  handleCheckboxChange
}) => {
  return (
    <Card className="racing-card">
      <CardHeader className="pb-2">
        <CardTitle className="font-rajdhani">Roles & Driving Style</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-md font-semibold">Preferred Roles</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {isEditing ? (
              <div className="grid grid-cols-2 gap-2">
                {['Driver', 'Strategist', 'Team Manager', 'Endurance Pro', 'Sprint Specialist', 'Coach'].map(role => (
                  <label key={role} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData?.role_tags?.includes(role)}
                      onChange={(e) => handleCheckboxChange?.('role_tags', role, e.target.checked)}
                      className="h-4 w-4"
                    />
                    <span>{role}</span>
                  </label>
                ))}
              </div>
            ) : (
              currentRacer.role_tags && currentRacer.role_tags.length > 0 ? (
                currentRacer.role_tags.map((role, idx) => (
                  <RoleTag key={idx} role={role} />
                ))
              ) : (
                <p className="text-gray-400 italic">No roles specified.</p>
              )
            )}
          </div>
        </div>
        
        <div>
          <h3 className="text-md font-semibold">Driving Style</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {isEditing ? (
              <div className="grid grid-cols-2 gap-2">
                {['Aggressive', 'Defensive', 'Conservative', 'Balanced', 'Endurance', 'Sprint'].map(style => (
                  <label key={style} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData?.driving_styles?.includes(style)}
                      onChange={(e) => handleCheckboxChange?.('driving_styles', style, e.target.checked)}
                      className="h-4 w-4"
                    />
                    <span>{style}</span>
                  </label>
                ))}
              </div>
            ) : (
              currentRacer.driving_styles && currentRacer.driving_styles.length > 0 ? (
                currentRacer.driving_styles.map((style, idx) => (
                  <span key={idx} className="px-3 py-1 bg-gray-800 text-white rounded-md text-sm">
                    {style}
                  </span>
                ))
              ) : (
                <p className="text-gray-400 italic">No driving styles specified.</p>
              )
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-md font-semibold">Strengths</h3>
            <ul className="list-disc list-inside text-sm text-gray-300">
              <li>Consistent lap times</li>
              <li>Smooth driving style</li>
              <li>Fuel management</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-md font-semibold">Experience</h3>
            <ul className="list-disc list-inside text-sm text-gray-300">
              <li>3+ years sim racing</li>
              <li>Multiple endurance events</li>
              <li>Team leadership</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RolesSkillsCard;
