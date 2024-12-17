interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'white';
  className?: string;
}

const LoadingSpinner = ({ 
  size = 'medium', 
  color = 'primary',
  className = '' 
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  const colorClasses = {
    primary: 'text-blue-600',
    white: 'text-white'
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <svg
        className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
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
    </div>
  );
};

export const LoadingOverlay = ({ message = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 flex flex-col items-center">
        <LoadingSpinner size="large" />
        <p className="mt-4 text-gray-700 font-medium">{message}</p>
      </div>
    </div>
  );
};

export const LoadingContainer = ({ 
  loading, 
  children,
  message = 'Loading...',
  className = ''
}: {
  loading: boolean;
  children: React.ReactNode;
  message?: string;
  className?: string;
}) => {
  if (loading) {
    return (
      <div className={`flex justify-center items-center p-8 ${className}`}>
        <div className="text-center">
          <LoadingSpinner size="large" />
          <p className="mt-4 text-gray-600">{message}</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default LoadingSpinner;
