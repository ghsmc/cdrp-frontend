'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { 
  Satellite, 
  RefreshCw, 
  Download, 
  MapPin, 
  Clock, 
  Activity,
  TrendingUp,
  Thermometer,
  Flame,
  Eye,
  Zap,
  Globe,
  Camera
} from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';

const mockUser = {
  id: '1',
  email: 'responder@example.com',
  name: 'Sarah Chen',
  role: 'field_agent' as const,
  region_id: '1',
  created_at: '2024-01-01',
};

interface SatelliteData {
  id: string;
  satellite: string;
  instrument: string;
  type: 'fire' | 'flood' | 'thermal' | 'vegetation' | 'aerosol';
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  timestamp: string;
  confidence: number;
  brightness: number;
  scan: number;
  track: number;
  version: string;
}

const mockSatelliteData: SatelliteData[] = [
  {
    id: 'MODIS_C6_1_Global_7d_2024015_1345',
    satellite: 'Terra',
    instrument: 'MODIS',
    type: 'fire',
    location: {
      lat: 34.0522,
      lng: -118.2437,
      address: 'Los Angeles, California'
    },
    timestamp: '2024-01-15T13:45:00Z',
    confidence: 85,
    brightness: 315.7,
    scan: 1.2,
    track: 1.1,
    version: 'Collection 6.1'
  },
  {
    id: 'VIIRS_SNPP_Global_7d_2024015_1430',
    satellite: 'Suomi NPP',
    instrument: 'VIIRS',
    type: 'fire',
    location: {
      lat: 37.4419,
      lng: -122.1430,
      address: 'San Francisco Bay Area, California'
    },
    timestamp: '2024-01-15T14:30:00Z',
    confidence: 92,
    brightness: 387.2,
    scan: 375,
    track: 375,
    version: 'Collection 2'
  },
  {
    id: 'MODIS_C6_1_Thermal_2024015_1200',
    satellite: 'Aqua',
    instrument: 'MODIS',
    type: 'thermal',
    location: {
      lat: 25.7617,
      lng: -80.1918,
      address: 'Miami, Florida'
    },
    timestamp: '2024-01-15T12:00:00Z',
    confidence: 78,
    brightness: 298.1,
    scan: 1.0,
    track: 1.0,
    version: 'Collection 6.1'
  },
  {
    id: 'VIIRS_FLOOD_2024015_0900',
    satellite: 'NOAA-20',
    instrument: 'VIIRS',
    type: 'flood',
    location: {
      lat: 29.9511,
      lng: -90.0715,
      address: 'New Orleans, Louisiana'
    },
    timestamp: '2024-01-15T09:00:00Z',
    confidence: 95,
    brightness: 285.3,
    scan: 375,
    track: 375,
    version: 'Collection 2'
  }
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'fire':
      return Flame;
    case 'flood':
      return Activity;
    case 'thermal':
      return Thermometer;
    default:
      return Eye;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'fire':
      return 'text-red-400 bg-red-500/10 border-red-500/20';
    case 'flood':
      return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
    case 'thermal':
      return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
    default:
      return 'text-green-400 bg-green-500/10 border-green-500/20';
  }
};

const getConfidenceColor = (confidence: number) => {
  if (confidence >= 90) return 'text-green-400';
  if (confidence >= 70) return 'text-yellow-400';
  return 'text-red-400';
};

export default function SatellitePage() {
  const [data, setData] = useState<SatelliteData[]>(mockSatelliteData);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const refreshData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to refresh satellite data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportData = () => {
    const csvData = data.map(item => ({
      ID: item.id,
      Satellite: item.satellite,
      Instrument: item.instrument,
      Type: item.type,
      Location: item.location.address,
      Latitude: item.location.lat,
      Longitude: item.location.lng,
      Timestamp: item.timestamp,
      Confidence: item.confidence,
      Brightness: item.brightness,
      Version: item.version
    }));
    
    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nasa-satellite-data.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background gradients */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent pointer-events-none"></div>
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent pointer-events-none"></div>
      
      <Header user={mockUser} />
      
      <div className="md:ml-52 px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
              <img 
                src="https://img.logo.dev/nasa.gov?token=pk_VAZ6tvAVQHCDwKeaNRVyjQ"
                alt="NASA"
                className="h-8 w-8"
                onError={(e) => {
                  e.currentTarget.src = 'https://upload.wikimedia.org/wikipedia/commons/e/e5/NASA_logo.svg';
                }}
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">NASA Satellite Data</h1>
              <p className="text-muted-foreground">Real-time fire detection, thermal anomalies, and Earth observation data</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={refreshData}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground glass border border-white/10 rounded-lg hover:bg-white/[0.05] disabled:opacity-50 transition-all"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            
            <button
              onClick={exportData}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground glass border border-white/10 rounded-lg hover:bg-white/[0.05] transition-all"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="glass-card rounded-2xl p-6 border border-white/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Detections</p>
                <p className="text-3xl font-bold text-foreground">{data.length}</p>
              </div>
              <Satellite className="h-8 w-8 text-purple-400" />
            </div>
          </div>
          
          <div className="glass-card rounded-2xl p-6 border border-white/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Fire Detections</p>
                <p className="text-3xl font-bold text-red-400">
                  {data.filter(d => d.type === 'fire').length}
                </p>
              </div>
              <Flame className="h-8 w-8 text-red-400" />
            </div>
          </div>
          
          <div className="glass-card rounded-2xl p-6 border border-white/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">High Confidence</p>
                <p className="text-3xl font-bold text-green-400">
                  {data.filter(d => d.confidence >= 90).length}
                </p>
              </div>
              <Activity className="h-8 w-8 text-green-400" />
            </div>
          </div>
          
          <div className="glass-card rounded-2xl p-6 border border-white/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="text-sm font-medium text-foreground">
                  {formatRelativeTime(lastUpdated.toISOString())}
                </p>
              </div>
              <Clock className="h-6 w-6 text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* Satellite Instruments */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass rounded-xl border border-white/5 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Camera className="h-6 w-6 text-blue-400" />
              <h3 className="text-lg font-semibold text-foreground">MODIS</h3>
            </div>
            <p className="text-muted-foreground text-sm mb-2">
              Moderate Resolution Imaging Spectroradiometer on Terra and Aqua satellites
            </p>
            <div className="text-xs text-muted-foreground">
              <p>• 36 spectral bands</p>
              <p>• 250m to 1km resolution</p>
              <p>• Fire and thermal detection</p>
            </div>
          </div>
          
          <div className="glass rounded-xl border border-white/5 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="h-6 w-6 text-green-400" />
              <h3 className="text-lg font-semibold text-foreground">VIIRS</h3>
            </div>
            <p className="text-muted-foreground text-sm mb-2">
              Visible Infrared Imaging Radiometer Suite on Suomi NPP and NOAA-20
            </p>
            <div className="text-xs text-muted-foreground">
              <p>• 22 spectral bands</p>
              <p>• 375m resolution</p>
              <p>• Enhanced fire detection</p>
            </div>
          </div>
          
          <div className="glass rounded-xl border border-white/5 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="h-6 w-6 text-purple-400" />
              <h3 className="text-lg font-semibold text-foreground">Landsat</h3>
            </div>
            <p className="text-muted-foreground text-sm mb-2">
              Operational Land Imager (OLI) and Thermal Infrared Sensor (TIRS)
            </p>
            <div className="text-xs text-muted-foreground">
              <p>• 11 spectral bands</p>
              <p>• 30m resolution</p>
              <p>• Land surface analysis</p>
            </div>
          </div>
        </div>

        {/* Satellite Data List */}
        <div className="glass rounded-2xl border border-white/5 overflow-hidden">
          <div className="p-6 border-b border-white/5">
            <h2 className="text-xl font-bold text-foreground">Recent Satellite Detections</h2>
            <p className="text-muted-foreground text-sm mt-1">
              Latest fire, thermal, and environmental detections from NASA Earth observation satellites
            </p>
          </div>
          
          <div className="divide-y divide-white/5">
            {data.map((item) => {
              const TypeIcon = getTypeIcon(item.type);
              
              return (
                <div key={item.id} className="p-6 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg border ${getTypeColor(item.type)}`}>
                      <TypeIcon className="h-6 w-6" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">
                            {item.satellite} {item.instrument} Detection
                          </h3>
                          <p className="text-primary font-medium capitalize">{item.type} Alert</p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getConfidenceColor(item.confidence)}`}>
                            {item.confidence}% Confidence
                          </span>
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-foreground">
                            {item.version}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-muted-foreground">Brightness Temperature</p>
                          <p className="text-sm font-medium text-foreground">{item.brightness.toFixed(1)}K</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Scan/Track</p>
                          <p className="text-sm font-medium text-foreground">{item.scan.toFixed(1)} × {item.track.toFixed(1)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Coordinates</p>
                          <p className="text-sm font-medium text-foreground">
                            {item.location.lat.toFixed(4)}, {item.location.lng.toFixed(4)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Detection Time</p>
                          <p className="text-sm font-medium text-foreground">
                            {formatRelativeTime(item.timestamp)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{item.location.address}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Satellite className="h-3 w-3" />
                          <span>{item.satellite} / {item.instrument}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Activity className="h-3 w-3" />
                          <span>ID: {item.id}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Integration Info */}
        <div className="mt-8 glass rounded-2xl border border-white/5 p-6">
          <div className="flex items-center gap-3 mb-4">
            <img 
              src="https://img.logo.dev/nasa.gov?token=pk_VAZ6tvAVQHCDwKeaNRVyjQ"
              alt="NASA"
              className="h-8 w-8"
              onError={(e) => {
                e.currentTarget.src = 'https://upload.wikimedia.org/wikipedia/commons/e/e5/NASA_logo.svg';
              }}
            />
            <h3 className="text-lg font-semibold text-foreground">NASA FIRMS Integration</h3>
          </div>
          <p className="text-muted-foreground text-sm">
            CDRP integrates with NASA's Fire Information for Resource Management System (FIRMS) to provide real-time 
            fire detection data from multiple satellite instruments including MODIS and VIIRS. This data helps emergency 
            responders detect and track active fires, thermal anomalies, and other environmental hazards with high precision 
            and near real-time updates. Data is processed and delivered within 3-6 hours of satellite observation.
          </p>
        </div>
      </div>
    </div>
  );
}