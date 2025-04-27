import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '',
  onClick
}: ButtonProps) {
  const variantClass = {
    'primary': 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white',
    'secondary': 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm',
    'outline': 'bg-transparent border border-purple-500 text-purple-500 hover:bg-purple-500/10',
  }[variant];
  
  const sizeClass = {
    'sm': 'text-sm py-2 px-3',
    'md': 'text-base py-2 px-5',
    'lg': 'text-lg py-3 px-6',
  }[size];

  return (
    <button
      className={`rounded-full font-medium transition-all duration-300 ${variantClass} ${sizeClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}