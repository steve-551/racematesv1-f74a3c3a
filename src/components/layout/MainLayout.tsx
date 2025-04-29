
import React from 'react';
import Sidebar from './Sidebar';
import { useAuthStore } from '@/stores/useAuthStore';
import { Navigate } from 'react-router-dom';

interface MainLayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  requireAuth = true
}) => {
  const { user, session } = useAuthStore();
  const isLoading = false; // We'll use a simple loading state since isLoading isn't in AuthState

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-blue-500" />
      </div>
    );
  }

  if (requireAuth && !user) {
    return <Navigate to="/" />;
  }

  return (
    <Sidebar>
      {children}
    </Sidebar>
  );
};

export default MainLayout;
