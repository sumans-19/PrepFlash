
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Book } from "lucide-react";
import { ThemeToggle } from "./ui/theme-toggle";

const Header = () => {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="font-bold text-xl text-primary">
          Learning Path Creator
        </Link>
        <Button asChild variant="ghost" className="gap-2">
          <Link to="/learning-toolkit">
            <Book className="h-4 w-4" />
            <span>Learning Tool Kit</span>
          </Link>
        </Button><ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
