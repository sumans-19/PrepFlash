import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { ThemeToggle } from "./ui/theme-toggle";
import { LogOut, UserCircle2, Sparkles } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export function DashboardNav() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/auth");
  };

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
          <Link to="/profile">
            <Button variant="ghost" className="text-lg hover:from-indigo-500 hover:to-purple-500 bg-gradient-to-r hover:text-white transition-transform hover:scale-110 duration-200 font-playfair px-4 py-2">
              <UserCircle2 className="h-5 w-5 mr-1" />
              Profile
            </Button>
          </Link>
          <ThemeToggle />
          <Button onClick={handleLogout} variant="outline" className="text-lg hover:from-indigo-500 hover:to-purple-500 bg-gradient-to-r hover:text-white transition-transform hover:scale-105 gap-2 font-playfair px-4 py-2">
            <LogOut className="h-5 w-5" />
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
}
