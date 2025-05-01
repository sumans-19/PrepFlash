
import React from "react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Code, Calendar, Clock, Target, Layers, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface Milestone {
  title: string;
  completed: boolean;
  date?: string;
}

interface Stage {
  name: string;
  status: "completed" | "current" | "upcoming";
}

interface ProjectCardProps {
  title: string;
  description: string;
  techStack: string[];
  target: string;
  duration: string;
  progress: number;
  stages: Stage[];
  milestones: Milestone[];
  image?: string;
}

const ProjectCard = ({
  title,
  description,
  techStack,
  target,
  duration,
  progress,
  stages,
  milestones,
  image,
}: ProjectCardProps) => {
  return (
    <div className="project-card group">
      <div className="glow"></div>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-foreground">{title}</h3>
          <Badge variant="outline" className="bg-primary/20 text-primary border-primary/20">
            {progress}% Complete
          </Badge>
        </div>
        
        {/* Description */}
        <p className="text-muted-foreground text-sm mb-4">{description}</p>
        
        {/* Progress Bar */}
        <div className="mb-5">
          <div className="flex justify-between text-xs mb-1">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        <Separator className="my-3 bg-border/20" />
        
        {/* Details */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Target size={16} className="text-primary" />
            <span className="text-muted-foreground">Target:</span>
            <span>{target}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Clock size={16} className="text-primary" />
            <span className="text-muted-foreground">Duration:</span>
            <span>{duration}</span>
          </div>
        </div>
        
        {/* Tech Stack */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Code size={16} className="text-primary" />
            <span className="text-sm font-medium">Tech Stack</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {techStack.map((tech) => (
              <span key={tech} className="tech-badge">
                {tech}
              </span>
            ))}
          </div>
        </div>
        
        {/* Stages */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Layers size={16} className="text-primary" />
            <span className="text-sm font-medium">Stages</span>
          </div>
          <div className="flex items-center gap-1">
            {stages.map((stage, index) => (
              <React.Fragment key={stage.name}>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div 
                        className={cn(
                          "timeline-dot",
                          stage.status === "completed" ? "bg-primary" : 
                          stage.status === "current" ? "bg-primary/50" : "bg-muted"
                        )}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{stage.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                {index < stages.length - 1 && (
                  <div 
                    className={cn(
                      "h-0.5 w-4",
                      stage.status === "completed" ? "bg-primary" : "bg-muted"
                    )} 
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        
        {/* Milestones */}
        <div className="mt-auto">
          <div className="flex items-center gap-2 mb-2">
            <Star size={16} className="text-primary" />
            <span className="text-sm font-medium">Milestones</span>
          </div>
          <div className="space-y-1.5">
            {milestones.slice(0, 3).map((milestone) => (
              <div 
                key={milestone.title} 
                className={cn(
                  "milestone", 
                  milestone.completed ? "milestone-complete" : "milestone-pending"
                )}
              >
                {milestone.completed ? (
                  <div className="timeline-dot bg-primary" />
                ) : (
                  <div className="timeline-dot bg-muted" />
                )}
                <span className="text-xs flex-1">{milestone.title}</span>
                {milestone.date && (
                  <span className="text-xs text-muted-foreground">
                    <Calendar size={12} className="inline mr-1" />
                    {milestone.date}
                  </span>
                )}
              </div>
            ))}
            
            {milestones.length > 3 && (
              <div className="text-xs text-primary text-right mt-1">
                +{milestones.length - 3} more milestones
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
