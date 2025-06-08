interface RequestsByRegionProps {
  data: Record<string, number>;
}

export function RequestsByRegion({ data }: RequestsByRegionProps) {
  const sortedRegions = Object.entries(data)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8);

  const maxValue = Math.max(...Object.values(data));

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Emergency Requests by Region
      </h3>
      <div className="space-y-3">
        {sortedRegions.map(([region, count]) => {
          const percentage = (count / maxValue) * 100;
          
          return (
            <div key={region}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">
                  {region}
                </span>
                <span className="text-sm text-gray-500">
                  {count} requests
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}