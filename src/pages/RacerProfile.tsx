
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useRacerStore } from '@/stores/useRacerStore';
import AppLayout from '@/components/layout/AppLayout';
import LicenseClassBadge from '@/components/racer/LicenseClassBadge';
import PlatformBadge from '@/components/racer/PlatformBadge';
import RoleTag from '@/components/racer/RoleTag';
import XpProgressBar from '@/components/racer/XpProgressBar';
import { Button } from '@/components/ui/button';
import { UserPlus, MessageSquare, Users, ThumbsUp } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const RacerProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { fetchRacerById, currentRacer } = useRacerStore();
  
  useEffect(() => {
    if (id) {
      fetchRacerById(id);
    }
  }, [id, fetchRacerById]);
  
  if (!currentRacer) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-lg">Loading racer profile...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="outline" size="sm" asChild>
            <Link to="/find-racers">← Back to Racers</Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Overview */}
          <div className="lg:col-span-1">
            <Card className="racing-card overflow-hidden">
              <div className="h-24 bg-gradient-to-r from-gray-800 to-gray-900" />
              
              <div className="px-6 -mt-12 pb-6">
                <Avatar className="h-24 w-24 border-4 border-racing-dark-alt">
                  <AvatarImage src={currentRacer.avatar_url} className="object-cover" />
                  <AvatarFallback className="text-2xl">{currentRacer.display_name.substring(0, 2).toUpperCase()}</AvatarFallback>
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
                  
                  <div className="mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Region</span>
                      <span>{currentRacer.region}</span>
                    </div>
                    <Separator className="my-2 bg-gray-800" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Timezone</span>
                      <span>{currentRacer.timezone}</span>
                    </div>
                    <Separator className="my-2 bg-gray-800" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Reputation</span>
                      <div className="flex items-center">
                        <span className="mr-1">{currentRacer.reputation}%</span>
                        <ThumbsUp size={14} className="text-green-400" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h3 className="text-sm font-semibold uppercase text-gray-400 mb-2">Platforms</h3>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {currentRacer.platforms.map(platform => (
                        <PlatformBadge key={platform} platform={platform} />
                      ))}
                    </div>
                    
                    <h3 className="text-sm font-semibold uppercase text-gray-400 mb-2">Roles</h3>
                    <div className="flex flex-wrap">
                      {currentRacer.role_tags.map(role => (
                        <RoleTag key={role} role={role} />
                      ))}
                    </div>
                  </div>
                  
                  {currentRacer.looking_for_team && (
                    <div className="mt-6 bg-green-900/30 border border-green-900 rounded-md p-3 text-center">
                      <span className="text-sm font-medium text-green-400">
                        Currently Looking for a Team
                      </span>
                    </div>
                  )}
                  
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <Button className="racing-btn">
                      <UserPlus size={18} className="mr-2" /> Add Friend
                    </Button>
                    <Button variant="outline">
                      <MessageSquare size={18} className="mr-2" /> Message
                    </Button>
                    {currentRacer.looking_for_team && (
                      <Button variant="outline" className="col-span-2">
                        <Users size={18} className="mr-2" /> Invite to Team
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>
          
          {/* Right Column - Detailed Stats */}
          <div className="lg:col-span-2">
            {/* iRacing Stats */}
            <Card className="racing-card mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="flex justify-between">
                  <span className="font-rajdhani">iRacing Stats</span>
                  <LicenseClassBadge licenseClass={currentRacer.iracing_stats.license_class} size="md" />
                </CardTitle>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
            
            {/* Driving Styles */}
            <Card className="racing-card mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="font-rajdhani">Driving Styles</CardTitle>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
            
            {/* Activity Graph - Placeholder */}
            <Card className="racing-card mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="font-rajdhani">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-800 rounded-md h-48 flex items-center justify-center">
                  <p className="text-gray-400">Activity graph will be displayed here</p>
                </div>
              </CardContent>
            </Card>
            
            {/* XP History - Placeholder */}
            <Card className="racing-card">
              <CardHeader className="pb-2">
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
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default RacerProfile;
