
import React, { useEffect, useState } from 'react';
import { useRacerStore } from '@/stores/useRacerStore';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import XpProgressBar from '@/components/racer/XpProgressBar';
import LicenseClassBadge from '@/components/racer/LicenseClassBadge';
import PlatformBadge from '@/components/racer/PlatformBadge';
import { Edit, ThumbsUp, Upload, Save } from 'lucide-react';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const MyRacerProfile: React.FC = () => {
  const { currentRacer, fetchCurrentRacerProfile, updateRacerProfile, toggleLookingForTeam } = useRacerStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    display_name: '',
    iracing_stats: {
      irating: 0,
      safety_rating: 0,
      license_class: '' as any,
      tt_rating: 0
    },
    platforms: [] as string[],
    driving_styles: [] as string[],
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
        iracing_stats: { ...currentRacer.iracing_stats },
        platforms: [...currentRacer.platforms],
        driving_styles: [...currentRacer.driving_styles],
        region: currentRacer.region,
        timezone: currentRacer.timezone,
        looking_for_team: currentRacer.looking_for_team
      });
    }
  }, [currentRacer]);
  
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    
    // Reset form when canceling edit
    if (isEditing && currentRacer) {
      setFormData({
        display_name: currentRacer.display_name,
        iracing_stats: { ...currentRacer.iracing_stats },
        platforms: [...currentRacer.platforms],
        driving_styles: [...currentRacer.driving_styles],
        region: currentRacer.region,
        timezone: currentRacer.timezone,
        looking_for_team: currentRacer.looking_for_team
      });
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle nested objects like iracing_stats
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleCheckboxChange = (name: string, value: string, checked: boolean) => {
    setFormData(prev => {
      const currentValues = prev[name as keyof typeof prev] as string[];
      
      if (checked) {
        return { ...prev, [name]: [...currentValues, value] };
      } else {
        return { ...prev, [name]: currentValues.filter(v => v !== value) };
      }
    });
  };
  
  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
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
  
  if (!currentRacer) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-lg">Loading profile...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
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
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="bg-racing-dark-alt mb-6">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="stats">Racing Stats</TabsTrigger>
            <TabsTrigger value="xp">XP & Achievements</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Profile Overview */}
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
                        <Input
                          name="display_name"
                          value={formData.display_name}
                          onChange={handleInputChange}
                          className="bg-gray-800 border-gray-700 mb-2"
                        />
                      ) : (
                        <h1 className="text-2xl font-orbitron font-bold">{currentRacer.display_name}</h1>
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
                              <PlatformBadge key={platform} platform={platform as any} />
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
                              ? (checked) => setFormData(prev => ({ ...prev, looking_for_team: checked })) 
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
              
              {/* Right Column */}
              <div className="lg:col-span-2">
                {/* Driving Styles */}
                <Card className="racing-card mb-6">
                  <CardHeader className="pb-2">
                    <CardTitle className="font-rajdhani">Driving Styles & Preferences</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Select Your Driving Styles</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {['Endurance', 'Sprint', 'Oval', 'Rally', 'Drift', 'F1', 'GT3', 'GT4', 'NASCAR', 'Dirt'].map(style => (
                            <label key={style} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={formData.driving_styles.includes(style)}
                                onChange={(e) => handleCheckboxChange('driving_styles', style, e.target.checked)}
                                className="h-4 w-4"
                              />
                              <span>{style}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {currentRacer.driving_styles.map((style, i) => (
                          <span 
                            key={i} 
                            className="px-3 py-1 bg-gray-800 text-white rounded-md text-sm"
                          >
                            {style}
                          </span>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Role Tags */}
                <Card className="racing-card mb-6">
                  <CardHeader className="pb-2">
                    <CardTitle className="font-rajdhani">Role Tags</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {currentRacer.role_tags.map(role => (
                        <span
                          key={role}
                          className={`px-3 py-1 ${
                            role === 'Driver' ? 'bg-blue-900' : 
                            role === 'Strategist' ? 'bg-green-900' : 
                            role === 'Team Manager' ? 'bg-purple-900' :
                            role === 'Endurance Pro' ? 'bg-amber-900' :
                            role === 'Sprint Specialist' ? 'bg-red-900' :
                            role === 'Coach' ? 'bg-cyan-900' : 'bg-gray-800'
                          } text-white rounded-md text-sm`}
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                    
                    {isEditing && (
                      <p className="text-sm text-gray-400">
                        Role tags are earned through achievements and participation in events.
                      </p>
                    )}
                  </CardContent>
                </Card>
                
                {/* Reputation */}
                <Card className="racing-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex justify-between items-center font-rajdhani">
                      <span>Reputation</span>
                      <div className="flex items-center">
                        <ThumbsUp size={18} className="mr-1 text-green-400" />
                        <span>{currentRacer.reputation}%</span>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500" 
                        style={{ width: `${currentRacer.reputation}%` }}
                      />
                    </div>
                    
                    <p className="mt-4 text-sm text-gray-400">
                      Your reputation is based on feedback from other racers and teams you've raced with. 
                      Clean racing and good sportsmanship will increase your reputation.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="stats">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* iRacing Stats */}
              <Card className="racing-card mb-6 lg:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="flex justify-between">
                    <span className="font-rajdhani">iRacing Stats</span>
                    <LicenseClassBadge licenseClass={currentRacer.iracing_stats.license_class} size="md" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="irating">iRating</Label>
                        <Input
                          id="irating"
                          name="iracing_stats.irating"
                          value={formData.iracing_stats.irating}
                          onChange={handleInputChange}
                          type="number"
                          className="bg-gray-800 border-gray-700"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="safety_rating">Safety Rating</Label>
                        <Input
                          id="safety_rating"
                          name="iracing_stats.safety_rating"
                          value={formData.iracing_stats.safety_rating}
                          onChange={handleInputChange}
                          type="number"
                          step="0.1"
                          min="0"
                          max="5"
                          className="bg-gray-800 border-gray-700"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="license_class">License Class</Label>
                        <select
                          id="license_class"
                          name="iracing_stats.license_class"
                          value={formData.iracing_stats.license_class}
                          onChange={handleInputChange}
                          className="w-full bg-gray-800 text-white border border-gray-700 rounded-md px-3 py-2"
                        >
                          <option value="rookie">Rookie</option>
                          <option value="D">D</option>
                          <option value="C">C</option>
                          <option value="B">B</option>
                          <option value="A">A</option>
                          <option value="pro">PRO</option>
                          <option value="black">World Championship</option>
                        </select>
                      </div>
                      
                      <div>
                        <Label htmlFor="tt_rating">Time Trial Rating</Label>
                        <Input
                          id="tt_rating"
                          name="iracing_stats.tt_rating"
                          value={formData.iracing_stats.tt_rating}
                          onChange={handleInputChange}
                          type="number"
                          className="bg-gray-800 border-gray-700"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="text-center bg-gray-800 rounded-md p-3">
                        <span className="text-sm text-gray-400">iRating</span>
                        <div className="text-xl font-bold">{currentRacer.iracing_stats.irating}</div>
                      </div>
                      <div className="text-center bg-gray-800 rounded-md p-3">
                        <span className="text-sm text-gray-400">Safety Rating</span>
                        <div className="text-xl font-bold">{currentRacer.iracing_stats.safety_rating.toFixed(2)}</div>
                      </div>
                      <div className="text-center bg-gray-800 rounded-md p-3">
                        <span className="text-sm text-gray-400">License Class</span>
                        <div className="text-xl font-bold">{currentRacer.iracing_stats.license_class}</div>
                      </div>
                      <div className="text-center bg-gray-800 rounded-md p-3">
                        <span className="text-sm text-gray-400">Time Trial Rating</span>
                        <div className="text-xl font-bold">{currentRacer.iracing_stats.tt_rating}</div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Stats by Discipline - Placeholder */}
              <Card className="racing-card lg:col-span-1">
                <CardHeader className="pb-2">
                  <CardTitle className="font-rajdhani">Stats by Discipline</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-400 py-8">
                    Detailed statistics by racing discipline will be displayed here.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="xp">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="racing-card lg:col-span-2">
                <CardHeader>
                  <CardTitle className="font-rajdhani">XP History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                      <span>Event Participation: 24h Le Mans</span>
                      <span className="text-green-400">+250 XP</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                      <span>Setup Shared: GT3 Monza</span>
                      <span className="text-green-400">+50 XP</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                      <span>Profile Completion</span>
                      <span className="text-green-400">+100 XP</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>iRating Milestone: 2000+</span>
                      <span className="text-green-400">+200 XP</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="racing-card lg:col-span-1">
                <CardHeader>
                  <CardTitle className="font-rajdhani">Tier Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Current Tier</span>
                      <span className={`text-sm font-semibold text-${currentRacer.xp_tier}`}>
                        {currentRacer.xp_tier.toUpperCase()}
                      </span>
                    </div>
                    <XpProgressBar
                      level={currentRacer.xp_level}
                      points={currentRacer.xp_points}
                      tier={currentRacer.xp_tier}
                      size="md"
                      showLabels={false}
                    />
                  </div>
                  
                  <h4 className="font-semibold mb-2">Tier Thresholds</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Bronze</span>
                      <span>&lt; 1500 XP</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Silver</span>
                      <span>1500 - 1999 XP</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Gold</span>
                      <span>2000 - 2499 XP</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Platinum</span>
                      <span>2500 - 2999 XP</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pro</span>
                      <span>3000+ XP</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default MyRacerProfile;
