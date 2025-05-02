
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Calendar, 
  FolderCog2, 
  GaugeCircle, 
  LayoutGrid, 
  LogOut, 
  MessageSquare, 
  Settings, 
  Timer, 
  User, 
  Users, 
  Trash2, 
  ScrollText,
  BellDot
} from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { Button } from '@/components/ui/button';
import { useProfile } from '@/components/providers/ProfileProvider';
import { toast } from 'sonner';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user, signOut } = useAuthStore();
  const { hasProfile } = useProfile();
  
  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logged out successfully!");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
  };
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const navigationItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutGrid size={18} /> },
    { name: 'Events', path: '/events', icon: <Calendar size={18} /> },
    { name: 'Teams', path: '/teams', icon: <Users size={18} /> },
    { name: 'Find Racers', path: '/find-racers', icon: <User size={18} /> },
    { name: 'Messages', path: '/messages', icon: <MessageSquare size={18} /> },
    { name: 'Notice Board', path: '/notice-board', icon: <ScrollText size={18} /> },
    { name: 'Setups', path: '/setups', icon: <FolderCog2 size={18} /> },
    { name: 'Stint Planner', path: '/stint-planner', icon: <Timer size={18} /> },
    { name: 'Telemetry', path: '/telemetry', icon: <GaugeCircle size={18} /> },
    { name: 'Notifications', path: '/notifications', icon: <BellDot size={18} /> },
  ];
  
  const bottomItems = [
    { name: 'Settings', path: '/settings/account', icon: <Settings size={18} /> },
    { name: 'Trash', path: '/trash', icon: <Trash2 size={18} /> },
  ];
  
  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static flex flex-col`}
    >
      <div className="p-4 border-b border-gray-800">
        <h1 className="text-xl font-bold font-orbitron">Race Manager</h1>
        <p className="text-sm text-gray-400">Pro Racing Management</p>
      </div>
      
      <div className="flex-grow overflow-y-auto py-4">
        <nav className="px-3 space-y-1">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-blue-600 text-white font-medium'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
              onClick={onClose}
            >
              <span className="mr-3">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>
      
      <div className="p-3 border-t border-gray-800">
        <nav className="space-y-1">
          {bottomItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-blue-600 text-white font-medium'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
              onClick={onClose}
            >
              <span className="mr-3">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
          
          {user && (
            <Button 
              variant="ghost" 
              className="flex items-center px-3 py-2 rounded-lg text-red-400 hover:bg-gray-800 w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut size={18} className="mr-3" />
              <span>Logout</span>
            </Button>
          )}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
