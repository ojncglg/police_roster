/**
 * @file useAuth.ts
 * @description Custom hook that provides authentication functionality at the component level.
 * Combines session management with navigation handling for authentication flows.
 */

import { useCallback } from 'react';
import { useSessionContext } from '../contexts/SessionContext';
import { useAuthNavigation } from './useAuthNavigation';

/**
 * useAuth Hook
 * 
 * @description Provides a simplified interface for authentication-related operations
 * by combining session management with navigation handling. This hook serves as the
 * primary interface for components that need to interact with authentication state
 * and perform authentication-related actions.
 * 
 * Features:
 * - Access to current user data
 * - Authentication state checking
 * - Loading state for async operations
 * - Login functionality
 * - Logout with automatic navigation
 * 
 * @returns {Object} Authentication utilities and state
 * @property {User | null} user - Current authenticated user or null
 * @property {boolean} isAuthenticated - Whether user is currently authenticated
 * @property {boolean} isLoading - Loading state for auth operations
 * @property {Function} login - Function to handle user login
 * @property {Function} logout - Function to handle user logout with navigation
 */
export function useAuth() {
  // Get authentication state and methods from session context
  const { user, isAuthenticated, isLoading, login, logout } = useSessionContext();
  
  // Get navigation utilities for auth flows
  const { navigateAfterLogout } = useAuthNavigation();

  /**
   * Enhanced logout handler
   * Combines session logout with navigation
   * Memoized to prevent unnecessary re-renders
   */
  const handleLogout = useCallback(() => {
    // Clear authentication state
    logout();
    // Navigate to appropriate route after logout
    navigateAfterLogout();
  }, [logout, navigateAfterLogout]);

  // Return authentication utilities and state
  return {
    user,               // Current user data
    isAuthenticated,    // Authentication state
    isLoading,         // Loading state
    login,             // Login function
    logout: handleLogout // Enhanced logout function with navigation
  };
}
