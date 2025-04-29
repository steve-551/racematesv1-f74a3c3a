
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Racer } from '@/stores/useRacerStore';

interface BioCareerCardProps {
  currentRacer: Racer;
  isEditing: boolean;
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

const BioCareerCard: React.FC<BioCareerCardProps> = ({
  currentRacer,
  isEditing,
  formData,
  handleInputChange
}) => {
  return (
    <Card className="racing-card mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="font-rajdhani">Bio & Career</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <>
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                className="bg-gray-800 border-gray-700 min-h-[100px]"
                placeholder="Tell us about yourself as a racer..."
              />
            </div>
          
            <div>
              <Label htmlFor="career_summary">Career Summary</Label>
              <Textarea
                id="career_summary"
                name="career_summary"
                value={formData.career_summary}
                onChange={handleInputChange}
                className="bg-gray-800 border-gray-700"
                placeholder="Summarize your racing career..."
              />
            </div>
          
            <div>
              <Label htmlFor="achievements">Achievements</Label>
              <Textarea
                id="achievements"
                name="achievements"
                value={formData.achievements}
                onChange={handleInputChange}
                className="bg-gray-800 border-gray-700"
                placeholder="List your racing achievements..."
              />
            </div>
          
            <div>
              <Label htmlFor="future_goals">Future Goals</Label>
              <Textarea
                id="future_goals"
                name="future_goals"
                value={formData.future_goals}
                onChange={handleInputChange}
                className="bg-gray-800 border-gray-700"
                placeholder="What are your racing ambitions?"
              />
            </div>
          </>
        ) : (
          <>
            {currentRacer.bio ? (
              <div>
                <h3 className="text-md font-semibold">About Me</h3>
                <p className="text-gray-300">{currentRacer.bio}</p>
              </div>
            ) : (
              <p className="text-gray-400 italic">No bio information added yet.</p>
            )}
            
            {currentRacer.career_summary && (
              <div>
                <h3 className="text-md font-semibold">Career Summary</h3>
                <p className="text-gray-300">{currentRacer.career_summary}</p>
              </div>
            )}
            
            {currentRacer.achievements && (
              <div>
                <h3 className="text-md font-semibold">Achievements</h3>
                <p className="text-gray-300">{currentRacer.achievements}</p>
              </div>
            )}
            
            {currentRacer.future_goals && (
              <div>
                <h3 className="text-md font-semibold">Future Goals</h3>
                <p className="text-gray-300">{currentRacer.future_goals}</p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default BioCareerCard;
