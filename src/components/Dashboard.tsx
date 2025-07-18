import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import useAppStore from '../store';
import { imageGenerationService } from '../services/api';
import { cn, downloadImage, copyToClipboard } from '../utils';
import ImageGrid from './ImageGrid';
import ImageModal from './ImageModal';
import PromptHistoryModal from './PromptHistoryModal';
import Settings from './Settings';
import { Settings as SettingsIcon, History, Sparkles, Sun, Moon, Zap } from 'lucide-react';

const Dashboard: React.FC = () => {
  const {
    images,
    addImage,
    setLoading,
    setError,
    isLoading,
    error,
    darkMode,
    toggleDarkMode,
    promptHistory,
    addPromptHistory,
    apiKey,
    mockMode,
    setMockMode,
  } = useAppStore();

  const [prompt, setPrompt] = useState('');
  const [showImageModal, setShowImageModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Initialize API service
  useEffect(() => {
    // Use environment variable if available, otherwise use stored API key
    const envApiKey = import.meta.env.VITE_HF_API_KEY;
    const finalApiKey = envApiKey || apiKey;
    
    imageGenerationService.setApiKey(finalApiKey);
    imageGenerationService.setMockMode(mockMode);
  }, [apiKey, mockMode]);

  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      setError('Prompt cannot be empty.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const imageUrl = await imageGenerationService.generateImage(prompt);
      addImage({ prompt, url: imageUrl });
      addPromptHistory(prompt);
      setPrompt('');
    } catch (err: any) {
      setError(err.message || 'Failed to generate image');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleGenerateImage();
    }
  };

  return (
    <div className={cn(
      'min-h-screen transition-colors duration-300',
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white' 
        : 'bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-900'
    )}>
      <Toaster 
        position="top-right" 
        toastOptions={{
          className: darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900',
          duration: 4000,
        }}
      />

      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className={cn(
              'p-2 rounded-xl',
              darkMode ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gradient-to-r from-blue-500 to-purple-500'
            )}>
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Image Generator
            </h1>
          </div>
          <button
            onClick={toggleDarkMode}
            className={cn(
              'p-3 rounded-full transition-all duration-300 hover:scale-110',
              darkMode 
                ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' 
                : 'bg-white hover:bg-gray-100 text-gray-600 shadow-lg'
            )}
            title="Toggle dark mode"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 pb-8">
        {/* Prompt input section */}
        <div className={cn(
          'p-6 rounded-2xl shadow-xl mb-8 backdrop-blur-sm',
          darkMode 
            ? 'bg-gray-800/50 border border-gray-700' 
            : 'bg-white/70 border border-gray-200'
        )}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-gray-600 dark:text-gray-300">
              Describe your image
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g., A majestic lion in a forest, photorealistic, 4K"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyPress={handleKeyPress}
                className={cn(
                  'w-full p-4 rounded-xl border-2 focus:outline-none focus:ring-0 transition-all duration-300',
                  'placeholder:text-gray-400 text-lg',
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                    : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500 shadow-sm'
                )}
                disabled={isLoading}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                <Sparkles className={cn(
                  'w-5 h-5 transition-colors',
                  prompt.trim() ? 'text-blue-500' : 'text-gray-400'
                )} />
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={handleGenerateImage}
              disabled={isLoading || !prompt.trim()}
              className={cn(
                'px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105',
                'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg',
                'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
                isLoading && 'animate-pulse'
              )}
            >
              {isLoading ? (
                <>
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="inline w-4 h-4 mr-2" />
                  Generate Image
                </>
              )}
            </button>

            <button
              onClick={() => setShowHistoryModal(true)}
              className={cn(
                'px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105',
                darkMode 
                  ? 'bg-gray-700 text-white hover:bg-gray-600' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              <History className="inline w-4 h-4 mr-2" />
              History
            </button>

            <button
              onClick={() => setMockMode(!mockMode)}
              className={cn(
                'px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105',
                mockMode 
                  ? 'bg-orange-500 text-white hover:bg-orange-600' 
                  : 'bg-purple-500 text-white hover:bg-purple-600'
              )}
            >
              <Zap className="inline w-4 h-4 mr-2" />
              {mockMode ? 'Mock Mode' : 'Real API'}
            </button>

            <button
              onClick={() => setShowSettings(true)}
              className={cn(
                'px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105',
                darkMode 
                  ? 'bg-gray-700 text-white hover:bg-gray-600' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              <SettingsIcon className="inline w-4 h-4 mr-2" />
              Settings
            </button>
          </div>

          {/* Error message */}
          {error && (
            <div className="mt-4 p-4 bg-red-100 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-xl">
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Image grid */}
        <ImageGrid
          images={images}
          onImageClick={(id) => {
            setSelectedImage(id);
            setShowImageModal(true);
          }}
        />
      </main>

      {/* Image Modal */}
      {showImageModal && selectedImage && (
        <ImageModal
          imageUrl={images.find((img) => img.id === selectedImage)?.url || ''}
          onClose={() => setShowImageModal(false)}
          onDownload={() => downloadImage(images.find((img) => img.id === selectedImage)?.url || '', 'downloaded-image.jpg')}
          onCopy={() => copyToClipboard(images.find((img) => img.id === selectedImage)?.url || '')}
        />
      )}

      {/* Prompt History Modal */}
      {showHistoryModal && (
        <PromptHistoryModal
          history={promptHistory}
          onClose={() => setShowHistoryModal(false)}
        />
      )}

      {/* Settings Modal */}
      <Settings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  );
};

export default Dashboard;
