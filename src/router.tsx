/**
 * @file router.tsx
 * @description Defines the application's routing configuration using React Router.
 * Implements protected routes, lazy loading, and authentication-based navigation.
 */

import { lazy } from 'react';
import { Navigate, createHashRouter } from 'react-router-dom';
import { AuthNavigation } from './components/auth/AuthNavigation';
import DefaultError from './components/common/DefaultError';
import AppLayout from './components/layout/AppLayout';
import { withAuth } from './hocs/withAuth';
import withRouteLoader from './hocs/withRouteLoader'; // Importing withRouteLoader
import LoginView from './views/LoginView';

/**
 * Lazy-loaded view components
 * Using React.lazy for code splitting to improve initial load performance
 * Each route is loaded on-demand when the user navigates to it
 */
const DashboardView = lazy(() => import('./views/DashboardView'));
const OfficersView = lazy(() => import('./views/OfficersView'));
const RosterView = lazy(() => import('./views/RosterView'));
const DailyRosterView = lazy(() => import('./views/DailyRosterView'));
const DocumentationView = lazy(() => import('./views/DocumentationView'));
const SickTimeView = lazy(() => import('./views/SickTimeView'));

/**
 * Protected Route Components
 * Each view is wrapped with:
 * 1. Authentication HOC (withAuth) - Ensures user is authenticated
 * 2. Route Loader HOC (withRouteLoader) - Provides loading states during component/data fetch
 */
const ProtectedDashboardView = withRouteLoader(withAuth(DashboardView), {
    requireAuth: true,
    loadingMessage: 'Loading dashboard...',
});

const ProtectedOfficersView = withRouteLoader(withAuth(OfficersView), {
    requireAuth: true,
    loadingMessage: 'Loading officer management...',
});

const ProtectedRosterView = withRouteLoader(withAuth(RosterView), {
    requireAuth: true,
    loadingMessage: 'Loading roster management...',
});

const ProtectedDailyRosterView = withRouteLoader(withAuth(DailyRosterView), {
    requireAuth: true,
    loadingMessage: 'Loading daily roster...',
});

const ProtectedDocumentationView = withRouteLoader(withAuth(DocumentationView), {
    requireAuth: true,
    loadingMessage: 'Loading documentation...',
});

const ProtectedSickTimeView = withRouteLoader(withAuth(SickTimeView), {
    requireAuth: true,
    loadingMessage: 'Loading sick time management...',
});

/**
 * Creates the application router configuration
 *
 * @param isAuthenticated - Boolean indicating if user is authenticated
 * @returns Router configuration with protected routes and authentication handling
 *
 * Router Structure:
 * - Root (/) -> Redirects to /dashboard or /login based on auth status
 * - /login -> Login page (redirects to dashboard if already authenticated)
 * - /dashboard/* -> Protected routes requiring authentication:
 *   - /dashboard (index) -> Dashboard view
 *   - /dashboard/officers -> Officer management
 *   - /dashboard/roster -> Roster management
 *   - /dashboard/daily-roster -> Daily roster view
 *   - /dashboard/docs -> Documentation
 *   - /dashboard/sick-time -> Sick time management
 */
export function createAppRouter(isAuthenticated: boolean) {
    return createHashRouter([
        {
            // Root element handling auth navigation
            element: <AuthNavigation />,
            errorElement: <DefaultError />,
            children: [
                {
                    // Root path redirect
                    path: '/',
                    element: <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />,
                },
                {
                    // Login route with auth check
                    path: 'login',
                    element: isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginView />,
                },
                {
                    // Protected dashboard routes
                    path: 'dashboard',
                    element: isAuthenticated ? <AppLayout /> : <Navigate to="/login" replace />,
                    children: [
                        {
                            index: true,
                            element: <ProtectedDashboardView />,
                        },
                        {
                            path: 'officers',
                            element: <ProtectedOfficersView />,
                        },
                        {
                            path: 'roster',
                            element: <ProtectedRosterView />,
                        },
                        {
                            path: 'daily-roster',
                            element: <ProtectedDailyRosterView />,
                        },
                        {
                            path: 'docs',
                            element: <ProtectedDocumentationView />,
                        },
                        {
                            path: 'sick-time',
                            element: <ProtectedSickTimeView />,
                        },
                    ],
                },
            ],
        },
    ]);
}
