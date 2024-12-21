/**
 * @file useAuthNavigation.ts
 * @description Custom hook that handles navigation logic for authentication flows,
 * including route protection and redirects based on authentication state.
 */

import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSessionContext } from '../contexts/SessionContext';

/**
 * Route Configuration Constants
 */
const PUBLIC_ROUTES = ['/login', '/forgot-password', '/reset-password']; // Routes accessible without authentication
const DEFAULT_PRIVATE_ROUTE = '/officers';                               // Default route after login
const DEFAULT_PUBLIC_ROUTE = '/login';                                  // Default route when not authenticated

/**
 * useAuthNavigation Hook
 * 
 * @description Manages navigation logic for authentication flows, including:
 * - Protecting private routes from unauthenticated access
 * - Redirecting authenticated users away from public routes
 * - Handling post-login/logout navigation
 * - Preserving attempted route access for post-login redirect
 * 
 * @returns {Object} Navigation utility functions
 */
export function useAuthNavigation() {
  // Get authentication state from session context
  const { isAuthenticated, isLoading } = useSessionContext();
  
  // React Router hooks for navigation
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * Route Protection Effect
   * 
   * Handles automatic navigation based on authentication state:
   * 1. Redirects unauthenticated users to login when accessing private routes
   * 2. Redirects authenticated users away from public routes
   */
  useEffect(() => {
    // Skip navigation during loading state
    if (isLoading) return;

    // Check if current route is public
    const isPublicRoute = PUBLIC_ROUTES.some(route => 
      location.pathname.startsWith(route)
    );

    if (!isAuthenticated && !isPublicRoute) {
      // Case: Unauthenticated user trying to access private route
      // Redirect to login and save attempted route for post-login redirect
      navigate(DEFAULT_PUBLIC_ROUTE, {
        replace: true,
        state: { from: location.pathname }
      });
    } else if (isAuthenticated && isPublicRoute) {
      // Case: Authenticated user trying to access public route
      // Redirect to default private route
      navigate(DEFAULT_PRIVATE_ROUTE, { replace: true });
    }
  }, [isAuthenticated, isLoading, location.pathname, navigate]);

  /**
   * Post-login Navigation Handler
   * 
   * Navigates user after successful login:
   * - To previously attempted route if available
   * - To default private route otherwise
   */
  const navigateAfterLogin = () => {
    const from = location.state?.from as string || DEFAULT_PRIVATE_ROUTE;
    navigate(from, { replace: true });
  };

  /**
   * Post-logout Navigation Handler
   * 
   * Navigates user to login page after logout
   */
  const navigateAfterLogout = () => {
    navigate(DEFAULT_PUBLIC_ROUTE, { replace: true });
  };

  return {
    navigateAfterLogin,   // Function to handle post-login navigation
    navigateAfterLogout   // Function to handle post-logout navigation
  };
}
