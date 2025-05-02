
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTeamStore } from '@/stores/useTeamStore';
import { useProfile } from '@/components/providers/ProfileProvider';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, Users, PlusCircle, Search, Trophy, Info } from 'lucide-react';
import { toast } from 'sonner';

interface CreateTeamFormData {
  name: string;
  description: string;
  is_public: boolean;
  platforms: string[];
}

const TeamsPage: React.FC = () => {
  const navigate = useNavigate();
  const { teams, suggestedTeams, createTeam, fetchTeams, isLoading } = useTeamStore();
  const { userTeams, refreshUserTeams } = useProfile();
  
  const [activeTab, setActiveTab] = useState('my-teams');
  const [isCreateTeamDialogOpen, setIsCreateTeamDialogOpen] = useState(false);
  const [formData, setFormData] = useState<CreateTeamFormData>({
    name: '',
    description: '',
    is_public: true,
    platforms: []
  });
  
  const platformOptions = [
    'iRacing', 'F1', 'ACC', 'GT7', 'rFactor', 'Automobilista', 'RaceRoom'
  ];
  
  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handlePlatformChange = (platform: string, checked: boolean) => {
    setFormData(prev => {
      if (checked) {
        return {
          ...prev,
          platforms: [...prev.platforms, platform]
        };
      } else {
        return {
          ...prev,
          platforms: prev.platforms.filter(p => p !== platform)
        };
      }
    });
  };
  
  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error('Please enter a team name');
      return;
    }
    
    try {
      const newTeam = await createTeam({
        name: formData.name,
        description: formData.description,
        is_public: formData.is_public,
        platforms: formData.platforms
      });
      
      if (newTeam) {
        toast.success('Team created successfully!');
        setIsCreateTeamDialogOpen(false);
        setFormData({
          name: '',
          description: '',
          is_public: true,
          platforms: []
        });
        await refreshUserTeams();
        navigate(`/team/${newTeam.id}`);
      }
    } catch (error) {
      console.error('Error creating team:', error);
      toast.error('Failed to create team. Please try again.');
    }
  };
  
  const handleViewTeam = (teamId: string) => {
    navigate(`/team/${teamId}`);
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold font-orbitron">Teams</h1>
          <Button onClick={() => setIsCreateTeamDialogOpen(true)} className="racing-btn">
            <PlusCircle className="mr-2 h-4 w-4" /> Create Team
          </Button>
        </div>
        
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="my-teams">
              <User className="h-4 w-4 mr-2" /> My Teams
            </TabsTrigger>
            <TabsTrigger value="browse">
              <Search className="h-4 w-4 mr-2" /> Browse Teams
            </TabsTrigger>
            <TabsTrigger value="suggested">
              <Trophy className="h-4 w-4 mr-2" /> Suggested
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="my-teams">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              </div>
            ) : userTeams && userTeams.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userTeams.map(team => (
                  <Card key={team.id} className="overflow-hidden racing-card">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <Avatar className="h-14 w-14">
                          <AvatarImage src={team.logo_url} />
                          <AvatarFallback>{team.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <Badge className="bg-yellow-500 text-yellow-950">Level {team.xp_level}</Badge>
                      </div>
                      <CardTitle className="mt-3 text-xl font-bold">{team.name}</CardTitle>
                      <p className="text-sm text-gray-400">{team.description || "No description"}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {team.platforms?.map(platform => (
                          <Badge key={platform} variant="outline" className="bg-gray-800">
                            {platform}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        onClick={() => handleViewTeam(team.id)} 
                        className="w-full"
                      >
                        Manage Team
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 px-4">
                <div className="bg-gray-800 p-8 rounded-lg max-w-lg mx-auto">
                  <Users className="h-12 w-12 mb-4 text-gray-400 mx-auto" />
                  <h3 className="text-xl font-semibold mb-2">You're not a member of any teams yet</h3>
                  <p className="text-gray-400 mb-6">
                    Create your own team or browse existing teams to join.
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Button onClick={() => setIsCreateTeamDialogOpen(true)} className="racing-btn">
                      Create a Team
                    </Button>
                    <Button variant="outline" onClick={() => setActiveTab('browse')}>
                      Browse Teams
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="browse">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              </div>
            ) : teams && teams.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teams.filter(team => team.is_public).map(team => (
                  <Card key={team.id} className="overflow-hidden racing-card">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <Avatar className="h-14 w-14">
                          <AvatarImage src={team.logo_url} />
                          <AvatarFallback>{team.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <Badge className="bg-yellow-500 text-yellow-950">Level {team.xp_level}</Badge>
                      </div>
                      <CardTitle className="mt-3 text-xl font-bold">{team.name}</CardTitle>
                      <p className="text-sm text-gray-400">{team.description || "No description"}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {team.platforms?.map(platform => (
                          <Badge key={platform} variant="outline" className="bg-gray-800">
                            {platform}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="outline"
                        onClick={() => handleViewTeam(team.id)} 
                        className="w-full"
                      >
                        View Team
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Info className="h-12 w-12 mb-4 text-gray-400 mx-auto" />
                <h3 className="text-xl font-semibold mb-2">No teams found</h3>
                <p className="text-gray-400">
                  There are no public teams available at the moment.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="suggested">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              </div>
            ) : suggestedTeams && suggestedTeams.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {suggestedTeams.map(team => (
                  <Card key={team.id} className="overflow-hidden racing-card">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <Avatar className="h-14 w-14">
                          <AvatarImage src={team.logo_url} />
                          <AvatarFallback>{team.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <Badge className="bg-yellow-500 text-yellow-950">Level {team.xp_level}</Badge>
                      </div>
                      <CardTitle className="mt-3 text-xl font-bold">{team.name}</CardTitle>
                      <p className="text-sm text-gray-400">{team.description || "No description"}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {team.platforms?.map(platform => (
                          <Badge key={platform} variant="outline" className="bg-gray-800">
                            {platform}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="outline"
                        onClick={() => handleViewTeam(team.id)} 
                        className="w-full"
                      >
                        View Team
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Info className="h-12 w-12 mb-4 text-gray-400 mx-auto" />
                <h3 className="text-xl font-semibold mb-2">No suggested teams</h3>
                <p className="text-gray-400">
                  We don't have any team suggestions for you at the moment.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Create Team Dialog */}
      <Dialog open={isCreateTeamDialogOpen} onOpenChange={setIsCreateTeamDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create a new team</DialogTitle>
            <DialogDescription>
              Fill out the details below to create your racing team.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Team Name*</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter team name"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Tell us about your team"
                rows={3}
              />
            </div>
            <div>
              <Label className="block mb-2">Racing Platforms</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {platformOptions.map(platform => (
                  <div key={platform} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`platform-${platform}`}
                      checked={formData.platforms.includes(platform)}
                      onChange={(e) => handlePlatformChange(platform, e.target.checked)}
                      className="form-checkbox h-4 w-4"
                    />
                    <Label htmlFor={`platform-${platform}`} className="text-sm">
                      {platform}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_public"
                name="is_public"
                checked={formData.is_public}
                onChange={(e) => handleInputChange({
                  ...e,
                  target: {
                    ...e.target,
                    name: 'is_public',
                    value: e.target.checked.toString()
                  }
                } as any)}
                className="form-checkbox h-4 w-4"
              />
              <Label htmlFor="is_public">Make this team public</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateTeamDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleSubmit}>
              Create Team
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default TeamsPage;
