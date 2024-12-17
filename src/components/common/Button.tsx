import { ButtonHTMLAttributes, ReactNode } from 'react';
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
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200';

  const variantStyles = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
    warning: 'bg-yellow-600 hover:bg-yellow-700 text-white focus:ring-yellow-500',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500'
  };

  const sizeStyles = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg'
  };

  const disabledStyles = 'opacity-50 cursor-not-allowed';
  const widthStyles = fullWidth ? 'w-full' : '';

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
            color="white" 
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
  const baseStyles = 'inline-flex items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200';

  const variantStyles = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
    warning: 'bg-yellow-600 hover:bg-yellow-700 text-white focus:ring-yellow-500',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500'
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
          color={variant === 'outline' ? 'primary' : 'white'} 
        />
      ) : (
        <span className={iconSizes[size]}>{icon}</span>
      )}
    </button>
  );
};

export default Button;
