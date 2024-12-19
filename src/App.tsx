import { RouterProvider } from 'react-router-dom';
import { useSessionContext } from './contexts/SessionContext';
import { createAppRouter } from './router';
import LoadingScreen from './components/common/LoadingScreen';

const App = () => {
  const { isAuthenticated, isLoading } = useSessionContext();
  const router = createAppRouter(isAuthenticated);

  if (isLoading) {
    return <LoadingScreen message="Loading application..." />;
  }

  return <RouterProvider router={router} />;
};

export default App;
