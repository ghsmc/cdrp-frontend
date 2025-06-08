'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useRealTimeData } from '@/lib/hooks/useRealTimeData';
import { 
  ExternalLink, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Database,
  Satellite,
  Activity,
  Cloud,
  Heart,
  Shield,
  MapPin,
  TrendingUp,
  Globe,
  Zap
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

const dataProviders = [
  {
    id: 'nasa',
    name: 'NASA',
    fullName: 'National Aeronautics and Space Administration',
    logo: 'https://img.logo.dev/nasa.gov?token=pk_VAZ6tvAVQHCDwKeaNRVyjQ',
    fallbackLogo: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/NASA_logo.svg',
    website: 'https://nasa.gov',
    description: 'NASA provides critical satellite imagery, Earth observation data, and disaster monitoring capabilities to support emergency response efforts worldwide.',
    dataTypes: [
      'Satellite Imagery',
      'Earth Observation Data',
      'Disaster Monitoring',
      'Climate Data',
      'Atmospheric Conditions'
    ],
    apis: [
      {
        name: 'NASA Earth Imagery API',
        endpoint: 'https://api.nasa.gov/planetary/earth/imagery',
        description: 'High-resolution satellite images for disaster assessment'
      },
      {
        name: 'NASA FIRMS API',
        endpoint: 'https://firms.modaps.eosdis.nasa.gov/api/',
        description: 'Fire Information for Resource Management System'
      }
    ],
    updateFrequency: 'Every 15 minutes',
    coverage: 'Global',
    icon: Satellite,
    color: 'bg-blue-500',
    stats: {
      lastUpdate: '2024-01-07T10:30:00Z',
      recordsCount: 15420,
      status: 'active'
    }
  },
  {
    id: 'usgs',
    name: 'USGS',
    fullName: 'United States Geological Survey',
    logo: 'https://img.logo.dev/usgs.gov?token=pk_VAZ6tvAVQHCDwKeaNRVyjQ',
    fallbackLogo: 'https://upload.wikimedia.org/wikipedia/commons/1/1c/USGS_logo_green.svg',
    website: 'https://usgs.gov',
    description: 'USGS provides real-time earthquake data, geological hazards information, and natural disaster monitoring essential for emergency preparedness.',
    dataTypes: [
      'Earthquake Data',
      'Landslide Information',
      'Flood Monitoring',
      'Volcanic Activity',
      'Ground Water Levels'
    ],
    apis: [
      {
        name: 'USGS Earthquake API',
        endpoint: 'https://earthquake.usgs.gov/fdsnws/event/1/',
        description: 'Real-time and historical earthquake data worldwide'
      },
      {
        name: 'USGS Water Services',
        endpoint: 'https://waterservices.usgs.gov/',
        description: 'Real-time water data for flood monitoring'
      }
    ],
    updateFrequency: 'Real-time',
    coverage: 'Global',
    icon: Activity,
    color: 'bg-green-500',
    stats: {
      lastUpdate: '2024-01-07T10:25:00Z',
      recordsCount: 8932,
      status: 'active'
    }
  },
  {
    id: 'noaa',
    name: 'NOAA',
    fullName: 'National Oceanic and Atmospheric Administration',
    logo: 'https://img.logo.dev/noaa.gov?token=pk_VAZ6tvAVQHCDwKeaNRVyjQ',
    fallbackLogo: 'https://upload.wikimedia.org/wikipedia/commons/7/79/NOAA_logo.svg',
    website: 'https://noaa.gov',
    description: 'NOAA delivers critical weather forecasts, severe weather warnings, and climate data to support emergency management and disaster preparedness.',
    dataTypes: [
      'Weather Forecasts',
      'Severe Weather Alerts',
      'Hurricane Tracking',
      'Storm Surge Data',
      'Climate Information'
    ],
    apis: [
      {
        name: 'NOAA Weather API',
        endpoint: 'https://api.weather.gov/',
        description: 'Weather forecasts, alerts, and current conditions'
      },
      {
        name: 'NOAA Storm Events Database',
        endpoint: 'https://www.ncdc.noaa.gov/stormevents/',
        description: 'Historical storm and weather event data'
      }
    ],
    updateFrequency: 'Every 5 minutes',
    coverage: 'United States',
    icon: Cloud,
    color: 'bg-indigo-500',
    stats: {
      lastUpdate: '2024-01-07T10:28:00Z',
      recordsCount: 12567,
      status: 'active'
    }
  },
  {
    id: 'nws',
    name: 'NWS',
    fullName: 'National Weather Service',
    logo: 'https://img.logo.dev/weather.gov?token=pk_VAZ6tvAVQHCDwKeaNRVyjQ',
    fallbackLogo: 'https://upload.wikimedia.org/wikipedia/commons/6/65/US-NationalWeatherService-Logo.svg',
    website: 'https://weather.gov',
    description: 'The National Weather Service provides weather forecasts, warnings, meteorological products for public protection, safety, and general information to support economic prosperity.',
    dataTypes: [
      'Weather Forecasts',
      'Weather Warnings',
      'Radar Data',
      'Storm Reports',
      'Climate Data'
    ],
    apis: [
      {
        name: 'NWS API',
        endpoint: 'https://api.weather.gov/',
        description: 'Weather forecasts, current conditions, and alerts'
      },
      {
        name: 'NWS Radar API',
        endpoint: 'https://radar.weather.gov/',
        description: 'Real-time weather radar imagery'
      }
    ],
    updateFrequency: 'Every 5 minutes',
    coverage: 'United States',
    icon: Cloud,
    color: 'bg-sky-500',
    stats: {
      lastUpdate: '2024-01-07T10:32:00Z',
      recordsCount: 8456,
      status: 'active'
    }
  },
  {
    id: 'cdc',
    name: 'CDC',
    fullName: 'Centers for Disease Control and Prevention',
    logo: 'https://img.logo.dev/cdc.gov?token=pk_VAZ6tvAVQHCDwKeaNRVyjQ',
    fallbackLogo: 'https://upload.wikimedia.org/wikipedia/commons/8/87/US_CDC_logo.svg',
    website: 'https://cdc.gov',
    description: 'CDC provides health surveillance data, disease outbreak information, and public health emergency guidance to support comprehensive emergency response.',
    dataTypes: [
      'Disease Surveillance',
      'Health Alerts',
      'Outbreak Information',
      'Health Emergency Guidelines',
      'Vaccination Data'
    ],
    apis: [
      {
        name: 'CDC Health Alert Network',
        endpoint: 'https://emergency.cdc.gov/han/',
        description: 'Health alerts and emergency communications'
      },
      {
        name: 'CDC WONDER API',
        endpoint: 'https://wonder.cdc.gov/api/',
        description: 'Public health surveillance data'
      }
    ],
    updateFrequency: 'Daily',
    coverage: 'United States',
    icon: Shield,
    color: 'bg-red-500',
    stats: {
      lastUpdate: '2024-01-07T09:00:00Z',
      recordsCount: 5678,
      status: 'active'
    }
  },
  {
    id: 'fema',
    name: 'FEMA',
    fullName: 'Federal Emergency Management Agency',
    logo: 'https://img.logo.dev/fema.gov?token=pk_VAZ6tvAVQHCDwKeaNRVyjQ',
    fallbackLogo: 'https://upload.wikimedia.org/wikipedia/commons/4/49/Seal_of_the_Federal_Emergency_Management_Agency.svg',
    website: 'https://fema.gov',
    description: 'FEMA provides disaster declarations, resource allocation data, and emergency management coordination information for federal disaster response.',
    dataTypes: [
      'Disaster Declarations',
      'Resource Allocation',
      'Emergency Shelter Information',
      'Incident Management Data',
      'Recovery Status Updates'
    ],
    apis: [
      {
        name: 'FEMA Disaster Declarations API',
        endpoint: 'https://www.fema.gov/api/open/',
        description: 'Federal disaster declarations and status updates'
      }
    ],
    updateFrequency: 'Real-time',
    coverage: 'United States',
    icon: AlertTriangle,
    color: 'bg-orange-500',
    stats: {
      lastUpdate: '2024-01-07T10:15:00Z',
      recordsCount: 1234,
      status: 'active'
    }
  }
];

export default function DataSourcesPage() {
  const [selectedProvider, setSelectedProvider] = useState(dataProviders[0]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { externalSources, importAllData, refreshAllData } = useRealTimeData();

  const handleRefreshAll = async () => {
    setIsRefreshing(true);
    await refreshAllData();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header user={mockUser} />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/10 p-4 rounded-lg">
                <Database className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Data Sources & Integrations
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-xl leading-8 text-blue-100">
              CDRP integrates real-time data from leading government agencies and research institutions 
              to provide comprehensive, up-to-date information for emergency response decisions.
            </p>
            
            <div className="mt-8 flex justify-center">
              <button
                onClick={handleRefreshAll}
                disabled={isRefreshing}
                className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh All Data Sources
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Data Sources Grid */}
      <div className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Providers List */}
            <div className="lg:col-span-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Data Providers</h2>
              <div className="space-y-3">
                {dataProviders.map((provider) => {
                  const Icon = provider.icon;
                  const isSelected = selectedProvider.id === provider.id;
                  
                  return (
                    <button
                      key={provider.id}
                      onClick={() => setSelectedProvider(provider)}
                      className={`w-full text-left p-4 rounded-lg border transition-all ${
                        isSelected 
                          ? 'border-blue-500 bg-blue-50 shadow-md' 
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img 
                          src={provider.logo}
                          alt={provider.name}
                          className="h-8 w-8"
                          onError={(e) => {
                            e.currentTarget.src = provider.fallbackLogo;
                          }}
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900">{provider.name}</h3>
                            {getStatusIcon(provider.stats.status)}
                          </div>
                          <p className="text-sm text-gray-600">{provider.fullName}</p>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-xs text-gray-500">
                              {provider.stats.recordsCount.toLocaleString()} records
                            </span>
                            <span className="text-xs text-gray-500">
                              Updated {formatRelativeTime(provider.stats.lastUpdate)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Provider Details */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Header */}
                <div className={`${selectedProvider.color} text-white p-6`}>
                  <div className="flex items-start gap-4">
                    <img 
                      src={selectedProvider.logo}
                      alt={selectedProvider.name}
                      className="h-16 w-16 bg-white/20 rounded-lg p-2"
                      onError={(e) => {
                        e.currentTarget.src = selectedProvider.fallbackLogo;
                      }}
                    />
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold mb-1">{selectedProvider.name}</h2>
                      <p className="text-sm opacity-90 mb-2">{selectedProvider.fullName}</p>
                      <a 
                        href={selectedProvider.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm hover:underline"
                      >
                        Visit Website <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 mb-1">
                        {getStatusIcon(selectedProvider.stats.status)}
                        <span className="text-sm capitalize">{selectedProvider.stats.status}</span>
                      </div>
                      <div className="text-sm opacity-90">
                        {selectedProvider.stats.recordsCount.toLocaleString()} records
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="space-y-6">
                    {/* Description */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Overview</h3>
                      <p className="text-gray-600 leading-relaxed">{selectedProvider.description}</p>
                    </div>

                    {/* Data Types */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Data Types</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedProvider.dataTypes.map((type, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            {type}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* APIs */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">API Endpoints</h3>
                      <div className="space-y-3">
                        {selectedProvider.apis.map((api, index) => (
                          <div key={index} className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-medium text-gray-900">{api.name}</h4>
                              <a 
                                href={api.endpoint}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-700"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{api.description}</p>
                            <code className="text-xs bg-gray-200 px-2 py-1 rounded font-mono text-gray-800">
                              {api.endpoint}
                            </code>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Technical Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4 text-center">
                        <Clock className="h-6 w-6 text-gray-600 mx-auto mb-2" />
                        <div className="text-sm font-medium text-gray-900">Update Frequency</div>
                        <div className="text-sm text-gray-600">{selectedProvider.updateFrequency}</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4 text-center">
                        <Globe className="h-6 w-6 text-gray-600 mx-auto mb-2" />
                        <div className="text-sm font-medium text-gray-900">Coverage</div>
                        <div className="text-sm text-gray-600">{selectedProvider.coverage}</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4 text-center">
                        <TrendingUp className="h-6 w-6 text-gray-600 mx-auto mb-2" />
                        <div className="text-sm font-medium text-gray-900">Last Updated</div>
                        <div className="text-sm text-gray-600">
                          {formatRelativeTime(selectedProvider.stats.lastUpdate)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Integration Stats */}
      <div className="bg-gray-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Real-Time Integration Status
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Live status of all data sources and integration health
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {dataProviders.map((provider) => {
              const Icon = provider.icon;
              return (
                <div key={provider.id} className="bg-white rounded-lg p-6 text-center shadow-sm border border-gray-200">
                  <div className={`inline-flex p-3 rounded-lg ${provider.color} text-white mb-3`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{provider.name}</h3>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    {getStatusIcon(provider.stats.status)}
                    <span className="text-sm text-gray-600 capitalize">{provider.stats.status}</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {provider.stats.recordsCount.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">records</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}