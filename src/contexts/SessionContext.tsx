/**
 * @file SessionContext.tsx
 * @description Provides session management and authentication context for the application.
 * Includes route protection, authentication state management, and navigation utilities.
 */

import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSession } from '../hooks/useSession';
import LoadingScreen from '../components/common/LoadingScreen';

import type { User } from '../services/authService';

/**
 * Session Context Type Definition
 * Defines the shape of the session context data and methods
 */
interface SessionContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<User>;
  logout: () => void;
  refreshSession: () => Promise<void>;
  updateActivity: () => void;
}

// Create context with null as initial value
const SessionContext = createContext<SessionContextType | null>(null);

/**
 * Route Configuration
 * Defines which routes are public vs protected
 */
const PUBLIC_ROUTES = ['/login', '/forgot-password', '/reset-password'];
const DEFAULT_PRIVATE_ROUTE = '/officers';
const DEFAULT_PUBLIC_ROUTE = '/login';

/**
 * SessionProvider Component
 * Provides session context to the application
 * 
 * @param children - Child components that will have access to session context
 */
export function SessionProvider({ children }: { children: ReactNode }) {
  const session = useSession();
  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
}

/**
 * useSessionContext Hook
 * Custom hook to access session context
 * 
 * @throws Error if used outside of SessionProvider
 * @returns SessionContextType object containing session state and methods
 */
export function useSessionContext() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSessionContext must be used within a SessionProvider');
  }
  return context;
}

/**
 * withAuth Higher Order Component
 * Wraps components that require authentication
 * 
 * @param WrappedComponent - Component to be protected
 * @returns Protected component with authentication check
 */
export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function WithAuthComponent(props: P) {
    const { isAuthenticated, isLoading } = useSessionContext();
    const location = useLocation();
    const navigate = useNavigate();

    // Redirect to login if not authenticated
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

/**
 * usePreventAuthAccess Hook
 * Prevents authenticated users from accessing public routes
 * 
 * @returns Object containing authentication state
 */
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

/**
 * useRequireAuth Hook
 * Enforces authentication requirement for protected routes
 * 
 * @returns Object containing authentication state
 */
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

/**
 * useAuthForm Hook
 * Handles authentication logic in login forms
 * 
 * @returns Object containing login handler
 */
export function useAuthForm() {
  const { login } = useSessionContext();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogin = async (username: string, password: string) => {
    await login(username, password);
    
    // Navigate to return URL or default private route
    const from = location.state?.from as string || DEFAULT_PRIVATE_ROUTE;
    navigate(from, { replace: true });
  };

  return { handleLogin };
}

/**
 * getReturnUrl Utility Function
 * Gets the URL to return to after authentication
 * 
 * @param location - Location object containing return path
 * @returns Return URL string
 */
export function getReturnUrl(location: { state?: { from?: string } }): string {
  return location.state?.from || DEFAULT_PRIVATE_ROUTE;
}
