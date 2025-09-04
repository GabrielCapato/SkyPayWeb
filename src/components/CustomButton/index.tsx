'use client';
import React, { useState } from 'react';

interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  buttonSize?: 'SM' | 'MD' | 'LG' | 'XL' | 'FULL';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onClick?: () => void | Promise<void>;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  buttonSize = 'MD',
  variant = 'primary',
  isLoading: externalLoading,
  leftIcon,
  rightIcon,
  children,
  className = '',
  disabled,
  onClick,
  ...props
}) => {
  const [internalLoading, setInternalLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const isLoading = externalLoading || internalLoading;

  const sizeClasses = {
    SM: 'h-14 px-3 text-sm',
    MD: 'h-14 px-4 text-base',
    LG: 'h-14 px-6 text-lg',
    XL: 'h-14 px-8 text-xl',
    FULL: 'h-14 w-full text-base',
  };

  const variantClasses = {
    primary: `
      bg-gradient-to-r from-blue-600 to-purple-600 
      hover:from-blue-700 hover:to-purple-700 
      active:from-blue-800 active:to-purple-800
      disabled:from-blue-300 disabled:to-purple-300
    `,
    secondary: `
      bg-gray-200 
      text-gray-800 
      hover:bg-gray-300 
      active:bg-gray-400
      disabled:bg-gray-100
      dark:bg-gray-700 
      dark:text-gray-100 
      dark:hover:bg-gray-600 
      dark:active:bg-gray-500
      dark:disabled:bg-gray-800
    `,
    outline: `
      border-2 
      border-blue-600 
      text-blue-600 
      hover:bg-blue-50 
      active:bg-blue-100
      disabled:border-blue-300 
      disabled:text-blue-300
      dark:border-blue-400 
      dark:text-blue-400 
      dark:hover:bg-blue-900/20 
      dark:active:bg-blue-900/30
    `,
    ghost: `
      text-blue-600 
      hover:bg-blue-50 
      active:bg-blue-100
      disabled:text-blue-300
      dark:text-blue-400 
      dark:hover:bg-blue-900/20 
      dark:active:bg-blue-900/30
    `,
  };

  const statusClasses = {
    success: `
      !bg-gradient-to-r !from-green-500 !to-emerald-600 
      !hover:from-green-600 !hover:to-emerald-700 
      !active:from-green-700 !active:to-emerald-800
      dark:!from-green-600 dark:!to-emerald-700 
      dark:!hover:from-green-700 dark:!hover:to-emerald-800 
      dark:!active:from-green-800 dark:!active:to-emerald-900
    `,
    error: `
      !bg-gradient-to-r !from-red-500 !to-rose-600 
      !hover:from-red-600 !hover:to-rose-700 
      !active:from-red-700 !active:to-rose-800
      dark:!from-red-600 dark:!to-rose-700 
      dark:!hover:from-red-700 dark:!hover:to-rose-800 
      dark:!active:from-red-800 dark:!active:to-rose-900
    `,
  };

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      const result = onClick();
      
      // Se o resultado for uma Promise, é uma função assíncrona
      if (result instanceof Promise) {
        try {
          setInternalLoading(true);
          setStatus('idle');
          await result;
          setInternalLoading(false);
          setStatus('success');
        } catch (error) {
          setInternalLoading(false);
          setStatus('error');
        } finally {
          setTimeout(() => {
            setStatus('idle');
          }, 2000);
        }
      }
    }
  };

  return (
    <button
      className={`
        inline-flex
        items-center
        justify-center
        gap-2
        font-medium
        rounded-lg
        text-white
        transition-all
        duration-300
        disabled:cursor-not-allowed
        disabled:opacity-50
        transform
        hover:scale-[1.02]
        active:scale-[0.98]
        ${sizeClasses[buttonSize]}
        ${status !== 'idle' ? statusClasses[status] : variantClasses[variant]}
        ${className}
      `}
      disabled={disabled || isLoading}
      onClick={handleClick}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : status === 'success' ? (
        <svg
          className="animate-scale-check h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      ) : status === 'error' ? (
        <svg
          className="animate-scale-x h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <>
          {leftIcon}
          {children}
          {rightIcon}
        </>
      )}
    </button>
  );
};

export default CustomButton;
