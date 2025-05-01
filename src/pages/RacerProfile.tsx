
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useRacerStore } from '@/stores/useRacerStore';
import { useFriendshipStore } from '@/stores/useFriendshipStore';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { UserPlus, MessageSquare, Users, ThumbsUp } from 'lucide-react';
import XpProgressBar from '@/components/racer/XpProgressBar';
import RoleTag from '@/components/racer/RoleTag';
import PlatformBadge from '@/components/racer/PlatformBadge';
import LicenseClassBadge from '@/components/racer/LicenseClassBadge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useMessagingStore } from '@/stores/useMessagingStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

const RacerProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { 
    fetchRacerById, 
    currentRacer, 
    isLoading, 
    error 
  } = useRacerStore();
  
  const {
    sendFriendRequest,
    checkFriendship,
    isLoading: isFriendshipLoading
  } = useFriendshipStore();
  
  const { sendDirectMessage } = useMessagingStore();
  
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [friendshipStatus, setFriendshipStatus] = useState<string | null>(null);
  const [isSendingRequest, setIsSendingRequest] = useState(false);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  useEffect(() => {
    async function loadProfileAndFriendship() {
      if (id) {
        try {
          setLoadingProfile(true);
          await fetchRacerById(id);
          const status = await checkFriendship(id);
          setFriendshipStatus(status);
        } catch (error) {
          console.error("Failed to load profile:", error);
          toast.error("Failed to load racer profile");
        } finally {
          setLoadingProfile(false);
        }
      }
    }
    
    loadProfileAndFriendship();
  }, [id, fetchRacerById, checkFriendship]);

  const handleSendFriendRequest = async () => {
    if (!id) return;
    
    try {
      setIsSendingRequest(true);
      await sendFriendRequest(id);
      setFriendshipStatus('pending');
      toast.success('Friend request sent!');
    } catch (error: any) {
      console.error('Error sending friend request:', error);
      toast.error(error.message || 'Failed to send friend request');
    } finally {
      setIsSendingRequest(false);
    }
  };

  const handleSendMessage = async () => {
    if (!id || !messageContent.trim()) {
      toast.error('Please enter a message');
      return;
    }

    try {
      setIsSendingMessage(true);
      await sendDirectMessage(id, messageContent);
      toast.success('Message sent!');
      setMessageContent('');
      setIsMessageDialogOpen(false);
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleTeamInvite = () => {
    toast.info('Team invite functionality will be implemented soon!');
  };

  const isProfileLoading = isLoading || loadingProfile;

  if (error) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-lg text-red-500">Error loading racer profile: {error}</p>
          <Button variant="outline" size="sm" asChild className="mt-4">
            <Link to="/find-racers">← Back to Racers</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  const disciplines = [
    { key: 'road', label: 'Road' },
    { key: 'oval', label: 'Oval' },
    { key: 'dirt_oval', label: 'Dirt Oval' },
    { key: 'dirt_road', label: 'Dirt Road' },
    { key: 'rx', label: 'Rallycross (RX)' },
  ];

  const renderFriendshipButton = () => {
    if (friendshipStatus === 'accepted') {
      return (
        <Button 
          className="racing-btn"
          onClick={() => setIsMessageDialogOpen(true)}
        >
          <MessageSquare size={16} className="mr-1" /> Message
        </Button>
      );
    } else if (friendshipStatus === 'pending') {
      return (
        <Button variant="outline" disabled>
          Request Pending
        </Button>
      );
    } else {
      return (
        <Button 
          className="racing-btn"
          onClick={handleSendFriendRequest}
          disabled={isSendingRequest}
        >
          <UserPlus size={16} className="mr-1" /> 
          {isSendingRequest ? 'Sending...' : 'Add Friend'}
        </Button>
      );
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="outline" size="sm" asChild>
            <Link to="/find-racers">← Back to Racers</Link>
          </Button>
        </div>

        {isProfileLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <Card className="overflow-hidden">
                <Skeleton className="h-24 w-full" />
                <div className="px-6 -mt-12 pb-6">
                  <Skeleton className="h-24 w-24 rounded-full" />
                  <div className="space-y-4 mt-4">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                </div>
              </Card>
            </div>
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <Skeleton className="h-8 w-48" />
                </CardHeader>
                <CardContent className="space-y-6">
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-32 w-full" />
                </CardContent>
              </Card>
            </div>
          </div>
        ) : !currentRacer ? (
          <div className="text-center py-12">
            <p className="text-lg">Racer profile not found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Overview */}
            <div className="lg:col-span-1">
              <Card className="overflow-hidden">
                <div className="h-24 bg-gradient-to-r from-gray-800 to-gray-900" />
                <div className="px-6 -mt-12 pb-6">
                  <Avatar className="h-24 w-24 border-4 border-racing-dark-alt">
                    <AvatarImage 
                      src={currentRacer.avatar_url} 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + currentRacer.display_name;
                      }}
                    />
                    <AvatarFallback>{currentRacer.display_name?.[0]?.toUpperCase() || '?'}</AvatarFallback>
                  </Avatar>

                  <div className="mt-4">
                    <h1 className="text-2xl font-orbitron font-bold">{currentRacer.display_name}</h1>

                    <div className="mt-2">
                      <XpProgressBar
                        level={currentRacer.xp_level}
                        points={currentRacer.xp_points}
                        tier={currentRacer.xp_tier}
                        size="md"
                        showLabels={true}
                      />
                    </div>

                    <div className="mt-4 text-sm text-gray-300 space-y-2">
                      <div className="flex justify-between">
                        <span>Region</span>
                        <span>{currentRacer.region}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Timezone</span>
                        <span>{currentRacer.timezone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Reputation</span>
                        <span className="flex items-center">
                          {currentRacer.reputation}% <ThumbsUp size={14} className="ml-1 text-green-400" />
                        </span>
                      </div>
                    </div>

                    <Separator className="my-4 bg-gray-800" />

                    <div>
                      <h3 className="text-xs font-semibold text-gray-400 uppercase mb-1">Platforms</h3>
                      <div className="flex flex-wrap gap-2">
                        {currentRacer.platforms && currentRacer.platforms.length > 0 ? (
                          currentRacer.platforms.map(p => (
                            <PlatformBadge key={p} platform={p} />
                          ))
                        ) : (
                          <span className="text-sm text-gray-400">No platforms specified</span>
                        )}
                      </div>
                    </div>

                    <div className="mt-4">
                      <h3 className="text-xs font-semibold text-gray-400 uppercase mb-1">Roles</h3>
                      <div className="flex flex-wrap gap-2">
                        {currentRacer.role_tags && currentRacer.role_tags.length > 0 ? (
                          currentRacer.role_tags.map(role => (
                            <RoleTag key={role} role={role} />
                          ))
                        ) : (
                          <span className="text-sm text-gray-400">No roles specified</span>
                        )}
                      </div>
                    </div>

                    {currentRacer.looking_for_team && (
                      <div className="mt-4 bg-green-900/20 border border-green-800 p-2 rounded text-center text-green-400 text-sm">
                        Currently Looking for a Team
                      </div>
                    )}

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {renderFriendshipButton()}
                      <Button variant="outline" onClick={() => setIsMessageDialogOpen(true)}>
                        <MessageSquare size={16} className="mr-1" /> Message
                      </Button>
                      {currentRacer.looking_for_team && (
                        <Button variant="outline" className="col-span-2" onClick={handleTeamInvite}>
                          <Users size={16} className="mr-1" /> Invite to Team
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Column - Stats */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-rajdhani">iRacing Stats by Discipline</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {disciplines.map(({ key, label }) => {
                    const stats = currentRacer.statsByDiscipline?.[key as keyof typeof currentRacer.statsByDiscipline];
                    if (!stats) return null;

                    // Skip disciplines with no stats
                    const hasStats = stats.irating !== null || stats.sr !== null || 
                                   stats.licence !== null || stats.tt !== null;
                    
                    if (!hasStats) return null;

                    return (
                      <div key={key} className="bg-gray-800 p-4 rounded-md">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-lg font-semibold">{label}</h3>
                          {stats.licence && (
                            <LicenseClassBadge licenseClass={stats.licence} />
                          )}
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                          <div>
                            <p className="text-xs text-gray-400">iRating</p>
                            <p className="text-xl font-bold">{stats.irating ?? '-'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Safety Rating</p>
                            <p className="text-xl font-bold">
                              {typeof stats.sr === 'number' ? stats.sr.toFixed(2) : '-'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">License</p>
                            <p className="text-xl font-bold">{stats.licence ?? '-'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Time Trial Rating</p>
                            <p className="text-xl font-bold">{stats.tt ?? '-'}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {!disciplines.some(({ key }) => {
                    const stats = currentRacer.statsByDiscipline?.[key as keyof typeof currentRacer.statsByDiscipline];
                    if (!stats) return false;
                    return stats.irating !== null || stats.sr !== null || 
                           stats.licence !== null || stats.tt !== null;
                  }) && (
                    <p className="text-center text-gray-400 py-8">No racing statistics available</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Message Dialog */}
        <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Send message to {currentRacer?.display_name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Textarea
                placeholder="Type your message here..."
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                rows={5}
                className="resize-none"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsMessageDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSendMessage}
                disabled={isSendingMessage || !messageContent.trim()}
              >
                {isSendingMessage ? 'Sending...' : 'Send Message'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default RacerProfile;
