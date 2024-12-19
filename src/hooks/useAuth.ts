import { useCallback } from 'react';
import { useSessionContext } from '../contexts/SessionContext';
import { useAuthNavigation } from './useAuthNavigation';

export function useAuth() {
  const { user, isAuthenticated, isLoading, login, logout } = useSessionContext();
  const { navigateAfterLogout } = useAuthNavigation();

  const handleLogout = useCallback(() => {
    logout();
    navigateAfterLogout();
  }, [logout, navigateAfterLogout]);

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout: handleLogout
  };
}
