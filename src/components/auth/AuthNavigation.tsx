/**
 * @file AuthNavigation.tsx
 * @description Root navigation component that handles authentication-based routing
 * and provides loading states during authentication checks.
 */

import { useAuthNavigation } from '../../hooks/useAuthNavigation';
import { Outlet } from 'react-router-dom';
import { useSessionContext } from '../../contexts/SessionContext';
import LoadingScreen from '../common/LoadingScreen';

/**
 * AuthNavigation Component
 * 
 * @description Top-level navigation component that:
 * 1. Manages authentication-based routing through useAuthNavigation hook
 * 2. Handles loading states during authentication checks
 * 3. Renders child routes through React Router's Outlet
 * 
 * This component serves as a wrapper for the entire application's routing structure,
 * ensuring proper authentication flow and loading states are maintained.
 * 
 * Features:
 * - Automatic navigation based on auth state
 * - Loading screen during authentication checks
 * - Child route rendering through Outlet
 * 
 * @example
 * // Used in router configuration
 * {
 *   element: <AuthNavigation />,
 *   children: [
 *     // Child routes
 *   ]
 * }
 */
export function AuthNavigation() {
  // Get loading state from session context
  const { isLoading } = useSessionContext();
  
  // Initialize authentication-based navigation
  useAuthNavigation();
  
  // Show loading screen during authentication checks
  if (isLoading) {
    return <LoadingScreen message="Loading application..." />;
  }

  // Render child routes when authentication state is determined
  return <Outlet />;
}
