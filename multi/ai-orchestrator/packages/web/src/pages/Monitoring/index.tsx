/**
 * Monitoring Page
 *
 * System metrics and cost tracking.
 */

import { useQuery } from '@tanstack/react-query';
import { Activity, DollarSign, Cpu, TrendingUp } from 'lucide-react';
import { api } from '@/services/api';

export default function Monitoring() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: () => api.getStats(),
    refetchInterval: 10000,
  });

  const { data: costs, isLoading: costsLoading } = useQuery({
    queryKey: ['costs', 30],
    queryFn: () => api.getCosts(30),
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Monitoring</h1>
        <p className="text-gray-500 dark:text-gray-400">System metrics and cost tracking</p>
      </div>

      {/* Task Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Tasks"
          value={stats?.total_tasks || 0}
          icon={Activity}
          color="blue"
          loading={statsLoading}
        />
        <MetricCard
          title="Success Rate"
          value={`${stats?.success_rate?.toFixed(1) || 0}%`}
          icon={TrendingUp}
          color="green"
          loading={statsLoading}
        />
        <MetricCard
          title="Avg Duration"
          value={stats?.avg_task_duration_ms ? `${(stats.avg_task_duration_ms / 1000).toFixed(1)}s` : '-'}
          icon={Cpu}
          color="purple"
          loading={statsLoading}
        />
        <MetricCard
          title="Total Cost (30d)"
          value={`$${costs?.total_cost?.toFixed(2) || '0.00'}`}
          icon={DollarSign}
          color="yellow"
          loading={costsLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost by Provider */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Cost by Provider</h3>
          {costsLoading ? (
            <div className="space-y-3">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-8 bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
              ))}
            </div>
          ) : costs?.cost_by_provider && Object.keys(costs.cost_by_provider).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(costs.cost_by_provider).map(([provider, cost]) => (
                <div key={provider} className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">{provider}</span>
                  <span className="font-medium text-gray-900 dark:text-white">${cost.toFixed(4)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No cost data</p>
          )}
        </div>

        {/* Cost by Model */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Cost by Model</h3>
          {costsLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-8 bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
              ))}
            </div>
          ) : costs?.cost_by_model && Object.keys(costs.cost_by_model).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(costs.cost_by_model).map(([model, cost]) => (
                <div key={model} className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300 truncate max-w-[200px]">{model}</span>
                  <span className="font-medium text-gray-900 dark:text-white">${cost.toFixed(4)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No cost data</p>
          )}
        </div>

        {/* Token Usage */}
        <div className="card lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Token Usage (30 days)</h3>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Input Tokens</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {costs?.total_tokens_input?.toLocaleString() || 0}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Output Tokens</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {costs?.total_tokens_output?.toLocaleString() || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  title,
  value,
  icon: Icon,
  color,
  loading,
}: {
  title: string;
  value: string | number;
  icon: typeof Activity;
  color: 'blue' | 'green' | 'purple' | 'yellow';
  loading?: boolean;
}) {
  const colors = {
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    green: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    yellow: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
  };

  return (
    <div className="card">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg ${colors[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          {loading ? (
            <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          ) : (
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          )}
        </div>
      </div>
    </div>
  );
}
