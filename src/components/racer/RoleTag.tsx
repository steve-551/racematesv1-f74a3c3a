
import React from 'react';
import { RoleTag as RoleTagType } from '@/stores/useRacerStore';

interface RoleTagProps {
  role: RoleTagType;
}

const RoleTag: React.FC<RoleTagProps> = ({ role }) => {
  let bgColor;
  
  switch (role) {
    case 'Driver':
      bgColor = 'bg-blue-900';
      break;
    case 'Strategist':
      bgColor = 'bg-green-900';
      break;
    case 'Team Manager':
      bgColor = 'bg-purple-900';
      break;
    case 'Endurance Pro':
      bgColor = 'bg-amber-900';
      break;
    case 'Sprint Specialist':
      bgColor = 'bg-red-900';
      break;
    case 'Coach':
      bgColor = 'bg-cyan-900';
      break;
    default:
      bgColor = 'bg-gray-800';
  }

  return (
    <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded ${bgColor} text-white mr-1 mb-1`}>
      {role}
    </span>
  );
};

export default RoleTag;
