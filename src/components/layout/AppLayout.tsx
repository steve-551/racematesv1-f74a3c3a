
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Users, 
  Calendar, 
  Car, 
  Flag, 
  User,
  LogOut,
  Menu,
} from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { toast } from 'sonner';
import { useOnboardingStore } from '@/stores/useOnboardingStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { supabase } from '@/integrations/supabase/client';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { user, signOut } = useAuthStore();
  const { checkOnboardingStatus } = useOnboardingStore();
  const navigate = useNavigate();
  const [isOnboardingComplete, setIsOnboardingComplete] = React.useState(true);

  React.useEffect(() => {
    const checkStatus = async () => {
      const status = await checkOnboardingStatus();
      setIsOnboardingComplete(status);
      
      if (!status && user) {
        navigate('/onboarding');
      }
    };
    
    checkStatus();
  }, [user, navigate, checkOnboardingStatus]);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  const getInitials = () => {
    if (!user || !user.email) return 'U';
    return user.email.substring(0, 2).toUpperCase();
  };

  const navItems = [
    { title: 'Dashboard', path: '/dashboard', icon: Home },
    { title: 'Find Racers', path: '/find-racers', icon: Users },
    { title: 'Events', path: '/events', icon: Calendar },
    { title: 'Setup Vault', path: '/setups', icon: Car },
    { title: 'Stint Planner', path: '/stints', icon: Flag },
    { title: 'My Profile', path: '/profile', icon: User },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-racing-dark text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-racing-dark-alt">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/dashboard" className="flex items-center">
            <h1 className="text-2xl font-orbitron font-bold text-white tracking-wider">
              RACE<span className="text-racing-red">MATES</span>
            </h1>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path} 
                className="flex items-center gap-1.5 text-gray-300 hover:text-white transition"
              >
                <item.icon size={18} />
                <span>{item.title}</span>
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8 bg-racing-red">
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback>{getInitials()}</AvatarFallback>
            </Avatar>
            
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="hidden md:flex">
              <LogOut size={18} className="mr-1" /> Sign Out
            </Button>

            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-racing-dark-alt border-gray-800 text-white">
                <div className="flex flex-col gap-6 pt-10">
                  {navItems.map((item) => (
                    <Link 
                      key={item.path} 
                      to={item.path} 
                      className="flex items-center gap-3 px-2 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition"
                    >
                      <item.icon size={20} />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  ))}
                  
                  <Button 
                    variant="ghost" 
                    className="flex items-center justify-start gap-3 px-2 py-6 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition"
                    onClick={handleSignOut}
                  >
                    <LogOut size={20} />
                    <span className="font-medium">Sign Out</span>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-racing-dark-alt border-t border-gray-800 py-4">
        <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
          <p>© 2025 RaceMates Network. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;
