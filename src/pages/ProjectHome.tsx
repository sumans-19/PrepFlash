
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components2/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { DashboardNav } from '@/components/DashboardNav';
import { 
  Code, 
  Calendar, 
  Clock, 
  Target, 
  Layers,
  Star,
  BarChart,
  FileText,
  PlusCircle,
  Users,
  Rocket,
  Search,
  Folder,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import ProjectZone from "@/components/ProjectZone";

const ProjectHome = () => {
  // Example data for featured projects
  const featuredProjects = [
    {
      title: "Full-Stack E-Commerce",
      description: "Build a complete online store with React, Node.js and MongoDB",
      progress: 65,
      category: "Web Development"
    },
    {
      title: "AI Chatbot Assistant",
      description: "Create an intelligent chatbot using machine learning algorithms",
      progress: 40,
      category: "AI & Machine Learning"
    },
    {
      title: "Mobile Fitness App",
      description: "Design a cross-platform mobile app for fitness tracking",
      progress: 0,
      category: "Mobile Development"
    }
  ];

  // Stats data
  const statsData = [
    { label: "Total Projects", value: "24", icon: <Folder className="text-primary" size={20} /> },
    { label: "Completed", value: "12", icon: <Rocket className="text-primary" size={20} /> },
    { label: "In Progress", value: "8", icon: <Clock className="text-primary" size={20} /> },
    { label: "Team Members", value: "6", icon: <Users className="text-primary" size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <DashboardNav />
        <div className="max-w-7xl mx-auto px-4 py-8 mt-12 space-y-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 to-secondary p-8 md:p-12">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))]" />
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Project Portfolio Builder</h1>
          <p className="text-xl text-muted-foreground mb-6">
            Showcase your skills, track your progress, and build an impressive portfolio
            for your interview preparation.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="gap-2">
              <PlusCircle size={18} />
              Create New Project
            </Button>
            <Button variant="outline" size="lg" className="gap-2">
              <FileText size={18} />
              Browse Templates
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statsData.map((stat, index) => (
          <Card key={index} className="bg-card/70 backdrop-blur border-border/20">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="p-3 rounded-full bg-primary/10">
                {stat.icon}
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Featured Projects */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Featured Projects</h2>
          <Button variant="outline" size="sm" className="gap-2">
            <Search size={14} />
            Find Projects
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProjects.map((project, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-all duration-300 border-border/20">
              <CardHeader className="bg-card/70 backdrop-blur">
                <Badge className="w-fit mb-2">{project.category}</Badge>
                <CardTitle>{project.title}</CardTitle>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button variant="ghost" className="gap-2">
                  View Details
                  <ArrowRight size={16} />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Project Categories */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Project Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { title: "Web Development", icon: <Code size={20} />, count: 12 },
            { title: "Mobile Apps", icon: <Rocket size={20} />, count: 8 },
            { title: "Data Science", icon: <BarChart size={20} />, count: 6 },
            { title: "UI/UX Design", icon: <Layers size={20} />, count: 9 },
            { title: "Machine Learning", icon: <Star size={20} />, count: 5 },
            { title: "Cloud & DevOps", icon: <Target size={20} />, count: 7 }
          ].map((category, index) => (
            <Card 
              key={index}
              className="bg-card/70 backdrop-blur border-border/20 hover:bg-primary/5 transition cursor-pointer"
            >
              <CardContent className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-primary/10 rounded-full text-primary">
                    {category.icon}
                  </div>
                  <span className="font-medium">{category.title}</span>
                </div>
                <Badge variant="secondary">
                  {category.count} projects
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Project Zone Section */}
      <div>
        <Separator className="my-12 bg-border/20" />
        <h2 className="text-2xl font-bold mb-8">Project Showcase</h2>
        <ProjectZone />
      </div>
    </div>
    </div>

  );
};

export default ProjectHome;
