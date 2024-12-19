import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSession } from '../hooks/useSession';
import LoadingScreen from '../components/common/LoadingScreen';

import type { User } from '../services/authService';

interface SessionContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<User>;
  logout: () => void;
  refreshSession: () => Promise<void>;
  updateActivity: () => void;
}

const SessionContext = createContext<SessionContextType | null>(null);

// Protected routes configuration
const PUBLIC_ROUTES = ['/login', '/forgot-password', '/reset-password'];
const DEFAULT_PRIVATE_ROUTE = '/officers';
const DEFAULT_PUBLIC_ROUTE = '/login';

export function SessionProvider({ children }: { children: ReactNode }) {
  const session = useSession();
  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSessionContext() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSessionContext must be used within a SessionProvider');
  }
  return context;
}

// HOC for protecting routes
export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function WithAuthComponent(props: P) {
    const { isAuthenticated, isLoading } = useSessionContext();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
      if (!isLoading && !isAuthenticated && !PUBLIC_ROUTES.includes(location.pathname)) {
        navigate(DEFAULT_PUBLIC_ROUTE, {
          replace: true,
          state: { from: location.pathname }
        });
      }
    }, [isAuthenticated, isLoading, location.pathname, navigate]);

    if (isLoading) {
      return <LoadingScreen message="Checking authentication..." />;
    }

    if (!isAuthenticated && !PUBLIC_ROUTES.includes(location.pathname)) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}

// Hook for preventing authenticated users from accessing public routes
export function usePreventAuthAccess() {
  const { isAuthenticated, isLoading } = useSessionContext();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && isAuthenticated && PUBLIC_ROUTES.includes(location.pathname)) {
      navigate(DEFAULT_PRIVATE_ROUTE, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, location.pathname]);

  return { isAuthenticated, isLoading };
}

// Hook for requiring authentication
export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useSessionContext();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !PUBLIC_ROUTES.includes(location.pathname)) {
      navigate(DEFAULT_PUBLIC_ROUTE, {
        replace: true,
        state: { from: location.pathname }
      });
    }
  }, [isAuthenticated, isLoading, location.pathname, navigate]);

  return { isAuthenticated, isLoading };
}

// Hook for handling authentication state in forms
export function useAuthForm() {
  const { login } = useSessionContext();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogin = async (username: string, password: string) => {
    await login(username, password);
    
    // Get the return path from location state, or use default
    const from = location.state?.from as string || DEFAULT_PRIVATE_ROUTE;
    navigate(from, { replace: true });
  };

  return { handleLogin };
}

// Utility function to get return URL
export function getReturnUrl(location: { state?: { from?: string } }): string {
  return location.state?.from || DEFAULT_PRIVATE_ROUTE;
}
