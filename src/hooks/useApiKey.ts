import { useState } from 'react';
import useAppStore from '../store';
import { validateApiKey } from '../utils';
import { imageGenerationService } from '../services/api';

export const useApiKey = () => {
  const { apiKey, setApiKey, mockMode, setMockMode } = useAppStore();
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const validateAndSetApiKey = async (key: string) => {
    if (!key.trim()) {
      setApiKey('');
      setValidationError(null);
      return;
    }

    if (!validateApiKey(key)) {
      setValidationError('Invalid API key format. Should start with "hf_"');
      return;
    }

    setIsValidating(true);
    setValidationError(null);

    try {
      const isValid = await imageGenerationService.testApiKey(key);
      if (isValid) {
        setApiKey(key);
        setValidationError(null);
      } else {
        setValidationError('Invalid API key. Please check your Hugging Face token.');
      }
    } catch (error) {
      setValidationError('Failed to validate API key. Please try again.');
    } finally {
      setIsValidating(false);
    }
  };

  return {
    apiKey,
    setApiKey: validateAndSetApiKey,
    mockMode,
    setMockMode,
    isValidating,
    validationError,
    hasValidApiKey: apiKey && validateApiKey(apiKey),
  };
};
