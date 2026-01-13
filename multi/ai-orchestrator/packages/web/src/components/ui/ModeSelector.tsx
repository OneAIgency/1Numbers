/**
 * Mode Selector Component
 *
 * Dropdown to switch between execution modes.
 */

import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ChevronDown, Zap, Shield, Bot, DollarSign } from 'lucide-react';
import { api } from '@/services/api';
import { useModeStore, type ExecutionMode } from '@/stores/modeStore';

const modeIcons: Record<ExecutionMode, typeof Zap> = {
  SPEED: Zap,
  QUALITY: Shield,
  AUTONOMY: Bot,
  COST: DollarSign,
};

const modeColors: Record<ExecutionMode, string> = {
  SPEED: 'text-yellow-500',
  QUALITY: 'text-blue-500',
  AUTONOMY: 'text-purple-500',
  COST: 'text-green-500',
};

const modeDescriptions: Record<ExecutionMode, string> = {
  SPEED: 'Fast execution, minimal validation',
  QUALITY: 'Comprehensive validation, all agents',
  AUTONOMY: 'Full automation with deployment',
  COST: 'Local models, cost optimized',
};

export default function ModeSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentMode, setCurrentMode, setConfig, setActiveTasks } = useModeStore();

  // Fetch current mode
  useQuery({
    queryKey: ['currentMode'],
    queryFn: async () => {
      const data = await api.getCurrentMode();
      setCurrentMode(data.mode as ExecutionMode);
      setConfig(data.config);
      setActiveTasks(data.active_tasks);
      return data;
    },
  });

  // Switch mode mutation
  const switchMutation = useMutation({
    mutationFn: (mode: string) => api.switchMode(mode),
    onSuccess: (_, mode) => {
      setCurrentMode(mode as ExecutionMode);
      setIsOpen(false);
    },
  });

  const Icon = modeIcons[currentMode];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 ${modeColors[currentMode]}`} />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
            {currentMode}
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20 overflow-hidden">
            {(['SPEED', 'QUALITY', 'AUTONOMY', 'COST'] as ExecutionMode[]).map(
              (mode) => {
                const ModeIcon = modeIcons[mode];
                const isActive = mode === currentMode;
                const isLoading = switchMutation.isPending && switchMutation.variables === mode;

                return (
                  <button
                    key={mode}
                    onClick={() => !isActive && switchMutation.mutate(mode)}
                    disabled={isActive || isLoading}
                    className={`w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                      isActive ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                    }`}
                  >
                    <ModeIcon className={`w-5 h-5 mt-0.5 ${modeColors[mode]}`} />
                    <div className="text-left">
                      <p className={`text-sm font-medium ${
                        isActive
                          ? 'text-primary-600 dark:text-primary-400'
                          : 'text-gray-700 dark:text-gray-200'
                      }`}>
                        {mode}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {modeDescriptions[mode]}
                      </p>
                    </div>
                    {isLoading && (
                      <div className="ml-auto">
                        <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </button>
                );
              }
            )}
          </div>
        </>
      )}
    </div>
  );
}
