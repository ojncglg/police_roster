/**
 * @file App.tsx
 * @description Root component of the NCCPD Roster application. This component serves as the 
 * entry point and handles the initial routing setup based on authentication state.
 */

import { RouterProvider } from 'react-router-dom';
import { useSessionContext } from './contexts/SessionContext';
import { createAppRouter } from './router';
import LoadingScreen from './components/common/LoadingScreen';

/**
 * App Component
 * 
 * @component
 * @description Main application component that:
 * 1. Manages authentication state through SessionContext
 * 2. Creates router configuration based on authentication status
 * 3. Shows loading screen during initial application load
 * 4. Renders the appropriate route based on auth state
 * 
 * @returns {JSX.Element} The rendered application with routing configuration
 */
const App = () => {
  // Get authentication status and loading state from session context
  const { isAuthenticated, isLoading } = useSessionContext();
  
  // Create router configuration based on authentication status
  const router = createAppRouter(isAuthenticated);

  // Show loading screen while application is initializing
  if (isLoading) {
    return <LoadingScreen message="Loading application..." />;
  }

  // Render router with configured routes
  return <RouterProvider router={router} />;
};

export default App;
