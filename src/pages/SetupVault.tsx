
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSetupStore } from '@/stores/useSetupStore';
import { Search, Filter, X, Upload, ThumbsUp, Share2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/components/layout/AppLayout';

interface Setup {
  id: string;
  title: string;
  car_model: string;
  track_name: string;
  sim_platform: string;
  description: string;
  owner_id: string;
  shared_with: 'team' | 'friends' | 'public';
  thumbs_up: number;
}

const SetupVault: React.FC = () => {
  const { setups, fetchSetups } = useSetupStore();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    platform: '',
    track: '',
    carClass: ''
  });
  
  const [mockSetups] = useState<Setup[]>([
    {
      id: '1',
      title: 'Spa GT3 Dry Setup',
      car_model: 'Ferrari 488 GT3 Evo',
      track_name: 'Spa-Francorchamps',
      sim_platform: 'iRacing',
      description: 'Optimized for low fuel quali. Stable through Eau Rouge.',
      owner_id: 'user1',
      shared_with: 'team',
      thumbs_up: 24
    },
    {
      id: '2',
      title: 'Monza Low Downforce',
      car_model: 'Porsche 911 GT3 R',
      track_name: 'Monza',
      sim_platform: 'ACC',
      description: 'Super fast on straights, careful in Ascari.',
      owner_id: 'user1',
      shared_with: 'public',
      thumbs_up: 18
    },
    {
      id: '3',
      title: 'Nürburgring Endurance',
      car_model: 'BMW M4 GT3',
      track_name: 'Nürburgring',
      sim_platform: 'iRacing',
      description: 'Balanced setup for 6h races. Good on tires.',
      owner_id: 'user2',
      shared_with: 'friends',
      thumbs_up: 12
    },
    {
      id: '4',
      title: 'Silverstone Wet',
      car_model: 'Mercedes AMG GT3',
      track_name: 'Silverstone',
      sim_platform: 'ACC',
      description: 'Perfect for heavy rain conditions. High downforce.',
      owner_id: 'user3',
      shared_with: 'team',
      thumbs_up: 9
    },
    {
      id: '5',
      title: 'Suzuka Qualifying',
      car_model: 'Audi R8 LMS Evo II',
      track_name: 'Suzuka',
      sim_platform: 'iRacing',
      description: 'Maximum attack setup for quali. One lap wonder.',
      owner_id: 'user1',
      shared_with: 'public',
      thumbs_up: 32
    },
    {
      id: '6',
      title: 'Watkins Glen Race',
      car_model: 'Lamborghini Huracán GT3 Evo',
      track_name: 'Watkins Glen',
      sim_platform: 'iRacing',
      description: 'Good all-around setup for full race distance.',
      owner_id: 'user2',
      shared_with: 'friends',
      thumbs_up: 15
    }
  ]);

  useEffect(() => {
    fetchSetups();
  }, [fetchSetups]);

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };
  
  const clearFilters = () => {
    setFilters({
      platform: '',
      track: '',
      carClass: ''
    });
  };

  const platforms = ['iRacing', 'ACC', 'GT7', 'F1', 'RaceRoom', 'Automobilista', 'rFactor'];
  const tracks = ['Spa-Francorchamps', 'Monza', 'Nürburgring', 'Silverstone', 'Suzuka', 'Watkins Glen', 'Le Mans', 'Daytona'];
  const carClasses = ['GT3', 'GT4', 'LMP2', 'F1', 'NASCAR', 'TCR'];

  const getSharedBadge = (sharedWith: string) => {
    switch (sharedWith) {
      case 'team':
        return <Badge variant="secondary" className="bg-blue-900 hover:bg-blue-800">Team</Badge>;
      case 'friends':
        return <Badge variant="secondary" className="bg-green-900 hover:bg-green-800">Friends</Badge>;
      case 'public':
        return <Badge variant="secondary" className="bg-purple-900 hover:bg-purple-800">Public</Badge>;
      default:
        return <Badge variant="secondary" className="bg-gray-700 hover:bg-gray-600">Private</Badge>;
    }
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-orbitron font-bold">Setup Vault</h1>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={toggleFilters} 
              className="flex items-center"
            >
              <Filter size={18} className="mr-1" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
            
            <Button className="racing-btn">
              <Upload size={18} className="mr-1" /> Upload Setup
            </Button>
          </div>
        </div>
        
        {showFilters && (
          <div className="mb-6 p-4 bg-racing-dark-alt border border-gray-800 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Platform</label>
                <select 
                  name="platform"
                  value={filters.platform}
                  onChange={handleFilterChange}
                  className="w-full bg-gray-800 text-white border border-gray-700 rounded-md px-3 py-2"
                >
                  <option value="">All Platforms</option>
                  {platforms.map(platform => (
                    <option key={platform} value={platform}>{platform}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Track</label>
                <select 
                  name="track"
                  value={filters.track}
                  onChange={handleFilterChange}
                  className="w-full bg-gray-800 text-white border border-gray-700 rounded-md px-3 py-2"
                >
                  <option value="">All Tracks</option>
                  {tracks.map(track => (
                    <option key={track} value={track}>{track}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Car Class</label>
                <select 
                  name="carClass"
                  value={filters.carClass}
                  onChange={handleFilterChange}
                  className="w-full bg-gray-800 text-white border border-gray-700 rounded-md px-3 py-2"
                >
                  <option value="">All Car Classes</option>
                  {carClasses.map(carClass => (
                    <option key={carClass} value={carClass}>{carClass}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={clearFilters} 
                className="flex items-center"
              >
                <X size={16} className="mr-1" />
                Clear
              </Button>
              <Button className="racing-btn">Apply Filters</Button>
            </div>
          </div>
        )}
        
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search setups by name, car, or track..." 
            className="w-full pl-10 pr-4 py-3 bg-racing-dark-alt text-white border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-racing-red"
          />
        </div>
        
        <div className="overflow-hidden bg-racing-dark-alt border border-gray-800 rounded-lg">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Setup Name</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Platform / Car / Track</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Notes</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Shared With</th>
                  <th className="py-3 px-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-400">Likes</th>
                  <th className="py-3 px-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {mockSetups.map(setup => (
                  <tr key={setup.id} className="hover:bg-gray-800/50">
                    <td className="py-4 px-4 whitespace-nowrap font-medium">{setup.title}</td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col">
                        <span className="font-medium">{setup.sim_platform}</span>
                        <span className="text-sm text-gray-400">{setup.car_model} / {setup.track_name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="max-w-xs truncate text-sm text-gray-300">
                        {setup.description}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {getSharedBadge(setup.shared_with)}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center">
                        <ThumbsUp size={16} className="mr-1 text-gray-400" />
                        <span>{setup.thumbs_up}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <ThumbsUp size={16} />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Share2 size={16} />
                        </Button>
                        <Button size="sm" variant="secondary" className="text-xs">Download</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default SetupVault;
