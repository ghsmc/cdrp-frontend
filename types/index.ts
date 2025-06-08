export type UserRole = 'admin' | 'regional_coordinator' | 'field_agent' | 'viewer';

export type RequestStatus = 'pending' | 'approved' | 'in_progress' | 'completed' | 'cancelled';

export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  region_id?: string;
  created_at: string;
}

export interface Region {
  id: string;
  name: string;
  description?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface DisasterType {
  id: string;
  name: string;
  description?: string;
  icon?: string;
}

export interface EmergencyRequest {
  id: string;
  title: string;
  description: string;
  status: RequestStatus;
  severity: SeverityLevel;
  disaster_type_id: string;
  disaster_type?: DisasterType;
  region_id: string;
  region?: Region;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  requester_id: string;
  requester?: User;
  assigned_to_id?: string;
  assigned_to?: User;
  medical_supplies_needed?: string[];
  estimated_affected_people?: number;
  created_at: string;
  updated_at: string;
  approved_at?: string;
  completed_at?: string;
}

export interface DashboardStats {
  total_requests: number;
  pending_requests: number;
  in_progress_requests: number;
  completed_requests: number;
  critical_requests: number;
  requests_by_region: Record<string, number>;
  requests_by_severity: Record<SeverityLevel, number>;
  recent_activity: ActivityLog[];
}

export interface ActivityLog {
  id: string;
  action: string;
  user_id: string;
  user?: User;
  request_id?: string;
  request?: EmergencyRequest;
  timestamp: string;
  details?: Record<string, any>;
}