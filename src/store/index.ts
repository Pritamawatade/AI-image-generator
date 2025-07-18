import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GeneratedImage, PromptHistory, AppState } from '../types';
import { generateId } from '../utils';

interface AppStore extends AppState {
  // Actions
  addImage: (image: Omit<GeneratedImage, 'id' | 'createdAt'>) => void;
  updateImage: (id: string, updates: Partial<GeneratedImage>) => void;
  removeImage: (id: string) => void;
  addPromptHistory: (prompt: string, imageId?: string) => void;
  clearPromptHistory: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  toggleDarkMode: () => void;
  clearAllImages: () => void;
  setApiKey: (apiKey: string) => void;
  apiKey: string;
  mockMode: boolean;
  setMockMode: (mockMode: boolean) => void;
}

const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      // Initial state
      images: [],
      promptHistory: [],
      isLoading: false,
      error: null,
      darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
      apiKey: '',
      mockMode: false,

      // Actions
      addImage: (image) => {
        const newImage: GeneratedImage = {
          ...image,
          id: generateId(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          images: [newImage, ...state.images],
        }));
      },

      updateImage: (id, updates) => {
        set((state) => ({
          images: state.images.map((img) =>
            img.id === id ? { ...img, ...updates } : img
          ),
        }));
      },

      removeImage: (id) => {
        set((state) => ({
          images: state.images.filter((img) => img.id !== id),
        }));
      },

      addPromptHistory: (prompt, imageId) => {
        const newHistory: PromptHistory = {
          id: generateId(),
          prompt,
          timestamp: new Date().toISOString(),
          imageId,
        };
        set((state) => ({
          promptHistory: [newHistory, ...state.promptHistory.slice(0, 49)], // Keep last 50
        }));
      },

      clearPromptHistory: () => {
        set({ promptHistory: [] });
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      setError: (error) => {
        set({ error });
      },

      toggleDarkMode: () => {
        set((state) => ({ darkMode: !state.darkMode }));
      },

      clearAllImages: () => {
        set({ images: [] });
      },

      setApiKey: (apiKey) => {
        set({ apiKey });
      },

      setMockMode: (mockMode) => {
        set({ mockMode });
      },
    }),
    {
      name: 'ai-image-generator-store',
      partialize: (state) => ({
        images: state.images,
        promptHistory: state.promptHistory,
        darkMode: state.darkMode,
        apiKey: state.apiKey,
        mockMode: state.mockMode,
      }),
    }
  )
);

export default useAppStore;
