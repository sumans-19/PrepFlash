import React from 'react';
import { NavLink } from 'react-router-dom';
import { FileText, FileCheck } from 'lucide-react';

const Navigation: React.FC = () => {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex space-x-4 py-3">
          <NavLink
            to="/resume-builder"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 rounded-md transition-colors ${
                isActive
                  ? 'bg-teal-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <FileText className="w-5 h-5 mr-2" />
            Resume Builder
          </NavLink>
          <NavLink
            to="/ats-checker"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 rounded-md transition-colors ${
                isActive
                  ? 'bg-teal-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <FileCheck className="w-5 h-5 mr-2" />
            ATS Analyser
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;