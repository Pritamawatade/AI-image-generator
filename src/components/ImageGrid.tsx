import React from 'react';
import type { GeneratedImage } from '../types';
import { cn, formatDate, truncateText } from '../utils';
import { Loader2, AlertCircle } from 'lucide-react';

interface ImageGridProps {
  images: GeneratedImage[];
  onImageClick: (id: string) => void;
}

const ImageGrid: React.FC<ImageGridProps> = ({ images, onImageClick }) => {
  if (images.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No images generated yet
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Enter a prompt above to generate your first AI image
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {images.map((image) => (
        <div
          key={image.id}
          className={cn(
            'relative group bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-xl cursor-pointer',
            image.isLoading && 'opacity-50'
          )}
          onClick={() => !image.isLoading && onImageClick(image.id)}
        >
          {image.isLoading ? (
            <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-300">Generating...</p>
              </div>
            </div>
          ) : image.error ? (
            <div className="aspect-square bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/40 flex items-center justify-center">
              <div className="text-center">
                <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <p className="text-sm text-red-600 dark:text-red-400 px-2">
                  Failed to load
                </p>
              </div>
            </div>
          ) : (
            <>
              <img
                src={image.url}
                alt={image.prompt}
                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
              />
              <div className="p-3">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 line-clamp-2">
                  {truncateText(image.prompt, 80)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formatDate(image.createdAt)}
                </p>
              </div>
            </>
          )}
          
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
            <div className="p-4 text-white w-full">
              <p className="text-sm font-semibold mb-1">
                Click to view full size
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageGrid;
