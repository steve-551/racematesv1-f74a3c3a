
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useRacerStore } from '@/stores/useRacerStore';
import { useTeamStore } from '@/stores/useTeamStore';
import { Team } from '@/stores/useTeamStore';
import { toast } from 'sonner';

interface ProfileContextType {
  isProfileLoading: boolean;
  hasProfile: boolean;
  isAuthenticated: boolean;
  userTeams: Team[];
  isLoadingTeams: boolean;
  refreshUserTeams: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType>({
  isProfileLoading: true,
  hasProfile: false,
  isAuthenticated: false,
  userTeams: [],
  isLoadingTeams: true,
  refreshUserTeams: async () => {}
});

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthStore();
  const { currentRacer, fetchCurrentRacerProfile, isLoading } = useRacerStore();
  const { teams, fetchTeams, isLoading: isTeamsLoading } = useTeamStore();
  const [hasAttemptedProfileFetch, setHasAttemptedProfileFetch] = useState(false);
  const [hasAttemptedTeamsFetch, setHasAttemptedTeamsFetch] = useState(false);
  const [userTeams, setUserTeams] = useState<Team[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Fetch profile on mount or when user changes
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Use mock data or fetch from API
        await fetchCurrentRacerProfile();
        setFetchError(null);
        setHasAttemptedProfileFetch(true);
      } catch (error) {
        console.error("Failed to fetch racer profile:", error);
        setFetchError("Failed to load profile data");
        toast.error("Failed to load your profile data");
        setHasAttemptedProfileFetch(true);
      }
    };
    
    // Always fetch in development mode for easier testing
    if (!hasAttemptedProfileFetch || user) {
      fetchProfile();
    }
  }, [user, fetchCurrentRacerProfile, hasAttemptedProfileFetch]);
  
  // Fetch teams on mount or when user changes
  useEffect(() => {
    const fetchUserTeams = async () => {
      try {
        await fetchTeams();
        setHasAttemptedTeamsFetch(true);
      } catch (error) {
        console.error("Failed to fetch teams:", error);
        setHasAttemptedTeamsFetch(true);
      }
    };
    
    // Always fetch in development mode for easier testing
    if (!hasAttemptedTeamsFetch || user) {
      fetchUserTeams();
    }
  }, [user, fetchTeams, hasAttemptedTeamsFetch]);
  
  // Filter teams the user is a member of
  useEffect(() => {
    if (teams.length > 0) {
      // In a real app, we would fetch team_members to determine which teams the user belongs to
      // For now, we'll use the first two teams from mock data for demonstration
      setUserTeams(teams.filter((_, index) => index < 2));
    }
  }, [teams, user]);
  
  const refreshUserTeams = async () => {
    try {
      await fetchTeams();
      return Promise.resolve();
    } catch (error) {
      console.error("Failed to refresh teams:", error);
      toast.error("Failed to refresh your teams data");
      return Promise.reject(error);
    }
  };

  const contextValue: ProfileContextType = {
    isProfileLoading: isLoading && !hasAttemptedProfileFetch,
    hasProfile: !!currentRacer,
    isAuthenticated: !!user,
    userTeams: userTeams,
    isLoadingTeams: isTeamsLoading && !hasAttemptedTeamsFetch,
    refreshUserTeams
  };

  return (
    <ProfileContext.Provider value={contextValue}>
      {children}
    </ProfileContext.Provider>
  );
};
