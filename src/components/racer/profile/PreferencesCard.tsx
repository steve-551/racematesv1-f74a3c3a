
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Racer } from '@/stores/useRacerStore';

interface PreferencesCardProps {
  currentRacer: Racer;
  isEditing: boolean;
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleCheckboxChange: (name: 'platforms' | 'driving_styles' | 'favorite_disciplines' | 'favorite_car_types' | 'series_focus', value: string, checked: boolean) => void;
}

const PreferencesCard: React.FC<PreferencesCardProps> = ({
  currentRacer,
  isEditing,
  formData,
  handleInputChange,
  handleCheckboxChange
}) => {
  return (
    <Card className="racing-card mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="font-rajdhani">Preferences & Specialties</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <>
            <div>
              <Label className="mb-2 block">Favorite Disciplines</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {['GT3', 'GT4', 'GTE', 'LMP', 'F1', 'Oval', 'Dirt', 'Rally', 'Drift', 'Prototypes'].map(discipline => (
                  <label key={discipline} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.favorite_disciplines.includes(discipline)}
                      onChange={(e) => handleCheckboxChange('favorite_disciplines', discipline, e.target.checked)}
                      className="h-4 w-4"
                    />
                    <span>{discipline}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <Label className="mb-2 block">Favorite Car Types</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {['Ferrari 488 GT3', 'Porsche 911 RSR', 'BMW M4 GT3', 'Audi R8 LMS', 'Mercedes AMG GT3', 'Formula 1', 'NASCAR', 'Rally Car', 'Drift Car', 'Prototype'].map(car => (
                  <label key={car} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.favorite_car_types.includes(car)}
                      onChange={(e) => handleCheckboxChange('favorite_car_types', car, e.target.checked)}
                      className="h-4 w-4"
                    />
                    <span>{car}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <Label className="mb-2 block">Series Focus</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {['Sprint Races', 'Endurance Events', 'Championships', 'Special Events', 'Time Trials', 'League Racing'].map(series => (
                  <label key={series} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.series_focus.includes(series)}
                      onChange={(e) => handleCheckboxChange('series_focus', series, e.target.checked)}
                      className="h-4 w-4"
                    />
                    <span>{series}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <Label htmlFor="commitment_level">Commitment Level</Label>
              <select
                id="commitment_level"
                name="commitment_level"
                value={formData.commitment_level}
                onChange={handleInputChange}
                className="w-full bg-gray-800 text-white border border-gray-700 rounded-md px-3 py-2"
              >
                <option value="">Select Commitment Level</option>
                <option value="Casual">Casual</option>
                <option value="Regular">Regular</option>
                <option value="Competitive">Competitive</option>
                <option value="Professional">Professional</option>
              </select>
            </div>
            
            <div>
              <Label htmlFor="availability_hours">Weekly Availability (Hours)</Label>
              <Input
                id="availability_hours"
                name="availability_hours"
                type="number"
                value={formData.availability_hours}
                onChange={handleInputChange}
                className="bg-gray-800 border-gray-700"
              />
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div>
              <h3 className="text-md font-semibold">Favorite Disciplines</h3>
              {currentRacer.favorite_disciplines && currentRacer.favorite_disciplines.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-2">
                  {currentRacer.favorite_disciplines.map((discipline, idx) => (
                    <span key={idx} className="px-3 py-1 bg-gray-800 text-white rounded-md text-sm">
                      {discipline}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 italic">No favorite disciplines specified.</p>
              )}
            </div>
            
            <div>
              <h3 className="text-md font-semibold">Favorite Cars</h3>
              {currentRacer.favorite_car_types && currentRacer.favorite_car_types.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-2">
                  {currentRacer.favorite_car_types.map((car, idx) => (
                    <span key={idx} className="px-3 py-1 bg-gray-800 text-white rounded-md text-sm">
                      {car}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 italic">No favorite cars specified.</p>
              )}
            </div>
            
            <div>
              <h3 className="text-md font-semibold">Series Focus</h3>
              {currentRacer.series_focus && currentRacer.series_focus.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-2">
                  {currentRacer.series_focus.map((series, idx) => (
                    <span key={idx} className="px-3 py-1 bg-gray-800 text-white rounded-md text-sm">
                      {series}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 italic">No series focus specified.</p>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-md font-semibold">Commitment Level</h3>
                <p className="text-gray-300">{currentRacer.commitment_level || "Not specified"}</p>
              </div>
              
              <div>
                <h3 className="text-md font-semibold">Weekly Availability</h3>
                <p className="text-gray-300">{currentRacer.availability_hours ? `${currentRacer.availability_hours} hours` : "Not specified"}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PreferencesCard;
