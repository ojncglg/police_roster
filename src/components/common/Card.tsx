import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'small' | 'medium' | 'large';
  variant?: 'default' | 'outlined' | 'elevated';
  header?: ReactNode;
  footer?: ReactNode;
  onClick?: () => void;
}

const Card = ({
  children,
  className = '',
  padding = 'medium',
  variant = 'default',
  header,
  footer,
  onClick
}: CardProps) => {
  const baseStyles = 'rounded-lg overflow-hidden';

  const variantStyles = {
    default: 'bg-white',
    outlined: 'bg-white border border-gray-200',
    elevated: 'bg-white shadow-md'
  };

  const paddingStyles = {
    none: '',
    small: 'p-3',
    medium: 'p-4',
    large: 'p-6'
  };

  const interactionStyles = onClick ? 'cursor-pointer hover:shadow-lg transition-shadow duration-200' : '';

  return (
    <div
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${interactionStyles}
        ${className}
      `}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {header && (
        <div className={`border-b border-gray-200 ${paddingStyles[padding]}`}>
          {header}
        </div>
      )}
      <div className={paddingStyles[padding]}>
        {children}
      </div>
      {footer && (
        <div className={`border-t border-gray-200 ${paddingStyles[padding]}`}>
          {footer}
        </div>
      )}
    </div>
  );
};

export const CardHeader = ({
  title,
  subtitle,
  action,
  className = ''
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  className?: string;
}) => {
  return (
    <div className={`flex justify-between items-start ${className}`}>
      <div>
        <h3 className="text-lg font-medium text-gray-900">
          {title}
        </h3>
        {subtitle && (
          <p className="mt-1 text-sm text-gray-500">
            {subtitle}
          </p>
        )}
      </div>
      {action && (
        <div className="ml-4">
          {action}
        </div>
      )}
    </div>
  );
};

export const CardContent = ({
  children,
  className = ''
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};

export const CardFooter = ({
  children,
  className = '',
  align = 'right'
}: {
  children: ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
}) => {
  const alignStyles = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end'
  };

  return (
    <div className={`flex items-center ${alignStyles[align]} ${className}`}>
      {children}
    </div>
  );
};

export const CardGrid = ({
  children,
  columns = 1,
  gap = 'medium',
  className = ''
}: {
  children: ReactNode;
  columns?: 1 | 2 | 3 | 4;
  gap?: 'small' | 'medium' | 'large';
  className?: string;
}) => {
  const columnStyles = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  const gapStyles = {
    small: 'gap-3',
    medium: 'gap-4',
    large: 'gap-6'
  };

  return (
    <div className={`grid ${columnStyles[columns]} ${gapStyles[gap]} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
