/**
 * Mode Store
 *
 * Global state for execution mode management.
 */

import { create } from 'zustand';

export type ExecutionMode = 'SPEED' | 'QUALITY' | 'AUTONOMY' | 'COST';

interface ModeState {
  currentMode: ExecutionMode;
  config: Record<string, unknown>;
  activeTasks: number;
  isLoading: boolean;
  setCurrentMode: (mode: ExecutionMode) => void;
  setConfig: (config: Record<string, unknown>) => void;
  setActiveTasks: (count: number) => void;
  setLoading: (loading: boolean) => void;
}

export const useModeStore = create<ModeState>((set) => ({
  currentMode: 'QUALITY',
  config: {},
  activeTasks: 0,
  isLoading: false,
  setCurrentMode: (mode) => set({ currentMode: mode }),
  setConfig: (config) => set({ config }),
  setActiveTasks: (count) => set({ activeTasks: count }),
  setLoading: (loading) => set({ isLoading: loading }),
}));
