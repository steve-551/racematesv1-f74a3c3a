
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useRacerStore } from '@/stores/useRacerStore';

interface ProfileContextType {
  isProfileLoading: boolean;
  hasProfile: boolean;
  isAuthenticated: boolean;
}

const ProfileContext = createContext<ProfileContextType>({
  isProfileLoading: true,
  hasProfile: false,
  isAuthenticated: false
});

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthStore();
  const { currentRacer, fetchCurrentRacerProfile, isLoading } = useRacerStore();
  const [hasAttemptedProfileFetch, setHasAttemptedProfileFetch] = useState(false);

  useEffect(() => {
    if (user && !hasAttemptedProfileFetch) {
      const fetchProfile = async () => {
        await fetchCurrentRacerProfile();
        setHasAttemptedProfileFetch(true);
      };
      
      fetchProfile();
    } else if (!user) {
      setHasAttemptedProfileFetch(false);
    }
  }, [user, fetchCurrentRacerProfile, hasAttemptedProfileFetch]);

  const contextValue: ProfileContextType = {
    isProfileLoading: isLoading || (user && !hasAttemptedProfileFetch),
    hasProfile: !!currentRacer,
    isAuthenticated: !!user
  };

  return (
    <ProfileContext.Provider value={contextValue}>
      {children}
    </ProfileContext.Provider>
  );
};
