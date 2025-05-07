import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface RoadmapCardProps {
  roadmap: {
    label: string;
    value: string;
    category?: string;
  };
  onClick: () => void;
  isActive: boolean;
}

export const RoadmapCard: React.FC<RoadmapCardProps> = ({ roadmap, onClick, isActive }) => {
  // Get color based on category
  const getCategoryColor = (category?: string) => {
    switch(category) {
      case "frontend": 
        return "from-primary to-primary/80";
      case "backend": 
        return "from-secondary to-secondary/80";
      case "devops": 
        return "from-accent to-accent/80";
      case "languages": 
        return "from-primary/90 to-secondary/90";
      case "tools": 
        return "from-secondary/90 to-accent/90";
      case "careers": 
        return "from-primary/80 to-accent/80";
      default: 
        return "from-primary to-primary/70";
    }
  };

  const colorGradient = getCategoryColor(roadmap.category);

  return (
    <Card 
      className={cn(
        "roadmap-card-hover cursor-pointer relative overflow-hidden",
        isActive && "ring-2 ring-primary",
        "animate-scale-in"
      )}
      onClick={onClick}
    >
      <div className={cn(
        "absolute inset-0 opacity-10 bg-gradient-to-br", 
        colorGradient
      )} />
      <span 
        className={cn(
          "absolute top-0 right-0 w-3 h-3 rounded-full m-2 transition-all duration-300",
          isActive ? "bg-primary animate-pulse-light" : "bg-secondary"
        )}
      />
      <CardContent className="p-6 flex flex-col items-center justify-center h-full min-h-[100px] relative z-10">
        <h3 className="text-lg font-medium text-center transition-colors">
          {roadmap.label}
        </h3>
      </CardContent>
    </Card> 
  );
};