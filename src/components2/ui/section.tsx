import React from 'react';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  title?: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
}

export function Section({ 
  children, 
  className = '', 
  id, 
  title, 
  subtitle, 
  align = 'center' 
}: SectionProps) {
  const alignClass = {
    'left': 'text-left items-start',
    'center': 'text-center items-center',
    'right': 'text-right items-end',
  }[align];

  return (
    <section id={id} className={`py-16 md:py-24 flex flex-col ${alignClass} ${className}`}>
      {title && (
        <h2 className="text-3xl md:text-4xl font-bold mb-4 relative">
          <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            {title}
          </span>
          <span className="absolute -bottom-3 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full"></span>
        </h2>
      )}
      {subtitle && (
        <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-3xl">
          {subtitle}
        </p>
      )}
      {children}
    </section>
  );
}