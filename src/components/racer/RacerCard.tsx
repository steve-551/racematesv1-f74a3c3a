
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { RacerProfile } from '@/stores/useRacerStore';
import LicenseClassBadge from './LicenseClassBadge';
import XpProgressBar from './XpProgressBar';
import PlatformBadge from './PlatformBadge';
import RoleTag from './RoleTag';
import { UserPlus, Users, Eye } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface RacerCardProps {
  racer: RacerProfile;
}

const RacerCard: React.FC<RacerCardProps> = ({ racer }) => {
  return (
    <div className="racing-card p-4 hover:transform hover:scale-[1.01] transition-all duration-200">
      <div className="flex items-start">
        <Avatar className="h-16 w-16 mr-3">
          <AvatarImage src={racer.avatar_url} />
          <AvatarFallback>{racer.display_name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        
        <div className="flex flex-col flex-grow">
          <div className="flex justify-between items-start">
            <h3 className="font-rajdhani font-bold text-lg">{racer.display_name}</h3>
            <div className="flex space-x-1">
              <LicenseClassBadge licenseClass={racer.iracing_stats.license_class} size="sm" />
            </div>
          </div>
          
          <div className="mt-1 flex flex-wrap gap-1">
            {racer.platforms.map(platform => (
              <PlatformBadge key={platform} platform={platform} />
            ))}
          </div>
          
          <div className="mt-2">
            <span className="text-sm text-gray-300">
              {racer.xp_tier.charAt(0).toUpperCase() + racer.xp_tier.slice(1)} – {racer.iracing_stats.irating} iR
            </span>
          </div>
          
          <div className="mt-1">
            <XpProgressBar 
              level={racer.xp_level}
              points={racer.xp_points}
              tier={racer.xp_tier}
              size="sm"
              showLabels={false}
            />
          </div>
          
          <div className="mt-2 flex flex-wrap">
            {racer.role_tags.map(role => (
              <RoleTag key={role} role={role} />
            ))}
          </div>
        </div>
      </div>
      
      {racer.looking_for_team && (
        <div className="mt-3">
          <span className="text-xs font-medium bg-green-900 text-white px-2 py-0.5 rounded">
            Looking for Team
          </span>
        </div>
      )}
      
      <div className="mt-4 flex justify-between">
        <Button size="sm" variant="outline" className="text-xs">
          <UserPlus size={14} className="mr-1" /> Add Friend
        </Button>
        
        {racer.looking_for_team && (
          <Button size="sm" variant="outline" className="text-xs">
            <Users size={14} className="mr-1" /> Invite to Team
          </Button>
        )}
        
        <Button size="sm" variant="secondary" className="text-xs" asChild>
          <Link to={`/racers/${racer.id}`}>
            <Eye size={14} className="mr-1" /> Profile
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default RacerCard;
