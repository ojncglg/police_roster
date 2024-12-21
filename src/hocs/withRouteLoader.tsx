import React, { FC, useEffect, useState } from 'react';
import Loading from '../components/common/Loading';

interface WithRouteLoaderProps {
  loadingMessage?: string;
  requireAuth?: boolean;
}

const withRouteLoader = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  { loadingMessage = 'Loading...' }: WithRouteLoaderProps = {}
) => {
  const WithRouteLoader: FC<P> = (props) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      // Simulate loading delay
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1000); // Adjust the delay as needed

      return () => clearTimeout(timer);
    }, []);

    if (loading) {
      return <Loading variant="screen" message={loadingMessage} />;
    }

    return <WrappedComponent {...(props as P)} />;
  };

  return WithRouteLoader;
};

export default withRouteLoader;
