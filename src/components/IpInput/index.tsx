import React, { useEffect, useMemo, useRef, useState } from 'react';

interface IpInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  containerClassName?: string;
  inputSize?: 'SM' | 'MD' | 'LG' | 'XL' | 'FULL';
}

const inputBaseClasses = `
  px-3
  h-14
  flex-1 min-w-0
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
  focus:border-blue-500
  transition-all
  duration-200
  text-xl
  text-center
`;

const dotClasses = 'text-gray-500 dark:text-gray-400 px-1 select-none text-4xl';

export default function IpInput({ label, value, onChange, error, required, containerClassName }: IpInputProps) {
  const inputSize = 'FULL';
  const sizeClasses: Record<'SM' | 'MD' | 'LG' | 'XL' | 'FULL', string> = {
    SM: ' h-14 max-w-[8rem]',
    MD: ' h-14 max-w-[12rem]',
    LG: ' h-14 max-w-[16rem]',
    XL: ' h-14 max-w-[20rem]',
    FULL: ' h-14 w-full',
  };
  const initialParts = useMemo(() => (value ? value.split('.').slice(0, 4) : []), [value]);
  const [parts, setParts] = useState<string[]>([
    initialParts[0] ?? '',
    initialParts[1] ?? '',
    initialParts[2] ?? '',
    initialParts[3] ?? ''
  ]);

  const inputsRef = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  useEffect(() => {
    const vParts = (value ? value.split('.').slice(0, 4) : []);
    setParts([
      vParts[0] ?? '',
      vParts[1] ?? '',
      vParts[2] ?? '',
      vParts[3] ?? ''
    ]);
  }, [value]);

  const clamp255 = (p: string): string => {
    if (p === '') return '';
    const num = parseInt(p, 10);
    if (Number.isNaN(num)) return '';
    if (num > 255) return '255';
    return String(num);
  };

  const emitChange = (nextParts: string[]) => {
    const compact = nextParts.map(p => p.trim()).filter((_, idx) => true);
    const joined = compact.join('.');
    onChange(joined);
  };

  const handlePartChange = (index: number, raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 3);
    const clamped = clamp255(digits);
    const next = [...parts];
    next[index] = clamped;
    setParts(next);
    emitChange(next);

    if (clamped.length === 3 && index < 3) {
      inputsRef[index + 1].current?.focus();
      inputsRef[index + 1].current?.select();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && parts[index] === '' && index > 0) {
      e.preventDefault();
      inputsRef[index - 1].current?.focus();
    }
    if (e.key === '.' && index < 3) {
      e.preventDefault();
      inputsRef[index + 1].current?.focus();
      inputsRef[index + 1].current?.select();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData('text');
    if (/^[0-9.]+$/.test(text)) {
      e.preventDefault();
      const pasted = text
        .replace(/[^0-9.]/g, '')
        .split('.')
        .slice(0, 4)
        .map(p => clamp255(p.slice(0, 3)));
      const next = [pasted[0] ?? '', pasted[1] ?? '', pasted[2] ?? '', pasted[3] ?? ''];
      setParts(next);
      emitChange(next);
    }
  };

  return (
    <div className={`flex flex-col gap-1 ${containerClassName ?? ''}`}>
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className={`flex items-center gap-1 ${sizeClasses[inputSize]}`}>
        {parts.map((part, idx) => (
          <React.Fragment key={idx}>
            <input
              ref={inputsRef[idx]}
              className={`${inputBaseClasses} ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
              value={part}
              onChange={(e) => handlePartChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              onPaste={handlePaste}
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="000"
              maxLength={3}
              aria-label={`Octeto ${idx + 1}`}
            />
            {idx < 3 && <span className={dotClasses}>.</span>}
          </React.Fragment>
        ))}
      </div>
      {error && (
        <span className="text-sm text-red-500 mt-1">{error}</span>
      )}
    </div>
  );
}


