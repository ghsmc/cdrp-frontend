import { getSeverityColor } from '@/lib/utils';
import { SeverityLevel } from '@/types';

interface SeverityDistributionProps {
  data: Record<SeverityLevel, number>;
}

const severityLabels: Record<SeverityLevel, string> = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

const severityColors: Record<SeverityLevel, string> = {
  critical: 'bg-red-500',
  high: 'bg-orange-500',
  medium: 'bg-yellow-500',
  low: 'bg-green-500',
};

export function SeverityDistribution({ data }: SeverityDistributionProps) {
  const total = Object.values(data).reduce((sum, count) => sum + count, 0);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Severity Distribution
      </h3>
      <div className="space-y-4">
        {(Object.keys(severityLabels) as SeverityLevel[]).map((severity) => {
          const count = data[severity] || 0;
          const percentage = total > 0 ? (count / total) * 100 : 0;
          
          return (
            <div key={severity}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${severityColors[severity]}`} />
                  <span className="text-sm font-medium text-gray-700">
                    {severityLabels[severity]}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {count} ({percentage.toFixed(1)}%)
                </span>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Visual representation */}
      <div className="mt-6 h-4 bg-gray-200 rounded-full overflow-hidden flex">
        {(Object.keys(severityLabels) as SeverityLevel[]).map((severity) => {
          const count = data[severity] || 0;
          const percentage = total > 0 ? (count / total) * 100 : 0;
          
          if (percentage === 0) return null;
          
          return (
            <div
              key={severity}
              className={`${severityColors[severity]} transition-all duration-500`}
              style={{ width: `${percentage}%` }}
            />
          );
        })}
      </div>
    </div>
  );
}