import React from 'react';

interface NumberDisplayProps {
  value: number;
  language?: 'ar' | 'en';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  variant?: 'default' | 'gradient' | 'neon' | 'muted';
  format?: 'number' | 'percentage' | 'decimal';
  decimalPlaces?: number;
}

/**
 * NumberDisplay - مكون موحد لعرض الأرقام في جميع الحالات
 * يضمن تناسق الأرقام في اللغتين العربية والإنجليزية
 */
export const NumberDisplay: React.FC<NumberDisplayProps> = ({
  value,
  language = 'en',
  className = '',
  size = 'md',
  variant = 'default',
  format = 'number',
  decimalPlaces = 0,
}) => {
  // تنسيق الرقم
  const formatNumber = (num: number): string => {
    let formatted: string;

    switch (format) {
      case 'percentage':
        formatted = `${num.toFixed(decimalPlaces)}%`;
        break;
      case 'decimal':
        formatted = num.toFixed(decimalPlaces);
        break;
      case 'number':
      default:
        formatted = num.toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US', {
          minimumFractionDigits: 0,
          maximumFractionDigits: decimalPlaces,
        });
        break;
    }

    return formatted;
  };

  // حجم الخط
  const sizeClasses: Record<string, string> = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
  };

  // نمط العرض
  const variantClasses: Record<string, string> = {
    default: 'text-white font-semibold',
    gradient: 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 font-bold',
    neon: 'text-cyan-400 font-bold drop-shadow-lg drop-shadow-cyan-500/50',
    muted: 'text-gray-400 font-medium',
  };

  const formattedValue = formatNumber(value);

  return (
    <span
      className={`
        font-mono tracking-wider
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      {formattedValue}
    </span>
  );
};

export default NumberDisplay;
