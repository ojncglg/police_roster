import React, { Suspense } from 'react';
import { useAuth } from '../../hooks/useAuth';
import LoadingScreen from './LoadingScreen';

interface RouteLoaderProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  loadingMessage?: string;
}

const RouteLoader: React.FC<RouteLoaderProps> = ({
  children,
  requireAuth = false,
  loadingMessage = 'Loading...'
}) => {
  const { isAuthenticated } = useAuth();

  // Show loading screen while checking authentication
  if (requireAuth && !isAuthenticated) {
    return <LoadingScreen message="Checking authentication..." />;
  }

  return (
    <Suspense fallback={<LoadingScreen message={loadingMessage} />}>
      {children}
    </Suspense>
  );
};

// Higher-order component for lazy-loaded routes
export const withRouteLoader = (
  Component: React.ComponentType<any>,
  options: Omit<RouteLoaderProps, 'children'> = {}
) => {
  const WrappedComponent = (props: any) => (
    <RouteLoader {...options}>
      <Component {...props} />
    </RouteLoader>
  );

  WrappedComponent.displayName = `WithRouteLoader(${
    Component.displayName || Component.name || 'Component'
  })`;

  return WrappedComponent;
};

export default RouteLoader;
