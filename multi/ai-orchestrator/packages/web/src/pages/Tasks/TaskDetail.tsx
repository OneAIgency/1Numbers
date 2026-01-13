/**
 * Task Detail Page
 *
 * Detailed view of a single task with execution progress.
 */

import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  Play,
  XCircle,
  RefreshCw,
  Clock,
  DollarSign,
  Cpu,
} from 'lucide-react';
import { api } from '@/services/api';
import { useEffect } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';

export default function TaskDetail() {
  const { taskId } = useParams<{ taskId: string }>();
  const queryClient = useQueryClient();
  const { subscribe, unsubscribe, messages } = useWebSocket();

  // Fetch task
  const { data: task, isLoading } = useQuery({
    queryKey: ['task', taskId],
    queryFn: () => api.getTask(taskId!),
    enabled: !!taskId,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === 'running' || status === 'pending' ? 2000 : false;
    },
  });

  // Subscribe to task updates
  useEffect(() => {
    if (taskId) {
      subscribe(`task:${taskId}`);
      return () => unsubscribe(`task:${taskId}`);
    }
  }, [taskId, subscribe, unsubscribe]);

  // Refetch on relevant messages
  useEffect(() => {
    const relevantMessage = messages.find(
      (m) => m.task_id === taskId && ['task_completed', 'task_failed', 'agent_completed'].includes(m.type)
    );
    if (relevantMessage) {
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
    }
  }, [messages, taskId, queryClient]);

  // Cancel mutation
  const cancelMutation = useMutation({
    mutationFn: () => api.cancelTask(taskId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
    },
  });

  // Retry mutation
  const retryMutation = useMutation({
    mutationFn: () => api.retryTask(taskId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
    },
  });

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">Task not found</p>
        <Link to="/tasks" className="text-primary-600 hover:underline mt-2 inline-block">
          Back to tasks
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          to="/tasks"
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Task Details
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
            {task.id}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {task.status === 'failed' && (
            <button
              onClick={() => retryMutation.mutate()}
              disabled={retryMutation.isPending}
              className="btn btn-secondary px-3 py-2"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </button>
          )}
          {['pending', 'running'].includes(task.status) && (
            <button
              onClick={() => cancelMutation.mutate()}
              disabled={cancelMutation.isPending}
              className="btn px-3 py-2 bg-red-100 text-red-600 hover:bg-red-200"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Status & Info */}
      <div className="card mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <StatusBadge status={task.status} />
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mt-2">
              {task.description}
            </h2>
          </div>
          <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
            {task.mode}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <InfoItem
            icon={Clock}
            label="Created"
            value={new Date(task.created_at).toLocaleString()}
          />
          {task.started_at && (
            <InfoItem
              icon={Play}
              label="Started"
              value={new Date(task.started_at).toLocaleString()}
            />
          )}
          <InfoItem
            icon={Cpu}
            label="Tokens"
            value={task.tokens_used.toLocaleString()}
          />
          <InfoItem
            icon={DollarSign}
            label="Cost"
            value={`$${task.estimated_cost.toFixed(4)}`}
          />
        </div>
      </div>

      {/* Phases */}
      {task.phases.length > 0 && (
        <div className="card mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Execution Phases
          </h3>

          <div className="space-y-4">
            {task.phases.map((phase, idx) => (
              <div
                key={idx}
                className={`border rounded-lg p-4 ${
                  phase.status === 'completed'
                    ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                    : phase.status === 'failed'
                    ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
                    : phase.status === 'running'
                    ? 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm font-medium">
                      {phase.number}
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {phase.name}
                    </span>
                  </div>
                  <span
                    className={`text-sm ${
                      phase.status === 'completed'
                        ? 'text-green-600'
                        : phase.status === 'failed'
                        ? 'text-red-600'
                        : phase.status === 'running'
                        ? 'text-yellow-600'
                        : 'text-gray-500'
                    }`}
                  >
                    {phase.status}
                  </span>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {phase.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {phase.agents.map((agent) => (
                    <span
                      key={agent}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-medium text-gray-600 dark:text-gray-300"
                    >
                      {agent}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Errors */}
      {task.errors.length > 0 && (
        <div className="card border-red-200 dark:border-red-800">
          <h3 className="text-lg font-semibold text-red-600 mb-4">Errors</h3>
          <div className="space-y-2">
            {task.errors.map((error, idx) => (
              <div
                key={idx}
                className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg"
              >
                <p className="text-sm text-red-700 dark:text-red-300">
                  {error.message}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Executions */}
      {task.executions && task.executions.length > 0 && (
        <div className="card mt-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Agent Executions
          </h3>

          <div className="space-y-3">
            {task.executions.map((exec) => (
              <div
                key={exec.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {exec.agent_type}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                    Phase {exec.phase_number}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  {exec.duration_ms && <span>{exec.duration_ms}ms</span>}
                  {exec.tokens_input + exec.tokens_output > 0 && (
                    <span>{(exec.tokens_input + exec.tokens_output).toLocaleString()} tokens</span>
                  )}
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium ${
                      exec.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : exec.status === 'failed'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {exec.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    running: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    failed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    cancelled: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status] || styles.pending}`}>
      {status}
    </span>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Clock;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="w-4 h-4 text-gray-400" />
      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-sm font-medium text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
}
