
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logo = () => {
  const navigate = useNavigate();
  
  return (
    <div 
      className="flex items-center cursor-pointer" 
      onClick={() => navigate('/')}
    >
      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-interview-blue to-interview-purple flex items-center justify-center mr-2">
        <span className="text-white font-bold text-xl">P</span>
      </div>
      <div className="font-bold text-xl">PrepWise</div>
    </div>
  );
};

export default Logo;