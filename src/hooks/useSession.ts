/**
 * @file useSession.ts
 * @description Custom hook for managing user session state, including authentication,
 * session timeout, and activity tracking.
 */

import { useState, useEffect, useCallback } from 'react';
import { authService, type User } from '../services/authService';
import { notificationService } from '../services/notificationService';

/**
 * Session state interface
 */
interface SessionState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  lastActivity: number;
}

// Configuration constants
const SESSION_KEY = 'nccpd_session';
const ACTIVITY_TIMEOUT = 30 * 60 * 1000;         // Session timeout: 30 minutes
const ACTIVITY_CHECK_INTERVAL = 60 * 1000;       // Check interval: 1 minute
const ACTIVITY_WARNING_THRESHOLD = 5 * 60 * 1000; // Warning threshold: 5 minutes before timeout

/**
 * useSession Hook
 * Manages user session state and provides session-related functionality
 * 
 * Features:
 * - Session persistence in localStorage
 * - Automatic session timeout
 * - Activity tracking
 * - Session refresh
 * - Login/Logout handling
 */
export function useSession() {
  /**
   * Initialize session state
   * Attempts to restore session from localStorage if available and valid
   */
  const [state, setState] = useState<SessionState>(() => {
    const storedSession = localStorage.getItem(SESSION_KEY);
    if (storedSession) {
      try {
        const session = JSON.parse(storedSession);
        // Validate session timeout
        if (Date.now() - session.lastActivity < ACTIVITY_TIMEOUT) {
          return {
            ...session,
            isLoading: false
          };
        }
      } catch (error) {
        console.error('Error parsing session:', error);
      }
    }
    
    // Return default state if no valid session exists
    return {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      lastActivity: Date.now()
    };
  });

  /**
   * Updates session state and persists to localStorage
   */
  const updateSession = useCallback((updates: Partial<SessionState>) => {
    setState(prev => {
      const newState = { ...prev, ...updates };
      localStorage.setItem(SESSION_KEY, JSON.stringify(newState));
      return newState;
    });
  }, []);

  /**
   * Updates the last activity timestamp
   * Used to track user activity and prevent session timeout
   */
  const updateActivity = useCallback(() => {
    updateSession({ lastActivity: Date.now() });
  }, [updateSession]);

  /**
   * Activity tracking
   * Listens for user interactions to update last activity timestamp
   */
  useEffect(() => {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    
    const handleActivity = () => {
      updateActivity();
    };

    // Add event listeners for activity tracking
    events.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    // Cleanup event listeners
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [updateActivity]);

  /**
   * Session timeout monitoring
   * Checks for session expiration and shows warnings
   */
  useEffect(() => {
    const checkSession = () => {
      const timeElapsed = Date.now() - state.lastActivity;
      
      if (state.isAuthenticated) {
        if (timeElapsed >= ACTIVITY_TIMEOUT) {
          // Session expired - force logout
          notificationService.warning('Your session has expired. Please log in again.');
          handleLogout();
        } else if (timeElapsed >= ACTIVITY_TIMEOUT - ACTIVITY_WARNING_THRESHOLD) {
          // Show warning before session expires
          const minutesLeft = Math.ceil((ACTIVITY_TIMEOUT - timeElapsed) / 60000);
          notificationService.warning(
            `Your session will expire in ${minutesLeft} minute${minutesLeft > 1 ? 's' : ''}. Please save your work.`
          );
        }
      }
    };

    // Set up periodic session checks
    const interval = setInterval(checkSession, ACTIVITY_CHECK_INTERVAL);
    return () => clearInterval(interval);
  }, [state.isAuthenticated, state.lastActivity]);

  /**
   * Handles user login
   * Authenticates user and updates session state
   */
  const handleLogin = useCallback(async (username: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const user = await authService.login({ username, password });
      updateSession({
        user,
        isAuthenticated: true,
        isLoading: false,
        lastActivity: Date.now()
      });
      return user;
    } catch (error) {
      updateSession({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        lastActivity: Date.now()
      });
      throw error;
    }
  }, [updateSession]);

  /**
   * Handles user logout
   * Clears session state and local storage
   */
  const handleLogout = useCallback(() => {
    authService.logout();
    localStorage.removeItem(SESSION_KEY);
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      lastActivity: Date.now()
    });
  }, []);

  /**
   * Refreshes the session
   * Updates activity timestamp and could refresh auth token if using JWT
   */
  const refreshSession = useCallback(async () => {
    if (!state.isAuthenticated) return;
    
    try {
      updateActivity();
      // Could add JWT token refresh logic here if needed
    } catch (error) {
      console.error('Error refreshing session:', error);
      handleLogout();
    }
  }, [state.isAuthenticated, updateActivity, handleLogout]);

  // Return session state and methods
  return {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    login: handleLogin,
    logout: handleLogout,
    refreshSession,
    updateActivity
  };
}
