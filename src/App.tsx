import { useEffect } from 'react';
import Dashboard from './components/Dashboard';
import useAppStore from './store';
import { imageGenerationService } from './services/api';

function App() {
  const { darkMode, apiKey, mockMode } = useAppStore();

  // Update document theme and API configuration
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    imageGenerationService.setApiKey(apiKey);
    imageGenerationService.setMockMode(mockMode);
  }, [apiKey, mockMode]);

  return (
    <div className="App">
      <Dashboard />
    </div>
  );
}

export default App;
