import { createHashRouter, Navigate } from 'react-router-dom';
import { lazy } from 'react';
import AppLayout from './components/layout/AppLayout';
import LoginView from './views/LoginView';
import DefaultError from './components/common/DefaultError';
import { withAuth } from './hocs/withAuth';
import { withRouteLoader } from './components/common/RouteLoader';
import { AuthNavigation } from './components/auth/AuthNavigation';

// Lazy load route components
const DashboardView = lazy(() => import('./views/DashboardView'));
const OfficersView = lazy(() => import('./views/OfficersView'));
const RosterView = lazy(() => import('./views/RosterView'));
const DailyRosterView = lazy(() => import('./views/DailyRosterView'));
const DocumentationView = lazy(() => import('./views/DocumentationView'));

// Wrap components with auth and loading
const ProtectedDashboardView = withRouteLoader(withAuth(DashboardView), {
  requireAuth: true,
  loadingMessage: 'Loading dashboard...'
});

const ProtectedOfficersView = withRouteLoader(withAuth(OfficersView), {
  requireAuth: true,
  loadingMessage: 'Loading officer management...'
});

const ProtectedRosterView = withRouteLoader(withAuth(RosterView), {
  requireAuth: true,
  loadingMessage: 'Loading roster management...'
});

const ProtectedDailyRosterView = withRouteLoader(withAuth(DailyRosterView), {
  requireAuth: true,
  loadingMessage: 'Loading daily roster...'
});

const ProtectedDocumentationView = withRouteLoader(withAuth(DocumentationView), {
  requireAuth: true,
  loadingMessage: 'Loading documentation...'
});

export function createAppRouter(isAuthenticated: boolean) {
  return createHashRouter([
    {
      element: <AuthNavigation />,
      errorElement: <DefaultError />,
      children: [
        {
          path: '/',
          element: <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />
        },
        {
          path: 'login',
          element: isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginView />
        },
        {
          path: 'dashboard',
          element: isAuthenticated ? <AppLayout /> : <Navigate to="/login" replace />,
          children: [
            {
              index: true,
              element: <ProtectedDashboardView />
            },
            {
              path: 'officers',
              element: <ProtectedOfficersView />
            },
            {
              path: 'roster',
              element: <ProtectedRosterView />
            },
            {
              path: 'daily-roster',
              element: <ProtectedDailyRosterView />
            },
            {
              path: 'docs',
              element: <ProtectedDocumentationView />
            }
          ]
        }
      ]
    }
  ]);
}
