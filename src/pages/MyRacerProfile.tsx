
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
import RoleTag from '@/components/racer/RoleTag';
import { Textarea } from '@/components/ui/textarea';
import { useProfile } from '@/components/providers/ProfileProvider';

const MyRacerProfile: React.FC = () => {
  const { currentRacer, fetchCurrentRacerProfile, updateRacerProfile, toggleLookingForTeam, isLoading } = useRacerStore();
  const { isProfileLoading, userTeams } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
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
        platforms: [...currentRacer.platforms],
        driving_styles: [...currentRacer.driving_styles],
        role_tags: [...currentRacer.role_tags],
        region: currentRacer.region,
        timezone: currentRacer.timezone,
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
        platforms: [...currentRacer.platforms],
        driving_styles: [...currentRacer.driving_styles],
        role_tags: [...currentRacer.role_tags],
        region: currentRacer.region,
        timezone: currentRacer.timezone,
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
  
  const handleCheckboxChange = (name: 'platforms' | 'driving_styles' | 'favorite_disciplines' | 'favorite_car_types' | 'series_focus', value: string, checked: boolean) => {
    setFormData(prev => {
      const currentValues = prev[name];
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
  
  if (isProfileLoading || isLoading) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-lg">Loading profile...</p>
        </div>
      </AppLayout>
    );
  }
  
  if (!currentRacer) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-lg">No profile found. Please sign in or create an account.</p>
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
            <TabsTrigger value="teams">Teams</TabsTrigger>
            <TabsTrigger value="xp">XP & Achievements</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
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
                              <PlatformBadge key={platform} platform={platform} />
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
              
              <div className="lg:col-span-2">
                <Card className="racing-card mb-6">
                  <CardHeader className="pb-2">
                    <CardTitle className="font-rajdhani">Bio & Career</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {isEditing ? (
                      <>
                        <div>
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea
                            id="bio"
                            name="bio"
                            value={formData.bio}
                            onChange={handleInputChange}
                            className="bg-gray-800 border-gray-700 min-h-[100px]"
                            placeholder="Tell us about yourself as a racer..."
                          />
                        </div>
                      
                        <div>
                          <Label htmlFor="career_summary">Career Summary</Label>
                          <Textarea
                            id="career_summary"
                            name="career_summary"
                            value={formData.career_summary}
                            onChange={handleInputChange}
                            className="bg-gray-800 border-gray-700"
                            placeholder="Summarize your racing career..."
                          />
                        </div>
                      
                        <div>
                          <Label htmlFor="achievements">Achievements</Label>
                          <Textarea
                            id="achievements"
                            name="achievements"
                            value={formData.achievements}
                            onChange={handleInputChange}
                            className="bg-gray-800 border-gray-700"
                            placeholder="List your racing achievements..."
                          />
                        </div>
                      
                        <div>
                          <Label htmlFor="future_goals">Future Goals</Label>
                          <Textarea
                            id="future_goals"
                            name="future_goals"
                            value={formData.future_goals}
                            onChange={handleInputChange}
                            className="bg-gray-800 border-gray-700"
                            placeholder="What are your racing ambitions?"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        {currentRacer.bio ? (
                          <div>
                            <h3 className="text-md font-semibold">About Me</h3>
                            <p className="text-gray-300">{currentRacer.bio}</p>
                          </div>
                        ) : (
                          <p className="text-gray-400 italic">No bio information added yet.</p>
                        )}
                        
                        {currentRacer.career_summary && (
                          <div>
                            <h3 className="text-md font-semibold">Career Summary</h3>
                            <p className="text-gray-300">{currentRacer.career_summary}</p>
                          </div>
                        )}
                        
                        {currentRacer.achievements && (
                          <div>
                            <h3 className="text-md font-semibold">Achievements</h3>
                            <p className="text-gray-300">{currentRacer.achievements}</p>
                          </div>
                        )}
                        
                        {currentRacer.future_goals && (
                          <div>
                            <h3 className="text-md font-semibold">Future Goals</h3>
                            <p className="text-gray-300">{currentRacer.future_goals}</p>
                          </div>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
                
                <Card className="racing-card mb-6">
                  <CardHeader className="pb-2">
                    <CardTitle className="font-rajdhani">Preferences & Specialties</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {isEditing ? (
                      <>
                        <div>
                          <Label className="mb-2 block">Favorite Disciplines</Label>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {['GT3', 'GT4', 'GTE', 'LMP', 'F1', 'Oval', 'Dirt', 'Rally', 'Drift', 'Prototypes'].map(discipline => (
                              <label key={discipline} className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={formData.favorite_disciplines.includes(discipline)}
                                  onChange={(e) => handleCheckboxChange('favorite_disciplines', discipline, e.target.checked)}
                                  className="h-4 w-4"
                                />
                                <span>{discipline}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <Label className="mb-2 block">Favorite Car Types</Label>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {['Ferrari 488 GT3', 'Porsche 911 RSR', 'BMW M4 GT3', 'Audi R8 LMS', 'Mercedes AMG GT3', 'Formula 1', 'NASCAR', 'Rally Car', 'Drift Car', 'Prototype'].map(car => (
                              <label key={car} className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={formData.favorite_car_types.includes(car)}
                                  onChange={(e) => handleCheckboxChange('favorite_car_types', car, e.target.checked)}
                                  className="h-4 w-4"
                                />
                                <span>{car}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <Label className="mb-2 block">Series Focus</Label>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {['Sprint Races', 'Endurance Events', 'Championships', 'Special Events', 'Time Trials', 'League Racing'].map(series => (
                              <label key={series} className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={formData.series_focus.includes(series)}
                                  onChange={(e) => handleCheckboxChange('series_focus', series, e.target.checked)}
                                  className="h-4 w-4"
                                />
                                <span>{series}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="commitment_level">Commitment Level</Label>
                          <select
                            id="commitment_level"
                            name="commitment_level"
                            value={formData.commitment_level}
                            onChange={handleInputChange}
                            className="w-full bg-gray-800 text-white border border-gray-700 rounded-md px-3 py-2"
                          >
                            <option value="">Select Commitment Level</option>
                            <option value="Casual">Casual</option>
                            <option value="Regular">Regular</option>
                            <option value="Competitive">Competitive</option>
                            <option value="Professional">Professional</option>
                          </select>
                        </div>
                        
                        <div>
                          <Label htmlFor="availability_hours">Weekly Availability (Hours)</Label>
                          <Input
                            id="availability_hours"
                            name="availability_hours"
                            type="number"
                            value={formData.availability_hours}
                            onChange={handleInputChange}
                            className="bg-gray-800 border-gray-700"
                          />
                        </div>
                      </>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-md font-semibold">Favorite Disciplines</h3>
                          {currentRacer.favorite_disciplines && currentRacer.favorite_disciplines.length > 0 ? (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {currentRacer.favorite_disciplines.map((discipline, idx) => (
                                <span key={idx} className="px-3 py-1 bg-gray-800 text-white rounded-md text-sm">
                                  {discipline}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-400 italic">No favorite disciplines specified.</p>
                          )}
                        </div>
                        
                        <div>
                          <h3 className="text-md font-semibold">Favorite Cars</h3>
                          {currentRacer.favorite_car_types && currentRacer.favorite_car_types.length > 0 ? (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {currentRacer.favorite_car_types.map((car, idx) => (
                                <span key={idx} className="px-3 py-1 bg-gray-800 text-white rounded-md text-sm">
                                  {car}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-400 italic">No favorite cars specified.</p>
                          )}
                        </div>
                        
                        <div>
                          <h3 className="text-md font-semibold">Series Focus</h3>
                          {currentRacer.series_focus && currentRacer.series_focus.length > 0 ? (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {currentRacer.series_focus.map((series, idx) => (
                                <span key={idx} className="px-3 py-1 bg-gray-800 text-white rounded-md text-sm">
                                  {series}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-400 italic">No series focus specified.</p>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h3 className="text-md font-semibold">Commitment Level</h3>
                            <p className="text-gray-300">{currentRacer.commitment_level || "Not specified"}</p>
                          </div>
                          
                          <div>
                            <h3 className="text-md font-semibold">Weekly Availability</h3>
                            <p className="text-gray-300">{currentRacer.availability_hours ? `${currentRacer.availability_hours} hours` : "Not specified"}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card className="racing-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="font-rajdhani">Roles & Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {currentRacer.role_tags.map(role => (
                        <RoleTag key={role} role={role} />
                      ))}
                    </div>
                    
                    <div className="mt-4">
                      <h3 className="text-md font-semibold">Driving Styles</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {currentRacer.driving_styles.map((style, idx) => (
                          <span key={idx} className="px-3 py-1 bg-gray-800 text-white rounded-md text-sm">
                            {style}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="stats">
            <div className="grid grid-cols-1 gap-8">
              <Card className="racing-card">
                <CardHeader>
                  <CardTitle className="font-rajdhani">Racing Statistics by Discipline</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="road" className="w-full">
                    <TabsList className="w-full justify-start mb-4">
                      <TabsTrigger value="road">Road</TabsTrigger>
                      <TabsTrigger value="oval">Oval</TabsTrigger>
                      <TabsTrigger value="dirt_road">Dirt Road</TabsTrigger>
                      <TabsTrigger value="dirt_oval">Dirt Oval</TabsTrigger>
                      <TabsTrigger value="rx">Rallycross</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="road">
                      <StatsDisciplineContent stats={currentRacer.statsByDiscipline.road} />
                    </TabsContent>
                    
                    <TabsContent value="oval">
                      <StatsDisciplineContent stats={currentRacer.statsByDiscipline.oval} />
                    </TabsContent>
                    
                    <TabsContent value="dirt_road">
                      <StatsDisciplineContent stats={currentRacer.statsByDiscipline.dirt_road} />
                    </TabsContent>
                    
                    <TabsContent value="dirt_oval">
                      <StatsDisciplineContent stats={currentRacer.statsByDiscipline.dirt_oval} />
                    </TabsContent>
                    
                    <TabsContent value="rx">
                      <StatsDisciplineContent stats={currentRacer.statsByDiscipline.rx} />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="teams">
            <div className="grid grid-cols-1 gap-8">
              <Card className="racing-card">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="font-rajdhani">My Teams</CardTitle>
                  <Button className="racing-btn">Create Team</Button>
                </CardHeader>
                <CardContent>
                  {userTeams && userTeams.length > 0 ? (
                    <div className="space-y-4">
                      {userTeams.map((team, idx) => (
                        <div key={idx} className="border border-gray-800 rounded-lg p-4 flex items-center justify-between">
                          <div className="flex items-center">
                            <Avatar className="h-12 w-12 mr-4">
                              <AvatarImage src={team.logo_url} alt={team.name} />
                              <AvatarFallback>{team.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold text-lg">{team.name}</h3>
                              <p className="text-sm text-gray-400">Role: Team Manager</p>
                            </div>
                          </div>
                          <Button variant="outline">View Team</Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-400">You are not a member of any teams yet.</p>
                      <Button className="mt-4 racing-btn">Find a Team</Button>
                    </div>
                  )}
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

// Helper component to render stats for each discipline
const StatsDisciplineContent: React.FC<{ stats: any }> = ({ stats }) => {
  if (!stats.irating && !stats.sr && !stats.licence) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No data available for this discipline.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="bg-gray-800 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Ratings & License</h3>
          {stats.licence && (
            <LicenseClassBadge licenseClass={stats.licence} size="lg" />
          )}
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-xs text-gray-400">iRating</p>
            <p className="text-2xl font-bold">{stats.irating || '-'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Safety Rating</p>
            <p className="text-2xl font-bold">{stats.sr ? stats.sr.toFixed(2) : '-'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Time Trial Rating</p>
            <p className="text-2xl font-bold">{stats.tt || '-'}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Race Statistics</h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-xs text-gray-400">Races</p>
            <p className="text-2xl font-bold">{stats.starts || '-'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Wins</p>
            <p className="text-2xl font-bold">{stats.wins || '-'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Top 5</p>
            <p className="text-2xl font-bold">{stats.top5 || '-'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Avg. Finish</p>
            <p className="text-2xl font-bold">{stats.avg_finish ? stats.avg_finish.toFixed(1) : '-'}</p>
          </div>
        </div>
        
        {stats.wins && stats.starts && (
          <div className="mt-4">
            <p className="text-sm text-gray-400">Win Rate: {((stats.wins / stats.starts) * 100).toFixed(1)}%</p>
            <div className="h-2 bg-gray-700 rounded-full mt-1">
              <div 
                className="h-full bg-green-500 rounded-full" 
                style={{ width: `${(stats.wins / stats.starts) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRacerProfile;
