import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, type User } from '../services/authService';
import { notificationService } from '../services/notificationService';

interface SessionState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  lastActivity: number;
}

const SESSION_KEY = 'nccpd_session';
const ACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const ACTIVITY_CHECK_INTERVAL = 60 * 1000; // 1 minute
const ACTIVITY_WARNING_THRESHOLD = 5 * 60 * 1000; // 5 minutes

export function useSession() {
  const navigate = useNavigate();
  const [state, setState] = useState<SessionState>(() => {
    const storedSession = localStorage.getItem(SESSION_KEY);
    if (storedSession) {
      try {
        const session = JSON.parse(storedSession);
        // Check if session is still valid
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
    return {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      lastActivity: Date.now()
    };
  });

  // Update session in localStorage
  const updateSession = useCallback((updates: Partial<SessionState>) => {
    setState(prev => {
      const newState = { ...prev, ...updates };
      localStorage.setItem(SESSION_KEY, JSON.stringify(newState));
      return newState;
    });
  }, []);

  // Update last activity timestamp
  const updateActivity = useCallback(() => {
    updateSession({ lastActivity: Date.now() });
  }, [updateSession]);

  // Handle user activity
  useEffect(() => {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    
    const handleActivity = () => {
      updateActivity();
    };

    events.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [updateActivity]);

  // Check session timeout
  useEffect(() => {
    const checkSession = () => {
      const timeElapsed = Date.now() - state.lastActivity;
      
      if (state.isAuthenticated) {
        if (timeElapsed >= ACTIVITY_TIMEOUT) {
          // Session expired
          notificationService.warning('Your session has expired. Please log in again.');
          handleLogout();
        } else if (timeElapsed >= ACTIVITY_TIMEOUT - ACTIVITY_WARNING_THRESHOLD) {
          // Show warning 5 minutes before expiry
          const minutesLeft = Math.ceil((ACTIVITY_TIMEOUT - timeElapsed) / 60000);
          notificationService.warning(
            `Your session will expire in ${minutesLeft} minute${minutesLeft > 1 ? 's' : ''}. ` +
            'Please save your work.'
          );
        }
      }
    };

    const interval = setInterval(checkSession, ACTIVITY_CHECK_INTERVAL);
    return () => clearInterval(interval);
  }, [state.isAuthenticated, state.lastActivity]);

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
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, [updateSession]);

  const handleLogout = useCallback(() => {
    authService.logout();
    localStorage.removeItem(SESSION_KEY);
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      lastActivity: Date.now()
    });
    navigate('/login');
  }, [navigate]);

  const refreshSession = useCallback(async () => {
    if (!state.isAuthenticated) return;
    
    try {
      updateActivity();
      // Here you could also refresh the auth token if using JWT
    } catch (error) {
      console.error('Error refreshing session:', error);
      handleLogout();
    }
  }, [state.isAuthenticated, updateActivity, handleLogout]);

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

// Hook for requiring authentication
export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  return { isAuthenticated, isLoading };
}

// Hook for preventing authenticated users from accessing certain routes
export function usePreventAuthAccess() {
  const { isAuthenticated, isLoading } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/officers');
    }
  }, [isAuthenticated, isLoading, navigate]);

  return { isAuthenticated, isLoading };
}
