import { useAuthNavigation } from '../../hooks/useAuthNavigation';
import { Outlet } from 'react-router-dom';
import { useSessionContext } from '../../contexts/SessionContext';
import LoadingScreen from '../common/LoadingScreen';

export function AuthNavigation() {
  const { isLoading } = useSessionContext();
  useAuthNavigation();
  
  if (isLoading) {
    return <LoadingScreen message="Loading application..." />;
  }

  return <Outlet />;
}
