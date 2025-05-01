
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Team } from '@/stores/useTeamStore';
import { toast } from 'sonner';

interface TeamsTabProps {
  userTeams: Team[] | null;
}

const TeamsTab: React.FC<TeamsTabProps> = ({ userTeams }) => {
  const navigate = useNavigate();

  const handleViewTeam = (teamId: string) => {
    navigate(`/team/${teamId}`);
  };

  const handleCreateTeam = () => {
    navigate('/teams');
    toast.info('Navigated to Teams page where you can create a new team');
  };

  const handleFindTeam = () => {
    navigate('/find-racers');
    toast.info('Navigated to Find Racers page where you can find teams');
  };

  return (
    <div className="grid grid-cols-1 gap-8">
      <Card className="racing-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-rajdhani">My Teams</CardTitle>
          <Button className="racing-btn" onClick={handleCreateTeam}>Create Team</Button>
        </CardHeader>
        <CardContent>
          {userTeams && userTeams.length > 0 ? (
            <div className="space-y-4">
              {userTeams.map((team, idx) => (
                <div key={team.id || idx} className="border border-gray-800 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar className="h-12 w-12 mr-4">
                      <AvatarImage src={team.logo_url} alt={team.name} />
                      <AvatarFallback>{team.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{team.name}</h3>
                      <p className="text-sm text-gray-400">Role: Team Manager</p>
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => handleViewTeam(team.id)}>View Team</Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">You are not a member of any teams yet.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4">
                <Button className="racing-btn" onClick={handleCreateTeam}>Create a Team</Button>
                <Button variant="outline" onClick={handleFindTeam}>Find a Team</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamsTab;
