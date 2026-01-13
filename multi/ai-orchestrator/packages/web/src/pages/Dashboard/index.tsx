/**
 * Dashboard Page
 *
 * Overview of system status, recent tasks, and key metrics.
 */

import { useQuery } from '@tanstack/react-query';
import {
  Activity,
  CheckCircle2,
  XCircle,
  Clock,
  Zap,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import { api } from '@/services/api';
import { useModeStore } from '@/stores/modeStore';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const currentMode = useModeStore((state) => state.currentMode);

  // Fetch stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: () => api.getStats(),
    refetchInterval: 10000,
  });

  // Fetch costs
  const { data: costs } = useQuery({
    queryKey: ['costs'],
    queryFn: () => api.getCosts(7),
  });

  // Fetch recent tasks
  const { data: taskData, isLoading: tasksLoading } = useQuery({
    queryKey: ['recentTasks'],
    queryFn: () => api.listTasks({ page_size: 5 }),
    refetchInterval: 10000,
  });

  // Fetch health
  const { data: health } = useQuery({
    queryKey: ['health'],
    queryFn: () => api.healthCheck(),
    refetchInterval: 30000,
  });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          AI Development Orchestration Platform
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Tasks"
          value={stats?.total_tasks || 0}
          icon={Activity}
          color="blue"
          loading={statsLoading}
        />
        <StatCard
          title="Completed"
          value={stats?.completed_tasks || 0}
          icon={CheckCircle2}
          color="green"
          loading={statsLoading}
        />
        <StatCard
          title="Failed"
          value={stats?.failed_tasks || 0}
          icon={XCircle}
          color="red"
          loading={statsLoading}
        />
        <StatCard
          title="Running"
          value={stats?.running_tasks || 0}
          icon={Clock}
          color="yellow"
          loading={statsLoading}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Success Rate
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {stats?.success_rate?.toFixed(1) || 0}%
          </p>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-5 h-5 text-green-500" />
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Total Cost (7d)
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            ${costs?.total_cost?.toFixed(2) || '0.00'}
          </p>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Current Mode
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {currentMode}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tasks */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Tasks
            </h2>
            <Link
              to="/tasks"
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              View all
            </Link>
          </div>

          {tasksLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-16 bg-gray-100 dark:bg-gray-700 rounded animate-pulse"
                />
              ))}
            </div>
          ) : taskData?.tasks.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              No tasks yet
            </p>
          ) : (
            <div className="space-y-3">
              {taskData?.tasks.map((task) => (
                <Link
                  key={task.id}
                  to={`/tasks/${task.id}`}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {task.description}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {task.mode} • {new Date(task.created_at).toLocaleString()}
                    </p>
                  </div>
                  <StatusBadge status={task.status} />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* System Health */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            System Health
          </h2>

          <div className="space-y-3">
            <HealthItem
              name="Database"
              status={health?.database?.status || 'unknown'}
            />
            <HealthItem
              name="Cache"
              status={health?.cache?.status || 'unknown'}
            />
            <HealthItem
              name="Claude API"
              status={health?.claude?.status || 'unknown'}
            />
            <HealthItem
              name="Ollama"
              status={health?.ollama?.status || 'unknown'}
            />
          </div>

          {health?.version && (
            <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
              Version: {health.version}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  color,
  loading,
}: {
  title: string;
  value: number;
  icon: typeof Activity;
  color: 'blue' | 'green' | 'red' | 'yellow';
  loading?: boolean;
}) {
  const colors = {
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    green: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    red: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
    yellow: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
  };

  return (
    <div className="card">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg ${colors[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </p>
          {loading ? (
            <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          ) : (
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {value.toLocaleString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: 'bg-gray-100 text-gray-600',
    running: 'bg-yellow-100 text-yellow-600',
    completed: 'bg-green-100 text-green-600',
    failed: 'bg-red-100 text-red-600',
    cancelled: 'bg-gray-100 text-gray-600',
  };

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded ${
        styles[status] || styles.pending
      }`}
    >
      {status}
    </span>
  );
}

function HealthItem({ name, status }: { name: string; status: string }) {
  const isHealthy = status === 'healthy';

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-600 dark:text-gray-300">{name}</span>
      <div className="flex items-center gap-2">
        <span
          className={`w-2 h-2 rounded-full ${
            isHealthy ? 'bg-green-500' : 'bg-red-500'
          }`}
        />
        <span
          className={`text-sm ${
            isHealthy ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {status}
        </span>
      </div>
    </div>
  );
}
