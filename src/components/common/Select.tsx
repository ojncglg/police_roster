import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  className?: string;
}

const Select: React.FC<SelectProps> = ({ options, className = '', ...props }) => {
  return (
    <select
      {...props}
      className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-police-yellow focus:ring-police-yellow sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 ${className}`}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
