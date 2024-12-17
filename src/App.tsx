import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { createHashRouter, Navigate } from 'react-router-dom';
import { useSessionContext } from './contexts/SessionContext';
import { useAppSettings } from './hooks/useAppSettings';
import AppLayout from './components/layout/AppLayout';
import LoginView from './views/LoginView';
import OfficersView from './views/OfficersView';
import RosterView from './views/RosterView';
import DocumentationView from './views/DocumentationView';
import DefaultError from './components/common/DefaultError';
import LoadingScreen from './components/common/LoadingScreen';

const App: React.FC = () => {
  const { isAuthenticated, isLoading } = useSessionContext();
  const { settings } = useAppSettings();

  // Apply theme settings
  useEffect(() => {
    if (settings.theme.mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme.mode]);

  // Create router configuration based on auth state
  const router = createHashRouter([
    {
      path: '/',
      element: <Navigate to={isAuthenticated ? '/officers' : '/login'} replace />,
      errorElement: <DefaultError />,
    },
    {
      path: '/login',
      element: isAuthenticated ? <Navigate to="/officers" replace /> : <LoginView />,
      errorElement: <DefaultError />,
    },
    {
      path: '/',
      element: isAuthenticated ? <AppLayout /> : <Navigate to="/login" replace />,
      errorElement: <DefaultError />,
      children: [
        {
          path: 'officers',
          element: <OfficersView />,
        },
        {
          path: 'roster',
          element: <RosterView />,
        },
        {
          path: 'docs',
          element: <DocumentationView />,
        },
      ],
    },
  ]);

  if (isLoading) {
    return <LoadingScreen message="Loading application..." />;
  }

  return <RouterProvider router={router} />;
};

export default App;
