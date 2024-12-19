import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardView = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to today's daily roster when dashboard loads
    const today = new Date().toISOString().split('T')[0];
    navigate(`/dashboard/daily-roster?date=${today}`, { replace: true });
  }, [navigate]);

  // Return null since we're redirecting immediately
  return null;
};

export default DashboardView;
