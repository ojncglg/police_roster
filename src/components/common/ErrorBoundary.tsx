import type { ReactNode } from 'react';
import { Component } from 'react';
import { notificationService } from '../../services/notificationService';
import Button from './Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }

  public componentDidCatch(error: Error) {
    console.error('Uncaught error:', error);
    notificationService.error('An unexpected error occurred. Please try again.');
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          <div className="max-w-md w-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-900">
            <div className="text-center">
              <svg
                role="img"
                className="mx-auto h-12 w-12 text-red-500 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <title>Error icon</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
                Something went wrong
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                We're sorry! An unexpected error occurred. Please try refreshing the page.
              </p>
              <div className="mt-6">
                <Button
                  onClick={() => window.location.reload()}
                  variant="danger"
                  aria-label="Refresh the page"
                >
                  Refresh Page
                </Button>
              </div>
              {import.meta.env.DEV && this.state.error && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-md">
                  <pre className="text-left text-xs text-red-800 dark:text-red-300 whitespace-pre-wrap font-mono">
                    {this.state.error.toString()}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
