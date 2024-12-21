import type { FC } from 'react';
import { Suspense } from 'react';

interface LoadingProps {
  variant?: 'spinner' | 'screen' | 'overlay' | 'container';
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'white' | 'police-yellow';
  message?: string;
  className?: string;
  children?: React.ReactNode;
  loading?: boolean;  // Added loading prop
}

const Spinner: FC<Pick<LoadingProps, 'size' | 'color' | 'className'>> = ({ 
  size = 'medium', 
  color = 'primary',
  className = '' 
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  const colorClasses = {
    primary: 'text-blue-600',
    white: 'text-white',
    'police-yellow': 'text-police-yellow'
  };

  return (
    <div className={`flex justify-center items-center ${className}`} role="status">
      <svg
        className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        role="img"
      >
        <title>Loading spinner</title>
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

const Screen: FC<Pick<LoadingProps, 'message'>> = ({ message = 'Loading...' }) => {
  return (
    <div 
      className="min-h-screen bg-police-black flex flex-col items-center justify-center"
      role="status"
      aria-label="Loading application"
    >
      <div className="text-center">
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
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
            <Spinner size="medium" color="police-yellow" />
          </div>
        </div>

        <div className="text-police-yellow font-bold text-xl mb-2">
          NCCPD Roster System
        </div>
        <div className="text-gray-400">
          {message}
        </div>
      </div>

      <div className="mt-8 w-64">
        <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-police-yellow animate-loading"
            aria-hidden="true"
          />
        </div>
      </div>

      <div className="sr-only" aria-live="polite">
        {message}
      </div>
    </div>
  );
};

const Overlay: FC<Pick<LoadingProps, 'message'>> = ({ message = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 flex flex-col items-center">
        <Spinner size="large" color="police-yellow" />
        <p className="mt-4 text-gray-700 dark:text-gray-300 font-medium">{message}</p>
      </div>
    </div>
  );
};

const Container: FC<LoadingProps> = ({ 
  loading = true, 
  children,
  message = 'Loading...',
  className = ''
}) => {
  if (loading) {
    return (
      <div className={`flex justify-center items-center p-8 ${className}`}>
        <div className="text-center">
          <Spinner size="large" color="police-yellow" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">{message}</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

const Loading: FC<LoadingProps> = ({ variant = 'spinner', ...props }) => {
  switch (variant) {
    case 'screen':
      return <Screen {...props} />;
    case 'overlay':
      return <Overlay {...props} />;
    case 'container':
      return <Container {...props} />;
    default:
      return <Spinner {...props} />;
  }
};

export const RouteLoader: FC<{
  children: React.ReactNode;
  loadingMessage?: string;
}> = ({
  children,
  loadingMessage = 'Loading...'
}) => {
  return (
    <Suspense fallback={<Loading variant="screen" message={loadingMessage} />}>
      {children}
    </Suspense>
  );
};

export default Loading;
