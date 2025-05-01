
import React from 'react';

interface PlatformBadgeProps {
  platform: string;
}

const PlatformBadge: React.FC<PlatformBadgeProps> = ({ platform }) => {
  // Function to get appropriate color based on platform
  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'iracing':
        return 'bg-blue-900 text-blue-100';
      case 'f1':
        return 'bg-red-900 text-red-100';
      case 'acc':
        return 'bg-green-900 text-green-100';
      case 'gt7':
        return 'bg-purple-900 text-purple-100';
      case 'rfactor':
        return 'bg-yellow-900 text-yellow-100';
      case 'automobilista':
        return 'bg-orange-900 text-orange-100';
      case 'raceroom':
        return 'bg-indigo-900 text-indigo-100';
      default:
        return 'bg-gray-800 text-gray-200';
    }
  };

  const colorClasses = getPlatformColor(platform);

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${colorClasses}`}>
      {platform}
    </span>
  );
};

export default PlatformBadge;
