export interface GeneratedImage {
  id: string;
  prompt: string;
  url: string;
  createdAt: string;
  isLoading?: boolean;
  error?: string;
}

export interface PromptHistory {
  id: string;
  prompt: string;
  timestamp: string;
  imageId?: string;
}

export interface AppState {
  images: GeneratedImage[];
  promptHistory: PromptHistory[];
  isLoading: boolean;
  error: string | null;
  darkMode: boolean;
}

export interface HuggingFaceResponse {
  generated_text?: string;
  error?: string;
}

export interface ImageGenerationRequest {
  inputs: string;
  parameters?: {
    guidance_scale?: number;
    num_inference_steps?: number;
    negative_prompt?: string;
  };
}

export interface MockImage {
  id: string;
  url: string;
  alt: string;
}

export type Theme = 'light' | 'dark';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}
