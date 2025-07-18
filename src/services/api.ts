import { validateApiKey } from '../utils';

const HUGGING_FACE_API_URL = 'https://router.huggingface.co/nebius/v1/images/generations';

class ImageGenerationService {
  private apiKey: string = '';
  private mockMode: boolean = false;

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  setMockMode(mockMode: boolean) {
    this.mockMode = mockMode;
  }

  async generateImage(prompt: string): Promise<string> {
    if (this.mockMode || !this.apiKey || !validateApiKey(this.apiKey)) {
      return this.generateMockImage(prompt);
    }

    try {
      const response = await fetch(HUGGING_FACE_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          response_format: 'b64_json',
          prompt: prompt,
          model: 'stability-ai/sdxl',
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new ApiError('Invalid API key. Please check your Hugging Face API key.');
        }
        if (response.status === 429) {
          throw new ApiError('Rate limit exceeded. Please try again later or use mock mode.');
        }
        if (response.status === 503) {
          throw new ApiError('Model is currently loading. Please try again in a few minutes.');
        }
        throw new ApiError(`API request failed with status ${response.status}`);
      }

      const result = await response.json();
      
      // Handle the base64 response
      if (result.data && result.data[0] && result.data[0].b64_json) {
        const base64Image = result.data[0].b64_json;
        return `data:image/png;base64,${base64Image}`;
      } else {
        throw new ApiError('Invalid response format from API');
      }
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      console.error('Image generation failed:', error);
      throw new ApiError('Failed to generate image. Please try again.');
    }
  }

  private async generateMockImage(prompt: string): Promise<string> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
    
    // Generate a deterministic image based on prompt
    const seed = prompt.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return `https://picsum.photos/seed/${seed}/512/512`;
  }

  async testApiKey(apiKey: string): Promise<boolean> {
    if (!validateApiKey(apiKey)) {
      return false;
    }

    try {
      const response = await fetch(HUGGING_FACE_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          response_format: 'b64_json',
          prompt: 'test',
          model: 'stability-ai/sdxl',
        }),
      });

      return response.status !== 401;
    } catch {
      return false;
    }
  }
}

class ApiError extends Error {
  public code?: string;
  public details?: any;
  
  constructor(message: string, code?: string, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.details = details;
  }
}

export const imageGenerationService = new ImageGenerationService();
export { ApiError };
