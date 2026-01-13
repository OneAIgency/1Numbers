/**
 * Settings Page
 *
 * User and application settings.
 */

import { useState } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';

export default function Settings() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (newTheme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // System preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400">Configure your preferences</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Appearance */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Appearance</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Choose how the application looks
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => handleThemeChange('light')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-colors ${
                theme === 'light'
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }`}
            >
              <Sun className="w-4 h-4" />
              Light
            </button>
            <button
              onClick={() => handleThemeChange('dark')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-colors ${
                theme === 'dark'
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }`}
            >
              <Moon className="w-4 h-4" />
              Dark
            </button>
            <button
              onClick={() => handleThemeChange('system')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-colors ${
                theme === 'system'
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }`}
            >
              <Monitor className="w-4 h-4" />
              System
            </button>
          </div>
        </div>

        {/* API Configuration */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">API Configuration</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                API Endpoint
              </label>
              <input
                type="text"
                defaultValue="http://localhost:8000"
                className="input"
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">Configured via environment</p>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notifications</h3>
          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Task Completion</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Get notified when tasks complete
                </p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
            </label>
            <label className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Task Failures</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Get notified when tasks fail
                </p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
