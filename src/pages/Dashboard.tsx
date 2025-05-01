import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Calendar, UsersRound, FileText, Clock3, MessageSquare, Plus, ChevronRight, Bell, UserPlus } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/useAuthStore';
import { useTeamStore } from '@/stores/useTeamStore';
import { useEventStore } from '@/stores/useEventStore';
import { useRacerStore } from '@/stores/useRacerStore';
import { useProfile } from '@/components/providers/ProfileProvider';
import FriendsPanel from '@/components/friends/FriendsPanel';
import { useFriendshipStore } from '@/stores/useFriendshipStore';
const Dashboard = () => {
  const [isCreateTeamDialogOpen, setIsCreateTeamDialogOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDescription, setNewTeamDescription] = useState('');
  const [isFriendsPanelOpen, setIsFriendsPanelOpen] = useState(false);
  const {
    user
  } = useAuthStore();
  const {
    currentRacer,
    fetchRecommendedRacers,
    recommendedRacers
  } = useRacerStore();
  const {
    events,
    isLoading: eventsLoading,
    fetchEvents
  } = useEventStore();
  const {
    createTeam,
    isLoading: teamsLoading
  } = useTeamStore();
  const {
    userTeams,
    isLoadingTeams,
    refreshUserTeams
  } = useProfile();
  const {
    fetchFriends,
    friends
  } = useFriendshipStore();
  useEffect(() => {
    fetchEvents();
    fetchRecommendedRacers();
    fetchFriends();
  }, [fetchEvents, fetchRecommendedRacers, fetchFriends]);
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
  return <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-3xl font-bold font-orbitron">Dashboard</h1>
          <div className="flex mt-4 md:mt-0 space-x-2">
            <Button variant="outline" onClick={() => setIsFriendsPanelOpen(true)} className="flex items-center space-x-1">
              <UserPlus size={18} />
              <span className="hidden sm:inline ml-1">Friends</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-1">
              <Bell size={18} />
              <span className="hidden sm:inline ml-1">Notifications</span>
            </Button>
            <Button className="flex items-center space-x-1" onClick={() => setIsCreateTeamDialogOpen(true)}>
              <Plus size={18} />
              <span className="hidden sm:inline ml-1">Create Team</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Teams Section */}
            <Card className="bg-neutral-200">
              <CardHeader className="pb-3 bg-racing-red">
                <CardTitle>My Teams</CardTitle>
                <CardDescription>Teams you are a member of</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingTeams ? <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-t-blue-500 mx-auto"></div>
                    <p className="text-sm text-gray-500 mt-2">Loading your teams...</p>
                  </div> : userTeams.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userTeams.map(team => <Link key={team.id} to={`/team/${team.id}`} className="block">
                        <Card className="hover:shadow-md transition-shadow">
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
                            <ChevronRight className="h-5 w-5 text-gray-400" />
                          </CardContent>
                        </Card>
                      </Link>)}
                  </div> : <div className="text-center py-8">
                    <UsersRound className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">You don't belong to any teams yet</p>
                    <Button onClick={() => setIsCreateTeamDialogOpen(true)} className="mt-4">
                      Create Team
                    </Button>
                  </div>}
              </CardContent>
              {userTeams.length > 0 && <CardFooter className="border-t pt-3">
                  <Button variant="outline" className="w-full" onClick={() => setIsCreateTeamDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Team
                  </Button>
                </CardFooter>}
            </Card>

            {/* Upcoming Events Section */}
            <Card className="bg-neutral-200">
              <CardHeader className="pb-3 bg-racing-red">
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>Your scheduled racing events</CardDescription>
              </CardHeader>
              <CardContent>
                {eventsLoading ? <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-t-blue-500 mx-auto"></div>
                    <p className="text-sm text-gray-500 mt-2">Loading events...</p>
                  </div> : events.length > 0 ? <div className="space-y-4">
                    {events.slice(0, 3).map(event => <Card key={event.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold">{event.title}</h3>
                              <div className="flex items-center text-sm text-gray-500 space-x-1 mt-1">
                                <Clock3 className="h-3 w-3" />
                                <span>{format(parseISO(event.start_time), 'PPP')} at {format(parseISO(event.start_time), 'p')}</span>
                              </div>
                              <div className="mt-2 flex flex-wrap gap-2">
                                <Badge variant="outline">{event.race_format}</Badge>
                                <Badge variant="outline">{event.car_class}</Badge>
                                <Badge variant="outline">{event.sim_platform}</Badge>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>)}
                  </div> : <div className="text-center py-8">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">No upcoming events</p>
                    <Button variant="outline" className="mt-4" asChild>
                      <Link to="/events">Browse Events</Link>
                    </Button>
                  </div>}
              </CardContent>
              {events.length > 0 && <CardFooter className="border-t pt-3">
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/events">View All Events</Link>
                  </Button>
                </CardFooter>}
            </Card>

            {/* Notice Board Highlights Section */}
            <Card className="bg-neutral-200">
              <CardHeader className="pb-3 bg-racing-red">
                <CardTitle>Notice Board</CardTitle>
                <CardDescription>Recent racing notices</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500">Stay tuned for racing notices</p>
                  <Button variant="outline" className="mt-4" asChild>
                    <Link to="/notice-board">Go to Notice Board</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Right Column */}
          <div className="space-y-6">
            {/* Quick Stats Panel */}
            <Card className="bg-neutral-200">
              <CardHeader className="pb-3 bg-racing-red">
                <CardTitle>Racing Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3 mb-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={currentRacer?.avatar_url} />
                    <AvatarFallback>
                      {currentRacer?.display_name?.charAt(0) || user?.email?.charAt(0) || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-lg">{currentRacer?.display_name || user?.email}</h3>
                    <Badge variant="outline" className="mt-1">
                      {currentRacer?.xp_tier || 'Bronze'} Tier
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="p-3 rounded-lg text-center bg-[racing-red-hover] bg-racing-red">
                    <p className="text-sm text-gray-500">Friends</p>
                    <p className="font-bold text-xl">{friends.length}</p>
                  </div>
                  <div className="p-3 text-center bg-racing-red rounded-lg">
                    <p className="text-sm text-gray-500">Teams</p>
                    <p className="font-bold text-xl">{userTeams.length}</p>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/profile">View Full Profile</Link>
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => setIsFriendsPanelOpen(true)}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Messages
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Links Panel */}
            <Card className="bg-neutral-200">
              <CardHeader className="pb-3">
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/setups">
                    <FileText className="h-4 w-4 mr-2" />
                    Setup Vault
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/stints">
                    <Calendar className="h-4 w-4 mr-2" />
                    Stint Planner
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/find-racers">
                    <UsersRound className="h-4 w-4 mr-2" />
                    Find Racers
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/notice-board">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Notice Board
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Recommended Racers Panel */}
            <Card className="bg-neutral-200">
              <CardHeader className="pb-3 bg-racing-red">
                <CardTitle>Recommended Racers</CardTitle>
                <CardDescription>People you might want to race with</CardDescription>
              </CardHeader>
              <CardContent>
                {recommendedRacers ? <div className="space-y-3">
                    {recommendedRacers.map(racer => <Link key={racer.id} to={`/racers/${racer.id}`} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <Avatar>
                          <AvatarImage src={racer.avatar_url} />
                          <AvatarFallback>{racer.display_name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">{racer.display_name}</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {racer.role_tags.slice(0, 1).map(role => <Badge key={role} variant="outline" className="text-xs">
                                {role}
                              </Badge>)}
                          </div>
                        </div>
                      </Link>)}
                  </div> : <div className="text-center py-4">
                    <p className="text-sm text-gray-500">Loading recommendations...</p>
                  </div>}
              </CardContent>
              <CardFooter className="border-t pt-3">
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/find-racers">Find More Racers</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
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
              <Input id="team-name" placeholder="E.g., Apex Racers" value={newTeamName} onChange={e => setNewTeamName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="team-description">Description (Optional)</Label>
              <Textarea id="team-description" placeholder="Tell us about your team's focus, goals, or racing preferences" value={newTeamDescription} onChange={e => setNewTeamDescription(e.target.value)} rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateTeamDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateTeam} disabled={teamsLoading}>
              {teamsLoading ? <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-t-white mr-2" />
                  Creating...
                </> : 'Create Team'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Friends Panel */}
      <FriendsPanel isOpen={isFriendsPanelOpen} onClose={() => setIsFriendsPanelOpen(false)} />
    </MainLayout>;
};
export default Dashboard;