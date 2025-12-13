/**
 * Reusable Button Component
 */

import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
}

/**
 * Custom button component with predefined styles
 */
const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  fullWidth = false,
  className = '',
}) => {
  const baseClasses = 'px-6 py-2.5 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500 disabled:bg-purple-300',
    secondary: 'bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-400 disabled:bg-orange-300',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-400 disabled:bg-red-300',
    success: 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-400 disabled:bg-green-300',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${widthClass} ${className} ${
        disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
      }`}
    >
      {children}
    </button>
  );
};

export default Button;