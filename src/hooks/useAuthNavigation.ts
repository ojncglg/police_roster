import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSessionContext } from '../contexts/SessionContext';

const PUBLIC_ROUTES = ['/login', '/forgot-password', '/reset-password'];
const DEFAULT_PRIVATE_ROUTE = '/officers';
const DEFAULT_PUBLIC_ROUTE = '/login';

export function useAuthNavigation() {
  const { isAuthenticated, isLoading } = useSessionContext();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isLoading) return;

    const isPublicRoute = PUBLIC_ROUTES.some(route => 
      location.pathname.startsWith(route)
    );

    if (!isAuthenticated && !isPublicRoute) {
      // Redirect to login if trying to access private route without auth
      navigate(DEFAULT_PUBLIC_ROUTE, {
        replace: true,
        state: { from: location.pathname }
      });
    } else if (isAuthenticated && isPublicRoute) {
      // Redirect to default private route if accessing public route while authenticated
      navigate(DEFAULT_PRIVATE_ROUTE, { replace: true });
    }
  }, [isAuthenticated, isLoading, location.pathname, navigate]);

  const navigateAfterLogin = () => {
    const from = location.state?.from as string || DEFAULT_PRIVATE_ROUTE;
    navigate(from, { replace: true });
  };

  const navigateAfterLogout = () => {
    navigate(DEFAULT_PUBLIC_ROUTE, { replace: true });
  };

  return {
    navigateAfterLogin,
    navigateAfterLogout
  };
}
