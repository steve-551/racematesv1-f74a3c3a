
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

  useEffect(() => {
    if (user && !hasAttemptedProfileFetch) {
      const fetchProfile = async () => {
        try {
          await fetchCurrentRacerProfile();
          setHasAttemptedProfileFetch(true);
        } catch (error) {
          console.error("Failed to fetch racer profile:", error);
          toast.error("Failed to load your profile data");
        }
      };
      
      fetchProfile();
    } else if (!user) {
      setHasAttemptedProfileFetch(false);
    }
  }, [user, fetchCurrentRacerProfile, hasAttemptedProfileFetch]);
  
  useEffect(() => {
    if (user && !hasAttemptedTeamsFetch) {
      const fetchUserTeams = async () => {
        try {
          await fetchTeams();
          setHasAttemptedTeamsFetch(true);
        } catch (error) {
          console.error("Failed to fetch teams:", error);
          toast.error("Failed to load your teams data");
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
      } catch (error) {
        console.error("Failed to refresh teams:", error);
        toast.error("Failed to refresh your teams data");
      }
    }
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
