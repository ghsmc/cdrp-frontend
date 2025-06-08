'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { useRealTimeData } from '@/lib/hooks/useRealTimeData';
import { 
  Cloud, 
  RefreshCw, 
  Download, 
  MapPin, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  Thermometer,
  Activity,
  Wind,
  Droplets,
  Eye,
  Zap
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

interface WeatherAlert {
  id: string;
  event: string;
  severity: 'minor' | 'moderate' | 'severe' | 'extreme';
  urgency: 'immediate' | 'expected' | 'future' | 'past';
  certainty: 'observed' | 'likely' | 'possible' | 'unlikely';
  headline: string;
  description: string;
  instruction?: string;
  areas: string[];
  effective: string;
  expires: string;
  sender: string;
  senderName: string;
}

const mockWeatherAlerts: WeatherAlert[] = [
  {
    id: 'NWS-IDP-PROD-4925558',
    event: 'Winter Storm Warning',
    severity: 'severe',
    urgency: 'immediate',
    certainty: 'likely',
    headline: 'Winter Storm Warning issued for multiple counties',
    description: 'Heavy snow expected with accumulations of 8 to 14 inches possible. Winds gusting as high as 45 mph.',
    instruction: 'Travel could be very difficult to impossible. The hazardous conditions could impact the morning or evening commute.',
    areas: ['Jefferson County', 'Adams County', 'Denver County'],
    effective: '2024-01-15T06:00:00Z',
    expires: '2024-01-16T18:00:00Z',
    sender: 'w-nws.webmaster@noaa.gov',
    senderName: 'NWS Boulder CO'
  },
  {
    id: 'NWS-IDP-PROD-4925559',
    event: 'Flood Warning',
    severity: 'moderate',
    urgency: 'expected',
    certainty: 'likely',
    headline: 'Flood Warning in effect for Rio Grande River',
    description: 'The Rio Grande River at Albuquerque is forecast to rise above flood stage this evening.',
    instruction: 'Turn around, don\'t drown when encountering flooded roads. Most flood deaths occur in vehicles.',
    areas: ['Bernalillo County', 'Valencia County'],
    effective: '2024-01-15T18:00:00Z',
    expires: '2024-01-17T06:00:00Z',
    sender: 'w-nws.webmaster@noaa.gov',
    senderName: 'NWS Albuquerque NM'
  },
  {
    id: 'NWS-IDP-PROD-4925560',
    event: 'Excessive Heat Warning',
    severity: 'extreme',
    urgency: 'immediate',
    certainty: 'observed',
    headline: 'Excessive Heat Warning for Phoenix Metro Area',
    description: 'Dangerously hot conditions with afternoon highs 115 to 120 degrees.',
    instruction: 'Drink plenty of fluids, stay in an air-conditioned room, stay out of the sun, and check up on relatives and neighbors.',
    areas: ['Maricopa County', 'Pinal County'],
    effective: '2024-01-15T10:00:00Z',
    expires: '2024-01-16T20:00:00Z',
    sender: 'w-nws.webmaster@noaa.gov',
    senderName: 'NWS Phoenix AZ'
  }
];

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case 'extreme':
      return AlertTriangle;
    case 'severe':
      return Zap;
    case 'moderate':
      return Cloud;
    default:
      return Activity;
  }
};

const getSeverityBgColor = (severity: string) => {
  switch (severity) {
    case 'extreme':
      return 'bg-red-600';
    case 'severe':
      return 'bg-orange-600';
    case 'moderate':
      return 'bg-yellow-600';
    default:
      return 'bg-blue-600';
  }
};

export default function WeatherPage() {
  const [alerts, setAlerts] = useState<WeatherAlert[]>(mockWeatherAlerts);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  const { importWeatherAlerts } = useRealTimeData();

  const refreshData = async () => {
    setIsLoading(true);
    try {
      await importWeatherAlerts();
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to refresh weather data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportData = () => {
    const csvData = alerts.map(alert => ({
      ID: alert.id,
      Event: alert.event,
      Severity: alert.severity,
      Urgency: alert.urgency,
      Headline: alert.headline,
      Areas: alert.areas.join('; '),
      Effective: alert.effective,
      Expires: alert.expires,
      Sender: alert.senderName
    }));
    
    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'weather-alerts.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background gradients */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent pointer-events-none"></div>
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent pointer-events-none"></div>
      
      <Header user={mockUser} />
      
      <div className="md:ml-52 px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <img 
                src="https://img.logo.dev/noaa.gov?token=pk_VAZ6tvAVQHCDwKeaNRVyjQ"
                alt="NOAA"
                className="h-8 w-8"
                onError={(e) => {
                  e.currentTarget.src = 'https://upload.wikimedia.org/wikipedia/commons/7/79/NOAA_logo.svg';
                }}
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">NOAA Weather Alerts</h1>
              <p className="text-muted-foreground">Real-time weather warnings and alerts from the National Weather Service</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={refreshData}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground glass border border-white/10 rounded-lg hover:bg-white/[0.05] disabled:opacity-50 transition-all"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Import Latest
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
                <p className="text-sm text-muted-foreground">Total Alerts</p>
                <p className="text-3xl font-bold text-foreground">{alerts.length}</p>
              </div>
              <Cloud className="h-8 w-8 text-blue-400" />
            </div>
          </div>
          
          <div className="glass-card rounded-2xl p-6 border border-white/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Extreme Alerts</p>
                <p className="text-3xl font-bold text-red-400">
                  {alerts.filter(a => a.severity === 'extreme').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>
          </div>
          
          <div className="glass-card rounded-2xl p-6 border border-white/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Warnings</p>
                <p className="text-3xl font-bold text-orange-400">
                  {alerts.filter(a => a.urgency === 'immediate').length}
                </p>
              </div>
              <Zap className="h-8 w-8 text-orange-400" />
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

        {/* Weather Alerts List */}
        <div className="glass rounded-2xl border border-white/5 overflow-hidden">
          <div className="p-6 border-b border-white/5">
            <h2 className="text-xl font-bold text-foreground">Active Weather Alerts</h2>
            <p className="text-muted-foreground text-sm mt-1">
              Current weather warnings, watches, and advisories from the National Weather Service
            </p>
          </div>
          
          <div className="divide-y divide-white/5">
            {alerts.map((alert) => {
              const SeverityIcon = getSeverityIcon(alert.severity);
              
              return (
                <div key={alert.id} className="p-6 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${getSeverityBgColor(alert.severity)}`}>
                      <SeverityIcon className="h-6 w-6 text-white" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">{alert.event}</h3>
                          <p className="text-primary font-medium">{alert.headline}</p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${getSeverityBgColor(alert.severity)}`}>
                            {alert.severity.toUpperCase()}
                          </span>
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-foreground">
                            {alert.urgency}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                        {alert.description}
                      </p>
                      
                      {alert.instruction && (
                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mb-3">
                          <p className="text-yellow-200 text-sm font-medium">
                            <AlertTriangle className="inline h-4 w-4 mr-1" />
                            {alert.instruction}
                          </p>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{alert.areas.join(', ')}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>Expires {formatRelativeTime(alert.expires)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Activity className="h-3 w-3" />
                          <span>{alert.senderName}</span>
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
              src="https://img.logo.dev/noaa.gov?token=pk_VAZ6tvAVQHCDwKeaNRVyjQ"
              alt="NOAA"
              className="h-8 w-8"
              onError={(e) => {
                e.currentTarget.src = 'https://upload.wikimedia.org/wikipedia/commons/7/79/NOAA_logo.svg';
              }}
            />
            <h3 className="text-lg font-semibold text-foreground">NOAA Integration</h3>
          </div>
          <p className="text-muted-foreground text-sm">
            CDRP integrates directly with the National Weather Service's Alert API to provide real-time weather warnings, 
            watches, and advisories. This integration helps emergency responders anticipate weather-related incidents and 
            prepare resources accordingly. Data is automatically updated every 5 minutes to ensure the most current information.
          </p>
        </div>
      </div>
    </div>
  );
}