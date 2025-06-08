'use client';

import { useEffect, useState } from 'react';
import { 
  Zap, 
  Satellite, 
  Globe, 
  AlertTriangle,
  Clock,
  MapPin,
  Activity,
  TrendingUp,
  Wifi,
  Database,
  ArrowUpRight,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

interface LiveEvent {
  id: string;
  type: 'earthquake' | 'weather' | 'fire';
  title: string;
  location: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  magnitude?: number;
  coordinates: string;
  time: string;
  source: string;
  predicted_by_ml: boolean;
  ml_confidence?: number;
}

interface DataSource {
  name: string;
  type: string;
  status: 'connected' | 'disconnected' | 'error';
  last_update: string;
  coverage: string;
  update_frequency: string;
}

export function LiveDataDashboard() {
  const [liveEvents, setLiveEvents] = useState<LiveEvent[]>([]);
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [stats, setStats] = useState({
    total_active: 0,
    earthquakes_today: 0,
    weather_alerts: 0,
    ml_generated: 0,
    last_import: null as string | null
  });
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    fetchLiveData();
    fetchDataSources();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchLiveData();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchLiveData = async () => {
    try {
      // Mock live data - in production this would fetch from your API
      const mockEvents: LiveEvent[] = [
        {
          id: '1',
          type: 'earthquake',
          title: 'M6.2 Earthquake - Solomon Islands',
          location: '15.2km SE of Honiara, Solomon Islands',
          severity: 'high',
          magnitude: 6.2,
          coordinates: '-9.464,159.972',
          time: new Date(Date.now() - 1200000).toISOString(), // 20 minutes ago
          source: 'USGS',
          predicted_by_ml: true,
          ml_confidence: 0.95
        },
        {
          id: '2',
          type: 'weather',
          title: 'Severe Thunderstorm Warning',
          location: 'Central Texas, USA',
          severity: 'critical',
          coordinates: '30.2672,-97.7431',
          time: new Date(Date.now() - 600000).toISOString(), // 10 minutes ago
          source: 'NOAA',
          predicted_by_ml: true,
          ml_confidence: 0.88
        },
        {
          id: '3',
          type: 'earthquake',
          title: 'M4.8 Earthquake - California',
          location: '12km NW of Ridgecrest, CA',
          severity: 'medium',
          magnitude: 4.8,
          coordinates: '35.6,117.7',
          time: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          source: 'USGS',
          predicted_by_ml: true,
          ml_confidence: 0.92
        }
      ];
      
      setLiveEvents(mockEvents);
      setStats({
        total_active: mockEvents.length,
        earthquakes_today: mockEvents.filter(e => e.type === 'earthquake').length,
        weather_alerts: mockEvents.filter(e => e.type === 'weather').length,
        ml_generated: mockEvents.filter(e => e.predicted_by_ml).length,
        last_import: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to fetch live data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDataSources = async () => {
    try {
      const mockSources: DataSource[] = [
        {
          name: 'USGS Earthquake API',
          type: 'earthquakes',
          status: 'connected',
          last_update: new Date(Date.now() - 900000).toISOString(), // 15 min ago
          coverage: 'Global',
          update_frequency: 'Real-time'
        },
        {
          name: 'NOAA Weather Alerts',
          type: 'weather',
          status: 'connected',
          last_update: new Date(Date.now() - 300000).toISOString(), // 5 min ago
          coverage: 'United States',
          update_frequency: 'Real-time'
        }
      ];
      setDataSources(mockSources);
    } catch (error) {
      console.error('Failed to fetch data sources:', error);
    }
  };

  const handleManualImport = async () => {
    setImporting(true);
    try {
      // This would call your actual import API
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      await fetchLiveData();
      toast.success('Successfully imported latest disaster data');
    } catch (error) {
      toast.error('Failed to import data');
    } finally {
      setImporting(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'earthquake': return <Activity className="h-5 w-5" />;
      case 'weather': return <Globe className="h-5 w-5" />;
      case 'fire': return <Zap className="h-5 w-5" />;
      default: return <AlertTriangle className="h-5 w-5" />;
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return time.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-white">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
          <span className="text-lg">Loading real-time disaster data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Real-Time Disaster Monitoring
          </h1>
          <p className="text-white/70">
            Live data from USGS, NOAA, and other authoritative sources
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={handleManualImport}
            disabled={importing}
            className="btn-premium flex items-center gap-2 px-4 py-2 text-white disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${importing ? 'animate-spin' : ''}`} />
            {importing ? 'Importing...' : 'Import Latest'}
          </button>
          
          <Link
            href="/map"
            className="glass border border-white/20 px-4 py-2 rounded-xl text-white hover:bg-white/5 transition-all duration-300 flex items-center gap-2"
          >
            <MapPin className="h-4 w-4" />
            View Map
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 border border-white/10 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Active Events</p>
              <p className="text-3xl font-bold text-white">{stats.total_active}</p>
            </div>
            <div className="p-3 rounded-xl bg-red-500/20 border border-red-400/30">
              <Activity className="h-6 w-6 text-red-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <Wifi className="h-4 w-4 text-green-400" />
            <span className="text-white/70">Live monitoring active</span>
          </div>
        </div>

        <div className="glass-card p-6 border border-white/10 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Earthquakes Today</p>
              <p className="text-3xl font-bold text-white">{stats.earthquakes_today}</p>
            </div>
            <div className="p-3 rounded-xl bg-orange-500/20 border border-orange-400/30">
              <Globe className="h-6 w-6 text-orange-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-white/70">
            <span>Magnitude 4.0+</span>
          </div>
        </div>

        <div className="glass-card p-6 border border-white/10 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Weather Alerts</p>
              <p className="text-3xl font-bold text-white">{stats.weather_alerts}</p>
            </div>
            <div className="p-3 rounded-xl bg-blue-500/20 border border-blue-400/30">
              <Satellite className="h-6 w-6 text-blue-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-white/70">
            <span>Severe weather warnings</span>
          </div>
        </div>

        <div className="glass-card p-6 border border-white/10 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">ML Generated</p>
              <p className="text-3xl font-bold text-white">{stats.ml_generated}</p>
            </div>
            <div className="p-3 rounded-xl bg-purple-500/20 border border-purple-400/30">
              <Database className="h-6 w-6 text-purple-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-white/70">
            <span>Auto-imported requests</span>
          </div>
        </div>
      </div>

      {/* Live Events and Data Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Live Events */}
        <div className="lg:col-span-2 glass-card border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Zap className="h-5 w-5 text-red-400" />
              Live Events
            </h2>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white/60 text-sm">Real-time</span>
            </div>
          </div>

          <div className="space-y-4">
            {liveEvents.map((event) => (
              <div 
                key={event.id}
                className="glass border border-white/5 rounded-xl p-4 hover:bg-white/[0.02] transition-all duration-300 group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`p-2 rounded-lg ${getSeverityColor(event.severity)}`}>
                      {getEventIcon(event.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-white group-hover:text-red-300 transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-white/60 text-sm mt-1">{event.location}</p>
                      
                      <div className="flex items-center gap-4 mt-3 text-xs text-white/50">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTimeAgo(event.time)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Database className="h-3 w-3" />
                          {event.source}
                        </span>
                        {event.ml_confidence && (
                          <span className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            {Math.round(event.ml_confidence * 100)}% confidence
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(event.severity)}`}>
                      {event.severity.toUpperCase()}
                    </span>
                    <ChevronRight className="h-4 w-4 text-white/40 group-hover:text-white/60 transition-colors" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <Link 
              href="/requests"
              className="w-full glass border border-white/10 rounded-xl p-3 text-center text-white/70 hover:text-white hover:bg-white/[0.02] transition-all duration-300 flex items-center justify-center gap-2"
            >
              View All Emergency Requests
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Data Sources */}
        <div className="glass-card border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Satellite className="h-5 w-5 text-blue-400" />
            Data Sources
          </h2>

          <div className="space-y-4">
            {dataSources.map((source, index) => (
              <div key={index} className="glass border border-white/5 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-white text-sm">{source.name}</h3>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      source.status === 'connected' ? 'bg-green-400' : 
                      source.status === 'disconnected' ? 'bg-gray-400' : 'bg-red-400'
                    }`}></div>
                    <span className={`text-xs ${
                      source.status === 'connected' ? 'text-green-400' : 
                      source.status === 'disconnected' ? 'text-gray-400' : 'text-red-400'
                    }`}>
                      {source.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-1 text-xs text-white/60">
                  <p>Coverage: {source.coverage}</p>
                  <p>Frequency: {source.update_frequency}</p>
                  <p>Last update: {formatTimeAgo(source.last_update)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 glass border border-blue-400/20 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-4 w-4 text-blue-400" />
              <span className="text-white font-medium text-sm">Auto Import</span>
            </div>
            <p className="text-white/60 text-xs">
              Data is automatically imported every 15-30 minutes from all connected sources.
            </p>
            {stats.last_import && (
              <p className="text-white/50 text-xs mt-2">
                Last import: {formatTimeAgo(stats.last_import)}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}