
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { ThemeToggle } from "./ui/theme-toggle";
import { LogIn, UserPlus, Sparkles } from "lucide-react";

export function Navigation() {
  return (
    <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-lg border-b z-50 font-playfair">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-3xl font-bold flex items-center gap-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-playfair tracking-tight">
          <Sparkles className="h-8 w-8 text-violet-400 drop-shadow-lg animate-pulse" />
          PrepFlash
        </Link>
        <div className="flex items-center gap-6">
          <Link to="/features">
            <Button variant="ghost" className="text-lg hover:from-indigo-500 hover:to-purple-500 bg-gradient-to-r hover:text-white transition-transform hover:scale-110 duration-200 font-playfair px-4 py-2">Features</Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="ghost" className="text-lg hover:from-indigo-500 hover:to-purple-500 bg-gradient-to-r hover:text-white transition-transform hover:scale-110 duration-200 font-playfair px-4 py-2">Dashboard</Button>
          </Link>
          <ThemeToggle />
          <div className="flex items-center gap-3">
            <Link to="/auth">
              <Button variant="outline" className="text-lg hover:from-indigo-500 hover:to-purple-500 bg-gradient-to-r hover:text-white transition-transform hover:scale-105 gap-2 font-playfair px-4 py-2">
                <LogIn className="h-5 w-5" />
                Login
              </Button>
            </Link>
            <Link to="/auth">
              <Button className="text-lg bg-gradient-to-r from-primary to-secondary hover:from-indigo-500 hover:to-purple-500 hover:text-white hover:scale-110 transition-all gap-2 font-playfair px-4 py-2">
                <UserPlus className="h-5 w-5" />
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
