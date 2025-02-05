import type { FC } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen: FC<LoadingScreenProps> = ({ 
  message = 'Loading...' 
}) => {
  return (
    <div 
      className="min-h-screen bg-police-black flex flex-col items-center justify-center"
      role="status"
      aria-label="Loading application"
    >
      <div className="text-center">
        {/* Police Badge Animation */}
        <div className="mb-8 relative">
          <div className="w-24 h-24 rounded-full bg-police-yellow flex items-center justify-center animate-pulse">
            <svg 
              className="w-16 h-16 text-police-black" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
              role="img"
            >
              <title>Police badge</title>
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" 
              />
            </svg>
          </div>
          {/* Loading Spinner */}
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
            <LoadingSpinner 
              size="medium"
              color="police-yellow"
            />
          </div>
        </div>

        {/* Loading Text */}
        <div className="text-police-yellow font-bold text-xl mb-2">
          NCCPD Roster System
        </div>
        <div className="text-gray-400">
          {message}
        </div>
      </div>

      {/* Loading Progress Bar */}
      <div className="mt-8 w-64">
        <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-police-yellow animate-loading"
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Screen reader text */}
      <div className="sr-only" aria-live="polite">
        {message}
      </div>
    </div>
  );
};

// Add loading animation to tailwind config instead of inline styles
const style = document.createElement('style');
style.textContent = `
  @keyframes loading {
    0% {
      transform: translateX(-100%);
    }
    50% {
      transform: translateX(100%);
    }
    100% {
      transform: translateX(-100%);
    }
  }

  .animate-loading {
    width: 100%;
    animation: loading 2s ease-in-out infinite;
  }
`;
document.head.appendChild(style);

export default LoadingScreen;
