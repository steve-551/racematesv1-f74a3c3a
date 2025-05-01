
import React from 'react';
import { Flag, Timer, Users, Trophy, Zap, GraduationCap } from 'lucide-react';

interface RoleTagProps {
  role: string;
}

const RoleTag: React.FC<RoleTagProps> = ({ role }) => {
  // Function to get icon and color based on role
  const getRoleStyles = (role: string): { icon: JSX.Element; color: string } => {
    switch (role.toLowerCase()) {
      case 'driver':
        return { 
          icon: <Flag className="h-3 w-3 mr-1" />, 
          color: 'bg-blue-900/60 border-blue-700 text-blue-300' 
        };
      case 'strategist':
        return { 
          icon: <Timer className="h-3 w-3 mr-1" />, 
          color: 'bg-purple-900/60 border-purple-700 text-purple-300' 
        };
      case 'team manager':
        return { 
          icon: <Users className="h-3 w-3 mr-1" />, 
          color: 'bg-amber-900/60 border-amber-700 text-amber-300' 
        };
      case 'endurance pro':
        return { 
          icon: <Zap className="h-3 w-3 mr-1" />, 
          color: 'bg-green-900/60 border-green-700 text-green-300' 
        };
      case 'sprint specialist':
        return { 
          icon: <Trophy className="h-3 w-3 mr-1" />, 
          color: 'bg-red-900/60 border-red-700 text-red-300' 
        };
      case 'coach':
        return { 
          icon: <GraduationCap className="h-3 w-3 mr-1" />, 
          color: 'bg-indigo-900/60 border-indigo-700 text-indigo-300' 
        };
      default:
        return { 
          icon: <Flag className="h-3 w-3 mr-1" />, 
          color: 'bg-gray-800 border-gray-700 text-gray-300' 
        };
    }
  };

  const { icon, color } = getRoleStyles(role);

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded border ${color} text-xs font-medium`}>
      {icon} {role}
    </span>
  );
};

export default RoleTag;
