import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { useProfile } from '@/components/providers/ProfileProvider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { LayoutDashboard, Users, Calendar, Settings, Menu, X, LogOut, User, FileText, MessageSquare, Home, UserPlus } from 'lucide-react';
interface SidebarProps {
  children: React.ReactNode;
}
export const Sidebar: React.FC<SidebarProps> = ({
  children
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const {
    user,
    signOut
  } = useAuthStore();
  const {
    hasProfile
  } = useProfile();
  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);
  const navItems = [{
    path: '/dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />,
    label: 'Dashboard'
  }, {
    path: '/find-racers',
    icon: <Users className="h-5 w-5" />,
    label: 'Find Racers'
  }, {
    path: '/events',
    icon: <Calendar className="h-5 w-5" />,
    label: 'Events'
  }, {
    path: '/teams',
    icon: <UserPlus className="h-5 w-5" />,
    label: 'Teams'
  }, {
    path: '/setups',
    icon: <FileText className="h-5 w-5" />,
    label: 'Setups'
  }, {
    path: '/stints',
    icon: <Calendar className="h-5 w-5" />,
    label: 'Stint Planner'
  }, {
    path: '/notice-board',
    icon: <MessageSquare className="h-5 w-5" />,
    label: 'Notice Board'
  }, {
    path: '/profile',
    icon: <User className="h-5 w-5" />,
    label: 'My Profile'
  }];
  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/';
  };
  return <div className="flex min-h-screen">
      {/* Mobile Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={closeSidebar} />}

      {/* Mobile Toggle Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button variant="outline" size="icon" onClick={toggleSidebar} className="dark:bg-gray-900 dark:text-white">
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full z-50 w-64 transform transition-transform duration-200 ease-in-out bg-gray-900 text-white
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}>
        <div className="flex flex-col h-full bg-neutral-200 rounded-2xl">
          {/* Sidebar Header */}
          <div className="p-4 bg-neutral-50 rounded-none">
            <div className="flex items-center justify-between">
              <Link to="/" onClick={closeSidebar} className="flex items-center space-x-2">
                <div className="font-orbitron text-xl font-bold">Race Mates</div>
              </Link>
              <Button variant="ghost" size="icon" className="lg:hidden" onClick={closeSidebar}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <Separator className="bg-gray-700" />

          {/* User Info */}
          {user && <div className="p-4">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.user_metadata?.avatar_url || undefined} />
                  <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-bold text-xs">{user.user_metadata?.full_name || user.email}</span>
                  <span className="text-xs text-gray-400">{user.email}</span>
                </div>
              </div>
            </div>}

          {/* Navigation */}
          <div className="mt-4 flex-1 overflow-y-auto">
            <nav className="space-y-1 px-2">
              {navItems.map(item => <Link key={item.path} to={item.path} onClick={closeSidebar} className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors 
                  hover:bg-gray-700 
                  ${location.pathname === item.path ? 'bg-gray-800 text-white' : 'text-gray-300'}`}>
                  {item.icon}
                  <span>{item.label}</span>
                </Link>)}
            </nav>
          </div>

          {/* Sidebar Footer */}
          <div className="p-4">
            <Separator className="mb-4 bg-gray-700" />
            <div className="flex flex-col space-y-2">
              <Button variant="ghost" onClick={handleSignOut} className="flex justify-start space-x-3 text-gray-300 hover:text-white bg-racing-red">
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full">
        {children}
      </div>
    </div>;
};
export default Sidebar;