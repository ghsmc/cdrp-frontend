import { ActivityLog } from '@/types';
import { formatRelativeTime } from '@/lib/utils';
import { FileText, User, CheckCircle, AlertCircle } from 'lucide-react';

interface RecentActivityProps {
  activities: ActivityLog[];
}

const getActivityIcon = (action: string) => {
  if (action.includes('created')) return FileText;
  if (action.includes('assigned')) return User;
  if (action.includes('completed')) return CheckCircle;
  if (action.includes('critical')) return AlertCircle;
  return FileText;
};

const getActivityColor = (action: string) => {
  if (action.includes('critical')) return 'text-red-600';
  if (action.includes('completed')) return 'text-green-600';
  if (action.includes('assigned')) return 'text-blue-600';
  return 'text-gray-600';
};

export function RecentActivity({ activities }: RecentActivityProps) {
  if (!activities || activities.length === 0) {
    return (
      <p className="text-gray-500 text-center py-4">No recent activity</p>
    );
  }

  return (
    <div className="space-y-4">
      {activities.slice(0, 10).map((activity) => {
        const Icon = getActivityIcon(activity.action);
        const color = getActivityColor(activity.action);
        
        return (
          <div key={activity.id} className="flex items-start gap-3">
            <div className={`mt-0.5 ${color}`}>
              <Icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">
                <span className="font-medium">{activity.user?.name || 'System'}</span>
                {' '}{activity.action}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {formatRelativeTime(activity.timestamp)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}