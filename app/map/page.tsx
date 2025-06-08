'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { EmergencyMap } from '@/components/map/EmergencyMap';
import { EmergencyRequest } from '@/types';
import { MapPin, Filter, Download, RefreshCw } from 'lucide-react';
import { getSeverityColor, getStatusColor, formatRelativeTime } from '@/lib/utils';

const mockUser = {
  id: '1',
  email: 'responder@example.com',
  name: 'Sarah Chen',
  role: 'field_agent' as const,
  region_id: '1',
  created_at: '2024-01-01',
};

const mockRequests: EmergencyRequest[] = [
  {
    id: '1',
    title: 'Medical Supply Request - Hurricane Relief',
    description: 'Urgent need for insulin and diabetes supplies in affected area. Approximately 50 patients requiring immediate medical attention.',
    status: 'approved',
    severity: 'critical',
    disaster_type_id: '1',
    region_id: '1',
    location: {
      lat: 18.2208,
      lng: -66.5901,
      address: 'San Juan, Puerto Rico'
    },
    requester_id: '1',
    created_at: '2024-01-01T10:00:00Z',
    updated_at: '2024-01-01T12:00:00Z',
    estimated_affected_people: 50,
    medical_supplies_needed: ['insulin', 'diabetes medication', 'medical equipment']
  },
  {
    id: '2',
    title: 'Water Purification Equipment',
    description: 'Community water source contaminated, 200+ families affected. Need portable water purification systems urgently.',
    status: 'in_progress',
    severity: 'high',
    disaster_type_id: '2',
    region_id: '2',
    location: {
      lat: 29.9511,
      lng: -90.0715,
      address: 'New Orleans, Louisiana'
    },
    requester_id: '2',
    created_at: '2024-01-01T08:00:00Z',
    updated_at: '2024-01-01T11:00:00Z',
    estimated_affected_people: 200
  },
  {
    id: '3',
    title: 'Emergency Shelter Coordination',
    description: 'Temporary housing needed for displaced families after flooding. Need coordination for 100+ people.',
    status: 'pending',
    severity: 'medium',
    disaster_type_id: '3',
    region_id: '3',
    location: {
      lat: 25.7617,
      lng: -80.1918,
      address: 'Miami, Florida'
    },
    requester_id: '3',
    created_at: '2024-01-01T09:00:00Z',
    updated_at: '2024-01-01T09:30:00Z',
    estimated_affected_people: 100
  },
  {
    id: '4',
    title: 'Food Distribution Center',
    description: 'Setting up emergency food distribution point for affected communities. Distribution ongoing.',
    status: 'completed',
    severity: 'medium',
    disaster_type_id: '4',
    region_id: '4',
    location: {
      lat: 32.7767,
      lng: -96.7970,
      address: 'Dallas, Texas'
    },
    requester_id: '4',
    created_at: '2024-01-01T06:00:00Z',
    updated_at: '2024-01-01T10:00:00Z',
    completed_at: '2024-01-01T10:00:00Z',
    estimated_affected_people: 300
  },
  {
    id: '5',
    title: 'Search and Rescue Operations',
    description: 'Active search and rescue operations in wildfire affected areas. Multiple teams deployed.',
    status: 'in_progress',
    severity: 'critical',
    disaster_type_id: '5',
    region_id: '5',
    location: {
      lat: 34.0522,
      lng: -118.2437,
      address: 'Los Angeles, California'
    },
    requester_id: '5',
    created_at: '2024-01-01T07:00:00Z',
    updated_at: '2024-01-01T11:30:00Z',
    estimated_affected_people: 75
  }
];

export default function MapPage() {
  const [requests, setRequests] = useState<EmergencyRequest[]>(mockRequests);
  const [selectedRequest, setSelectedRequest] = useState<EmergencyRequest | null>(null);
  const [filters, setFilters] = useState({
    severity: [] as string[],
    status: [] as string[],
    region: [] as string[]
  });
  const [isLoading, setIsLoading] = useState(false);

  const filteredRequests = requests.filter(request => {
    if (filters.severity.length > 0 && !filters.severity.includes(request.severity)) {
      return false;
    }
    if (filters.status.length > 0 && !filters.status.includes(request.status)) {
      return false;
    }
    if (filters.region.length > 0 && !filters.region.includes(request.region_id)) {
      return false;
    }
    return true;
  });

  const refreshData = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const exportData = () => {
    const csvData = filteredRequests.map(req => ({
      ID: req.id,
      Title: req.title,
      Status: req.status,
      Severity: req.severity,
      Location: req.location.address,
      'Affected People': req.estimated_affected_people,
      'Created At': req.created_at,
      'Updated At': req.updated_at
    }));
    
    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'emergency-requests.csv';
    a.click();
    URL.revokeObjectURL(url);
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
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Emergency Response Map</h1>
              <p className="text-muted-foreground">Real-time visualization of emergency requests and response efforts</p>
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

        {/* Stats Bar */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="glass-card rounded-2xl p-8 border border-white/5 card-hover hover-glow">
            <div className="text-sm text-muted-foreground">Total Requests</div>
            <div className="text-3xl font-bold text-foreground">{filteredRequests.length}</div>
          </div>
          <div className="glass-card rounded-2xl p-8 border border-white/5 card-hover hover-glow">
            <div className="text-sm text-muted-foreground">Critical</div>
            <div className="text-4xl font-bold text-primary">
              {filteredRequests.filter(r => r.severity === 'critical').length}
            </div>
          </div>
          <div className="glass-card rounded-2xl p-8 border border-white/5 card-hover hover-glow">
            <div className="text-sm text-muted-foreground">In Progress</div>
            <div className="text-4xl font-bold text-blue-400">
              {filteredRequests.filter(r => r.status === 'in_progress').length}
            </div>
          </div>
          <div className="glass-card rounded-2xl p-8 border border-white/5 card-hover hover-glow">
            <div className="text-sm text-muted-foreground">People Affected</div>
            <div className="text-3xl font-bold text-foreground">
              {filteredRequests.reduce((sum, r) => sum + (r.estimated_affected_people || 0), 0)}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map */}
          <div className="lg:col-span-2">
            <div className="glass-ultra rounded-2xl border border-white/5 overflow-hidden card-hover">
              <EmergencyMap
                requests={filteredRequests}
                selectedRequestId={selectedRequest?.id}
                onRequestSelect={setSelectedRequest}
                className="h-[600px]"
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Filters */}
            <div className="glass rounded-xl border border-white/5 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="h-5 w-5 text-primary" />
                <h3 className="font-medium text-foreground">Filters</h3>
              </div>
              
              {/* Quick severity filters */}
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Severity</div>
                <div className="flex flex-wrap gap-2">
                  {['critical', 'high', 'medium', 'low'].map(severity => (
                    <button
                      key={severity}
                      onClick={() => {
                        setFilters(prev => ({
                          ...prev,
                          severity: prev.severity.includes(severity)
                            ? prev.severity.filter(s => s !== severity)
                            : [...prev.severity, severity]
                        }));
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        filters.severity.includes(severity)
                          ? getSeverityColor(severity)
                          : 'bg-white/10 text-muted-foreground hover:bg-white/20'
                      }`}
                    >
                      {severity}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status filters */}
              <div className="space-y-2 mt-4">
                <div className="text-sm font-medium text-muted-foreground">Status</div>
                <div className="flex flex-wrap gap-2">
                  {['pending', 'approved', 'in_progress', 'completed'].map(status => (
                    <button
                      key={status}
                      onClick={() => {
                        setFilters(prev => ({
                          ...prev,
                          status: prev.status.includes(status)
                            ? prev.status.filter(s => s !== status)
                            : [...prev.status, status]
                        }));
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        filters.status.includes(status)
                          ? getStatusColor(status)
                          : 'bg-white/10 text-muted-foreground hover:bg-white/20'
                      }`}
                    >
                      {status.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Selected Request Details */}
            {selectedRequest && (
              <div className="glass rounded-xl border border-white/5 p-6">
                <h3 className="font-medium text-foreground mb-4">Request Details</h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-foreground">{selectedRequest.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">{selectedRequest.location.address}</div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(selectedRequest.severity)}`}>
                      {selectedRequest.severity}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedRequest.status)}`}>
                      {selectedRequest.status.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">{selectedRequest.description}</p>
                  
                  {selectedRequest.estimated_affected_people && (
                    <div className="text-sm">
                      <span className="font-medium text-foreground">Affected People:</span> 
                      <span className="text-muted-foreground ml-1">{selectedRequest.estimated_affected_people}</span>
                    </div>
                  )}
                  
                  <div className="text-xs text-muted-foreground">
                    Updated {formatRelativeTime(selectedRequest.updated_at)}
                  </div>
                  
                  <button
                    onClick={() => window.open(`/requests/${selectedRequest.id}`, '_blank')}
                    className="w-full mt-3 px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/25"
                  >
                    View Full Details
                  </button>
                </div>
              </div>
            )}

            {/* Request List */}
            <div className="glass rounded-xl border border-white/5 p-6">
              <h3 className="font-medium text-foreground mb-4">Active Requests</h3>
              
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {filteredRequests.map(request => (
                  <div
                    key={request.id}
                    onClick={() => setSelectedRequest(request)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all hover:-translate-y-0.5 ${
                      selectedRequest?.id === request.id
                        ? 'border-primary/30 bg-primary/10 shadow-lg shadow-primary/25'
                        : 'border-white/10 hover:border-white/20 hover:bg-white/[0.02]'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div className="font-medium text-sm text-foreground line-clamp-1">
                        {request.title}
                      </div>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${getSeverityColor(request.severity)}`}>
                        {request.severity}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">{request.location.address}</div>
                    <div className="text-xs text-muted-foreground/60 mt-1">
                      {formatRelativeTime(request.updated_at)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}