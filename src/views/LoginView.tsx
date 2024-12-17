import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../hooks/useForm';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Card from '../components/common/Card';
import ThemeToggle from '../components/common/ThemeToggle';
import { notificationService } from '../services/notificationService';
import type { LoginCredentials } from '../services/authService';

const LoginView = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const { values, handleChange, handleSubmit } = useForm<LoginCredentials>({
    initialValues: {
      username: '',
      password: ''
    },
    onSubmit: async (data) => {
      setIsLoading(true);
      try {
        await login(data);
        notificationService.success('Login successful');
        navigate('/officers');
      } catch (error) {
        if (error instanceof Error) {
          notificationService.error(error.message);
        }
      } finally {
        setIsLoading(false);
      }
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-police-black via-gray-900 to-gray-800 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle showLabel />
      </div>

      <div className="max-w-md w-full space-y-8">
        {/* Logo and Title */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-police-yellow flex items-center justify-center shadow-highlight">
              <svg 
                className="w-16 h-16 text-police-black" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" 
                />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-police-yellow">
            NCCPD Roster System
          </h2>
          <p className="mt-2 text-gray-400">
            Administrative Portal
          </p>
        </div>

        <Card className="py-8 px-4 shadow-highlight bg-white dark:bg-gray-800">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Username"
              name="username"
              type="text"
              required
              value={values.username}
              onChange={handleChange}
              autoComplete="username"
              className="form-input"
              leftIcon={
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
            />

            <Input
              label="Password"
              name="password"
              type="password"
              required
              value={values.password}
              onChange={handleChange}
              autoComplete="current-password"
              className="form-input"
              leftIcon={
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              }
            />

            <div>
              <Button
                type="submit"
                className="w-full btn-primary"
                loading={isLoading}
              >
                Sign In
              </Button>
            </div>
          </form>

          {import.meta.env.DEV && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Demo credentials: admin / admin
              </p>
            </div>
          )}
        </Card>

        <div className="text-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} NCCPD. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
