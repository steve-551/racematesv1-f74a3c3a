import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useRacerStore } from '@/stores/useRacerStore';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { UserPlus, MessageSquare, Users, ThumbsUp } from 'lucide-react';
import XpProgressBar from '@/components/racer/XpProgressBar';
import RoleTag from '@/components/racer/RoleTag';
import PlatformBadge from '@/components/racer/PlatformBadge';
import LicenseClassBadge from '@/components/racer/LicenseClassBadge';

const RacerProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { fetchRacerById, currentRacer } = useRacerStore();

  useEffect(() => {
    if (id) fetchRacerById(id);
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

  const disciplines = [
    { key: 'road', label: 'Road' },
    { key: 'oval', label: 'Oval' },
    { key: 'dirt_oval', label: 'Dirt Oval' },
    { key: 'dirt_road', label: 'Dirt Road' },
    { key: 'rx', label: 'Rallycross (RX)' },
  ];

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="outline" size="sm" asChild>
            <Link to="/find-racers">← Back to Racers</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <Card className="overflow-hidden">
              <div className="h-24 bg-gradient-to-r from-gray-800 to-gray-900" />
              <div className="px-6 -mt-12 pb-6">
                <Avatar className="h-24 w-24 border-4 border-racing-dark-alt">
                  <AvatarImage src={currentRacer.avatar_url} />
                  <AvatarFallback>{currentRacer.display_name?.[0]}</AvatarFallback>
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
                    <div className="flex justify-between"><span>Region</span><span>{currentRacer.region}</span></div>
                    <div className="flex justify-between"><span>Timezone</span><span>{currentRacer.timezone}</span></div>
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
                      {currentRacer.platforms.map(p => (
                        <PlatformBadge key={p} platform={p} />
                      ))}
                    </div>
                  </div>

                  <div className="mt-4">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase mb-1">Roles</h3>
                    <div className="flex flex-wrap gap-2">
                      {currentRacer.role_tags.map(role => (
                        <RoleTag key={role} role={role} />
                      ))}
                    </div>
                  </div>

                  {currentRacer.looking_for_team && (
                    <div className="mt-4 bg-green-900/20 border border-green-800 p-2 rounded text-center text-green-400 text-sm">
                      Currently Looking for a Team
                    </div>
                  )}

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Button className="racing-btn"><UserPlus size={16} className="mr-1" /> Add Friend</Button>
                    <Button variant="outline"><MessageSquare size={16} className="mr-1" /> Message</Button>
                    {currentRacer.looking_for_team && (
                      <Button variant="outline" className="col-span-2">
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
                  const stats = currentRacer.statsByDiscipline[key as keyof typeof currentRacer.statsByDiscipline];
                  if (!stats) return null;

                  return (
                    <div key={key} className="bg-gray-800 p-4 rounded-md">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-semibold">{label}</h3>
                        <LicenseClassBadge licenseClass={stats.licence || 'rookie'} />
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                        <div><p className="text-xs text-gray-400">iRating</p><p className="text-xl font-bold">{stats.irating ?? '-'}</p></div>
                        <div><p className="text-xs text-gray-400">Safety Rating</p><p className="text-xl font-bold">{typeof stats.sr === 'number' ? stats.sr.toFixed(2) : '-'}</p></div>
                        <div><p className="text-xs text-gray-400">License</p><p className="text-xl font-bold">{stats.licence ?? '-'}</p></div>
                        <div><p className="text-xs text-gray-400">Time Trial Rating</p><p className="text-xl font-bold">{stats.tt ?? '-'}</p></div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default RacerProfile;
