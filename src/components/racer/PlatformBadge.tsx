
import React from 'react';
import { Platform } from '@/stores/useRacerStore';

interface PlatformBadgeProps {
  platform: Platform;
}

const PlatformBadge: React.FC<PlatformBadgeProps> = ({ platform }) => {
  return (
    <span className="platform-badge">
      {platform}
    </span>
  );
};

export default PlatformBadge;
