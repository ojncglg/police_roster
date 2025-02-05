import { type InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled = false,
  ...props
}, ref) => {
  const baseInputStyles = `
    block rounded-md shadow-sm
    bg-white dark:bg-gray-800
    text-gray-900 dark:text-gray-100
    placeholder-gray-400 dark:placeholder-gray-500
    focus:ring-2 focus:ring-offset-0
    disabled:bg-gray-100 dark:disabled:bg-gray-900
    disabled:cursor-not-allowed
    transition-colors duration-200
  `;

  const inputStateStyles = error
    ? 'border-red-300 dark:border-red-500 text-red-900 dark:text-red-100 placeholder-red-300 dark:placeholder-red-500 focus:ring-red-500 focus:border-red-500'
    : 'border-gray-300 dark:border-gray-600 focus:ring-police-yellow focus:border-police-yellow';

  const widthStyles = fullWidth ? 'w-full' : '';

  const inputStyles = `
    ${baseInputStyles}
    ${inputStateStyles}
    ${widthStyles}
    ${leftIcon ? 'pl-10' : ''}
    ${rightIcon ? 'pr-10' : ''}
    ${className}
  `;

  return (
    <div className={widthStyles}>
      {label && (
        <label 
          htmlFor={props.id} 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 dark:text-gray-400 sm:text-sm">{leftIcon}</span>
          </div>
        )}
        <input
          ref={ref}
          className={inputStyles}
          disabled={disabled}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? `${props.id}-error` : helperText ? `${props.id}-helper-text` : undefined
          }
          {...props}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-500 dark:text-gray-400 sm:text-sm">{rightIcon}</span>
          </div>
        )}
      </div>
      {error && (
        <p 
          className="mt-1 text-sm text-red-600 dark:text-red-400" 
          id={`${props.id}-error`}
        >
          {error}
        </p>
      )}
      {helperText && !error && (
        <p 
          className="mt-1 text-sm text-gray-500 dark:text-gray-400" 
          id={`${props.id}-helper-text`}
        >
          {helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export const Select = forwardRef<HTMLSelectElement, 
  Omit<InputHTMLAttributes<HTMLSelectElement>, 'children'> & {
    label?: string;
    error?: string;
    helperText?: string;
    fullWidth?: boolean;
    options: Array<{ value: string; label: string }>;
  }
>(({
  label,
  error,
  helperText,
  fullWidth = false,
  options,
  className = '',
  disabled = false,
  ...props
}, ref) => {
  const baseSelectStyles = `
    block rounded-md shadow-sm
    bg-white dark:bg-gray-800
    text-gray-900 dark:text-gray-100
    focus:ring-2 focus:ring-offset-0
    disabled:bg-gray-100 dark:disabled:bg-gray-900
    disabled:cursor-not-allowed
    transition-colors duration-200
  `;

  const selectStateStyles = error
    ? 'border-red-300 dark:border-red-500 text-red-900 dark:text-red-100 focus:ring-red-500 focus:border-red-500'
    : 'border-gray-300 dark:border-gray-600 focus:ring-police-yellow focus:border-police-yellow';

  const widthStyles = fullWidth ? 'w-full' : '';

  const selectStyles = `
    ${baseSelectStyles}
    ${selectStateStyles}
    ${widthStyles}
    ${className}
  `;

  return (
    <div className={widthStyles}>
      {label && (
        <label 
          htmlFor={props.id} 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={selectStyles}
        disabled={disabled}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={
          error ? `${props.id}-error` : helperText ? `${props.id}-helper-text` : undefined
        }
        {...props}
      >
        {options.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      {error && (
        <p 
          className="mt-1 text-sm text-red-600 dark:text-red-400" 
          id={`${props.id}-error`}
        >
          {error}
        </p>
      )}
      {helperText && !error && (
        <p 
          className="mt-1 text-sm text-gray-500 dark:text-gray-400" 
          id={`${props.id}-helper-text`}
        >
          {helperText}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Input;
