import type { ButtonHTMLAttributes, ReactNode } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'outline';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  icon?: ReactNode;
  fullWidth?: boolean;
}

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  icon,
  fullWidth = false,
  className = '',
  ...props
}: ButtonProps) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors duration-200';

  const variantStyles = {
    primary: 'bg-police-yellow hover:bg-police-gold text-black focus:ring-police-yellow',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white dark:bg-gray-700 dark:hover:bg-gray-600 focus:ring-gray-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white dark:bg-red-700 dark:hover:bg-red-600 focus:ring-red-500',
    success: 'bg-green-600 hover:bg-green-700 text-white dark:bg-green-700 dark:hover:bg-green-600 focus:ring-green-500',
    warning: 'bg-yellow-600 hover:bg-yellow-700 text-white dark:bg-yellow-700 dark:hover:bg-yellow-600 focus:ring-yellow-500',
    outline: 'border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-police-yellow'
  };

  const sizeStyles = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg'
  };

  const disabledStyles = 'opacity-50 cursor-not-allowed';
  const widthStyles = fullWidth ? 'w-full' : '';

  const getSpinnerColor = () => {
    if (variant === 'primary') return 'police-yellow';
    if (variant === 'outline') return 'primary';
    return 'white';
  };

  return (
    <button
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${(disabled || loading) ? disabledStyles : ''}
        ${widthStyles}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <LoadingSpinner 
            size="small" 
            color={getSpinnerColor()}
            className="mr-2"
          />
          {children}
        </>
      ) : (
        <>
          {icon && <span className="mr-2">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};

export const IconButton = ({
  icon,
  variant = 'outline',
  size = 'medium',
  loading = false,
  disabled = false,
  className = '',
  ...props
}: Omit<ButtonProps, 'children' | 'fullWidth'> & { icon: ReactNode }) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors duration-200';

  const variantStyles = {
    primary: 'bg-police-yellow hover:bg-police-gold text-black focus:ring-police-yellow',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white dark:bg-gray-700 dark:hover:bg-gray-600 focus:ring-gray-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white dark:bg-red-700 dark:hover:bg-red-600 focus:ring-red-500',
    success: 'bg-green-600 hover:bg-green-700 text-white dark:bg-green-700 dark:hover:bg-green-600 focus:ring-green-500',
    warning: 'bg-yellow-600 hover:bg-yellow-700 text-white dark:bg-yellow-700 dark:hover:bg-yellow-600 focus:ring-yellow-500',
    outline: 'border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-police-yellow'
  };

  const sizeStyles = {
    small: 'p-1',
    medium: 'p-2',
    large: 'p-3'
  };

  const iconSizes = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
    large: 'w-6 h-6'
  };

  const disabledStyles = 'opacity-50 cursor-not-allowed';

  const getSpinnerColor = () => {
    if (variant === 'primary') return 'police-yellow';
    if (variant === 'outline') return 'primary';
    return 'white';
  };

  return (
    <button
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${(disabled || loading) ? disabledStyles : ''}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <LoadingSpinner 
          size="small" 
          color={getSpinnerColor()}
        />
      ) : (
        <span className={iconSizes[size]}>{icon}</span>
      )}
    </button>
  );
};

export default Button;
