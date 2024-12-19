import { Suspense, type FC, type ComponentType } from 'react';
import { useAuth } from '../../hooks/useAuth';
import LoadingScreen from './LoadingScreen';

interface RouteLoaderProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  loadingMessage?: string;
}

const RouteLoader: FC<RouteLoaderProps> = ({
  children,
  requireAuth = false,
  loadingMessage = 'Loading...'
}) => {
  const { isAuthenticated } = useAuth();

  // Show loading screen while checking authentication
  if (requireAuth && !isAuthenticated) {
    return (
      <LoadingScreen 
        message="Checking authentication..." 
        aria-label="Verifying user authentication"
      />
    );
  }

  return (
    <Suspense 
      fallback={
        <LoadingScreen 
          message={loadingMessage}
          aria-label={`Loading ${loadingMessage.toLowerCase()}`}
        />
      }
    >
      {children}
    </Suspense>
  );
};

// Higher-order component for lazy-loaded routes
export const withRouteLoader = <P extends object>(
  Component: ComponentType<P>,
  options: Omit<RouteLoaderProps, 'children'> = {}
): FC<P> => {
  const WrappedComponent: FC<P> = (props) => (
    <RouteLoader {...options}>
      <Component {...props} />
    </RouteLoader>
  );

  // Preserve the original component's name for better debugging
  const displayName = Component.displayName || Component.name || 'Component';
  WrappedComponent.displayName = `WithRouteLoader(${displayName})`;

  return WrappedComponent;
};

export default RouteLoader;
