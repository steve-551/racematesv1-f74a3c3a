
import React, { useState } from 'react';
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // We're not using isLoading from the store as it doesn't exist
  const isLoading = false;

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
    <div className="flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="flex-1 p-4">
        <button 
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden fixed top-4 left-4 z-10 p-2 bg-gray-800 rounded-md"
        >
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
