import ProjectCard from "./ProjectCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Code, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Target, 
  Layers, 
  Star,
  Share2,
  Filter,
  Search,
  SlidersHorizontal,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";

// Sample project data with corrected types
const projectsData = [
  {
    id: 1,
    title: "E-Commerce Dashboard",
    description: "A responsive dashboard with real-time analytics for an e-commerce platform",
    techStack: ["React", "NextJS", "TailwindCSS", "Prisma", "PostgreSQL"],
    target: "Full-stack Application",
    duration: "8 weeks",
    progress: 75,
    stages: [
      { name: "Planning", status: "completed" as const },
      { name: "Design", status: "completed" as const },
      { name: "Development", status: "current" as const },
      { name: "Testing", status: "upcoming" as const },
      { name: "Deployment", status: "upcoming" as const }
    ],
    milestones: [
      { title: "Project Setup", completed: true, date: "03/15" },
      { title: "UI Components", completed: true, date: "04/01" },
      { title: "Backend API", completed: true, date: "04/20" },
      { title: "Data Integration", completed: false, date: "05/10" },
      { title: "Testing & QA", completed: false, date: "05/25" },
      { title: "Deployment", completed: false, date: "06/01" }
    ]
  },
  {
    id: 2,
    title: "AI Content Generator",
    description: "An AI-powered tool that generates marketing content based on given prompts",
    techStack: ["Python", "FastAPI", "React", "OpenAI", "Docker"],
    target: "SaaS Product",
    duration: "12 weeks",
    progress: 45,
    stages: [
      { name: "Planning", status: "completed" as const },
      { name: "Design", status: "completed" as const },
      { name: "Development", status: "current" as const },
      { name: "Testing", status: "upcoming" as const },
      { name: "Deployment", status: "upcoming" as const }
    ],
    milestones: [
      { title: "Project Setup", completed: true, date: "02/10" },
      { title: "API Design", completed: true, date: "02/25" },
      { title: "AI Model Integration", completed: true, date: "03/15" },
      { title: "UI Development", completed: false, date: "04/05" },
      { title: "Testing", completed: false, date: "04/20" },
      { title: "Launch", completed: false, date: "05/01" }
    ]
  },
  {
    id: 3,
    title: "Social Media Analytics",
    description: "A platform that analyzes social media engagement and provides actionable insights",
    techStack: ["React", "Firebase", "NodeJS", "Express", "D3.js"],
    target: "Analytics Dashboard",
    duration: "10 weeks",
    progress: 90,
    stages: [
      { name: "Planning", status: "completed" as const },
      { name: "Design", status: "completed" as const },
      { name: "Development", status: "completed" as const },
      { name: "Testing", status: "current" as const },
      { name: "Deployment", status: "upcoming" as const }
    ],
    milestones: [
      { title: "Project Setup", completed: true, date: "01/05" },
      { title: "API Integration", completed: true, date: "01/20" },
      { title: "Dashboard UI", completed: true, date: "02/10" },
      { title: "Analytics Engine", completed: true, date: "02/28" },
      { title: "Testing", completed: false, date: "03/15" },
      { title: "Deployment", completed: false, date: "03/25" }
    ]
  },
  {
    id: 4,
    title: "Mobile Fitness Tracker",
    description: "A cross-platform mobile app that tracks workouts, nutrition, and health metrics",
    techStack: ["React Native", "GraphQL", "MongoDB", "AWS"],
    target: "Mobile Application",
    duration: "14 weeks",
    progress: 35,
    stages: [
      { name: "Planning", status: "completed" as const },
      { name: "Design", status: "current" as const },
      { name: "Development", status: "upcoming" as const },
      { name: "Testing", status: "upcoming" as const },
      { name: "Deployment", status: "upcoming" as const }
    ],
    milestones: [
      { title: "Project Setup", completed: true, date: "03/01" },
      { title: "UI/UX Design", completed: true, date: "03/20" },
      { title: "Backend Development", completed: false, date: "04/15" },
      { title: "App Development", completed: false, date: "05/10" },
      { title: "Testing", completed: false, date: "05/25" },
      { title: "App Store Submission", completed: false, date: "06/10" }
    ]
  },
  {
    id: 5,
    title: "Blockchain Wallet",
    description: "A secure cryptocurrency wallet supporting multiple blockchains and tokens",
    techStack: ["TypeScript", "React", "Solidity", "Ethers.js", "Web3"],
    target: "Web3 Application",
    duration: "16 weeks",
    progress: 20,
    stages: [
      { name: "Planning", status: "completed" as const },
      { name: "Design", status: "current" as const },
      { name: "Development", status: "upcoming" as const },
      { name: "Testing", status: "upcoming" as const },
      { name: "Deployment", status: "upcoming" as const }
    ],
    milestones: [
      { title: "Project Setup", completed: true, date: "04/05" },
      { title: "Wallet Design", completed: false, date: "04/25" },
      { title: "Smart Contract Development", completed: false, date: "05/20" },
      { title: "Frontend Integration", completed: false, date: "06/15" },
      { title: "Security Audit", completed: false, date: "07/01" },
      { title: "Launch", completed: false, date: "07/20" }
    ]
  },
  {
    id: 6,
    title: "Virtual Learning Platform",
    description: "An interactive platform for online courses with live sessions and assessments",
    techStack: ["Vue.js", "Nuxt.js", "Node.js", "MongoDB", "WebRTC"],
    target: "EdTech Platform",
    duration: "12 weeks",
    progress: 60,
    stages: [
      { name: "Planning", status: "completed" as const },
      { name: "Design", status: "completed" as const },
      { name: "Development", status: "current" as const },
      { name: "Testing", status: "upcoming" as const },
      { name: "Deployment", status: "upcoming" as const }
    ],
    milestones: [
      { title: "Project Setup", completed: true, date: "02/15" },
      { title: "Course Structure", completed: true, date: "03/05" },
      { title: "Video Streaming", completed: true, date: "03/25" },
      { title: "Assessment System", completed: false, date: "04/15" },
      { title: "Payment Integration", completed: false, date: "05/05" },
      { title: "Launch", completed: false, date: "05/25" }
    ]
  }
];

type FilterType = "all" | "completed" | "inProgress" | "notStarted";

const ProjectZone: React.FC = () => {
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const filteredProjects = projectsData.filter((project) => {
    // Filter by status
    if (filter === "completed" && project.progress < 100) return false;
    if (filter === "inProgress" && (project.progress === 0 || project.progress === 100)) return false;
    if (filter === "notStarted" && project.progress > 0) return false;
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.techStack.some(tech => tech.toLowerCase().includes(query))
      );
    }
    
    return true;
  });
  
  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -400, behavior: "smooth" });
    }
  };
  
  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 400, behavior: "smooth" });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Code size={28} className="text-primary" />
            Project Zone
          </h1>
          <p className="text-muted-foreground mt-2">
            Hands-on project experience and portfolio building
          </p>
        </div>
        
        <div className="flex items-center gap-3 mt-4 sm:mt-0">
          <Button variant="outline" size="sm" className="gap-2">
            <Share2 size={14} />
            Share
          </Button>
          <Button size="sm" className="gap-2 bg-primary text-primary-foreground">
            <Plus size={14} />
            New Project
          </Button>
        </div>
      </div>
      
      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setFilter("all")}
            className={cn("filter-button", filter === "all" && "active")}
          >
            All Projects
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={cn("filter-button", filter === "completed" && "active")}
          >
            Completed
          </button>
          <button
            onClick={() => setFilter("inProgress")}
            className={cn("filter-button", filter === "inProgress" && "active")}
          >
            In Progress
          </button>
          <button
            onClick={() => setFilter("notStarted")}
            className={cn("filter-button", filter === "notStarted" && "active")}
          >
            Not Started
          </button>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <SlidersHorizontal size={14} />
          </Button>
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-card/70 rounded-xl p-4 border border-border/20">
          <h4 className="text-xl font-bold">{projectsData.length}</h4>
          <p className="text-sm text-muted-foreground">Total Projects</p>
        </div>
        <div className="bg-card/70 rounded-xl p-4 border border-border/20">
          <h4 className="text-xl font-bold">{projectsData.filter(p => p.progress === 100).length}</h4>
          <p className="text-sm text-muted-foreground">Completed</p>
        </div>
        <div className="bg-card/70 rounded-xl p-4 border border-border/20">
          <h4 className="text-xl font-bold">{projectsData.filter(p => p.progress > 0 && p.progress < 100).length}</h4>
          <p className="text-sm text-muted-foreground">In Progress</p>
        </div>
        <div className="bg-card/70 rounded-xl p-4 border border-border/20">
          <h4 className="text-xl font-bold">{projectsData.filter(p => p.progress === 0).length}</h4>
          <p className="text-sm text-muted-foreground">Not Started</p>
        </div>
      </div>
      
      {/* Horizontal scrollable projects */}
      <div className="relative mb-12">
        <h2 className="text-xl font-bold mb-4">Featured Projects</h2>
        
        <div className="flex items-center">
          <button 
            onClick={handleScrollLeft}
            className="mr-4 flex-shrink-0 bg-card/70 rounded-full p-2 hover:bg-card"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div 
            ref={scrollContainerRef}
            className="flex gap-5 overflow-x-auto scroll-container pb-4"
          >
            {projectsData.slice(0, 4).map((project) => (
              <div key={project.id} className="w-80 flex-shrink-0">
                <ProjectCard {...project} />
              </div>
            ))}
          </div>
          
          <button 
            onClick={handleScrollRight}
            className="ml-4 flex-shrink-0 bg-card/70 rounded-full p-2 hover:bg-card"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      
      {/* Grid projects */}
      <div>
        <h2 className="text-xl font-bold mb-4">All Projects</h2>
        
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} {...project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-card/70 rounded-xl border border-border/20">
            <h3 className="text-lg font-semibold">No projects found</h3>
            <p className="text-muted-foreground mt-2">Try adjusting your filters or search query</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectZone;
