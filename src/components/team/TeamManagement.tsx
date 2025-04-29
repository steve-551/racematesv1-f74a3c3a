
import React, { useState } from 'react';
import { useTeamStore } from '@/stores/useTeamStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle
} from '@/components/ui/dialog';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  MoreHorizontal, 
  UserPlus, 
  UserMinus, 
  Trophy, 
  Edit, 
  Users
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface TeamManagementProps {
  team: any;
  isOwner: boolean;
}

const TeamManagement: React.FC<TeamManagementProps> = ({ team, isOwner }) => {
  const [isEditTeamDialogOpen, setIsEditTeamDialogOpen] = useState(false);
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
  const [emailToInvite, setEmailToInvite] = useState('');
  const [teamName, setTeamName] = useState(team?.name || '');
  const [teamDescription, setTeamDescription] = useState(team?.description || '');
  
  const { 
    teamMembers, 
    fetchTeamMembers, 
    updateTeam, 
    addTeamMember, 
    removeTeamMember,
    isLoading 
  } = useTeamStore();
  
  const handleUpdateTeam = async () => {
    if (!teamName.trim()) {
      toast.error('Team name cannot be empty');
      return;
    }
    
    try {
      await updateTeam(team.id, {
        name: teamName,
        description: teamDescription
      });
      setIsEditTeamDialogOpen(false);
      toast.success('Team updated successfully');
    } catch (error) {
      console.error('Error updating team:', error);
      toast.error('Failed to update team');
    }
  };
  
  const handleInviteMember = async () => {
    if (!emailToInvite.trim()) {
      toast.error('Please enter an email address');
      return;
    }
    
    try {
      // This is a placeholder - actual implementation would need to check if the user exists
      // and then add them to the team
      toast.success(`Invited ${emailToInvite} to join the team`);
      setEmailToInvite('');
      setIsAddMemberDialogOpen(false);
    } catch (error) {
      console.error('Error inviting member:', error);
      toast.error('Failed to invite member');
    }
  };
  
  const handleRemoveMember = async (memberId: string) => {
    try {
      await removeTeamMember(memberId);
      toast.success('Team member removed');
    } catch (error) {
      console.error('Error removing team member:', error);
      toast.error('Failed to remove team member');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl font-bold">Team Settings</CardTitle>
          {isOwner && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsEditTeamDialogOpen(true)}
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit Team
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={team?.logo_url} />
              <AvatarFallback className="text-lg">
                {team?.name?.charAt(0) || 'T'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-lg font-bold">{team?.name}</h3>
              <p className="text-gray-500 text-sm mt-1">{team?.description || 'No description'}</p>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {team?.platforms?.map((platform: string) => (
                  <Badge key={platform} variant="outline">{platform}</Badge>
                ))}
              </div>
            </div>
            <div className="text-center">
              <div className="bg-yellow-100 rounded-full p-2">
                <Trophy className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="mt-1">
                <p className="text-xs text-gray-500">XP Level</p>
                <p className="font-bold">{team?.xp_level || 1}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl font-bold">Team Members</CardTitle>
          {isOwner && (
            <Button 
              size="sm" 
              onClick={() => setIsAddMemberDialogOpen(true)}
            >
              <UserPlus className="h-4 w-4 mr-1" />
              Add Member
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-t-blue-500"></div>
              <p className="mt-2 text-sm text-gray-500">Loading team members...</p>
            </div>
          ) : teamMembers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto mb-2 text-gray-400" />
              <p className="text-gray-500">No team members yet</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Role</TableHead>
                  {isOwner && <TableHead className="w-[100px]">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={member.profile?.avatar_url} />
                        <AvatarFallback>
                          {member.profile?.display_name?.charAt(0) || '?'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.profile?.display_name}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{member.role}</Badge>
                    </TableCell>
                    {isOwner && (
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="text-red-500 cursor-pointer"
                              onClick={() => handleRemoveMember(member.id)}
                            >
                              <UserMinus className="h-4 w-4 mr-2" />
                              Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      {/* Edit Team Dialog */}
      <Dialog open={isEditTeamDialogOpen} onOpenChange={setIsEditTeamDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Team</DialogTitle>
            <DialogDescription>
              Update your team's information
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="team-name">Team Name</Label>
              <Input
                id="team-name"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="team-description">Description</Label>
              <Textarea
                id="team-description"
                value={teamDescription}
                onChange={(e) => setTeamDescription(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsEditTeamDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateTeam}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Member Dialog */}
      <Dialog open={isAddMemberDialogOpen} onOpenChange={setIsAddMemberDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
            <DialogDescription>
              Enter the email address of the person you'd like to invite
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="racer@example.com"
                value={emailToInvite}
                onChange={(e) => setEmailToInvite(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsAddMemberDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleInviteMember}>
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamManagement;
