import React from 'react';
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, GraduationCap } from "lucide-react";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="bg-muted backdrop-blur-lg border-b py-3 sticky top-16 z-0 shadow-sm">
      <div className="container mx-auto">
        <div className="flex justify-center">
          <Tabs value={activeTab} className="w-auto">
            <TabsList className="grid w-[400px] grid-cols-2 bg-background/80 shadow-lg rounded-xl p-1 border border-muted/30">
              <TabsTrigger 
                value="jobs" 
                onClick={() => onTabChange("jobs")} 
                className={`relative py-3 rounded-lg transition-all duration-300 ${
                  activeTab === "jobs" ? "shadow-md bg-primary/20" : ""
                }`}
              >
                <motion.div
                  className="flex items-center gap-2 font-medium"
                  animate={{ 
                    scale: activeTab === "jobs" ? 1.05 : 1,
                    color: activeTab === "jobs" ? "hsl(var(--primary))" : ""
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Briefcase className={`w-4 h-4 ${activeTab === "jobs" ? "text-primary" : ""}`} />
                  <span>Jobs</span>
                </motion.div>
                {activeTab === "jobs" && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "100%", opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </TabsTrigger>
              
              <TabsTrigger 
                value="internships" 
                onClick={() => onTabChange("internships")} 
                className={`relative py-3 rounded-lg transition-all duration-300 ${
                  activeTab === "internships" ? "shadow-md bg-secondary/20" : ""
                }`}
              >
                <motion.div
                  className="flex items-center gap-2 font-medium"
                  animate={{ 
                    scale: activeTab === "internships" ? 1.05 : 1,
                    color: activeTab === "internships" ? "hsl(var(--secondary))" : ""
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <GraduationCap className={`w-4 h-4 ${activeTab === "internships" ? "text-secondary" : ""}`} />
                  <span>Internships</span>
                </motion.div>
                {activeTab === "internships" && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary rounded-full"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "100%", opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Navigation;