
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import XpProgressBar from '@/components/racer/XpProgressBar';
import { Upload, Save } from 'lucide-react';
import { Racer } from '@/stores/useRacerStore';
import BioCareerCard from './BioCareerCard';
import PreferencesCard from './PreferencesCard';
import RolesSkillsCard from './RolesSkillsCard';

interface ProfileTabProps {
  currentRacer: Racer;
  isEditing: boolean;
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleCheckboxChange: (name: 'platforms' | 'driving_styles' | 'favorite_disciplines' | 'favorite_car_types' | 'series_focus' | 'role_tags' | 'looking_for_team', value: string, checked: boolean) => void;
  handleToggleLookingForTeam: (value: boolean) => Promise<void>;
  handleSaveProfile: () => Promise<void>;
}

const ProfileTab: React.FC<ProfileTabProps> = ({
  currentRacer,
  isEditing,
  formData,
  handleInputChange,
  handleCheckboxChange,
  handleToggleLookingForTeam,
  handleSaveProfile
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <Card className="racing-card overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-gray-800 to-gray-900 relative">
            {isEditing && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute top-2 right-2 bg-black/50 hover:bg-black/70"
              >
                <Upload className="mr-1 h-4 w-4" /> Change Cover
              </Button>
            )}
          </div>
          
          <div className="px-6 -mt-12 pb-6">
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-racing-dark-alt">
                <AvatarImage src={currentRacer.avatar_url} className="object-cover" />
                <AvatarFallback className="text-2xl">{currentRacer.display_name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              
              {isEditing && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute bottom-0 right-0 bg-black/50 hover:bg-black/70 rounded-full h-8 w-8 p-0"
                >
                  <Upload className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <div className="mt-4">
              {isEditing ? (
                <>
                  <div className="mb-4">
                    <Label htmlFor="display_name">Display Name</Label>
                    <Input
                      id="display_name"
                      name="display_name"
                      value={formData.display_name}
                      onChange={handleInputChange}
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      name="age"
                      type="number"
                      value={formData.age}
                      onChange={handleInputChange}
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>
                </>
              ) : (
                <>
                  <h1 className="text-2xl font-orbitron font-bold">{currentRacer.display_name}</h1>
                  {currentRacer.full_name && (
                    <p className="text-gray-400">{currentRacer.full_name}</p>
                  )}
                  {currentRacer.age && (
                    <p className="text-gray-400">Age: {currentRacer.age}</p>
                  )}
                </>
              )}
              
              <div className="mt-2">
                <XpProgressBar 
                  level={currentRacer.xp_level}
                  points={currentRacer.xp_points}
                  tier={currentRacer.xp_tier}
                  size="md"
                  showLabels={true}
                />
              </div>
              
              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Region</label>
                  {isEditing ? (
                    <select
                      name="region"
                      value={formData.region}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 text-white border border-gray-700 rounded-md px-3 py-2"
                    >
                      <option value="">Select Region</option>
                      <option value="North America">North America</option>
                      <option value="Europe">Europe</option>
                      <option value="Asia">Asia</option>
                      <option value="South America">South America</option>
                      <option value="Oceania">Oceania</option>
                      <option value="Global">Global</option>
                    </select>
                  ) : (
                    <p>{currentRacer.region}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Timezone</label>
                  {isEditing ? (
                    <select
                      name="timezone"
                      value={formData.timezone}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 text-white border border-gray-700 rounded-md px-3 py-2"
                    >
                      <option value="">Select Timezone</option>
                      <option value="EST">EST (UTC-5)</option>
                      <option value="CST">CST (UTC-6)</option>
                      <option value="MST">MST (UTC-7)</option>
                      <option value="PST">PST (UTC-8)</option>
                      <option value="GMT">GMT (UTC+0)</option>
                      <option value="CET">CET (UTC+1)</option>
                      <option value="JST">JST (UTC+9)</option>
                    </select>
                  ) : (
                    <p>{currentRacer.timezone}</p>
                  )}
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-sm font-semibold uppercase text-gray-400 mb-2">Platforms</h3>
                {isEditing ? (
                  <div className="grid grid-cols-2 gap-2">
                    {['iRacing', 'F1', 'ACC', 'GT7', 'rFactor', 'Automobilista', 'RaceRoom'].map(platform => (
                      <label key={platform} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.platforms.includes(platform)}
                          onChange={(e) => handleCheckboxChange('platforms', platform, e.target.checked)}
                          className="h-4 w-4"
                        />
                        <span>{platform}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {currentRacer.platforms.map(platform => (
                      <span key={platform} className="px-2 py-1 text-xs bg-gray-800 rounded">{platform}</span>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold uppercase text-gray-400">Looking for Team</h3>
                  <Switch
                    name="looking_for_team"
                    checked={isEditing ? formData.looking_for_team : currentRacer.looking_for_team}
                    onCheckedChange={isEditing 
                      ? (checked) => handleCheckboxChange('looking_for_team', '', checked)
                      : handleToggleLookingForTeam
                    }
                    disabled={!isEditing && !currentRacer.looking_for_team}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">Toggle this if you're available to join a team</p>
              </div>
              
              {isEditing && (
                <Button className="w-full mt-6 racing-btn" onClick={handleSaveProfile}>
                  <Save className="mr-2 h-4 w-4" /> Save Profile
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
      
      <div className="lg:col-span-2">
        <BioCareerCard 
          currentRacer={currentRacer}
          isEditing={isEditing}
          formData={formData}
          handleInputChange={handleInputChange}
        />
        
        <PreferencesCard 
          currentRacer={currentRacer}
          isEditing={isEditing}
          formData={formData}
          handleInputChange={handleInputChange}
          handleCheckboxChange={handleCheckboxChange}
        />
        
        <RolesSkillsCard currentRacer={currentRacer} />
      </div>
    </div>
  );
};

export default ProfileTab;
