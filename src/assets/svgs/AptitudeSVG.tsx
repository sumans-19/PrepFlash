// src/assets/svgs/AptitudeSVG.tsx
import React from 'react';

const AptitudeSVG = () => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-20 h-20 opacity-10 absolute top-4 right-4 z-0"
  >
    <circle cx="32" cy="32" r="30" stroke="#7E69AB" strokeWidth="4" />
    <path d="M20 26h24M20 32h24M20 38h14" stroke="#7E69AB" strokeWidth="2" strokeLinecap="round" />
    <rect x="16" y="20" width="32" height="24" rx="4" stroke="#7E69AB" strokeWidth="2" />
    <path d="M48 16l4-4M52 20l4-4M44 20l-4-4" stroke="#7E69AB" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export default AptitudeSVG;
