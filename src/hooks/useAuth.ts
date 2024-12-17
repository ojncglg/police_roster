import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, type User, type LoginCredentials } from '../services/authService';

export function useAuth() {
  const [user, setUser] = useState<User | null>(authService.getUser());
  const navigate = useNavigate();

  const login = async (credentials: LoginCredentials) => {
    const user = await authService.login(credentials);
    setUser(user);
    return user;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    navigate('/login');
  };

  useEffect(() => {
    // Update last login time periodically
    const interval = setInterval(() => {
      if (authService.isAuthenticated()) {
        authService.updateLastLogin();
      }
    }, 5 * 60 * 1000); // Every 5 minutes

    return () => clearInterval(interval);
  }, []);

  return {
    user,
    isAuthenticated: authService.isAuthenticated(),
    login,
    logout
  };
}
