
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

  // Fetch profile on mount if user is logged in
  useEffect(() => {
    if (user && !hasAttemptedProfileFetch) {
      const fetchProfile = async () => {
        try {
          await fetchCurrentRacerProfile();
          setFetchError(null);
        } catch (error) {
          console.error("Failed to fetch racer profile:", error);
          setFetchError("Failed to load profile data");
          toast.error("Failed to load your profile data");
        } finally {
          setHasAttemptedProfileFetch(true);
        }
      };
      
      fetchProfile();
    } else if (!user) {
      setHasAttemptedProfileFetch(false);
    }
  }, [user, fetchCurrentRacerProfile, hasAttemptedProfileFetch]);
  
  // Fetch teams on mount if user is logged in
  useEffect(() => {
    if (user && !hasAttemptedTeamsFetch) {
      const fetchUserTeams = async () => {
        try {
          await fetchTeams();
        } catch (error) {
          console.error("Failed to fetch teams:", error);
          // Don't show toast here since it's already being shown from fetchTeams
        } finally {
          setHasAttemptedTeamsFetch(true);
        }
      };
      
      fetchUserTeams();
    } else if (!user) {
      setHasAttemptedTeamsFetch(false);
    }
  }, [user, fetchTeams, hasAttemptedTeamsFetch]);
  
  // Filter teams the user is a member of
  useEffect(() => {
    if (teams.length > 0 && user) {
      // In a real app, we would fetch team_members to determine which teams the user belongs to
      // For now, we'll just use mock data
      setUserTeams(teams.filter((_, index) => index < 2));
    }
  }, [teams, user]);
  
  const refreshUserTeams = async () => {
    if (user) {
      try {
        await fetchTeams();
        return Promise.resolve();
      } catch (error) {
        console.error("Failed to refresh teams:", error);
        toast.error("Failed to refresh your teams data");
        return Promise.reject(error);
      }
    }
    return Promise.resolve();
  };

  const contextValue: ProfileContextType = {
    isProfileLoading: isLoading || (user && !hasAttemptedProfileFetch),
    hasProfile: !!currentRacer,
    isAuthenticated: !!user,
    userTeams: userTeams,
    isLoadingTeams: isTeamsLoading || (user && !hasAttemptedTeamsFetch),
    refreshUserTeams
  };

  return (
    <ProfileContext.Provider value={contextValue}>
      {children}
    </ProfileContext.Provider>
  );
};
