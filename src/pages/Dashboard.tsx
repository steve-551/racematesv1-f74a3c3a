
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Car, Flag, Users, User } from 'lucide-react';
import { useRacerStore } from '@/stores/useRacerStore';
import { useTeamStore } from '@/stores/useTeamStore';
import RacerCard from '@/components/racer/RacerCard';

const Dashboard: React.FC = () => {
  const { fetchCurrentRacerProfile, currentRacer, fetchRecommendedRacers, recommendedRacers } = useRacerStore();
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link to="/find-racers">
            <Card className="racing-card h-full hover:shadow-lg hover:shadow-red-500/10 transition-all duration-200">
              <CardHeader className="text-center">
                <div className="mx-auto bg-gray-800 p-4 rounded-full mb-2">
                  <Users className="h-8 w-8 text-racing-red" />
                </div>
                <CardTitle className="font-rajdhani">Find Racers</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-sm text-gray-400">
                Browse and connect with racers who match your interests
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/events">
            <Card className="racing-card h-full hover:shadow-lg hover:shadow-red-500/10 transition-all duration-200">
              <CardHeader className="text-center">
                <div className="mx-auto bg-gray-800 p-4 rounded-full mb-2">
                  <Calendar className="h-8 w-8 text-racing-red" />
                </div>
                <CardTitle className="font-rajdhani">Event Browser</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-sm text-gray-400">
                Discover and join racing events across all platforms
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/setups">
            <Card className="racing-card h-full hover:shadow-lg hover:shadow-red-500/10 transition-all duration-200">
              <CardHeader className="text-center">
                <div className="mx-auto bg-gray-800 p-4 rounded-full mb-2">
                  <Car className="h-8 w-8 text-racing-red" />
                </div>
                <CardTitle className="font-rajdhani">Setup Vault</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-sm text-gray-400">
                Access shared setups for all your favorite tracks and cars
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/stints">
            <Card className="racing-card h-full hover:shadow-lg hover:shadow-red-500/10 transition-all duration-200">
              <CardHeader className="text-center">
                <div className="mx-auto bg-gray-800 p-4 rounded-full mb-2">
                  <Flag className="h-8 w-8 text-racing-red" />
                </div>
                <CardTitle className="font-rajdhani">Stint Planner</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-sm text-gray-400">
                Plan and manage driver stints for endurance events
              </CardContent>
            </Card>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Summary */}
          <Card className="racing-card">
            <CardHeader>
              <CardTitle className="font-rajdhani flex justify-between items-center">
                <span>Your Profile</span>
                <Button size="sm" variant="ghost" className="text-xs" asChild>
                  <Link to="/profile">
                    <User size={14} className="mr-1" /> View Complete Profile
                  </Link>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentRacer ? (
                <div>
                  <div className="flex items-center mb-4">
                    <div className="h-16 w-16 bg-gray-800 rounded-full overflow-hidden mr-4">
                      <img 
                        src={currentRacer.avatar_url} 
                        alt={currentRacer.display_name} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-rajdhani font-bold text-lg">{currentRacer.display_name}</h3>
                      <p className="text-sm text-gray-400">
                        iRating: {currentRacer.iracing_stats.irating} • 
                        XP Level: {currentRacer.xp_level}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="bg-gray-800 p-2 rounded">
                      <span className="text-xs text-gray-400">License</span>
                      <p className="font-semibold">{currentRacer.iracing_stats.license_class} {currentRacer.iracing_stats.safety_rating.toFixed(2)}</p>
                    </div>
                    <div className="bg-gray-800 p-2 rounded">
                      <span className="text-xs text-gray-400">XP Tier</span>
                      <p className="font-semibold capitalize">{currentRacer.xp_tier}</p>
                    </div>
                  </div>
                  
                  {currentRacer.looking_for_team && (
                    <div className="mt-4 p-3 bg-green-900/20 border border-green-900 rounded text-center">
                      <p className="text-sm text-green-400 font-medium">You're currently looking for a team</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p>Loading profile...</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Recommended Racers */}
          <Card className="racing-card">
            <CardHeader>
              <CardTitle className="font-rajdhani flex justify-between items-center">
                <span>Recommended Racers</span>
                <Button size="sm" variant="ghost" className="text-xs" asChild>
                  <Link to="/find-racers">
                    <Users size={14} className="mr-1" /> Find More
                  </Link>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recommendedRacers.length > 0 ? (
                <div className="space-y-4">
                  {recommendedRacers.slice(0, 2).map(racer => (
                    <div key={racer.id} className="flex items-start p-3 bg-gray-800/50 rounded-md">
                      <div className="h-12 w-12 bg-gray-700 rounded-full overflow-hidden mr-3">
                        <img 
                          src={racer.avatar_url} 
                          alt={racer.display_name} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{racer.display_name}</h4>
                        <p className="text-xs text-gray-400">
                          {racer.platforms.join(', ')} • {racer.region}
                        </p>
                        <div className="mt-2 flex justify-between">
                          <Button size="sm" variant="ghost" className="text-xs h-7 px-2">Add Friend</Button>
                          <Button size="sm" variant="ghost" className="text-xs h-7 px-2" asChild>
                            <Link to={`/racers/${racer.id}`}>View Profile</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <p>Loading recommendations...</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Suggested Teams */}
          <Card className="racing-card">
            <CardHeader>
              <CardTitle className="font-rajdhani">Suggested Teams</CardTitle>
            </CardHeader>
            <CardContent>
              {suggestedTeams.length > 0 ? (
                <div className="space-y-4">
                  {suggestedTeams.map(team => (
                    <div key={team.id} className="flex items-start p-3 bg-gray-800/50 rounded-md">
                      <div className="h-12 w-12 bg-gray-700 rounded-full overflow-hidden mr-3">
                        <img 
                          src={team.logo_url} 
                          alt={team.name} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{team.name}</h4>
                        <p className="text-xs text-gray-400">
                          {team.platforms.join(', ')} • {team.member_count} members
                        </p>
                        <div className="mt-2 flex justify-between">
                          <Button size="sm" variant="ghost" className="text-xs h-7 px-2">Request to Join</Button>
                          <Button size="sm" variant="ghost" className="text-xs h-7 px-2">View Team</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <p>Loading team suggestions...</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-8">
          <h2 className="text-2xl font-orbitron font-bold mb-4">Upcoming Events</h2>
          <Card className="racing-card">
            <CardContent className="p-6">
              <div className="flex justify-center items-center py-8 text-gray-400">
                <div className="text-center">
                  <Calendar className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p>No upcoming events scheduled.</p>
                  <Button variant="outline" className="mt-4" asChild>
                    <Link to="/events">Browse Events</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
