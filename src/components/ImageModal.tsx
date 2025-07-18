import React, { useEffect } from 'react';
import { X, Download, Copy } from 'lucide-react';
import toast from 'react-hot-toast';

interface ImageModalProps {
  imageUrl: string;
  onClose: () => void;
  onDownload: () => void;
  onCopy: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({
  imageUrl,
  onClose,
  onDownload,
  onCopy,
}) => {
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

  const handleDownload = () => {
    onDownload();
    toast.success('Image downloaded successfully!');
  };

  const handleCopy = async () => {
    try {
      await onCopy();
      toast.success('Image URL copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy image URL');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 cursor-pointer"
        onClick={onClose}
      />
      
      {/* Modal content */}
      <div className="relative max-w-5xl max-h-[90vh] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/70 to-transparent p-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <button
                onClick={handleDownload}
                className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full transition-all duration-200 hover:scale-110"
                title="Download image"
              >
                <Download className="w-5 h-5" />
              </button>
              <button
                onClick={handleCopy}
                className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full transition-all duration-200 hover:scale-110"
                title="Copy image URL"
              >
                <Copy className="w-5 h-5" />
              </button>
            </div>
            <button
              onClick={onClose}
              className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full transition-all duration-200 hover:scale-110"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Image */}
        <img
          src={imageUrl}
          alt="Generated image"
          className="w-full h-auto max-h-[80vh] object-contain"
          style={{ minHeight: '300px', maxWidth: '100%' }}
        />
      </div>
    </div>
  );
};

export default ImageModal;
