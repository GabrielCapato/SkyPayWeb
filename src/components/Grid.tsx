import React from 'react';

interface RowProps {
  children: React.ReactNode;
  className?: string;
  noGutters?: boolean;
  align?: 'start' | 'center' | 'end';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
}

interface ColProps {
  children: React.ReactNode;
  className?: string;
  xs?: number | 'auto';
  sm?: number | 'auto';
  md?: number | 'auto';
  lg?: number | 'auto';
  xl?: number | 'auto';
  xxl?: number | 'auto';
  order?: number;
  offset?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    xxl?: number;
  };
}

export const Row: React.FC<RowProps> = ({ 
  children, 
  className = '',
  noGutters = false,
  align,
  justify
}) => {
  const getRowClasses = () => {
    const classes = ['row'];
    
    if (noGutters) classes.push('g-0');
    if (align) classes.push(`align-items-${align}`);
    if (justify) classes.push(`justify-content-${justify}`);
    
    return classes.join(' ');
  };

  return (
    <div className={`${getRowClasses()} ${className}`}>
      {children}
    </div>
  );
};

export const Col: React.FC<ColProps> = ({ 
  children, 
  className = '',
  xs = 12,
  sm,
  md,
  lg,
  xl,
  xxl,
  order,
  offset
}) => {
  const getColClasses = () => {
    const classes = ['col'];

    // Tamanhos das colunas (ordem correta dos breakpoints)
    if (xs === 'auto') classes.push('col-auto');
    else if (xs) classes.push(`col-${xs}`);
    
    if (sm === 'auto') classes.push('col-sm-auto');
    else if (sm) classes.push(`col-sm-${sm}`);
    
    if (md === 'auto') classes.push('col-md-auto');
    else if (md) classes.push(`col-md-${md}`);
    
    if (lg === 'auto') classes.push('col-lg-auto');
    else if (lg) classes.push(`col-lg-${lg}`);
    
    if (xl === 'auto') classes.push('col-xl-auto');
    else if (xl) classes.push(`col-xl-${xl}`);
    
    if (xxl === 'auto') classes.push('col-xxl-auto');
    else if (xxl) classes.push(`col-xxl-${xxl}`);

    // Offset (ordem correta dos breakpoints)
    if (offset) {
      if (offset.xs) classes.push(`offset-${offset.xs}`);
      if (offset.sm) classes.push(`offset-sm-${offset.sm}`);
      if (offset.md) classes.push(`offset-md-${offset.md}`);
      if (offset.lg) classes.push(`offset-lg-${offset.lg}`);
      if (offset.xl) classes.push(`offset-xl-${offset.xl}`);
      if (offset.xxl) classes.push(`offset-xxl-${offset.xxl}`);
    }

    // Order
    if (order) classes.push(`order-${order}`);

    return classes.join(' ');
  };

  return (
    <div className={`${getColClasses()} ${className}`}>
      {children}
    </div>
  );
}; 