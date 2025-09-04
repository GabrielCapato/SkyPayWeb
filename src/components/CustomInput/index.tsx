import React from 'react';
import { PatternFormat } from 'react-number-format';
import { motion } from 'framer-motion';

interface CustomInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'mask'> {
  inputSize?: 'SM' | 'MD' | 'LG' | 'XL' | 'FULL';
  label?: string;
  error?: string;
  className?: string;
  containerClassName?: string;
  mask?: string;
  maskPlaceholder?: string;
}

const CustomInput: React.FC<CustomInputProps> = ({
  inputSize = 'FULL',
  label,
  error,
  className = '',
  containerClassName = '',
  mask,
  maskPlaceholder = '_',
  placeholder,
  ...props
}) => {
  const sizeClasses = {
    SM: ' h-14 max-w-[8rem]',
    MD: ' h-14 max-w-[12rem]',
    LG: ' h-14 max-w-[16rem]',
    XL: ' h-14 max-w-[20rem]',
    FULL: ' h-14 w-full',
  };

  const inputClasses = `
    px-4
    h-12
    rounded-lg
    border
    border-gray-300
    dark:border-gray-600
    bg-white
    dark:bg-gray-800
    text-gray-900
    dark:text-gray-100
    focus:outline-none
    focus:ring-2
    focus:ring-blue-500
    focus:border-transparent
    transition-all
    duration-200
    text-lg
    ${sizeClasses[inputSize]}
    ${error ? 'border-red-500' : ''}
    ${className}
  `;

  const getFormat = (mask?: string) => {
    switch (mask) {
      case '99.999.999/9999-99':
        return '##.###.###/####-##';
      case '(99) 99999-9999':
        return '(##) #####-####';
      case '99999-999':
        return '#####-###';
      default:
        return mask;
    }
  };

  const getDefaultPlaceholder = (mask?: string) => {
    switch (mask) {
      case '99.999.999/9999-99':
        return '00.000.000/0000-00';
      case '(99) 99999-9999':
        return '(00) 00000-0000';
      case '99999-999':
        return '00000-000';
      default:
        return placeholder;
    }
  };

  return (
    <div className={`flex flex-col gap-1 w-full ${containerClassName}`}>
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
          {label}
        </label>
      )}
      {mask ? (
        <PatternFormat
          format={getFormat(mask) || ''}
          mask={maskPlaceholder}
          className={inputClasses}
          value={props.value as string}
          onChange={props.onChange as React.ChangeEventHandler<HTMLInputElement>}
          placeholder={getDefaultPlaceholder(mask)}
          disabled={props.disabled}
          required={props.required}
        />
      ) : (
        <input
          className={inputClasses}
          placeholder={placeholder}
          {...props}
        />
      )}
      {error && (
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-500 mt-1"
        >
          {error}
        </motion.span>
      )}
    </div>
  );
};

export default CustomInput; 