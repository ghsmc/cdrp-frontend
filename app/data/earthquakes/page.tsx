'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { useRealTimeData } from '@/lib/hooks/useRealTimeData';
import { 
  Zap, 
  RefreshCw, 
  Download, 
  MapPin, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  Globe,
  Activity,
  BarChart3
} from 'lucide-react';
import { formatRelativeTime, getSeverityColor } from '@/lib/utils';

const mockUser = {
  id: '1',
  email: 'responder@example.com',
  name: 'Sarah Chen',
  role: 'field_agent' as const,
  region_id: '1',
  created_at: '2024-01-01',
};

interface Earthquake {
  id: string;
  magnitude: number;
  location: string;
  coordinates: [number, number];
  depth: number;
  time: string;
  tsunami: boolean;
  significance: number;
  alert?: 'green' | 'yellow' | 'orange' | 'red';
  url: string;
  felt?: number;
  cdi?: number;
  mmi?: number;
}

const mockEarthquakes: Earthquake[] = [
  {
    id: 'us6000m9x4',
    magnitude: 6.2,
    location: '15km SE of Honiara, Solomon Islands',
    coordinates: [-9.464, 159.972],
    depth: 35.2,
    time: new Date(Date.now() - 1200000).toISOString(),
    tsunami: false,
    significance: 543,
    alert: 'orange',
    url: 'https://earthquake.usgs.gov/earthquakes/eventpage/us6000m9x4',
    felt: 24,
    cdi: 4.2,
    mmi: 5.1
  },
  {
    id: 'us7000k1b2',
    magnitude: 4.8,
    location: '32km SW of Ferndale, CA',
    coordinates: [40.456, -124.789],
    depth: 18.5,
    time: new Date(Date.now() - 3600000).toISOString(),
    tsunami: false,
    significance: 234,
    alert: 'yellow',
    url: 'https://earthquake.usgs.gov/earthquakes/eventpage/us7000k1b2',
    felt: 156,
    cdi: 3.8
  },
  {
    id: 'us8000p3q7',
    magnitude: 5.4,
    location: '78km NNE of Iquique, Chile',
    coordinates: [-19.823, -70.156],
    depth: 112.8,
    time: new Date(Date.now() - 7200000).toISOString(),
    tsunami: false,
    significance: 412,
    alert: 'yellow',
    url: 'https://earthquake.usgs.gov/earthquakes/eventpage/us8000p3q7',
    felt: 12,
    cdi: 2.9
  }
];

const getMagnitudeColor = (magnitude: number) => {
  if (magnitude >= 7.0) return 'text-red-500 bg-red-500/10 border-red-400/30';
  if (magnitude >= 6.0) return 'text-orange-500 bg-orange-500/10 border-orange-400/30';
  if (magnitude >= 5.0) return 'text-yellow-500 bg-yellow-500/10 border-yellow-400/30';
  if (magnitude >= 4.0) return 'text-blue-500 bg-blue-500/10 border-blue-400/30';
  return 'text-green-500 bg-green-500/10 border-green-400/30';
};

const getAlertColor = (alert?: string) => {
  switch (alert) {
    case 'red': return 'bg-red-500 text-white border-red-400';
    case 'orange': return 'bg-orange-500 text-white border-orange-400';
    case 'yellow': return 'bg-yellow-500 text-black border-yellow-400';
    case 'green': return 'bg-green-500 text-white border-green-400';
    default: return 'bg-gray-500 text-white border-gray-400';
  }
};

export default function EarthquakesPage() {
  const [earthquakes, setEarthquakes] = useState<Earthquake[]>(mockEarthquakes);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    minMagnitude: 4.0,
    maxAge: 24, // hours
    alertLevel: [] as string[]
  });

  const { importEarthquakeData, isLoading: importing } = useRealTimeData();

  const refreshData = async () => {
    setIsLoading(true);
    try {
      await importEarthquakeData();
      // In a real implementation, we'd fetch the updated earthquake data here
      setTimeout(() => setIsLoading(false), 1000);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const filteredEarthquakes = earthquakes.filter(eq => {
    if (eq.magnitude < filters.minMagnitude) return false;
    
    const hoursAgo = (Date.now() - new Date(eq.time).getTime()) / (1000 * 60 * 60);
    if (hoursAgo > filters.maxAge) return false;
    
    if (filters.alertLevel.length > 0 && eq.alert && !filters.alertLevel.includes(eq.alert)) {
      return false;
    }
    
    return true;
  });

  const stats = {
    total: filteredEarthquakes.length,
    highMagnitude: filteredEarthquakes.filter(eq => eq.magnitude >= 6.0).length,
    recent: filteredEarthquakes.filter(eq => {
      const hoursAgo = (Date.now() - new Date(eq.time).getTime()) / (1000 * 60 * 60);
      return hoursAgo <= 1;
    }).length,
    maxMagnitude: filteredEarthquakes.length > 0 ? Math.max(...filteredEarthquakes.map(eq => eq.magnitude)) : 0
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background gradients */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none"></div>
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none"></div>
      
      <Header user={mockUser} />
      
      <div className="md:ml-52 px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/20">
              <Zap className="h-6 w-6 text-orange-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Earthquake Monitoring</h1>
              <p className="text-muted-foreground">Real-time seismic activity powered by USGS</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={refreshData}
              disabled={isLoading || importing}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground glass border border-white/10 rounded-lg hover:bg-white/[0.05] disabled:opacity-50 transition-all"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading || importing ? 'animate-spin' : ''}`} />
              {importing ? 'Importing...' : 'Refresh'}
            </button>
            
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground glass border border-white/10 rounded-lg hover:bg-white/[0.05] transition-all">
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="glass-card rounded-2xl p-6 border border-white/5 card-hover hover-glow">
            <div className="text-sm text-muted-foreground">Total Events</div>
            <div className="text-3xl font-bold text-foreground">{stats.total}</div>
          </div>
          <div className="glass-card rounded-2xl p-6 border border-white/5 card-hover hover-glow">
            <div className="text-sm text-muted-foreground">M6.0+ Events</div>
            <div className="text-3xl font-bold text-orange-500">{stats.highMagnitude}</div>
          </div>
          <div className="glass-card rounded-2xl p-6 border border-white/5 card-hover hover-glow">
            <div className="text-sm text-muted-foreground">Past Hour</div>
            <div className="text-3xl font-bold text-blue-400">{stats.recent}</div>
          </div>
          <div className="glass-card rounded-2xl p-6 border border-white/5 card-hover hover-glow">
            <div className="text-sm text-muted-foreground">Max Magnitude</div>
            <div className="text-3xl font-bold text-primary">{stats.maxMagnitude.toFixed(1)}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="glass-ultra rounded-2xl border border-white/5 p-6 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <h3 className="font-medium text-foreground">Filters</h3>
          </div>
          
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Minimum Magnitude
              </label>
              <select
                value={filters.minMagnitude}
                onChange={(e) => setFilters(prev => ({ ...prev, minMagnitude: parseFloat(e.target.value) }))}
                className="glass border border-white/10 rounded-xl px-3 py-2 text-foreground bg-transparent focus:ring-2 focus:ring-primary/50 focus:border-primary/50 w-full"
              >
                <option value={2.5}>2.5+</option>
                <option value={4.0}>4.0+</option>
                <option value={5.0}>5.0+</option>
                <option value={6.0}>6.0+</option>
                <option value={7.0}>7.0+</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Time Range
              </label>
              <select
                value={filters.maxAge}
                onChange={(e) => setFilters(prev => ({ ...prev, maxAge: parseInt(e.target.value) }))}
                className="glass border border-white/10 rounded-xl px-3 py-2 text-foreground bg-transparent focus:ring-2 focus:ring-primary/50 focus:border-primary/50 w-full"
              >
                <option value={1}>Past Hour</option>
                <option value={24}>Past Day</option>
                <option value={168}>Past Week</option>
                <option value={720}>Past Month</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Alert Level
              </label>
              <div className="flex gap-2">
                {['green', 'yellow', 'orange', 'red'].map(level => (
                  <button
                    key={level}
                    onClick={() => {
                      setFilters(prev => ({
                        ...prev,
                        alertLevel: prev.alertLevel.includes(level)
                          ? prev.alertLevel.filter(l => l !== level)
                          : [...prev.alertLevel, level]
                      }));
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      filters.alertLevel.includes(level)
                        ? getAlertColor(level)
                        : 'glass border border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/[0.05]'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Earthquake List */}
        <div className="glass-ultra rounded-2xl border border-white/5 p-6">
          <h3 className="font-medium text-foreground mb-6">Recent Earthquakes</h3>
          
          <div className="space-y-4">
            {filteredEarthquakes.map((earthquake) => (
              <div key={earthquake.id} className="glass-card rounded-xl border border-white/5 p-4 card-hover hover-glow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getMagnitudeColor(earthquake.magnitude)}`}>
                        M{earthquake.magnitude}
                      </span>
                      {earthquake.alert && (
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getAlertColor(earthquake.alert)}`}>
                          {earthquake.alert.toUpperCase()}
                        </span>
                      )}
                      {earthquake.tsunami && (
                        <span className="px-2 py-1 rounded text-xs font-medium bg-blue-500 text-white border border-blue-400">
                          TSUNAMI
                        </span>
                      )}
                    </div>
                    
                    <h4 className="font-medium text-foreground mb-1">{earthquake.location}</h4>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {formatRelativeTime(earthquake.time)}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {earthquake.depth}km deep
                      </div>
                      {earthquake.felt && (
                        <div className="flex items-center gap-1">
                          <Activity className="h-4 w-4" />
                          Felt by {earthquake.felt}
                        </div>
                      )}
                    </div>
                    
                    {(earthquake.cdi || earthquake.mmi) && (
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        {earthquake.cdi && (
                          <span>CDI: {earthquake.cdi}</span>
                        )}
                        {earthquake.mmi && (
                          <span>MMI: {earthquake.mmi}</span>
                        )}
                        <span>Significance: {earthquake.significance}</span>
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => window.open(earthquake.url, '_blank')}
                    className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/25"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {filteredEarthquakes.length === 0 && (
            <div className="text-center py-12">
              <Zap className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No earthquakes found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters to see more events.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}