
import React from 'react';
import { LicenseClass } from '@/stores/useRacerStore';

interface LicenseClassBadgeProps {
  licenseClass: LicenseClass;
  size?: 'sm' | 'md' | 'lg';
}

const LicenseClassBadge: React.FC<LicenseClassBadgeProps> = ({ licenseClass, size = 'md' }) => {
  let bgColor;
  let textColor = 'text-white';
  
  switch (licenseClass) {
    case 'rookie':
      bgColor = 'bg-license-rookie';
      break;
    case 'D':
      bgColor = 'bg-license-D';
      break;
    case 'C':
      bgColor = 'bg-license-C';
      textColor = 'text-black';
      break;
    case 'B':
      bgColor = 'bg-license-B';
      textColor = 'text-black';
      break;
    case 'A':
      bgColor = 'bg-license-A';
      break;
    case 'pro':
      bgColor = 'bg-license-pro';
      break;
    case 'black':
      bgColor = 'bg-license-black';
      break;
    default:
      bgColor = 'bg-gray-500';
  }

  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-1',
    lg: 'text-base px-3 py-1.5'
  };

  return (
    <span className={`license-badge font-rajdhani font-semibold ${bgColor} ${textColor} ${sizeClasses[size]}`}>
      {licenseClass === 'pro' ? 'PRO' : licenseClass === 'black' ? 'WC' : licenseClass}
    </span>
  );
};

export default LicenseClassBadge;
