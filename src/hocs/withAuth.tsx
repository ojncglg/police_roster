import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

export function withAuth<P extends object>(WrappedComponent: React.ComponentType<P>) {
  const WithAuthComponent = (props: P) => {
    const navigate = useNavigate();

    useEffect(() => {
      authService.requireAuth(navigate);
    }, [navigate]);

    if (!authService.isAuthenticated()) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  WithAuthComponent.displayName = `WithAuth(${
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  })`;

  return WithAuthComponent;
}
