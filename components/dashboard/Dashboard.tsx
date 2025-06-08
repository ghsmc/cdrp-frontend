'use client';

import { useEffect, useState } from 'react';
import { 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  FileText, 
  MapPin,
  TrendingUp,
  Users,
  Activity
} from 'lucide-react';
import { StatsCard } from './StatsCard';
import { RecentActivity } from './RecentActivity';
import { RequestsByRegion } from './RequestsByRegion';
import { SeverityDistribution } from './SeverityDistribution';
import { apiClient } from '@/lib/api/client';
import { DashboardStats } from '@/types';
import { toast } from 'react-hot-toast';

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getDashboardStats();
      setStats(data);
    } catch (error) {
      toast.error('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Emergency Requests"
          value={stats.total_requests}
          description="All time requests"
          icon={FileText}
          variant="default"
        />
        <StatsCard
          title="Critical Requests"
          value={stats.critical_requests}
          description="Requiring immediate attention"
          icon={AlertCircle}
          variant="danger"
          trend={{
            value: 12,
            isPositive: false,
          }}
        />
        <StatsCard
          title="In Progress"
          value={stats.in_progress_requests}
          description="Currently being handled"
          icon={Clock}
          variant="warning"
        />
        <StatsCard
          title="Completed"
          value={stats.completed_requests}
          description="Successfully resolved"
          icon={CheckCircle}
          variant="success"
          trend={{
            value: 8,
            isPositive: true,
          }}
        />
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Severity Distribution */}
        <div className="lg:col-span-1">
          <SeverityDistribution data={stats.requests_by_severity} />
        </div>

        {/* Requests by Region */}
        <div className="lg:col-span-2">
          <RequestsByRegion data={stats.requests_by_region} />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          <Activity className="h-5 w-5 text-gray-400" />
        </div>
        <RecentActivity activities={stats.recent_activity} />
      </div>

      {/* Quick Actions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          Situational Awareness
        </h3>
        <p className="text-blue-700 mb-4">
          View the heat map to identify areas with the highest concentration of critical requests
          and allocate resources accordingly.
        </p>
        <div className="flex items-center gap-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            View Heat Map
          </button>
          <button className="bg-white text-blue-700 border border-blue-300 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Predictive Analysis
          </button>
        </div>
      </div>
    </div>
  );
}