interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export default function MetricCard({ title, value, subtitle, icon, trend }: MetricCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        {icon && <span className="text-2xl">{icon}</span>}
      </div>
      
      <div className="space-y-2">
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        
        {subtitle && (
          <p className="text-sm text-gray-500">{subtitle}</p>
        )}
        
        {trend && (
          <div className="flex items-center space-x-1">
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                trend.isPositive
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {trend.isPositive ? '↗' : '↘'}
              {Math.abs(trend.value)}%
            </span>
            <span className="text-xs text-gray-500">vs last month</span>
          </div>
        )}
      </div>
    </div>
  );
}