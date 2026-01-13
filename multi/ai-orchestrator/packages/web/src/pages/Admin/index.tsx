/**
 * Admin Page
 *
 * Mode configuration and system administration.
 */

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Shield, Zap, Bot, DollarSign, Check, X } from 'lucide-react';
import { api, type ModeConfig } from '@/services/api';

const modeIcons = {
  SPEED: Zap,
  QUALITY: Shield,
  AUTONOMY: Bot,
  COST: DollarSign,
};

const modeColors = {
  SPEED: 'text-yellow-500',
  QUALITY: 'text-blue-500',
  AUTONOMY: 'text-purple-500',
  COST: 'text-green-500',
};

export default function Admin() {
  const [editingMode, setEditingMode] = useState<string | null>(null);

  const { data: modes, isLoading } = useQuery({
    queryKey: ['modes'],
    queryFn: () => api.listModes(),
  });

  const { data: agents } = useQuery({
    queryKey: ['agents'],
    queryFn: () => api.listAgents(),
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Configure execution modes and system settings
        </p>
      </div>

      {/* Mode Configurations */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Execution Modes
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Configure how tasks are executed in each mode. Changes apply to new tasks immediately.
        </p>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {modes?.map((mode) => (
              <ModeCard
                key={mode.mode}
                mode={mode}
                isEditing={editingMode === mode.mode}
                onEdit={() => setEditingMode(mode.mode)}
                onCancel={() => setEditingMode(null)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Available Agents */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Available Agents
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents?.agents.map((agent) => (
            <div key={agent.type} className="card">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-gray-900 dark:text-white">{agent.name}</h3>
                <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">
                  {agent.type}
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                {agent.description}
              </p>
              <div className="flex flex-wrap gap-1" title={`Supports: ${agent.supported_modes.join(', ')}`}>
                {agent.supported_modes.map((mode) => {
                  const Icon = modeIcons[mode as keyof typeof modeIcons];
                  return Icon ? (
                    <Icon
                      key={mode}
                      className={`w-4 h-4 ${modeColors[mode as keyof typeof modeColors]}`}
                    />
                  ) : null;
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ModeCard({
  mode,
  isEditing,
  onEdit,
  onCancel,
}: {
  mode: ModeConfig;
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
}) {
  const queryClient = useQueryClient();
  const [config, _setConfig] = useState(mode.config);

  const Icon = modeIcons[mode.mode as keyof typeof modeIcons] || Shield;
  const color = modeColors[mode.mode as keyof typeof modeColors] || 'text-gray-500';

  const updateMutation = useMutation({
    mutationFn: () => api.updateModeConfig(mode.mode, config, mode.is_active),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modes'] });
      onCancel();
    },
  });

  const requiredAgents = (config.requiredAgents as string[]) || [];
  const primaryModel = config.primaryModel as { provider: string; model: string } | undefined;

  return (
    <div className={`card border-2 ${isEditing ? 'border-primary-500' : 'border-transparent'}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Icon className={`w-6 h-6 ${color}`} />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{mode.mode}</h3>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${mode.is_active ? 'bg-green-500' : 'bg-gray-400'}`}
          />
          {isEditing ? (
            <>
              <button
                onClick={() => updateMutation.mutate()}
                disabled={updateMutation.isPending}
                className="p-1 text-green-600 hover:bg-green-50 rounded"
              >
                <Check className="w-4 h-4" />
              </button>
              <button onClick={onCancel} className="p-1 text-red-600 hover:bg-red-50 rounded">
                <X className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              onClick={onEdit}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              Edit
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Decomposition</span>
          <span className="text-gray-900 dark:text-white">
            {config.decompositionDepth as string}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Validation</span>
          <span className="text-gray-900 dark:text-white">
            {config.validationDepth as string}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Primary Model</span>
          <span className="text-gray-900 dark:text-white truncate max-w-[150px]">
            {primaryModel?.model || '-'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Human Approval</span>
          <span className="text-gray-900 dark:text-white">
            {config.requiresHumanApproval ? 'Yes' : 'No'}
          </span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Required Agents</p>
        <div className="flex flex-wrap gap-1">
          {requiredAgents.map((agent) => (
            <span
              key={agent}
              className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-300"
            >
              {agent}
            </span>
          ))}
        </div>
      </div>

      {mode.updated_at && (
        <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
          Updated {new Date(mode.updated_at).toLocaleString()}
          {mode.updated_by && ` by ${mode.updated_by}`}
        </p>
      )}
    </div>
  );
}
