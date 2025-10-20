'use client';

import { useState, useMemo, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { MapPin, Search, Filter, Users, DollarSign, Check } from 'lucide-react';

interface Machine {
  id: string;
  name: string;
  location: string;
  lat: number;
  lng: number;
  tier: 'low' | 'medium' | 'high';
  footTraffic: number;
  price6Months: number;
  locationType: string;
}

interface MachineSelectionStepProps {
  selectedMachines: Machine[];
  onNext: (machines: Machine[]) => void;
  onBack: () => void;
}

// Google Maps API key
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'demo_key_replace_with_real_key';

// Map styles
const containerStyle = {
  width: '100%',
  height: '100%'
};

const londonCenter = {
  lat: 51.5074,
  lng: -0.1278
};

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
  clickableIcons: false,
  gestureHandling: 'greedy',
  styles: [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }]
    },
    {
      featureType: 'poi.business',
      stylers: [{ visibility: 'off' }]
    }
  ]
};

// Create custom marker icons for different tiers
const createMachineIcon = (tier: 'low' | 'medium' | 'high', isSelected: boolean) => {
  const colors = {
    low: { fill: '#9ca3af', stroke: '#6b7280' },
    medium: { fill: '#3b82f6', stroke: '#2563eb' },
    high: { fill: '#10b981', stroke: '#059669' }
  };

  const color = colors[tier];
  const opacity = isSelected ? '1' : '0.6';
  const strokeWidth = isSelected ? '2' : '1';

  const svg = `
    <svg width="24" height="32" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="${color.fill}" stroke="white" stroke-width="${strokeWidth}" opacity="${opacity}"/>
      <circle cx="12" cy="12" r="6" fill="white" opacity="${opacity}"/>
      ${isSelected ? '<circle cx="12" cy="12" r="4" fill="white"/>' : ''}
    </svg>
  `;

  return {
    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg),
    scaledSize: new google.maps.Size(24, 32),
    anchor: new google.maps.Point(12, 12)
  };
};

// Generate 300 demo machines across London with 3 tiers
const generateMachines = (): Machine[] => {
  const machines: Machine[] = [];
  
  const locationTypes = ['Gym', 'Office', 'University', 'Shopping Centre', 'Hospital', 'Station'];
  const neighborhoods = [
    'Clapham', 'Shoreditch', 'Canary Wharf', 'Kensington', 'Camden', 'Wimbledon',
    'Greenwich', 'Richmond', 'Hampstead', 'Brixton', 'Hackney', 'Islington',
    'Chelsea', 'Notting Hill', 'Soho', 'Westminster', 'King\'s Cross', 'Stratford',
    'Croydon', 'Sutton', 'Barnet', 'Enfield', 'Walthamstow', 'Lewisham'
  ];
  
  const brands = [
    'PureGym', 'The Gym', 'Fitness First', 'Virgin Active', 'David Lloyd',
    'WeWork', 'Regus', 'The Office Group', 'Central Working', 'Spaces'
  ];
  
  // London center coordinates
  const centerLat = 51.5074;
  const centerLng = -0.1278;
  
  for (let i = 0; i < 300; i++) {
    // Distribute tiers: 40% low, 35% medium, 25% high
    let tier: 'low' | 'medium' | 'high';
    const rand = Math.random();
    if (rand < 0.4) {
      tier = 'low';
    } else if (rand < 0.75) {
      tier = 'medium';
    } else {
      tier = 'high';
    }
    
    // Set pricing and metrics based on tier
    let price6Months: number;
    let footTraffic: number;
    
    if (tier === 'low') {
      price6Months = 600 + Math.floor(Math.random() * 200); // £600-800
      footTraffic = 800 + Math.floor(Math.random() * 700); // 800-1500
    } else if (tier === 'medium') {
      price6Months = 800 + Math.floor(Math.random() * 200); // £800-1000
      footTraffic = 1500 + Math.floor(Math.random() * 1000); // 1500-2500
    } else {
      price6Months = 1000 + Math.floor(Math.random() * 500); // £1000-1500
      footTraffic = 2500 + Math.floor(Math.random() * 2000); // 2500-4500
    }
    
    // Random location within ~10km of London center
    const lat = centerLat + (Math.random() - 0.5) * 0.2;
    const lng = centerLng + (Math.random() - 0.5) * 0.3;
    
    const locationType = locationTypes[Math.floor(Math.random() * locationTypes.length)];
    const neighborhood = neighborhoods[Math.floor(Math.random() * neighborhoods.length)];
    const brand = brands[Math.floor(Math.random() * brands.length)];
    
    machines.push({
      id: `MACH-${String(i + 1).padStart(3, '0')}`,
      name: `${brand} ${neighborhood}`,
      location: `${neighborhood}, London`,
      lat,
      lng,
      tier,
      footTraffic,
      price6Months,
      locationType,
    });
  }
  
  return machines;
};

export default function MachineSelectionStep({ selectedMachines, onNext, onBack }: MachineSelectionStepProps) {
  const allMachines = useMemo(() => generateMachines(), []);
  
  const [selected, setSelected] = useState<Machine[]>(selectedMachines);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [selectedLocationType, setSelectedLocationType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'price' | 'traffic'>('traffic');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [hoveredMachine, setHoveredMachine] = useState<string | null>(null);
  
  // Load Google Maps API
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY
  });
  
  // Filter and sort machines
  const filteredMachines = useMemo(() => {
    let filtered = allMachines;
    
    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(m => 
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by tier
    if (selectedTier !== 'all') {
      filtered = filtered.filter(m => m.tier === selectedTier);
    }
    
    // Filter by location type
    if (selectedLocationType !== 'all') {
      filtered = filtered.filter(m => m.locationType === selectedLocationType);
    }
    
    // Sort
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === 'price') return a.price6Months - b.price6Months;
      if (sortBy === 'traffic') return b.footTraffic - a.footTraffic;
      return 0;
    });
    
    return filtered;
  }, [allMachines, searchQuery, selectedTier, selectedLocationType, sortBy]);
  
  const toggleMachine = (machine: Machine) => {
    if (selected.find(m => m.id === machine.id)) {
      setSelected(selected.filter(m => m.id !== machine.id));
    } else {
      setSelected([...selected, machine]);
    }
  };
  
  const totalCost = selected.reduce((sum, m) => sum + m.price6Months, 0);
  const avgPrice = selected.length > 0 ? totalCost / selected.length : 0;
  
  const tierCounts = {
    low: selected.filter(m => m.tier === 'low').length,
    medium: selected.filter(m => m.tier === 'medium').length,
    high: selected.filter(m => m.tier === 'high').length,
  };
  
  const locationTypes = ['all', ...Array.from(new Set(allMachines.map(m => m.locationType)))];
  
  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Choose Your Machine Locations</h2>
        <p className="mt-2 text-gray-600">
          Select from 300 available machines across London. Pricing varies by foot traffic and location quality.
        </p>
      </div>
      
      {/* Quick Selection */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Select by Tier</h3>
        <p className="text-sm text-gray-600 mb-4">Choose how many machines you want from each tier</p>
        
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Low Traffic Machines</label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="0"
                max={allMachines.filter(m => m.tier === 'low').length}
                placeholder="0"
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                id="quick-low"
              />
              <button
                onClick={() => {
                  const input = document.getElementById('quick-low') as HTMLInputElement;
                  const count = parseInt(input.value) || 0;
                  const lowMachines = allMachines.filter(m => m.tier === 'low').slice(0, count);
                  const otherSelected = selected.filter(m => m.tier !== 'low');
                  setSelected([...otherSelected, ...lowMachines]);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
              >
                Select
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">£600-800 each</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Medium Traffic Machines</label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="0"
                max={allMachines.filter(m => m.tier === 'medium').length}
                placeholder="0"
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                id="quick-medium"
              />
              <button
                onClick={() => {
                  const input = document.getElementById('quick-medium') as HTMLInputElement;
                  const count = parseInt(input.value) || 0;
                  const mediumMachines = allMachines.filter(m => m.tier === 'medium').slice(0, count);
                  const otherSelected = selected.filter(m => m.tier !== 'medium');
                  setSelected([...otherSelected, ...mediumMachines]);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
              >
                Select
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">£800-1,000 each</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">High Traffic Machines</label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="0"
                max={allMachines.filter(m => m.tier === 'high').length}
                placeholder="0"
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                id="quick-high"
              />
              <button
                onClick={() => {
                  const input = document.getElementById('quick-high') as HTMLInputElement;
                  const count = parseInt(input.value) || 0;
                  const highMachines = allMachines.filter(m => m.tier === 'high').slice(0, count);
                  const otherSelected = selected.filter(m => m.tier !== 'high');
                  setSelected([...otherSelected, ...highMachines]);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
              >
                Select
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">£1,000-1,500 each</p>
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Or manually select/deselect individual machines below
          </p>
          {selected.length > 0 && (
            <button
              onClick={() => setSelected([])}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Clear all ({selected.length})
            </button>
          )}
        </div>
      </div>
      
      {/* Tier Pricing Info */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className={`
          p-4 rounded-lg border-2 cursor-pointer transition-all
          ${selectedTier === 'low' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}
        `} onClick={() => setSelectedTier(selectedTier === 'low' ? 'all' : 'low')}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Low Traffic</span>
            <span className="px-2 py-1 bg-gray-100 text-xs font-medium rounded">120 available</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">£600-800</p>
          <p className="text-xs text-gray-500 mt-1">800-1,500 visitors/day</p>
        </div>
        
        <div className={`
          p-4 rounded-lg border-2 cursor-pointer transition-all
          ${selectedTier === 'medium' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}
        `} onClick={() => setSelectedTier(selectedTier === 'medium' ? 'all' : 'medium')}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Medium Traffic</span>
            <span className="px-2 py-1 bg-blue-100 text-xs font-medium rounded">105 available</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">£800-1,000</p>
          <p className="text-xs text-gray-500 mt-1">1,500-2,500 visitors/day</p>
        </div>
        
        <div className={`
          p-4 rounded-lg border-2 cursor-pointer transition-all
          ${selectedTier === 'high' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}
        `} onClick={() => setSelectedTier(selectedTier === 'high' ? 'all' : 'high')}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">High Traffic</span>
            <span className="px-2 py-1 bg-green-100 text-xs font-medium rounded">75 available</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">£1,000-1,500</p>
          <p className="text-xs text-gray-500 mt-1">2,500-4,500 visitors/day</p>
        </div>
      </div>
      
      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </button>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="traffic">Highest Traffic</option>
            <option value="price">Lowest Price</option>
          </select>
        </div>
        
        {showFilters && (
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Location Type:</label>
              <div className="flex flex-wrap gap-2">
                {locationTypes.map(type => (
                  <button
                    key={type}
                    onClick={() => setSelectedLocationType(type)}
                    className={`
                      px-3 py-1 rounded-full text-sm font-medium transition-all
                      ${selectedLocationType === type 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-300'
                      }
                    `}
                  >
                    {type === 'all' ? 'All Types' : type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Selection Summary */}
      {selected.length > 0 && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-blue-900">
                {selected.length} machine{selected.length !== 1 ? 's' : ''} selected
              </p>
              <div className="flex items-center space-x-4 text-xs text-blue-700">
                <span>Low: {tierCounts.low}</span>
                <span>Medium: {tierCounts.medium}</span>
                <span>High: {tierCounts.high}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-900">£{totalCost.toLocaleString()}</p>
              <p className="text-xs text-blue-700">6-month campaign</p>
              <p className="text-xs text-blue-600">Avg: £{Math.round(avgPrice)}/machine</p>
            </div>
          </div>
        </div>
      )}
      
      {/* View Toggle */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('map')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'map'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Map View
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'list'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            List View
          </button>
        </div>
        
        <p className="text-sm text-gray-600">
          Showing {filteredMachines.length} machine{filteredMachines.length !== 1 ? 's' : ''}
        </p>
      </div>
      
      {/* Map View */}
      {viewMode === 'map' && (
        <div className="mb-6">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden" style={{ height: '600px' }}>
            {!isLoaded ? (
              <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading map...</p>
                </div>
              </div>
            ) : (
              <div className="relative w-full h-full">
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={londonCenter}
                  zoom={11}
                  onLoad={setMap}
                  options={mapOptions}
                >
                  {/* Machine markers */}
                  {filteredMachines.map(machine => {
                    const isSelected = selected.some(m => m.id === machine.id);
                    
                    return (
                      <Marker
                        key={machine.id}
                        position={{ lat: machine.lat, lng: machine.lng }}
                        icon={createMachineIcon(machine.tier, isSelected)}
                        title={machine.name}
                        onClick={() => toggleMachine(machine)}
                        onMouseOver={() => setHoveredMachine(machine.id)}
                        onMouseOut={() => setHoveredMachine(null)}
                      />
                    );
                  })}
                  
                  {/* Info window for hovered machine */}
                  {hoveredMachine && (() => {
                    const machine = filteredMachines.find(m => m.id === hoveredMachine);
                    if (!machine) return null;
                    const isSelected = selected.some(m => m.id === machine.id);
                    
                    return (
                      <InfoWindow
                        position={{ lat: machine.lat, lng: machine.lng }}
                        onCloseClick={() => setHoveredMachine(null)}
                      >
                        <div className="p-2 max-w-xs">
                          <div className="font-bold text-sm mb-1">{machine.name}</div>
                          <div className="text-xs text-gray-600 mb-2">{machine.location}</div>
                          <div className="flex items-center justify-between text-xs mb-2">
                            <span className={`px-2 py-1 rounded ${
                              machine.tier === 'low' ? 'bg-gray-100 text-gray-700' :
                              machine.tier === 'medium' ? 'bg-blue-100 text-blue-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {machine.tier.charAt(0).toUpperCase() + machine.tier.slice(1)} Traffic
                            </span>
                            <span className="font-bold text-gray-900">£{machine.price6Months}</span>
                          </div>
                          <button
                            onClick={() => toggleMachine(machine)}
                            className={`w-full py-1 px-3 rounded text-xs font-medium ${
                              isSelected
                                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                          >
                            {isSelected ? 'Remove' : 'Select'}
                          </button>
                        </div>
                      </InfoWindow>
                    );
                  })()}
                </GoogleMap>
                
                {/* Overlay info */}
                <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-xs pointer-events-none">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Machine Locations</h3>
                  <p className="text-xs text-gray-600 mb-3">
                    {filteredMachines.length} machines available across London
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                        <span className="text-gray-700">Low Traffic</span>
                      </div>
                      <span className="font-medium">{tierCounts.low} selected</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-700">Medium Traffic</span>
                      </div>
                      <span className="font-medium">{tierCounts.medium} selected</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-gray-700">High Traffic</span>
                      </div>
                      <span className="font-medium">{tierCounts.high} selected</span>
                    </div>
                  </div>
                  
                  {selected.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-900">
                          {selected.length} machines
                        </span>
                        <span className="text-sm font-bold text-blue-600">
                          £{totalCost.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Clickable tip */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm pointer-events-none">
                  💡 Click markers to select machines
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Machine List */}
      {viewMode === 'list' && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            {selected.length > 0 && (
              <button
                onClick={() => setSelected([])}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Clear all selections
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto pr-2">
          {filteredMachines.map(machine => {
            const isSelected = selected.find(m => m.id === machine.id);
            
            return (
              <div
                key={machine.id}
                onClick={() => toggleMachine(machine)}
                className={`
                  p-4 rounded-lg border-2 cursor-pointer transition-all
                  ${isSelected 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-blue-300'
                  }
                `}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{machine.name}</h3>
                    <p className="text-sm text-gray-600 flex items-center mt-1">
                      <MapPin className="w-3 h-3 mr-1" />
                      {machine.location}
                    </p>
                  </div>
                  <div className={`
                    w-6 h-6 rounded-full border-2 flex items-center justify-center
                    ${isSelected 
                      ? 'border-blue-500 bg-blue-500' 
                      : 'border-gray-300'
                    }
                  `}>
                    {isSelected && <Check className="w-4 h-4 text-white" />}
                  </div>
                </div>
                
                {/* Tier Badge */}
                <div className="mb-3">
                  <span className={`
                    inline-block px-2 py-1 text-xs font-medium rounded
                    ${machine.tier === 'low' ? 'bg-gray-100 text-gray-700' : ''}
                    ${machine.tier === 'medium' ? 'bg-blue-100 text-blue-700' : ''}
                    ${machine.tier === 'high' ? 'bg-green-100 text-green-700' : ''}
                  `}>
                    {machine.tier.charAt(0).toUpperCase() + machine.tier.slice(1)} Traffic
                  </span>
                  <span className="ml-2 text-xs text-gray-500">{machine.locationType}</span>
                </div>
                
                {/* Stats */}
                <div className="space-y-2 mb-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      Daily Visitors
                    </span>
                    <span className="font-medium text-gray-900">
                      {machine.footTraffic.toLocaleString()}
                    </span>
                  </div>
                </div>
                
                {/* Price */}
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 flex items-center">
                      <DollarSign className="w-4 h-4 mr-1" />
                      6-month placement
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                      £{machine.price6Months}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        </div>
      )}
      
      {/* Navigation */}
      <div className="flex items-center justify-between pt-6 border-t">
        <button
          onClick={onBack}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
        >
          Back
        </button>
        
        <button
          onClick={() => onNext(selected)}
          disabled={selected.length === 0}
          className={`
            px-6 py-2 rounded-lg font-medium
            ${selected.length > 0
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          Continue with {selected.length} machine{selected.length !== 1 ? 's' : ''}
        </button>
      </div>
    </div>
  );
}

