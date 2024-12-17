import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppProvider } from './contexts/AppContext';
import { SessionProvider } from './contexts/SessionContext';
import App from './App';

import './index.css';
import './styles/print.css';
import './styles/animations.css';

// Add custom styles
const style = document.createElement('style');
style.textContent = `
  :root {
    --color-police-yellow: #FFD700;
    --color-police-black: #000000;
    --color-police-gold: #FFB700;
  }

  body {
    background-color: #f8f9fa;
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background: var(--color-police-yellow);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--color-police-gold);
  }

  /* Focus styles */
  *:focus {
    outline: 2px solid var(--color-police-yellow);
    outline-offset: 2px;
  }

  /* Selection styles */
  ::selection {
    background-color: var(--color-police-yellow);
    color: var(--color-police-black);
  }
`;

document.head.appendChild(style);

// biome-ignore lint/style/noNonNullAssertion: root html element is there
const rootElement = document.getElementById('root') as HTMLElement;

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <AppProvider>
      <SessionProvider>
        <App />
      </SessionProvider>
    </AppProvider>
  </React.StrictMode>
);
