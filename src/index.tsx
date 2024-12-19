import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppProvider } from './contexts/AppContext';
import { SessionProvider } from './contexts/SessionContext';
import App from './App';

import './index.css';
import './styles/print.css';
import './styles/animations.css';

// Initialize theme based on stored preference or system preference
const storedMode = localStorage.getItem('color-mode') as 'light' | 'dark' | 'system' || 'system';
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const shouldBeDark = storedMode === 'system' ? prefersDark : storedMode === 'dark';

if (shouldBeDark) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find the root element');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <AppProvider>
      <SessionProvider>
        <App />
      </SessionProvider>
    </AppProvider>
  </React.StrictMode>
);
