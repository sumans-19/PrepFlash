import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "./ui/theme-toggle";
import { motion } from "framer-motion";

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  return (
    <header className="bg-background border-b sticky top-0 z-10 shadow-sm">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto py-4"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Tech Hub 
            </h1>
            <p className="text-muted-foreground text-sm">
              Your daily source for news and job opportunities
            </p>
          </motion.div>
          
          <div className="flex items-center gap-4">
            
            <ThemeToggle />
          </div>
        </div>
      </motion.div>
    </header>
  );
};

export default Header;