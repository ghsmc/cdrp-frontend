'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { EmergencyRequest } from '@/types';
import { 
  FileText, 
  Plus, 
  Filter, 
  Search, 
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  MapPin,
  Clock,
  Users,
  AlertTriangle
} from 'lucide-react';
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

interface RequestCardProps {
  request: EmergencyRequest;
  onEdit?: (request: EmergencyRequest) => void;
  onDelete?: (request: EmergencyRequest) => void;
  onView?: (request: EmergencyRequest) => void;
}

function RequestCard({ request, onEdit, onDelete, onView }: RequestCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="glass-card rounded-2xl border border-white/5 p-6 card-hover hover-glow transition-all duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <Link href={`/requests/${request.id}`} className="hover:text-primary transition-colors">
            <h3 className="font-semibold text-foreground text-lg hover-lift">{request.title}</h3>
          </Link>
          <div className="flex items-center gap-2 mt-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{request.location.address}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(request.severity)}`}>
            {request.severity}
          </span>
          
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-white/[0.05] rounded-xl transition-colors"
            >
              <MoreVertical className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 glass-ultra rounded-xl border border-white/10 shadow-2xl z-20">
                <div className="py-2">
                  <button
                    onClick={() => {
                      onView?.(request);
                      setShowMenu(false);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-foreground hover:bg-white/[0.05] transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                    View Details
                  </button>
                  <button
                    onClick={() => {
                      onEdit?.(request);
                      setShowMenu(false);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-foreground hover:bg-white/[0.05] transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                    Edit Request
                  </button>
                  <button
                    onClick={() => {
                      onDelete?.(request);
                      setShowMenu(false);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-primary hover:bg-primary/10 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Request
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <p className="text-muted-foreground text-sm mb-4 line-clamp-2 leading-relaxed">{request.description}</p>

      {/* Status and Info */}
      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <div className="flex items-center gap-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
            {request.status.replace('_', ' ')}
          </span>
          
          {request.estimated_affected_people && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{request.estimated_affected_people} affected</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{formatRelativeTime(request.updated_at)}</span>
        </div>
      </div>
    </div>
  );
}

export default function RequestsPage() {
  const [requests, setRequests] = useState<EmergencyRequest[]>(mockRequests);
  const [filteredRequests, setFilteredRequests] = useState<EmergencyRequest[]>(mockRequests);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    severity: [] as string[],
    status: [] as string[],
    region: [] as string[]
  });
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'severity' | 'status'>('newest');

  // Filter and search logic
  useEffect(() => {
    let filtered = requests;

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(request =>
        request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.location.address?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply filters
    if (filters.severity.length > 0) {
      filtered = filtered.filter(request => filters.severity.includes(request.severity));
    }
    if (filters.status.length > 0) {
      filtered = filtered.filter(request => filters.status.includes(request.status));
    }
    if (filters.region.length > 0) {
      filtered = filtered.filter(request => filters.region.includes(request.region_id));
    }

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'severity':
          const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
          return severityOrder[b.severity] - severityOrder[a.severity];
        case 'status':
          const statusOrder = { pending: 4, approved: 3, in_progress: 2, completed: 1, cancelled: 0 };
          return statusOrder[b.status] - statusOrder[a.status];
        default:
          return 0;
      }
    });

    setFilteredRequests(filtered);
  }, [requests, searchTerm, filters, sortBy]);

  const toggleFilter = (type: 'severity' | 'status' | 'region', value: string) => {
    setFilters(prev => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter(v => v !== value)
        : [...prev[type], value]
    }));
  };

  const clearFilters = () => {
    setFilters({ severity: [], status: [], region: [] });
    setSearchTerm('');
  };

  const hasActiveFilters = searchTerm || filters.severity.length > 0 || filters.status.length > 0 || filters.region.length > 0;

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
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Emergency Requests</h1>
              <p className="text-muted-foreground">Manage and track emergency response requests</p>
            </div>
          </div>
          
          <Link
            href="/requests/new"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/25 btn-premium"
          >
            <Plus className="h-4 w-4" />
            New Request
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="glass-card rounded-2xl p-6 border border-white/5 card-hover hover-glow">
            <div className="text-sm text-muted-foreground">Total Requests</div>
            <div className="text-3xl font-bold text-foreground">{filteredRequests.length}</div>
          </div>
          <div className="glass-card rounded-2xl p-6 border border-white/5 card-hover hover-glow">
            <div className="text-sm text-muted-foreground">Critical</div>
            <div className="text-3xl font-bold text-primary">
              {filteredRequests.filter(r => r.severity === 'critical').length}
            </div>
          </div>
          <div className="glass-card rounded-2xl p-6 border border-white/5 card-hover hover-glow">
            <div className="text-sm text-muted-foreground">In Progress</div>
            <div className="text-3xl font-bold text-blue-400">
              {filteredRequests.filter(r => r.status === 'in_progress').length}
            </div>
          </div>
          <div className="glass-card rounded-2xl p-6 border border-white/5 card-hover hover-glow">
            <div className="text-sm text-muted-foreground">Completed Today</div>
            <div className="text-3xl font-bold text-green-400">
              {filteredRequests.filter(r => r.status === 'completed').length}
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="glass-ultra rounded-2xl border border-white/5 p-6 mb-8">
          <div className="flex items-center gap-4 mb-6">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
              <input
                type="text"
                placeholder="Search requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="glass border border-white/10 rounded-xl w-full pl-12 pr-4 py-3 text-foreground bg-transparent placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
              />
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="glass border border-white/10 rounded-xl px-4 py-3 text-foreground bg-transparent focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="severity">By Severity</option>
              <option value="status">By Status</option>
            </select>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-4 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Quick Filters */}
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium text-foreground mb-3">Severity</div>
              <div className="flex flex-wrap gap-2">
                {['critical', 'high', 'medium', 'low'].map(severity => (
                  <button
                    key={severity}
                    onClick={() => toggleFilter('severity', severity)}
                    className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 hover-lift ${
                      filters.severity.includes(severity)
                        ? getSeverityColor(severity)
                        : 'glass border border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/[0.05]'
                    }`}
                  >
                    {severity}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="text-sm font-medium text-foreground mb-3">Status</div>
              <div className="flex flex-wrap gap-2">
                {['pending', 'approved', 'in_progress', 'completed'].map(status => (
                  <button
                    key={status}
                    onClick={() => toggleFilter('status', status)}
                    className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 hover-lift ${
                      filters.status.includes(status)
                        ? getStatusColor(status)
                        : 'glass border border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/[0.05]'
                    }`}
                  >
                    {status.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        {filteredRequests.length === 0 ? (
          <div className="text-center py-16">
            <div className="glass-card rounded-2xl border border-white/5 p-12 max-w-md mx-auto">
              <AlertTriangle className="mx-auto h-16 w-16 text-muted-foreground mb-6" />
              <h3 className="text-xl font-medium text-foreground mb-3">No requests found</h3>
              <p className="text-muted-foreground mb-6">
                {hasActiveFilters 
                  ? 'Try adjusting your search criteria or filters.'
                  : 'No emergency requests have been submitted yet.'
                }
              </p>
              {!hasActiveFilters && (
                <Link
                  href="/requests/new"
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-primary-foreground bg-primary rounded-xl hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/25 btn-premium"
                >
                  <Plus className="h-5 w-5" />
                  Create First Request
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredRequests.map(request => (
              <RequestCard
                key={request.id}
                request={request}
                onView={(req) => window.open(`/requests/${req.id}`, '_blank')}
                onEdit={(req) => window.open(`/requests/${req.id}/edit`, '_blank')}
                onDelete={(req) => {
                  if (confirm('Are you sure you want to delete this request?')) {
                    setRequests(prev => prev.filter(r => r.id !== req.id));
                  }
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}