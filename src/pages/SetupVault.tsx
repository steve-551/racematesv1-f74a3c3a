
import React, { useState, useEffect } from 'react';
import { useSetupStore, Setup } from '@/stores/useSetupStore';
import { useRacerStore } from '@/stores/useRacerStore';
import { useTeamStore } from '@/stores/useTeamStore';
import { useProfile } from '@/components/providers/ProfileProvider';
import { useFriendshipStore } from '@/stores/useFriendshipStore';
import MainLayout from '@/components/layout/MainLayout';
import SetupCard from '@/components/setup/SetupCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { toast } from 'sonner';
import { Plus, Loader2, FileUp, Share2, AlertCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const SetupVault = () => {
  const [activeTab, setActiveTab] = useState('my-setups');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [selectedSetup, setSelectedSetup] = useState<Setup | null>(null);
  const [setupFile, setSetupFile] = useState<File | null>(null);
  const [setupForm, setSetupForm] = useState({
    title: '',
    description: '',
    car_model: '',
    track_name: '',
    sim_platform: '',
    visibility: 'private' as 'private' | 'team' | 'friends' | 'public'
  });
  const [shareWith, setShareWith] = useState('');
  const [shareType, setShareType] = useState('team'); // 'team' or 'friend'
  
  const { 
    setups, 
    setupFiles, 
    isLoading, 
    createSetup, 
    fetchSetups, 
    fetchSetupFiles, 
    uploadSetupFile, 
    deleteSetup, 
    shareSetupWithTeam, 
    shareSetupWithFriend
  } = useSetupStore();
  const { currentRacer } = useRacerStore();
  const { userTeams } = useProfile();
  const { friends, fetchFriends } = useFriendshipStore();
  
  useEffect(() => {
    fetchSetups();
    fetchFriends();
  }, [fetchSetups, fetchFriends]);
  
  useEffect(() => {
    if (selectedSetup) {
      fetchSetupFiles(selectedSetup.id);
    }
  }, [selectedSetup, fetchSetupFiles]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSetupForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSetupFile(e.target.files[0]);
    }
  };
  
  const handleCreateSetup = async () => {
    try {
      const setupData = {
        ...setupForm,
      };
      
      const createdSetup = await createSetup(setupData);
      
      if (createdSetup && setupFile) {
        await uploadSetupFile(createdSetup.id, setupFile);
      }
      
      toast.success('Setup created successfully');
      setIsCreateDialogOpen(false);
      setSetupForm({
        title: '',
        description: '',
        car_model: '',
        track_name: '',
        sim_platform: '',
        visibility: 'private'
      });
      setSetupFile(null);
    } catch (error) {
      console.error('Error creating setup:', error);
      toast.error('Failed to create setup');
    }
  };
  
  const handleViewSetup = (setup: Setup) => {
    setSelectedSetup(setup);
    setIsViewDialogOpen(true);
  };
  
  const handleShareSetup = (setup: Setup) => {
    setSelectedSetup(setup);
    setIsShareDialogOpen(true);
  };
  
  const handleDeleteSetup = async (setup: Setup) => {
    try {
      await deleteSetup(setup.id);
      toast.success('Setup deleted successfully');
    } catch (error) {
      console.error('Error deleting setup:', error);
      toast.error('Failed to delete setup');
    }
  };
  
  const handleShareSubmit = async () => {
    if (!selectedSetup || !shareWith) {
      toast.error('Please select who to share with');
      return;
    }
    
    try {
      if (shareType === 'team') {
        await shareSetupWithTeam(selectedSetup.id, shareWith);
        toast.success('Setup shared with team');
      } else {
        await shareSetupWithFriend(selectedSetup.id, shareWith);
        toast.success('Setup shared with friend');
      }
      
      setIsShareDialogOpen(false);
      setShareWith('');
    } catch (error) {
      console.error('Error sharing setup:', error);
      toast.error('Failed to share setup');
    }
  };

  const mySetups = setups.filter(setup => currentRacer && setup.owner_id === currentRacer.id);
  const teamSetups = setups.filter(setup => setup.visibility === 'team' && userTeams.some(team => team.id === setup.team_id));
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-3xl font-bold font-orbitron">Setup Vault</h1>
          <Button 
            onClick={() => setIsCreateDialogOpen(true)} 
            className="mt-4 md:mt-0"
          >
            <Plus className="h-4 w-4 mr-2" />
            Upload Setup
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="my-setups">My Setups</TabsTrigger>
            <TabsTrigger value="team-setups">Team Setups</TabsTrigger>
            <TabsTrigger value="shared-setups">Shared with Me</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <TabsContent value="my-setups">
          {isLoading ? (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
              <p>Loading your setups...</p>
            </div>
          ) : mySetups.length === 0 ? (
            <div className="text-center py-12">
              <FileUp className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h2 className="text-xl font-semibold mb-2">No Setups Yet</h2>
              <p className="text-gray-500 mb-6">Upload your first car setup to get started</p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>Upload Setup</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mySetups.map(setup => (
                <SetupCard
                  key={setup.id}
                  setup={setup}
                  onView={handleViewSetup}
                  onShare={handleShareSetup}
                  onDelete={handleDeleteSetup}
                  isOwner={true}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="team-setups">
          {isLoading ? (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
              <p>Loading team setups...</p>
            </div>
          ) : teamSetups.length === 0 ? (
            <div className="text-center py-12">
              <Share2 className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h2 className="text-xl font-semibold mb-2">No Team Setups</h2>
              <p className="text-gray-500 mb-6">Teams you belong to haven't shared any setups yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamSetups.map(setup => (
                <SetupCard
                  key={setup.id}
                  setup={setup}
                  onView={handleViewSetup}
                  onShare={() => {}}
                  onDelete={() => {}}
                  isOwner={currentRacer ? setup.owner_id === currentRacer.id : false}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="shared-setups">
          <div className="text-center py-12">
            <Share2 className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h2 className="text-xl font-semibold mb-2">Shared Setups</h2>
            <p className="text-gray-500">Setups shared directly with you will appear here</p>
          </div>
        </TabsContent>
      </div>
      
      {/* Create Setup Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload New Setup</DialogTitle>
            <DialogDescription>
              Share your car setup with your team or keep it private
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Setup Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="E.g., Spa GT3 Dry Weather"
                value={setupForm.title}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="car_model">Car Model</Label>
                <Input
                  id="car_model"
                  name="car_model"
                  placeholder="E.g., Ferrari 488 GT3"
                  value={setupForm.car_model}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="track_name">Track</Label>
                <Input
                  id="track_name"
                  name="track_name"
                  placeholder="E.g., Spa-Francorchamps"
                  value={setupForm.track_name}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="sim_platform">Sim Platform</Label>
                <Select
                  name="sim_platform"
                  value={setupForm.sim_platform}
                  onValueChange={(value) => setSetupForm(prev => ({ ...prev, sim_platform: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="iRacing">iRacing</SelectItem>
                    <SelectItem value="ACC">Assetto Corsa Competizione</SelectItem>
                    <SelectItem value="F1">F1 Series</SelectItem>
                    <SelectItem value="GT7">Gran Turismo 7</SelectItem>
                    <SelectItem value="rFactor">rFactor</SelectItem>
                    <SelectItem value="AMS2">Automobilista 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="visibility">Visibility</Label>
                <Select
                  name="visibility"
                  value={setupForm.visibility}
                  onValueChange={(value) => setSetupForm(prev => ({ ...prev, visibility: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="team">Team</SelectItem>
                    <SelectItem value="friends">Friends</SelectItem>
                    <SelectItem value="public">Public</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Add notes about the setup, conditions it works best in, etc."
                value={setupForm.description}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="file">Setup File</Label>
              <Input
                id="file"
                type="file"
                onChange={handleFileChange}
                accept=".svm,.json,.txt,.sto,.ini,.setup"
              />
              <p className="text-xs text-gray-500">
                Upload the setup file from your simulator (.svm, .json, .txt, etc.)
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsCreateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateSetup}
              disabled={!setupForm.title || !setupForm.car_model || !setupForm.track_name || !setupForm.sim_platform}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Uploading...
                </>
              ) : 'Upload Setup'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* View Setup Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedSetup?.title}</DialogTitle>
            <DialogDescription>
              Setup details and files
            </DialogDescription>
          </DialogHeader>
          {selectedSetup && (
            <div className="py-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <Label className="text-xs text-gray-500">Car Model</Label>
                  <p className="font-medium">{selectedSetup.car_model}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Track</Label>
                  <p className="font-medium">{selectedSetup.track_name}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <Label className="text-xs text-gray-500">Platform</Label>
                  <p className="font-medium">{selectedSetup.sim_platform}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Visibility</Label>
                  <p className="font-medium capitalize">{selectedSetup.visibility}</p>
                </div>
              </div>
              
              {selectedSetup.description && (
                <div className="mb-4">
                  <Label className="text-xs text-gray-500">Description</Label>
                  <p className="mt-1">{selectedSetup.description}</p>
                </div>
              )}
              
              <div className="mt-6">
                <h4 className="text-sm font-semibold mb-2">Setup Files</h4>
                {isLoading ? (
                  <div className="text-center py-4">
                    <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Loading files...</p>
                  </div>
                ) : setupFiles[selectedSetup.id]?.length ? (
                  <div className="space-y-2">
                    {setupFiles[selectedSetup.id].map(file => (
                      <Card key={file.id}>
                        <CardContent className="p-3 flex justify-between items-center">
                          <div className="flex items-center space-x-3">
                            <FileUp className="h-5 w-5 text-gray-500" />
                            <div>
                              <p className="font-medium text-sm">{file.file_name}</p>
                              <p className="text-xs text-gray-500">
                                {(file.file_size / 1024).toFixed(1)} KB
                              </p>
                            </div>
                          </div>
                          <Button size="sm" variant="outline">Download</Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 bg-gray-50 rounded-md">
                    <AlertCircle className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-500">No setup files attached</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Share Setup Dialog */}
      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Setup</DialogTitle>
            <DialogDescription>
              Share your setup with a team or friend
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex space-x-4 mb-4">
              <Button
                variant={shareType === 'team' ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => setShareType('team')}
              >
                Team
              </Button>
              <Button
                variant={shareType === 'friend' ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => setShareType('friend')}
              >
                Friend
              </Button>
            </div>
            
            {shareType === 'team' ? (
              userTeams.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-gray-500">You don't belong to any teams yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <Label>Select Team</Label>
                  <Select value={shareWith} onValueChange={setShareWith}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a team" />
                    </SelectTrigger>
                    <SelectContent>
                      {userTeams.map(team => (
                        <SelectItem key={team.id} value={team.id}>
                          {team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )
            ) : (
              friends.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-gray-500">You don't have any friends yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <Label>Select Friend</Label>
                  <Select value={shareWith} onValueChange={setShareWith}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a friend" />
                    </SelectTrigger>
                    <SelectContent>
                      {friends.map(friend => {
                        const friendDetails = friend.requestor?.id === currentRacer?.id ? friend.addressee : friend.requestor;
                        return (
                          <SelectItem key={friend.id} value={friendDetails?.id || ''}>
                            {friendDetails?.display_name}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              )
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsShareDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleShareSubmit}
              disabled={!shareWith || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Sharing...
                </>
              ) : 'Share Setup'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default SetupVault;
