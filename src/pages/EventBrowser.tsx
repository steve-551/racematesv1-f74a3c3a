
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEventStore } from '@/stores/useEventStore';
import { format, parseISO } from 'date-fns';
import { Calendar, Clock, Users, Filter, X, Search, Plus, Flag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/components/layout/AppLayout';
import { toast } from 'sonner';

const EventBrowser: React.FC = () => {
  const { events, fetchEvents, rsvpEvent } = useEventStore();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    platform: '',
    carClass: '',
    openTeamsOnly: false,
    timezone: ''
  });

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

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
  
  const clearFilters = () => {
    setFilters({
      platform: '',
      carClass: '',
      openTeamsOnly: false,
      timezone: ''
    });
  };

  const handleRsvp = (eventId: string, response: 'yes' | 'maybe' | 'no') => {
    rsvpEvent(eventId, response);
    
    const responseText = {
      'yes': 'Going',
      'maybe': 'Interested',
      'no': 'Not Going'
    };
    
    toast.success(`You're now marked as ${responseText[response]}`);
  };
  
  const formatEventTime = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), 'PPP p');
    } catch (e) {
      return dateStr;
    }
  };
  
  const formatDuration = (minutes: number | undefined) => {
    if (!minutes) return 'Unknown duration';
    
    if (minutes < 60) {
      return `${minutes}min`;
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (remainingMinutes === 0) {
      return `${hours}h`;
    }
    
    return `${hours}h ${remainingMinutes}min`;
  };

  const platforms = ['iRacing', 'ACC', 'GT7', 'F1', 'RaceRoom', 'Automobilista', 'rFactor'];
  const carClasses = ['GT3', 'GT4', 'LMP2', 'F1', 'NASCAR', 'TCR'];
  const timezones = ['UTC', 'UTC-5 (EST)', 'UTC-8 (PST)', 'UTC+1 (CET)', 'UTC+8', 'UTC+9 (JST)', 'UTC+10 (AEST)'];

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-orbitron font-bold">Event Browser</h1>
          
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
              <Plus size={18} className="mr-1" /> Create Event
            </Button>
          </div>
        </div>
        
        {showFilters && (
          <div className="mb-6 p-4 bg-racing-dark-alt border border-gray-800 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Timezone</label>
                <select 
                  name="timezone"
                  value={filters.timezone}
                  onChange={handleFilterChange}
                  className="w-full bg-gray-800 text-white border border-gray-700 rounded-md px-3 py-2"
                >
                  <option value="">All Timezones</option>
                  {timezones.map(timezone => (
                    <option key={timezone} value={timezone}>{timezone}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-end">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="openTeamsOnly"
                    checked={filters.openTeamsOnly}
                    onChange={handleFilterChange}
                    className="h-4 w-4 bg-gray-800 text-racing-red border-gray-700 rounded focus:ring-red-500"
                  />
                  <span className="text-sm font-medium text-gray-300">Open Teams Only</span>
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
              <Button className="racing-btn">Apply Filters</Button>
            </div>
          </div>
        )}
        
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search events..." 
            className="w-full pl-10 pr-4 py-3 bg-racing-dark-alt text-white border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-racing-red"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <Card key={event.id} className="racing-card overflow-hidden hover:shadow-lg hover:shadow-red-500/10 transition-all duration-200">
              <div className="h-2 bg-racing-red" />
              <CardHeader className="pb-2">
                <CardTitle className="flex justify-between items-start">
                  <span className="text-xl font-rajdhani">{event.title}</span>
                  <Badge
                    variant="secondary"
                    className={
                      event.race_format === 'Endurance' 
                        ? 'bg-blue-900 hover:bg-blue-800' 
                        : event.race_format === 'Sprint' 
                          ? 'bg-red-900 hover:bg-red-800'
                          : 'bg-amber-900 hover:bg-amber-800'
                    }
                  >
                    {event.race_format}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="flex items-center text-sm text-gray-300 mb-1">
                    <Calendar size={16} className="mr-2" />
                    <span>{formatEventTime(event.start_time)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-300 mb-1">
                    <Clock size={16} className="mr-2" />
                    <span>{formatDuration(event.estimated_duration)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-300">
                    <Flag size={16} className="mr-2" />
                    <span>{event.sim_platform} - {event.car_class}</span>
                  </div>
                </div>
                
                <div className="flex items-center mb-4">
                  <Users size={16} className="mr-2 text-gray-400" />
                  <div className="text-sm">
                    <span className="text-gray-300">12 Going</span>
                    <span className="mx-2 text-gray-500">•</span>
                    <span className="text-gray-300">3 Maybe</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    className="racing-btn text-xs h-8"
                    onClick={() => handleRsvp(event.id, 'yes')}
                  >
                    Going
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-8"
                    onClick={() => handleRsvp(event.id, 'maybe')}
                  >
                    Maybe
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-8"
                    onClick={() => handleRsvp(event.id, 'no')}
                  >
                    Not Going
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default EventBrowser;
