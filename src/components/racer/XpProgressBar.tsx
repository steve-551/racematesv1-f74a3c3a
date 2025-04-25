
import React from 'react';
import { XpTier } from '@/stores/useRacerStore';
import { Progress } from '@/components/ui/progress';

interface XpProgressBarProps {
  level: number;
  points: number;
  tier: XpTier;
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
}

const XpProgressBar: React.FC<XpProgressBarProps> = ({ 
  level, 
  points, 
  tier, 
  size = 'md',
  showLabels = true 
}) => {
  
  // Function to get color class based on tier
  const getTierColorClass = (tier: XpTier) => {
    switch (tier) {
      case 'bronze': return 'bg-xp-bronze';
      case 'silver': return 'bg-xp-silver';
      case 'gold': return 'bg-xp-gold';
      case 'platinum': return 'bg-xp-platinum';
      case 'pro': return 'bg-xp-pro';
      default: return 'bg-xp-bronze';
    }
  };
  
  // Calculate progress percentage within the current level
  const progressToNextLevel = (points % 100) / 100 * 100;
  
  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3'
  };

  return (
    <div className="w-full">
      {showLabels && (
        <div className="flex justify-between items-center mb-1 text-xs">
          <span className="font-rajdhani font-semibold">LVL {level}</span>
          <span className={`font-rajdhani font-semibold uppercase text-${tier}`}>
            {tier} - {points} XP
          </span>
        </div>
      )}
      <div className={`xp-progress-bar ${sizeClasses[size]}`}>
        <div 
          className={`h-full ${getTierColorClass(tier)}`}
          style={{ width: `${progressToNextLevel}%` }}
        />
      </div>
    </div>
  );
};

export default XpProgressBar;
