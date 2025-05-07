import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const categories = [
  { id: "all", name: "All" },
  { id: "frontend", name: "Frontend" },
  { id: "backend", name: "Backend" },
  { id: "devops", name: "DevOps" },
  { id: "languages", name: "Languages" },
  { id: "tools", name: "Tools" },
  { id: "careers", name: "Career Paths" },
];

interface RoadmapCategoriesProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

export const RoadmapCategories: React.FC<RoadmapCategoriesProps> = ({
  activeCategory,
  setActiveCategory,
}) => {
  return (
    <div className="animate-fade-in">
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={activeCategory === category.id ? "default" : "outline"}
            className={cn(
              "transition-all duration-300",
              activeCategory === category.id
                ? "bg-primary text-primary-foreground"
                : "hover:bg-primary/10"
            )}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.name}
          </Button>
        ))}
      </div>
    </div>
  );
};