import { useNavigate } from 'react-router-dom';
import Button from './Button';

const DefaultError = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center px-4 transition-colors duration-200">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-900 p-8 text-center">
        <div className="mb-6">
          <svg
            className="mx-auto h-16 w-16 text-police-yellow"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
            role="img"
          >
            <title>Error icon</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Oops! Something went wrong
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          We apologize for the inconvenience. Please try again or contact support if the problem persists.
        </p>
        <div className="space-x-4">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            aria-label="Go back to previous page"
          >
            Go Back
          </Button>
          <Button
            onClick={() => navigate('/')}
            variant="primary"
            aria-label="Go to home page"
          >
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DefaultError;
