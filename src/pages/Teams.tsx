
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus, Users, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

import { useTeamStore } from '@/stores/useTeamStore';
import { useProfile } from '@/components/providers/ProfileProvider';

const Teams: React.FC = () => {
  const [isCreateTeamDialogOpen, setIsCreateTeamDialogOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDescription, setNewTeamDescription] = useState('');
  const navigate = useNavigate();

  const { createTeam, isLoading: teamsLoading } = useTeamStore();
  const { userTeams, isLoadingTeams, refreshUserTeams } = useProfile();

  const handleCreateTeam = async () => {
    if (!newTeamName.trim()) {
      toast.error('Team name is required');
      return;
    }

    try {
      const team = await createTeam({
        name: newTeamName,
        description: newTeamDescription,
        is_public: true
      });
      
      if (team) {
        toast.success('Team created successfully!');
        await refreshUserTeams();
        setIsCreateTeamDialogOpen(false);
        setNewTeamName('');
        setNewTeamDescription('');
      }
    } catch (error) {
      console.error('Error creating team:', error);
      toast.error('Failed to create team');
    }
  };

  const handleViewTeam = (teamId: string) => {
    navigate(`/team/${teamId}`);
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-orbitron font-bold">My Teams</h1>
          <Button 
            onClick={() => setIsCreateTeamDialogOpen(true)}
            className="racing-btn"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Team
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>My Teams</CardTitle>
            <CardDescription>Teams you are a member of</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingTeams ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-t-blue-500 mx-auto"></div>
                <p className="text-sm text-gray-500 mt-2">Loading your teams...</p>
              </div>
            ) : userTeams && userTeams.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userTeams.map((team) => (
                  <Card key={team.id} className="hover:shadow-md transition-shadow overflow-hidden">
                    <CardContent className="p-4 flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={team.logo_url} />
                        <AvatarFallback className="bg-blue-500 text-white">
                          {team.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold">{team.name}</h3>
                        <p className="text-sm text-gray-500 truncate">{team.description}</p>
                      </div>
                      <Button variant="outline" onClick={() => handleViewTeam(team.id)}>
                        View <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">You don't belong to any teams yet</p>
                <Button 
                  onClick={() => setIsCreateTeamDialogOpen(true)} 
                  className="mt-4 racing-btn"
                >
                  Create Team
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create Team Dialog */}
      <Dialog open={isCreateTeamDialogOpen} onOpenChange={setIsCreateTeamDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a New Team</DialogTitle>
            <DialogDescription>
              Create your own racing team to collaborate with other drivers.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="team-name">Team Name</Label>
              <Input
                id="team-name"
                placeholder="E.g., Apex Racers"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="team-description">Description (Optional)</Label>
              <Textarea
                id="team-description"
                placeholder="Tell us about your team's focus, goals, or racing preferences"
                value={newTeamDescription}
                onChange={(e) => setNewTeamDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateTeamDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleCreateTeam}
              disabled={teamsLoading}
            >
              {teamsLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-t-white mr-2" />
                  Creating...
                </>
              ) : 'Create Team'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Teams;
