
import React, { useEffect, useState } from 'react';
import { useRacerStore } from '@/stores/useRacerStore';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Edit } from 'lucide-react';
import { toast } from 'sonner';
import { useProfile } from '@/components/providers/ProfileProvider';

// Import refactored components
import ProfileTab from '@/components/racer/profile/ProfileTab';
import StatsTab from '@/components/racer/profile/StatsTab';
import TeamsTab from '@/components/racer/profile/TeamsTab';
import XpTab from '@/components/racer/profile/XpTab';

const MyRacerProfile: React.FC = () => {
  const { currentRacer, fetchCurrentRacerProfile, updateRacerProfile, toggleLookingForTeam, isLoading } = useRacerStore();
  const { isProfileLoading, userTeams } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    display_name: '',
    full_name: '',
    age: 0,
    bio: '',
    career_summary: '',
    achievements: '',
    future_goals: '',
    favorite_disciplines: [] as string[],
    favorite_car_types: [] as string[],
    series_focus: [] as string[],
    commitment_level: '',
    availability_hours: 0,
    platforms: [] as string[],
    driving_styles: [] as string[],
    role_tags: [] as string[],
    region: '',
    timezone: '',
    looking_for_team: false
  });
  
  useEffect(() => {
    fetchCurrentRacerProfile();
  }, [fetchCurrentRacerProfile]);
  
  useEffect(() => {
    if (currentRacer) {
      setFormData({
        display_name: currentRacer.display_name,
        full_name: currentRacer.full_name || '',
        age: currentRacer.age || 0,
        bio: currentRacer.bio || '',
        career_summary: currentRacer.career_summary || '',
        achievements: currentRacer.achievements || '',
        future_goals: currentRacer.future_goals || '',
        favorite_disciplines: currentRacer.favorite_disciplines || [],
        favorite_car_types: currentRacer.favorite_car_types || [],
        series_focus: currentRacer.series_focus || [],
        commitment_level: currentRacer.commitment_level || '',
        availability_hours: currentRacer.availability_hours || 0,
        platforms: [...(currentRacer.platforms || [])],
        driving_styles: [...(currentRacer.driving_styles || [])],
        role_tags: [...(currentRacer.role_tags || [])],
        region: currentRacer.region || '',
        timezone: currentRacer.timezone || '',
        looking_for_team: currentRacer.looking_for_team
      });
    }
  }, [currentRacer]);
  
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    
    if (isEditing && currentRacer) {
      setFormData({
        display_name: currentRacer.display_name,
        full_name: currentRacer.full_name || '',
        age: currentRacer.age || 0,
        bio: currentRacer.bio || '',
        career_summary: currentRacer.career_summary || '',
        achievements: currentRacer.achievements || '',
        future_goals: currentRacer.future_goals || '',
        favorite_disciplines: currentRacer.favorite_disciplines || [],
        favorite_car_types: currentRacer.favorite_car_types || [],
        series_focus: currentRacer.series_focus || [],
        commitment_level: currentRacer.commitment_level || '',
        availability_hours: currentRacer.availability_hours || 0,
        platforms: [...(currentRacer.platforms || [])],
        driving_styles: [...(currentRacer.driving_styles || [])],
        role_tags: [...(currentRacer.role_tags || [])],
        region: currentRacer.region || '',
        timezone: currentRacer.timezone || '',
        looking_for_team: currentRacer.looking_for_team
      });
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleCheckboxChange = (name: 'platforms' | 'driving_styles' | 'favorite_disciplines' | 'favorite_car_types' | 'series_focus' | 'role_tags' | 'looking_for_team', value: string, checked: boolean) => {
    if (name === 'looking_for_team') {
      setFormData(prev => ({ ...prev, [name]: checked }));
      return;
    }
    
    setFormData(prev => {
      const currentValues = prev[name];
      if (checked) {
        return { ...prev, [name]: [...currentValues, value] };
      } else {
        return { ...prev, [name]: currentValues.filter(v => v !== value) };
      }
    });
  };
  
  const handleSaveProfile = async () => {
    try {
      await updateRacerProfile(formData);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error(error);
    }
  };
  
  const handleToggleLookingForTeam = async (value: boolean) => {
    try {
      await toggleLookingForTeam(value);
      toast.success(value ? 'Now looking for a team' : 'No longer looking for a team');
    } catch (error) {
      toast.error('Failed to update status');
      console.error(error);
    }
  };
  
  // Use combined loading state from both sources
  const combinedLoading = isProfileLoading || isLoading;
  
  if (combinedLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-lg">Loading profile...</p>
        </div>
      </MainLayout>
    );
  }
  
  if (!currentRacer) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-lg">No profile found. Please sign in or create an account.</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-orbitron font-bold">My Racer Profile</h1>
          
          <Button 
            variant={isEditing ? "outline" : "default"} 
            onClick={handleEditToggle}
            className={isEditing ? "" : "racing-btn"}
          >
            {isEditing ? (
              <>
                <Edit className="mr-2 h-4 w-4" /> Cancel Editing
              </>
            ) : (
              <>
                <Edit className="mr-2 h-4 w-4" /> Edit Profile
              </>
            )}
          </Button>
        </div>
        
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab} 
          defaultValue="profile"
          className="w-full"
        >
          <TabsList className="bg-racing-dark-alt mb-6">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="stats">Racing Stats</TabsTrigger>
            <TabsTrigger value="teams">Teams</TabsTrigger>
            <TabsTrigger value="xp">XP & Achievements</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <ProfileTab 
              currentRacer={currentRacer}
              isEditing={isEditing}
              formData={formData}
              handleInputChange={handleInputChange}
              handleCheckboxChange={handleCheckboxChange}
              handleToggleLookingForTeam={handleToggleLookingForTeam}
              handleSaveProfile={handleSaveProfile}
            />
          </TabsContent>
          
          <TabsContent value="stats">
            <StatsTab currentRacer={currentRacer} />
          </TabsContent>
          
          <TabsContent value="teams">
            <TeamsTab userTeams={userTeams} />
          </TabsContent>
          
          <TabsContent value="xp">
            <XpTab currentRacer={currentRacer} />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default MyRacerProfile;
