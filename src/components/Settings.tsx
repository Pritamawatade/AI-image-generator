import React, { useState } from 'react';
import { X, Eye, EyeOff, ExternalLink } from 'lucide-react';
import { useApiKey } from '../hooks/useApiKey';
import { cn } from '../utils';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({ isOpen, onClose }) => {
  const { apiKey, setApiKey, mockMode, setMockMode, isValidating, validationError, hasValidApiKey } = useApiKey();
  const [showApiKey, setShowApiKey] = useState(false);
  const [tempApiKey, setTempApiKey] = useState(apiKey);
  const envApiKey = import.meta.env.VITE_HF_API_KEY;
  const isUsingEnvKey = Boolean(envApiKey);

  const handleSave = () => {
    setApiKey(tempApiKey);
    onClose();
  };

  const handleOpenHuggingFace = () => {
    window.open('https://huggingface.co/settings/tokens', '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* API Key Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Hugging Face API Key
            </label>
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
                placeholder="hf_..."
                className={cn(
                  'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
                  'dark:bg-gray-700 dark:border-gray-600 dark:text-white',
                  validationError ? 'border-red-500' : 'border-gray-300'
                )}
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {validationError && (
              <p className="text-red-500 text-sm mt-1">{validationError}</p>
            )}
            {hasValidApiKey && (
              <p className="text-green-500 text-sm mt-1">✓ Valid API key</p>
            )}
            <div className="flex items-center justify-between mt-2">
              <button
                onClick={handleOpenHuggingFace}
                className="text-blue-500 hover:text-blue-600 text-sm flex items-center gap-1"
              >
                Get API Key <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Mock Mode Toggle */}
          <div>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={mockMode}
                onChange={(e) => setMockMode(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Use Mock Mode (for testing without API key)
              </span>
            </label>
          </div>

          {/* Environment API Key Status */}
          {isUsingEnvKey && (
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md">
              <p className="text-sm text-green-800 dark:text-green-200">
                <strong>✓ Environment API Key Active:</strong> Using API key from environment variables (.env file).
              </p>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Note:</strong> If you don't have an API key, enable Mock Mode to generate placeholder images.
              For real AI image generation, get a free API key from Hugging Face.
            </p>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isValidating}
            className={cn(
              'px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors',
              isValidating && 'opacity-50 cursor-not-allowed'
            )}
          >
            {isValidating ? 'Validating...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
