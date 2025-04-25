
import React, { useState, useEffect } from 'react';
import { useRacerStore, Platform, LicenseClass, RoleTag } from '@/stores/useRacerStore';
import RacerCard from '@/components/racer/RacerCard';
import { Button } from '@/components/ui/button';
import { Search, Filter, X } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';

const FindRacers: React.FC = () => {
  const { racers, fetchRacers } = useRacerStore();
  const [filters, setFilters] = useState({
    platform: '' as Platform | '',
    drivingStyle: '',
    region: '',
    licenseClass: '' as LicenseClass | '',
    iRatingMin: '',
    iRatingMax: '',
    lookingForTeam: false
  });
  
  const [showFilters, setShowFilters] = useState(false);
  
  useEffect(() => {
    fetchRacers();
  }, [fetchRacers]);
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFilters({
      ...filters,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const applyFilters = () => {
    // Prepare filter object based on set filters
    const filterObj: any = {};
    
    if (filters.platform) {
      filterObj.platforms = [filters.platform];
    }
    
    if (filters.drivingStyle) {
      filterObj.driving_styles = [filters.drivingStyle];
    }
    
    if (filters.region) {
      filterObj.region = filters.region;
    }
    
    if (filters.licenseClass) {
      filterObj['iracing_stats.license_class'] = filters.licenseClass;
    }
    
    if (filters.iRatingMin && filters.iRatingMax) {
      filterObj['iracing_stats.irating'] = [
        parseInt(filters.iRatingMin), 
        parseInt(filters.iRatingMax)
      ];
    }
    
    if (filters.lookingForTeam) {
      filterObj.looking_for_team = true;
    }
    
    fetchRacers(filterObj);
  };
  
  const clearFilters = () => {
    setFilters({
      platform: '',
      drivingStyle: '',
      region: '',
      licenseClass: '',
      iRatingMin: '',
      iRatingMax: '',
      lookingForTeam: false
    });
    fetchRacers();
  };
  
  const platforms: Platform[] = ['iRacing', 'F1', 'ACC', 'GT7', 'rFactor', 'Automobilista', 'RaceRoom'];
  const drivingStyles = ['Endurance', 'Sprint', 'Oval', 'Rally', 'Drift', 'F1', 'GT3', 'GT4', 'NASCAR', 'Dirt'];
  const regions = ['North America', 'Europe', 'Asia', 'South America', 'Oceania', 'Global'];
  const licenseClasses: LicenseClass[] = ['rookie', 'D', 'C', 'B', 'A', 'pro', 'black'];

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-orbitron font-bold">Find Racers</h1>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={toggleFilters} 
              className="flex items-center"
            >
              <Filter size={18} className="mr-1" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Search racers..." 
                className="pl-9 pr-4 py-2 bg-racing-dark-alt text-white border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-racing-red"
              />
            </div>
          </div>
        </div>
        
        {showFilters && (
          <div className="mb-6 p-4 bg-racing-dark-alt border border-gray-800 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
                <label className="block text-sm font-medium text-gray-300 mb-1">Driving Discipline</label>
                <select 
                  name="drivingStyle"
                  value={filters.drivingStyle}
                  onChange={handleFilterChange}
                  className="w-full bg-gray-800 text-white border border-gray-700 rounded-md px-3 py-2"
                >
                  <option value="">All Disciplines</option>
                  {drivingStyles.map(style => (
                    <option key={style} value={style}>{style}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Region/Timezone</label>
                <select 
                  name="region"
                  value={filters.region}
                  onChange={handleFilterChange}
                  className="w-full bg-gray-800 text-white border border-gray-700 rounded-md px-3 py-2"
                >
                  <option value="">All Regions</option>
                  {regions.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">License Class</label>
                <select 
                  name="licenseClass"
                  value={filters.licenseClass}
                  onChange={handleFilterChange}
                  className="w-full bg-gray-800 text-white border border-gray-700 rounded-md px-3 py-2"
                >
                  <option value="">All Classes</option>
                  {licenseClasses.map(license => (
                    <option key={license} value={license}>
                      {license === 'rookie' ? 'Rookie' : license === 'pro' ? 'PRO' : license === 'black' ? 'World Championship' : license}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">iRating Range</label>
                <div className="flex items-center">
                  <input
                    type="text"
                    name="iRatingMin"
                    placeholder="Min"
                    value={filters.iRatingMin}
                    onChange={handleFilterChange}
                    className="w-full bg-gray-800 text-white border border-gray-700 rounded-md px-3 py-2"
                  />
                  <span className="mx-2">-</span>
                  <input
                    type="text"
                    name="iRatingMax"
                    placeholder="Max"
                    value={filters.iRatingMax}
                    onChange={handleFilterChange}
                    className="w-full bg-gray-800 text-white border border-gray-700 rounded-md px-3 py-2"
                  />
                </div>
              </div>
              
              <div className="flex items-end">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="lookingForTeam"
                    checked={filters.lookingForTeam}
                    onChange={handleFilterChange}
                    className="h-4 w-4 bg-gray-800 text-racing-red border-gray-700 rounded focus:ring-red-500"
                  />
                  <span className="text-sm font-medium text-gray-300">Looking for Team</span>
                </label>
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
              <Button onClick={applyFilters} className="racing-btn">Apply Filters</Button>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {racers.map(racer => (
            <RacerCard key={racer.id} racer={racer} />
          ))}
          
          {racers.length === 0 && (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12">
              <p className="text-gray-400">No racers found matching your filters.</p>
              <Button variant="outline" onClick={clearFilters} className="mt-4">
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default FindRacers;
