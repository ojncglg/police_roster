/**
 * @file withAuth.tsx
 * @description Higher Order Component (HOC) that provides authentication protection
 * for React components. Ensures components are only rendered for authenticated users.
 */

import { useEffect, type ComponentType } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

/**
 * withAuth Higher Order Component
 * 
 * @description Wraps a component with authentication protection logic.
 * Features:
 * - Checks authentication status on mount and during updates
 * - Redirects unauthenticated users to login
 * - Prevents rendering of protected content for unauthenticated users
 * - Preserves component props and type safety
 * 
 * @template P - Type of props accepted by the wrapped component
 * @param {ComponentType<P>} WrappedComponent - Component to be protected
 * @returns {ComponentType<P>} Protected version of the component
 * 
 * @example
 * // Protect a component
 * const ProtectedDashboard = withAuth(DashboardComponent);
 * 
 * // Use in routes
 * <Route path="/dashboard" element={<ProtectedDashboard />} />
 */
export function withAuth<P extends object>(WrappedComponent: ComponentType<P>) {
  /**
   * WithAuthComponent
   * 
   * @description Internal component that handles the authentication logic
   * and renders the wrapped component when appropriate.
   * 
   * @param {P} props - Props to be passed to the wrapped component
   * @returns {JSX.Element | null} Protected component or null if not authenticated
   */
  const WithAuthComponent = (props: P) => {
    // Hook for programmatic navigation
    const navigate = useNavigate();

    /**
     * Authentication Check Effect
     * 
     * Runs on mount and when navigation capabilities change
     * Redirects to login if user is not authenticated
     */
    useEffect(() => {
      authService.requireAuth(navigate);
    }, [navigate]);

    // Prevent rendering if not authenticated
    if (!authService.isAuthenticated()) {
      return null;
    }

    // Render wrapped component with original props if authenticated
    return <WrappedComponent {...props} />;
  };

  /**
   * Set display name for debugging purposes
   * Uses the wrapped component's display name, name, or falls back to 'Component'
   */
  WithAuthComponent.displayName = `WithAuth(${
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  })`;

  return WithAuthComponent;
}
