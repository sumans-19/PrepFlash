
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const Navbar = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="bg-prep-secondary rounded-lg p-1">
            <span className="text-white font-bold text-xl">PP</span>
          </div>
          <span className="text-prep-dark font-bold text-xl">PrepPathwayPro</span>
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          <Link to="/prep-kit" className="text-gray-600 hover:text-prep-secondary transition-colors">
            Prep Kit
          </Link>
          <Link to="#" className="text-gray-600 hover:text-prep-secondary transition-colors">
            Resources
          </Link>
          <Link to="#" className="text-gray-600 hover:text-prep-secondary transition-colors">
            About
          </Link>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" className="hidden md:flex">
            <Search className="h-4 w-4" />
          </Button>
          <Button className="bg-prep-primary hover:bg-prep-secondary">
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
