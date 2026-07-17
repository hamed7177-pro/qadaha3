import React from 'react';

interface RiyalSymbolProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'inline';
}

export default function RiyalSymbol({ className = '', size = 'inline' }: RiyalSymbolProps) {
  // Determine dimensions based on size prop
  let sizeClass = 'w-[1em] h-[1.12em]';
  if (size === 'sm') {
    sizeClass = 'w-3.5 h-4';
  } else if (size === 'md') {
    sizeClass = 'w-4 h-4.5';
  } else if (size === 'lg') {
    sizeClass = 'w-5 h-5.5';
  }

  return (
    <svg 
      viewBox="0 0 1124.14 1256.39" 
      className={`inline-block align-middle fill-current ${sizeClass} ${className}`}
      aria-label="ريال سعودي"
      style={{ verticalAlign: 'middle', marginTop: '-0.15em' }}
    >
      <path d="M699.62,1113.02h0c-20.06,44.48-33.32,92.75-38.4,143.37l424.51-90.24c20.06-44.47,33.31-92.75,38.4-143.37l-424.51,90.24Z"/>
      <path d="M1085.73,895.8c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.33v-135.2l292.27-62.11c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.27V66.13c-50.67,28.45-95.67,66.32-132.25,110.99v403.35l-132.25,28.11V0c-50.67,28.44-95.67,66.32-132.25,110.99v525.69l-295.91,62.88c-20.06,44.47-33.33,92.75-38.42,143.37l334.33-71.05v170.26l-358.3,76.14c-20.06,44.47-33.32,92.75-38.4,143.37l375.04-79.7c30.53-6.35,56.77-24.4,73.83-49.24l68.78-101.97v-.02c7.14-10.55,11.3-23.27,11.3-36.97v-149.98l132.25-28.11v270.4l424.53-90.28Z"/>
    </svg>
  );
}

export function formatCurrency(value: number): string {
  if (value === undefined || value === null || isNaN(value)) return '0';
  // Round to max 1 decimal place, convert to number, and format with commas
  return Number(value.toFixed(1)).toLocaleString('en-US');
}
