'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { EmergencyMap } from '@/components/map/EmergencyMap';
import { EmergencyRequest, ActivityLog } from '@/types';
import { 
  ArrowLeft,
  Edit,
  Trash2,
  MapPin,
  Clock,
  Users,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Phone,
  Mail,
  Building,
  Calendar,
  FileText,
  MessageSquare,
  Send,
  Paperclip,
  Download
} from 'lucide-react';
import { getSeverityColor, getStatusColor, formatRelativeTime, formatDate } from '@/lib/utils';
import { toast } from 'react-hot-toast';

const mockUser = {
  id: '1',
  email: 'responder@example.com',
  name: 'Sarah Chen',
  role: 'field_agent' as const,
  region_id: '1',
  created_at: '2024-01-01',
};

const mockRequest: EmergencyRequest = {
  id: '1',
  title: 'Medical Supply Request - Hurricane Relief',
  description: 'Urgent need for insulin and diabetes supplies in affected area. Approximately 50 patients requiring immediate medical attention. The local clinic has been overwhelmed and their regular supply chain has been disrupted due to hurricane damage. We need emergency medical supplies including insulin, diabetes medication, blood pressure medication, and basic medical equipment.',
  status: 'approved',
  severity: 'critical',
  disaster_type_id: '1',
  disaster_type: {
    id: '1',
    name: 'Hurricane',
    description: 'Tropical cyclone causing widespread damage'
  },
  region_id: '1',
  region: {
    id: '1',
    name: 'Puerto Rico Zone 3',
    description: 'San Juan metropolitan area'
  },
  location: {
    lat: 18.2208,
    lng: -66.5901,
    address: 'San Juan, Puerto Rico'
  },
  requester_id: '1',
  requester: {
    id: '1',
    email: 'maria.rodriguez@puertorico-emergency.gov',
    name: 'Maria Rodriguez',
    role: 'field_agent',
    region_id: '1',
    created_at: '2024-01-01'
  },
  assigned_to_id: '2',
  assigned_to: {
    id: '2',
    email: 'carlos.santos@fema.gov',
    name: 'Carlos Santos',
    role: 'regional_coordinator',
    region_id: '1',
    created_at: '2024-01-01'
  },
  created_at: '2024-01-01T10:00:00Z',
  updated_at: '2024-01-01T12:00:00Z',
  approved_at: '2024-01-01T11:00:00Z',
  estimated_affected_people: 50,
  medical_supplies_needed: ['insulin', 'diabetes medication', 'blood pressure medication', 'medical equipment', 'bandages', 'antiseptic']
};

const mockActivityLog: ActivityLog[] = [
  {
    id: '1',
    action: 'created emergency request',
    user_id: '1',
    user: mockRequest.requester,
    request_id: '1',
    timestamp: '2024-01-01T10:00:00Z',
    details: { severity: 'critical', location: 'San Juan, Puerto Rico' }
  },
  {
    id: '2',
    action: 'approved request',
    user_id: '2',
    user: mockRequest.assigned_to,
    request_id: '1',
    timestamp: '2024-01-01T11:00:00Z',
    details: { previous_status: 'pending', new_status: 'approved' }
  },
  {
    id: '3',
    action: 'updated estimated affected people',
    user_id: '1',
    user: mockRequest.requester,
    request_id: '1',
    timestamp: '2024-01-01T11:30:00Z',
    details: { previous_count: 30, new_count: 50 }
  },
  {
    id: '4',
    action: 'added medical supplies to requirements',
    user_id: '2',
    user: mockRequest.assigned_to,
    request_id: '1',
    timestamp: '2024-01-01T12:00:00Z',
    details: { added_supplies: ['bandages', 'antiseptic'] }
  }
];

export default function RequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const requestId = params.id as string;
  
  const [request, setRequest] = useState<EmergencyRequest | null>(null);
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [activeTab, setActiveTab] = useState<'details' | 'activity' | 'map'>('details');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      if (requestId === '1') {
        setRequest(mockRequest);
        setActivityLog(mockActivityLog);
      }
      setLoading(false);
    }, 1000);
  }, [requestId]);

  const handleStatusChange = async (newStatus: string) => {
    if (!request) return;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setRequest(prev => prev ? { ...prev, status: newStatus as any } : null);
      toast.success(`Status updated to ${newStatus.replace('_', ' ')}`);
      
      // Add to activity log
      const newActivity: ActivityLog = {
        id: Date.now().toString(),
        action: `changed status to ${newStatus}`,
        user_id: mockUser.id,
        user: mockUser,
        request_id: requestId,
        timestamp: new Date().toISOString(),
        details: { previous_status: request.status, new_status: newStatus }
      };
      setActivityLog(prev => [newActivity, ...prev]);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !request) return;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newActivity: ActivityLog = {
        id: Date.now().toString(),
        action: 'added comment',
        user_id: mockUser.id,
        user: mockUser,
        request_id: requestId,
        timestamp: new Date().toISOString(),
        details: { comment: newComment }
      };
      
      setActivityLog(prev => [newActivity, ...prev]);
      setNewComment('');
      toast.success('Comment added');
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this emergency request? This action cannot be undone.')) {
      return;
    }
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success('Request deleted successfully');
      router.push('/requests');
    } catch (error) {
      toast.error('Failed to delete request');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header user={mockUser} />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header user={mockUser} />
        <div className="text-center py-12">
          <XCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Request Not Found</h3>
          <p className="text-gray-600 mb-4">The emergency request you're looking for doesn't exist.</p>
          <Link
            href="/requests"
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Requests
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={mockUser} />
      
      <div className="mx-auto px-8 max-w-[1280px] py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link
              href="/requests"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Requests
            </Link>
            <div className="h-6 border-l border-gray-300" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{request.title}</h1>
              <div className="flex items-center gap-4 mt-1">
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  {request.location.address}
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  Created {formatRelativeTime(request.created_at)}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Link
              href={`/requests/${requestId}/edit`}
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Edit className="h-4 w-4" />
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        </div>

        {/* Status and Priority */}
        <div className="flex items-center gap-4 mb-6">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(request.severity)}`}>
            {request.severity.toUpperCase()}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
            {request.status.replace('_', ' ').toUpperCase()}
          </span>
          {request.estimated_affected_people && (
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Users className="h-4 w-4" />
              {request.estimated_affected_people} people affected
            </div>
          )}
        </div>

        {/* Quick Actions */}
        {request.status !== 'completed' && request.status !== 'cancelled' && (
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <h3 className="font-medium text-gray-900 mb-3">Quick Actions</h3>
            <div className="flex flex-wrap gap-2">
              {request.status === 'pending' && (
                <button
                  onClick={() => handleStatusChange('approved')}
                  className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                >
                  <CheckCircle className="h-4 w-4" />
                  Approve Request
                </button>
              )}
              {request.status === 'approved' && (
                <button
                  onClick={() => handleStatusChange('in_progress')}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  <Clock className="h-4 w-4" />
                  Start Response
                </button>
              )}
              {request.status === 'in_progress' && (
                <button
                  onClick={() => handleStatusChange('completed')}
                  className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                >
                  <CheckCircle className="h-4 w-4" />
                  Mark Complete
                </button>
              )}
              <button
                onClick={() => handleStatusChange('cancelled')}
                className="flex items-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
              >
                <XCircle className="h-4 w-4" />
                Cancel Request
              </button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            {[
              { id: 'details', label: 'Details', icon: FileText },
              { id: 'activity', label: 'Activity', icon: Clock },
              { id: 'map', label: 'Location', icon: MapPin }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'details' && (
              <div className="space-y-6">
                {/* Description */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="font-medium text-gray-900 mb-3">Description</h3>
                  <p className="text-gray-600 whitespace-pre-wrap">{request.description}</p>
                </div>

                {/* Medical Supplies */}
                {request.medical_supplies_needed && request.medical_supplies_needed.length > 0 && (
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="font-medium text-gray-900 mb-3">Required Medical Supplies</h3>
                    <div className="flex flex-wrap gap-2">
                      {request.medical_supplies_needed.map((supply) => (
                        <span
                          key={supply}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {supply}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Timeline */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="font-medium text-gray-900 mb-3">Timeline</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <span className="text-gray-600">Created:</span>
                      <span className="font-medium">{formatDate(request.created_at)}</span>
                    </div>
                    {request.approved_at && (
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-gray-600">Approved:</span>
                        <span className="font-medium">{formatDate(request.approved_at)}</span>
                      </div>
                    )}
                    {request.completed_at && (
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-600">Completed:</span>
                        <span className="font-medium">{formatDate(request.completed_at)}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-gray-600">Last Updated:</span>
                      <span className="font-medium">{formatDate(request.updated_at)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="space-y-6">
                {/* Add Comment */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="font-medium text-gray-900 mb-3">Add Comment</h3>
                  <div className="space-y-3">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={3}
                      placeholder="Add a comment or update about this request..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                    <div className="flex items-center justify-between">
                      <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                        <Paperclip className="h-4 w-4" />
                        Attach Files
                      </button>
                      <button
                        onClick={handleAddComment}
                        disabled={!newComment.trim()}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="h-4 w-4" />
                        Post Comment
                      </button>
                    </div>
                  </div>
                </div>

                {/* Activity Log */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="font-medium text-gray-900 mb-4">Activity Log</h3>
                  <div className="space-y-4">
                    {activityLog.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-b-0">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">
                          {activity.user?.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="font-medium">{activity.user?.name}</span>{' '}
                            {activity.action}
                            {activity.details?.comment && (
                              <span className="block mt-1 text-gray-600 italic">
                                "{activity.details.comment}"
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatRelativeTime(activity.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'map' && (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <EmergencyMap
                  requests={[request]}
                  selectedRequestId={request.id}
                  className="h-[500px]"
                />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-medium text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-sm font-medium text-gray-700">Requested By</div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium text-gray-600">
                      {request.requester?.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm text-gray-900">{request.requester?.name}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    <a href={`mailto:${request.requester?.email}`} className="hover:underline">
                      {request.requester?.email}
                    </a>
                  </div>
                </div>

                {request.assigned_to && (
                  <div>
                    <div className="text-sm font-medium text-gray-700">Assigned To</div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium text-gray-600">
                        {request.assigned_to.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm text-gray-900">{request.assigned_to.name}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-sm text-gray-600">
                      <Mail className="h-4 w-4" />
                      <a href={`mailto:${request.assigned_to.email}`} className="hover:underline">
                        {request.assigned_to.email}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Request Details */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-medium text-gray-900 mb-4">Request Details</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-sm font-medium text-gray-700">Disaster Type</div>
                  <div className="text-sm text-gray-900">{request.disaster_type?.name}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700">Region</div>
                  <div className="text-sm text-gray-900">{request.region?.name}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700">Request ID</div>
                  <div className="text-sm text-gray-900 font-mono">{request.id}</div>
                </div>
              </div>
            </div>

            {/* Export Options */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-medium text-gray-900 mb-4">Export & Share</h3>
              <div className="space-y-2">
                <button className="w-full flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                  <Download className="h-4 w-4" />
                  Export as PDF
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                  <FileText className="h-4 w-4" />
                  Export as CSV
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                  <MessageSquare className="h-4 w-4" />
                  Share Link
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}