/**
 * Tasks Page
 *
 * Task list and creation.
 */

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus, Search, RefreshCw } from 'lucide-react';
import { api, type Task } from '@/services/api';
import { useModeStore } from '@/stores/modeStore';

export default function Tasks() {
  const queryClient = useQueryClient();
  const currentMode = useModeStore((state) => state.currentMode);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [modeFilter, setModeFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch tasks
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['tasks', statusFilter, modeFilter],
    queryFn: () =>
      api.listTasks({
        status: statusFilter || undefined,
        mode: modeFilter || undefined,
        page_size: 50,
      }),
    refetchInterval: 10000,
  });

  // Create task mutation
  const createMutation = useMutation({
    mutationFn: (data: { description: string; mode: string; priority: number }) =>
      api.createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setShowCreateModal(false);
    },
  });

  const filteredTasks = data?.tasks.filter((task) =>
    searchQuery
      ? task.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Tasks
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage orchestration tasks
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary px-4 py-2"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Task
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-10"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input w-40"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="running">Running</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </select>

        <select
          value={modeFilter}
          onChange={(e) => setModeFilter(e.target.value)}
          className="input w-40"
        >
          <option value="">All Modes</option>
          <option value="SPEED">SPEED</option>
          <option value="QUALITY">QUALITY</option>
          <option value="AUTONOMY">AUTONOMY</option>
          <option value="COST">COST</option>
        </select>

        <button
          onClick={() => refetch()}
          className="btn btn-secondary px-3 py-2"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Task List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-20 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : filteredTasks?.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No tasks found</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary px-4 py-2 mt-4"
          >
            Create your first task
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks?.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}

      {/* Total */}
      {data && (
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          Showing {filteredTasks?.length} of {data.total} tasks
        </p>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <CreateTaskModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={(data) => createMutation.mutate(data)}
          isLoading={createMutation.isPending}
          defaultMode={currentMode}
        />
      )}
    </div>
  );
}

function TaskCard({ task }: { task: Task }) {
  const statusColors: Record<string, string> = {
    pending: 'border-l-gray-400',
    running: 'border-l-yellow-400',
    completed: 'border-l-green-400',
    failed: 'border-l-red-400',
    cancelled: 'border-l-gray-400',
  };

  return (
    <Link
      to={`/tasks/${task.id}`}
      className={`block card border-l-4 ${statusColors[task.status] || 'border-l-gray-400'} hover:shadow-md transition-shadow`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-base font-medium text-gray-900 dark:text-white truncate">
              {task.description}
            </h3>
            <span
              className={`px-2 py-0.5 text-xs font-medium rounded ${
                task.status === 'completed'
                  ? 'bg-green-100 text-green-700'
                  : task.status === 'failed'
                  ? 'bg-red-100 text-red-700'
                  : task.status === 'running'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {task.status}
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span>{task.mode}</span>
            <span>•</span>
            <span>{new Date(task.created_at).toLocaleString()}</span>
            {task.tokens_used > 0 && (
              <>
                <span>•</span>
                <span>{task.tokens_used.toLocaleString()} tokens</span>
              </>
            )}
            {task.estimated_cost > 0 && (
              <>
                <span>•</span>
                <span>${task.estimated_cost.toFixed(4)}</span>
              </>
            )}
          </div>
        </div>

        {task.phases.length > 0 && (
          <div className="flex items-center gap-1 ml-4">
            {task.phases.map((phase, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full ${
                  phase.status === 'completed'
                    ? 'bg-green-500'
                    : phase.status === 'failed'
                    ? 'bg-red-500'
                    : phase.status === 'running'
                    ? 'bg-yellow-500'
                    : 'bg-gray-300'
                }`}
                title={`${phase.name}: ${phase.status}`}
              />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

function CreateTaskModal({
  onClose,
  onSubmit,
  isLoading,
  defaultMode,
}: {
  onClose: () => void;
  onSubmit: (data: { description: string; mode: string; priority: number }) => void;
  isLoading: boolean;
  defaultMode: string;
}) {
  const [description, setDescription] = useState('');
  const [mode, setMode] = useState(defaultMode);
  const [priority, setPriority] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim()) {
      onSubmit({ description: description.trim(), mode, priority });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg mx-4">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Create New Task
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what you want to build..."
              rows={4}
              className="input resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Mode
              </label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="input"
              >
                <option value="SPEED">SPEED</option>
                <option value="QUALITY">QUALITY</option>
                <option value="AUTONOMY">AUTONOMY</option>
                <option value="COST">COST</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Priority
              </label>
              <input
                type="number"
                value={priority}
                onChange={(e) => setPriority(parseInt(e.target.value) || 0)}
                min={0}
                max={100}
                className="input"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary px-4 py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!description.trim() || isLoading}
              className="btn btn-primary px-4 py-2"
            >
              {isLoading ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
