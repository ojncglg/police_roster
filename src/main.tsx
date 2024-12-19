import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./styles/print.css";
import "./styles/animations.css";
import { AppProvider } from "./contexts/AppContext";
import { SessionProvider } from "./contexts/SessionContext";
import App from "./App";

// Add custom styles
const style = document.createElement('style');
style.textContent = `
  :root {
    --color-police-yellow: #FFD700;
    --color-police-black: #000000;
    --color-police-gold: #FFB700;

    /* Light mode colors */
    --color-bg-primary: #ffffff;
    --color-bg-secondary: #f3f4f6;
    --color-text-primary: #111827;
    --color-text-secondary: #4b5563;
    --color-border: #e5e7eb;
  }

  /* Dark mode colors */
  .dark {
    --color-bg-primary: #1f2937;
    --color-bg-secondary: #111827;
    --color-text-primary: #f9fafb;
    --color-text-secondary: #d1d5db;
    --color-border: #374151;
  }

  body {
    background-color: var(--color-bg-secondary);
    color: var(--color-text-primary);
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: var(--color-bg-secondary);
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

  /* Button hover effects */
  .hover-effect {
    transition: all 0.3s ease;
  }

  .hover-effect:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(255, 215, 0, 0.2);
  }

  /* Card styles */
  .card {
    background-color: var(--color-bg-primary);
    border: 1px solid var(--color-border);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    transition: box-shadow 0.3s ease;
  }

  .card:hover {
    box-shadow: 0 4px 12px rgba(255, 215, 0, 0.15);
  }

  /* Form control focus styles */
  .form-control:focus {
    border-color: var(--color-police-yellow);
    box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.2);
  }

  /* Badge styles */
  .badge {
    background-color: var(--color-police-yellow);
    color: var(--color-police-black);
    font-weight: 600;
  }

  /* Print styles */
  @media print {
    .print\\:hidden {
      display: none !important;
    }
  }

  /* Loading animation */
  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .animate-spin {
    animation: spin 1s linear infinite;
  }
`;

document.head.appendChild(style);

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");
createRoot(rootElement).render(
  <StrictMode>
    <AppProvider>
      <SessionProvider>
        <App />
      </SessionProvider>
    </AppProvider>
  </StrictMode>
);
