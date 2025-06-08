'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock, 
  MapPin, 
  AlertTriangle,
  CheckCircle,
  Calendar,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';
import { formatDate, formatRelativeTime } from '@/lib/utils';

const mockUser = {
  id: '1',
  email: 'admin@cdrp.com',
  name: 'Admin User',
  role: 'admin' as const,
  region_id: null,
  created_at: '2024-01-01',
};

// Mock analytics data
const mockAnalytics = {
  overview: {
    totalRequests: 1247,
    activeRequests: 89,
    avgResponseTime: 2.4, // hours
    completionRate: 87, // percentage
    criticalRequests: 12,
    affectedPeople: 5420
  },
  requestsByStatus: [
    { status: 'Pending', count: 23, percentage: 26 },
    { status: 'Approved', count: 18, percentage: 20 },
    { status: 'In Progress', count: 35, percentage: 39 },
    { status: 'Completed', count: 13, percentage: 15 }
  ],
  requestsBySeverity: [
    { severity: 'Critical', count: 12, percentage: 13 },
    { severity: 'High', count: 28, percentage: 31 },
    { severity: 'Medium', count: 34, percentage: 38 },
    { severity: 'Low', count: 15, percentage: 17 }
  ],
  requestsByRegion: [
    { region: 'Northeast', count: 34, percentage: 38 },
    { region: 'Southeast', count: 25, percentage: 28 },
    { region: 'Central', count: 18, percentage: 20 },
    { region: 'West Coast', count: 12, percentage: 13 }
  ],
  trendsData: [
    { date: '2024-01-01', requests: 15, completed: 12 },
    { date: '2024-01-02', requests: 22, completed: 18 },
    { date: '2024-01-03', requests: 18, completed: 15 },
    { date: '2024-01-04', requests: 25, completed: 20 },
    { date: '2024-01-05', requests: 19, completed: 17 },
    { date: '2024-01-06', requests: 28, completed: 24 },
    { date: '2024-01-07', requests: 31, completed: 26 }
  ],
  topPerformers: [
    { name: 'Maria Rodriguez', requests: 45, completionRate: 92 },
    { name: 'Carlos Santos', requests: 38, completionRate: 89 },
    { name: 'Jennifer Chen', requests: 42, completionRate: 88 },
    { name: 'Michael Johnson', requests: 35, completionRate: 91 }
  ],
  recentActivity: [
    {
      id: '1',
      action: 'completed emergency request',
      user: 'Maria Rodriguez',
      timestamp: '2024-01-07T14:30:00Z',
      details: 'Medical Supply Request - Hurricane Relief'
    },
    {
      id: '2',
      action: 'approved request',
      user: 'Carlos Santos',
      timestamp: '2024-01-07T14:15:00Z',
      details: 'Water Purification Equipment'
    },
    {
      id: '3',
      action: 'created critical request',
      user: 'Jennifer Chen',
      timestamp: '2024-01-07T14:00:00Z',
      details: 'Search and Rescue Operations'
    }
  ]
};

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    isPositive: boolean;
  };
  icon: React.ElementType;
  color: string;
}

function MetricCard({ title, value, change, icon: Icon, color }: MetricCardProps) {
  return (
    <div className="glass rounded-xl border border-white/5 p-6 card-hover">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground mt-2">{value}</p>
          {change && (
            <div className="flex items-center mt-2">
              <TrendingUp className={`h-4 w-4 ${change.isPositive ? 'text-green-500' : 'text-red-500 rotate-180'}`} />
              <span className={`text-sm font-medium ml-1 ${change.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {change.value}% from last week
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-8 w-8 text-white" />
        </div>
      </div>
    </div>
  );
}

interface ChartBarProps {
  label: string;
  value: number;
  percentage: number;
  color: string;
}

function ChartBar({ label, value, percentage, color }: ChartBarProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center flex-1">
        <span className="text-sm font-medium text-foreground w-20">{label}</span>
        <div className="flex-1 mx-4">
          <div className="w-full bg-white/10 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${color}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
        <span className="text-sm text-muted-foreground w-12 text-right">{value}</span>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('7d');
  const [isLoading, setIsLoading] = useState(false);

  const refreshData = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const exportReport = () => {
    // Simulate export
    const csvData = [
      ['Metric', 'Value'],
      ['Total Requests', mockAnalytics.overview.totalRequests],
      ['Active Requests', mockAnalytics.overview.activeRequests],
      ['Average Response Time', `${mockAnalytics.overview.avgResponseTime} hours`],
      ['Completion Rate', `${mockAnalytics.overview.completionRate}%`],
      ['Critical Requests', mockAnalytics.overview.criticalRequests],
      ['Affected People', mockAnalytics.overview.affectedPeople]
    ];
    
    const csv = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cdrp-analytics-${new Date().toISOString().split('T')[0]}.csv`;
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
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Analytics Dashboard</h1>
              <p className="text-muted-foreground">Emergency response metrics and insights</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Date Range Selector */}
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="glass border border-white/10 rounded-lg px-3 py-2 text-foreground bg-transparent focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
            
            <button
              onClick={refreshData}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground glass border border-white/10 rounded-lg hover:bg-white/[0.05] disabled:opacity-50 transition-all"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            
            <button
              onClick={exportReport}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/25"
            >
              <Download className="h-4 w-4" />
              Export Report
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <MetricCard
            title="Total Requests"
            value={mockAnalytics.overview.totalRequests.toLocaleString()}
            change={{ value: 12, isPositive: true }}
            icon={AlertTriangle}
            color="bg-blue-600"
          />
          <MetricCard
            title="Active Requests"
            value={mockAnalytics.overview.activeRequests}
            change={{ value: 8, isPositive: false }}
            icon={Clock}
            color="bg-yellow-600"
          />
          <MetricCard
            title="Avg Response Time"
            value={`${mockAnalytics.overview.avgResponseTime}h`}
            change={{ value: 15, isPositive: true }}
            icon={TrendingUp}
            color="bg-green-600"
          />
          <MetricCard
            title="Completion Rate"
            value={`${mockAnalytics.overview.completionRate}%`}
            change={{ value: 5, isPositive: true }}
            icon={CheckCircle}
            color="bg-emerald-600"
          />
          <MetricCard
            title="Critical Requests"
            value={mockAnalytics.overview.criticalRequests}
            change={{ value: 3, isPositive: false }}
            icon={AlertTriangle}
            color="bg-red-600"
          />
          <MetricCard
            title="People Affected"
            value={mockAnalytics.overview.affectedPeople.toLocaleString()}
            change={{ value: 7, isPositive: false }}
            icon={Users}
            color="bg-purple-600"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Requests by Status */}
          <div className="glass rounded-xl border border-white/5 p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Requests by Status</h3>
            <div className="space-y-2">
              {mockAnalytics.requestsByStatus.map((item) => (
                <ChartBar
                  key={item.status}
                  label={item.status}
                  value={item.count}
                  percentage={item.percentage}
                  color={
                    item.status === 'Pending' ? 'bg-yellow-500' :
                    item.status === 'Approved' ? 'bg-blue-500' :
                    item.status === 'In Progress' ? 'bg-orange-500' :
                    'bg-green-500'
                  }
                />
              ))}
            </div>
          </div>

          {/* Requests by Severity */}
          <div className="glass rounded-xl border border-white/5 p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Requests by Severity</h3>
            <div className="space-y-2">
              {mockAnalytics.requestsBySeverity.map((item) => (
                <ChartBar
                  key={item.severity}
                  label={item.severity}
                  value={item.count}
                  percentage={item.percentage}
                  color={
                    item.severity === 'Critical' ? 'bg-red-500' :
                    item.severity === 'High' ? 'bg-orange-500' :
                    item.severity === 'Medium' ? 'bg-yellow-500' :
                    'bg-green-500'
                  }
                />
              ))}
            </div>
          </div>

          {/* Requests by Region */}
          <div className="glass rounded-xl border border-white/5 p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Requests by Region</h3>
            <div className="space-y-2">
              {mockAnalytics.requestsByRegion.map((item) => (
                <ChartBar
                  key={item.region}
                  label={item.region}
                  value={item.count}
                  percentage={item.percentage}
                  color="bg-blue-500"
                />
              ))}
            </div>
          </div>

          {/* Top Performers */}
          <div className="glass rounded-xl border border-white/5 p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Top Performers</h3>
            <div className="space-y-4">
              {mockAnalytics.topPerformers.map((performer, index) => (
                <div key={performer.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-medium text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{performer.name}</div>
                      <div className="text-sm text-muted-foreground">{performer.requests} requests</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-foreground">{performer.completionRate}%</div>
                    <div className="text-sm text-muted-foreground">completion</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trends Chart Placeholder */}
        <div className="glass rounded-xl border border-white/5 p-6 mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">Request Trends (Last 7 Days)</h3>
          <div className="h-64 flex items-center justify-center bg-black/20 rounded-lg border border-white/5">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-foreground">Interactive chart would be rendered here</p>
              <p className="text-sm text-muted-foreground">Integration with Chart.js or D3.js recommended</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass rounded-xl border border-white/5 p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {mockAnalytics.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                </div>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium text-foreground">{activity.user}</span> 
                    <span className="text-muted-foreground"> {activity.action}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">{activity.details}</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">
                    {formatRelativeTime(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}