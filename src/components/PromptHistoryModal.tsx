import React, { useEffect } from 'react';
import { X, Clock, Trash2, Copy } from 'lucide-react';
import type { PromptHistory } from '../types';
import { formatDate } from '../utils';
import useAppStore from '../store';
import toast from 'react-hot-toast';

interface PromptHistoryModalProps {
  history: PromptHistory[];
  onClose: () => void;
}

const PromptHistoryModal: React.FC<PromptHistoryModalProps> = ({
  history,
  onClose,
}) => {
  const { clearPromptHistory } = useAppStore();

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  const handleCopyPrompt = async (prompt: string) => {
    try {
      await navigator.clipboard.writeText(prompt);
      toast.success('Prompt copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy prompt');
    }
  };

  const handleClearHistory = () => {
    clearPromptHistory();
    toast.success('Prompt history cleared!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 cursor-pointer"
        onClick={onClose}
      />
      
      {/* Modal content */}
      <div className="relative w-full max-w-2xl max-h-[80vh] bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 border-b border-gray-200 dark:border-gray-600">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Prompt History
            </h2>
            <div className="flex gap-2">
              {history.length > 0 && (
                <button
                  onClick={handleClearHistory}
                  className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
                  title="Clear history"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onClose}
                className="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-full transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(80vh-80px)]">
          {history.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                No prompts in history yet
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                        {item.prompt}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(item.timestamp)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleCopyPrompt(item.prompt)}
                      className="bg-blue-500 hover:bg-blue-600 text-white p-1 rounded transition-colors"
                      title="Copy prompt"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromptHistoryModal;
