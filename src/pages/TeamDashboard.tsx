import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTeamStore } from '@/stores/useTeamStore';
import { useRacerStore } from '@/stores/useRacerStore';
import { useEventStore } from '@/stores/useEventStore';
import MainLayout from '@/components/layout/MainLayout';
import TeamChat from '@/components/team/TeamChat';
import TeamManagement from '@/components/team/TeamManagement';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter, 
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  Calendar as CalendarIcon, 
  Plus,
  AlertCircle
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const TeamDashboard = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCreateEventDialogOpen, setIsCreateEventDialogOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventType, setEventType] = useState('');
  const [eventDate, setEventDate] = useState<Date | undefined>(new Date());
  const [eventStartTime, setEventStartTime] = useState('');
  const [eventEndTime, setEventEndTime] = useState('');
  
  const { 
    currentTeam, 
    teamMembers, 
    teamEvents,
    fetchTeamById, 
    fetchTeamMembers,
    fetchTeamEvents,
    createTeamEvent,
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
  
  // Check if user is team owner by checking if they are a member with the role of 'owner'
  const isTeamOwner = currentTeam && currentRacer && teamMembers.some(
    member => member.profile_id === currentRacer.id && member.role === 'owner'
  );
  
  const handleCreateEvent = async () => {
    if (!id || !eventTitle || !eventType || !eventDate || !eventStartTime || !eventEndTime) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      const startDateTime = new Date(eventDate);
      const [startHours, startMinutes] = eventStartTime.split(':').map(Number);
      startDateTime.setHours(startHours, startMinutes);
      
      const endDateTime = new Date(eventDate);
      const [endHours, endMinutes] = eventEndTime.split(':').map(Number);
      endDateTime.setHours(endHours, endMinutes);
      
      if (endDateTime <= startDateTime) {
        toast.error('End time must be after start time');
        return;
      }
      
      await createTeamEvent({
        team_id: id,
        title: eventTitle,
        description: eventDescription,
        event_type: eventType,
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString()
      });
      
      setEventTitle('');
      setEventDescription('');
      setEventType('');
      setEventStartTime('');
      setEventEndTime('');
      setIsCreateEventDialogOpen(false);
      toast.success('Event created successfully');
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('Failed to create event');
    }
  };

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
              <Link to="/dashboard">Return to Dashboard</Link>
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
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
            <TabsTrigger value="chat">
              <MessageSquare className="h-4 w-4 mr-2" />
              Chat
            </TabsTrigger>
          </TabsList>
          
          <div className="mt-6">
            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>Upcoming Events</span>
                      <Button 
                        size="sm"
                        onClick={() => setIsCreateEventDialogOpen(true)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Event
                      </Button>
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
                          onClick={() => setIsCreateEventDialogOpen(true)}
                        >
                          Schedule an Event
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {teamEvents.slice(0, 3).map((event) => (
                          <Card key={event.id}>
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-semibold">{event.title}</h3>
                                  <p className="text-sm text-gray-500">
                                    {format(parseISO(event.start_time), 'PPP')} at {format(parseISO(event.start_time), 'p')}
                                  </p>
                                  <Badge className="mt-2">
                                    {event.event_type}
                                  </Badge>
                                </div>
                                <div className="text-right">
                                  <p className="text-xs text-gray-500">Duration</p>
                                  <p className="font-semibold">
                                    {format(parseISO(event.start_time), 'h:mm a')} - {format(parseISO(event.end_time), 'h:mm a')}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                  {teamEvents.length > 0 && (
                    <CardFooter>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => setActiveTab('calendar')}
                      >
                        View All Events
                      </Button>
                    </CardFooter>
                  )}
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Team Members</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {teamMembers.slice(0, 5).map((member) => (
                        <div key={member.id} className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={member.profile?.avatar_url} />
                            <AvatarFallback>
                              {member.profile?.display_name?.charAt(0) || '?'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{member.profile?.display_name}</p>
                            <p className="text-xs text-gray-500">{member.role}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  {teamMembers.length > 5 && (
                    <CardFooter>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => setActiveTab('members')}
                      >
                        View All Members
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Quick Links</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button 
                      variant="outline" 
                      className="h-auto flex flex-col items-center justify-center p-4"
                      onClick={() => setActiveTab('chat')}
                    >
                      <MessageSquare className="h-8 w-8 mb-2" />
                      <span>Team Chat</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-auto flex flex-col items-center justify-center p-4"
                      onClick={() => setActiveTab('calendar')}
                    >
                      <CalendarIcon className="h-8 w-8 mb-2" />
                      <span>Calendar</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-auto flex flex-col items-center justify-center p-4"
                      asChild
                    >
                      <Link to="/setups">
                        <CalendarIcon className="h-8 w-8 mb-2" />
                        <span>Setups</span>
                      </Link>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-auto flex flex-col items-center justify-center p-4"
                      asChild
                    >
                      <Link to="/stints">
                        <Users className="h-8 w-8 mb-2" />
                        <span>Stint Planner</span>
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="members">
              <TeamManagement team={currentTeam} isOwner={isTeamOwner} />
            </TabsContent>
            
            <TabsContent value="calendar">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Team Events</CardTitle>
                    <Button 
                      size="sm"
                      onClick={() => setIsCreateEventDialogOpen(true)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Event
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {teamEvents.length === 0 ? (
                      <div className="text-center py-8">
                        <CalendarIcon className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                        <p className="text-gray-500">No scheduled events</p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-4"
                          onClick={() => setIsCreateEventDialogOpen(true)}
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
                                    <p className="mt-2 text-sm">{event.description}</p>
                                  )}
                                  <Badge className="mt-2">
                                    {event.event_type}
                                  </Badge>
                                </div>
                                <div className="text-right">
                                  <p className="text-xs text-gray-500">Duration</p>
                                  <p className="font-semibold">
                                    {format(parseISO(event.start_time), 'h:mm a')} - {format(parseISO(event.end_time), 'h:mm a')}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-0">
                    <Calendar
                      className="rounded-md border"
                      mode="single"
                      selected={new Date()}
                      disabled={{ before: new Date() }}
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="chat">
              <div className="h-[70vh]">
                <TeamChat teamId={id || ''} />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
      
      {/* Create Event Dialog */}
      <Dialog open={isCreateEventDialogOpen} onOpenChange={setIsCreateEventDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Team Event</DialogTitle>
            <DialogDescription>
              Schedule a new event for your team
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                placeholder="E.g., Team Practice at Spa"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={eventDate ? format(eventDate, 'yyyy-MM-dd') : ''}
                  onChange={(e) => setEventDate(e.target.value ? new Date(e.target.value) : undefined)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Event Type</Label>
                <select
                  id="type"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                >
                  <option value="" disabled>Select type</option>
                  <option value="training">Training</option>
                  <option value="coaching">Coaching</option>
                  <option value="tuning">Setup Tuning</option>
                  <option value="practice_race">Practice Race</option>
                  <option value="race">Race</option>
                  <option value="meeting">Meeting</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="start-time">Start Time</Label>
                <Input
                  id="start-time"
                  type="time"
                  value={eventStartTime}
                  onChange={(e) => setEventStartTime(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="end-time">End Time</Label>
                <Input
                  id="end-time"
                  type="time"
                  value={eventEndTime}
                  onChange={(e) => setEventEndTime(e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
                placeholder="Add details, requirements, or notes about the event"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsCreateEventDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateEvent}>
              Create Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default TeamDashboard;
