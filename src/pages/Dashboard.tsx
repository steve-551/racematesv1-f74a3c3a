import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Car, Flag, Users, User } from 'lucide-react';
import { useRacerStore } from '@/stores/useRacerStore';
import { useTeamStore } from '@/stores/useTeamStore';
import { Skeleton } from '@/components/ui/skeleton';

const Dashboard: React.FC = () => {
  const { fetchCurrentRacerProfile, currentRacer, fetchRecommendedRacers, recommendedRacers, isLoading } = useRacerStore();
  const { fetchSuggestedTeams, suggestedTeams } = useTeamStore();

  useEffect(() => {
    fetchCurrentRacerProfile();
  }, [fetchCurrentRacerProfile]);

  useEffect(() => {
    if (currentRacer) {
      fetchRecommendedRacers();
      fetchSuggestedTeams();
    }
  }, [currentRacer, fetchRecommendedRacers, fetchSuggestedTeams]);

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-orbitron font-bold mb-8">Dashboard</h1>

        {/* Quick Nav Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              to: '/find-racers',
              icon: <Users className="h-8 w-8 text-racing-red" />,
              title: 'Find Racers',
              desc: 'Browse and connect with racers who match your interests',
            },
            {
              to: '/events',
              icon: <Calendar className="h-8 w-8 text-racing-red" />,
              title: 'Event Browser',
              desc: 'Discover and join racing events across all platforms',
            },
            {
              to: '/setups',
              icon: <Car className="h-8 w-8 text-racing-red" />,
              title: 'Setup Vault',
              desc: 'Access shared setups for all your favorite tracks and cars',
            },
            {
              to: '/stints',
              icon: <Flag className="h-8 w-8 text-racing-red" />,
              title: 'Stint Planner',
              desc: 'Plan and manage driver stints for endurance events',
            },
          ].map(({ to, icon, title, desc }) => (
            <Link to={to} key={title}>
              <Card className="racing-card h-full hover:shadow-lg hover:shadow-red-500/10 transition-all duration-200">
                <CardHeader className="text-center">
                  <div className="mx-auto bg-gray-800 p-4 rounded-full mb-2">{icon}</div>
                  <CardTitle className="font-rajdhani">{title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-sm text-gray-400">{desc}</CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Profile, Racers, Teams */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Summary */}
          <Card className="racing-card">
            <CardHeader>
              <CardTitle className="font-rajdhani flex justify-between items-center">
                <span>Your Profile</span>
                <Button size="sm" variant="ghost" className="text-xs" asChild>
                  <Link to="/profile"><User size={14} className="mr-1" /> View Profile</Link>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <div className="flex items-center mb-4">
                    <Skeleton className="h-16 w-16 rounded-full mr-4" />
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                </div>
              ) : currentRacer ? (
                <div>
                  <div className="flex items-center mb-4">
                    <img 
                      src={currentRacer.avatar_url} 
                      alt={currentRacer.display_name} 
                      className="h-16 w-16 rounded-full mr-4 object-cover bg-gray-800"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=default';
                      }}
                    />
                    <div>
                      <h3 className="font-bold text-lg">{currentRacer.display_name}</h3>
                      <p className="text-sm text-gray-400">
                        XP Level: {currentRacer.xp_level}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-800 p-2 rounded">
                      <span className="text-xs text-gray-400">XP Tier</span>
                      <p className="font-semibold capitalize">{currentRacer.xp_tier}</p>
                    </div>
                    <div className="bg-gray-800 p-2 rounded">
                      <span className="text-xs text-gray-400">Reputation</span>
                      <p className="font-semibold">{currentRacer.reputation}%</p>
                    </div>
                  </div>
                  {currentRacer.looking_for_team && (
                    <div className="mt-4 p-3 bg-green-900/20 border border-green-900 rounded text-center">
                      <p className="text-sm text-green-400 font-medium">You're currently looking for a team</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-center text-gray-400">Profile not available</p>
              )}
            </CardContent>
          </Card>

          {/* Recommended Racers */}
          <Card className="racing-card">
            <CardHeader>
              <CardTitle className="font-rajdhani flex justify-between items-center">
                <span>Recommended Racers</span>
                <Button size="sm" variant="ghost" className="text-xs" asChild>
                  <Link to="/find-racers"><Users size={14} className="mr-1" /> Find More</Link>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                </div>
              ) : recommendedRacers && recommendedRacers.length > 0 ? (
                <div className="space-y-4">
                  {recommendedRacers.slice(0, 2).map(racer => (
                    <div key={racer.id} className="flex items-center p-3 bg-gray-800/50 rounded-md">
                      <img 
                        src={racer.avatar_url} 
                        alt={racer.display_name} 
                        className="h-12 w-12 rounded-full mr-3 object-cover bg-gray-800"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=default';
                        }}
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{racer.display_name}</h4>
                        <p className="text-xs text-gray-400">{racer.platforms.join(', ')}</p>
                        <div className="mt-2 flex gap-2">
                          <Button size="sm" variant="ghost" className="text-xs h-7 px-2">Add Friend</Button>
                          <Link to={`/racers/${racer.id}`} className="text-xs text-blue-400">View</Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-400">No racer suggestions available.</p>
              )}
            </CardContent>
          </Card>

          {/* Suggested Teams */}
          <Card className="racing-card">
            <CardHeader>
              <CardTitle className="font-rajdhani">Suggested Teams</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                </div>
              ) : suggestedTeams?.length > 0 ? (
                <div className="space-y-4">
                  {suggestedTeams.map(team => (
                    <div key={team.id} className="flex items-center p-3 bg-gray-800/50 rounded-md">
                      <img 
                        src={team.logo_url} 
                        alt={team.name} 
                        className="h-12 w-12 rounded-full mr-3 object-cover bg-gray-800"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://api.dicebear.com/7.x/initials/svg?seed=' + team.name;
                        }}
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{team.name}</h4>
                        <p className="text-xs text-gray-400">{team.platforms && Array.isArray(team.platforms) ? team.platforms.join(', ') : ''}</p>
                        <div className="mt-2 flex gap-2">
                          <Button size="sm" variant="ghost" className="text-xs h-7 px-2">Join</Button>
                          <Button size="sm" variant="ghost" className="text-xs h-7 px-2">View</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-400">No team suggestions yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
