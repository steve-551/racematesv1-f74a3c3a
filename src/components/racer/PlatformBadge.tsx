
import React from 'react';
import { Platform } from '@/stores/useRacerStore';
import { Badge } from '@/components/ui/badge';

interface PlatformBadgeProps {
  platform: Platform;
}

const PlatformBadge: React.FC<PlatformBadgeProps> = ({ platform }) => {
  // Different background colors based on platform
  let bgColor;
  switch (platform) {
    case 'iRacing':
      bgColor = 'bg-blue-800';
      break;
    case 'F1':
      bgColor = 'bg-red-800';
      break;
    case 'ACC':
      bgColor = 'bg-orange-800';
      break;
    case 'GT7':
      bgColor = 'bg-indigo-800';
      break;
    case 'rFactor':
      bgColor = 'bg-green-800';
      break;
    case 'Automobilista':
      bgColor = 'bg-purple-800';
      break;
    case 'RaceRoom':
      bgColor = 'bg-yellow-800 text-black';
      break;
    default:
      bgColor = 'bg-gray-800';
  }

  return (
    <Badge className={`${bgColor} mr-1 mb-1`} variant="outline">
      {platform}
    </Badge>
  );
};

export default PlatformBadge;
