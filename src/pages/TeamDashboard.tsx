
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTeamStore } from '@/stores/useTeamStore';
import { useRacerStore } from '@/stores/useRacerStore';
import MainLayout from '@/components/layout/MainLayout';
import TeamManagement from '@/components/team/TeamManagement';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  Calendar as CalendarIcon,
  AlertCircle,
  Settings,
  ChevronLeft
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const TeamDashboard = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const { 
    currentTeam, 
    teamMembers, 
    teamEvents,
    fetchTeamById, 
    fetchTeamMembers,
    fetchTeamEvents,
    isLoading 
  } = useTeamStore();
  
  const { currentRacer } = useRacerStore();
  
  useEffect(() => {
    if (id) {
      fetchTeamById(id);
      fetchTeamMembers(id);
      fetchTeamEvents(id);
    }
  }, [id, fetchTeamById, fetchTeamMembers, fetchTeamEvents]);
  
  // Check if user is team owner by checking if they are a member with the role of 'Owner'
  const isTeamOwner = currentTeam && currentRacer && teamMembers.some(
    member => member.profile_id === currentRacer.id && member.role === 'Owner'
  );

  // Check if user is a team member
  const isTeamMember = currentTeam && currentRacer && teamMembers.some(
    member => member.profile_id === currentRacer.id
  );
  
  if (isLoading && !currentTeam) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-blue-500" />
        </div>
      </MainLayout>
    );
  }

  if (!currentTeam) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <h2 className="text-2xl font-bold mb-2">Team Not Found</h2>
            <p className="mb-4">The team you're looking for doesn't exist or you don't have permission to view it.</p>
            <Button asChild>
              <Link to="/teams">Return to Teams</Link>
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Button variant="outline" size="icon" className="mr-4" onClick={() => navigate('/teams')}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center space-x-3">
            <Avatar className="h-16 w-16">
              <AvatarImage src={currentTeam.logo_url} />
              <AvatarFallback className="text-xl">{currentTeam.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold font-orbitron">{currentTeam.name}</h1>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="outline" className="bg-gray-100">
                  {teamMembers.length} {teamMembers.length === 1 ? 'Member' : 'Members'}
                </Badge>
                <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                  Level {currentTeam.xp_level}
                </Badge>
              </div>
            </div>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 lg:w-auto">
            <TabsTrigger value="dashboard">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="members">
              <Users className="h-4 w-4 mr-2" />
              Members
            </TabsTrigger>
            <TabsTrigger value="calendar">
              <CalendarIcon className="h-4 w-4 mr-2" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>
          
          <div className="mt-6">
            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>Upcoming Events</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {teamEvents.length === 0 ? (
                      <div className="text-center py-8">
                        <CalendarIcon className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                        <p className="text-gray-500">No upcoming events</p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-4"
                          onClick={() => setActiveTab('calendar')}
                        >
                          Schedule an Event
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {teamEvents.map((event) => (
                          <Card key={event.id}>
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-semibold">{event.title}</h3>
                                  <p className="text-sm text-gray-500">
                                    {format(parseISO(event.start_time), 'PPP')} at {format(parseISO(event.start_time), 'p')}
                                  </p>
                                  {event.description && (
                                    <p className="text-sm text-gray-400 mt-2">{event.description}</p>
                                  )}
                                </div>
                                <Badge>{event.event_type}</Badge>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Team Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>XP Level</span>
                        <span className="font-bold">{currentTeam.xp_level}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>XP Points</span>
                        <span className="font-bold">{currentTeam.xp_points}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Members</span>
                        <span className="font-bold">{teamMembers.length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Events</span>
                        <span className="font-bold">{teamEvents.length}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Team Description</CardTitle>
                </CardHeader>
                <CardContent>
                  {currentTeam.description ? (
                    <p>{currentTeam.description}</p>
                  ) : (
                    <p className="text-gray-500">No team description available.</p>
                  )}
                </CardContent>
              </Card>
              
              {currentTeam.achievements && (
                <Card>
                  <CardHeader>
                    <CardTitle>Achievements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{currentTeam.achievements}</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="members">
              <Card>
                <CardHeader>
                  <CardTitle>Team Members</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {teamMembers.map((member) => (
                      <div 
                        key={member.id} 
                        className="bg-gray-800 rounded-lg p-4 flex items-center space-x-3"
                      >
                        <Avatar>
                          <AvatarImage src={member.profile?.avatar_url} />
                          <AvatarFallback>
                            {member.profile?.display_name?.charAt(0) || '?'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.profile?.display_name}</p>
                          <Badge variant="outline" className="mt-1">
                            {member.role}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {teamMembers.length === 0 && (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                      <p className="text-gray-500">No team members</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="calendar">
              <Card>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Team Calendar</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <CalendarIcon className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                    <p className="text-gray-500">Calendar view coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings">
              {isTeamOwner || isTeamMember ? (
                <TeamManagement team={currentTeam} isOwner={!!isTeamOwner} />
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 mx-auto mb-2 text-red-500" />
                  <p className="text-gray-500">You don't have permission to access team settings.</p>
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default TeamDashboard;
