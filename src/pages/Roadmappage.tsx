import React, { useState, useEffect, useMemo, useRef } from "react";
import { Navigation } from "@/components/Navigation";
import { ZoomableImage } from "@/components/ZoomableImage";
import { RoadmapCategories } from "@/components/RoadmapCategories";
import { RoadmapCard } from "@/components/RoadmapCard";
import { RoadmapSkeleton } from "@/components/RoadmapSkeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Search, Download } from "lucide-react";

// Full local roadmap list from roadmap.sh
const roadmaps = [
  { label: "Frontend", value: "frontend", category: "frontend" },
  { label: "Backend", value: "backend", category: "backend" },
  { label: "Full Stack", value: "full-stack", category: "careers" },
  { label: "API Design", value: "api-design", category: "backend" },
  { label: "QA", value: "qa", category: "careers" },
  { label: "DevOps", value: "devops", category: "devops" },
  { label: "Android", value: "android", category: "frontend" },
  { label: "iOS", value: "ios", category: "frontend" },
  { label: "PostgreSQL", value: "postgresql-dba", category: "backend" },
  { label: "Software Architect", value: "software-architect", category: "careers" },
  { label: "Technical Writer", value: "technical-writer", category: "careers" },
  { label: "DevRel Engineer", value: "devrel", category: "careers" },
  { label: "AI and Data Scientist", value: "ai-data-scientist", category: "careers" },
  { label: "AI Engineer", value: "ai-engineer", category: "careers" },
  { label: "Data Analyst", value: "data-analyst", category: "careers" },
  { label: "MLOps", value: "mlops", category: "devops" },
  { label: "Product Manager", value: "product-manager", category: "careers" },
  { label: "Engineering Manager", value: "engineering-manager", category: "careers" },
  { label: "Client Side Game Dev", value: "client-side-game-dev", category: "frontend" },
  { label: "Server Side Game Dev", value: "server-side-game-dev", category: "backend" },
  { label: "UX Design", value: "ux-design", category: "careers" },
  { label: "Blockchain", value: "blockchain", category: "backend" },
  { label: "Cyber Security", value: "cyber-security", category: "devops" },
  { label: "GraphQL", value: "graphql", category: "backend" },
  { label: "Git and GitHub", value: "git", category: "tools" },
  { label: "React", value: "react", category: "frontend" },
  { label: "Vue", value: "vue", category: "frontend" },
  { label: "Angular", value: "angular", category: "frontend" },
  { label: "Spring Boot", value: "spring-boot", category: "backend" },
  { label: "JavaScript", value: "javascript", category: "languages" },
  { label: "TypeScript", value: "typescript", category: "languages" },
  { label: "Node.js", value: "nodejs", category: "backend" },
  { label: "PHP", value: "php", category: "languages" },
  { label: "C++", value: "cpp", category: "languages" },
  { label: "Go", value: "go", category: "languages" },
  { label: "Rust", value: "rust", category: "languages" },
  { label: "Python", value: "python", category: "languages" },
  { label: "SQL", value: "sql", category: "languages" },
  { label: "Docker", value: "docker", category: "devops" },
  { label: "AWS", value: "aws", category: "devops" },
  { label: "Cloudflare", value: "cloudflare", category: "devops" },
  { label: "Kubernetes", value: "kubernetes", category: "devops" },
  { label: "Terraform", value: "terraform", category: "devops" },
  { label: "Linux", value: "linux", category: "tools" },
  { label: "React Native", value: "react-native", category: "frontend" },
  { label: "Flutter", value: "flutter", category: "frontend" },
  { label: "MongoDB", value: "mongodb", category: "backend" },
  { label: "Redis", value: "redis", category: "backend" },
  { label: "Computer Science", value: "computer-science", category: "careers" },
  { label: "Data Structures", value: "data-structures", category: "careers" },
  { label: "System Design", value: "system-design", category: "careers" },
  { label: "Design and Architecture", value: "software-design-architecture", category: "careers" },
  { label: "Code Review", value: "code-review", category: "careers" },
  { label: "Prompt Engineering", value: "prompt-engineering", category: "careers" },
  { label: "Design System", value: "design-system", category: "frontend" },
];

const RoadmapPage = () => {
  const [selectedRoadmap, setSelectedRoadmap] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const { toast } = useToast();
  const roadmapImageRef = useRef(null);

  useEffect(() => {
    if (selectedRoadmap) {
      setLoading(true);
      const img = new Image();
      img.src = `https://roadmap.sh/roadmaps/${selectedRoadmap}.png`;
      img.onload = () => {
        setImageUrl(`https://roadmap.sh/roadmaps/${selectedRoadmap}.png`);
        setLoading(false);
        
        // Scroll to the roadmap image after it's loaded
        setTimeout(() => {
          if (roadmapImageRef.current) {
            roadmapImageRef.current.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'start' 
            });
          }
        }, 100);
      };
      img.onerror = () => {
        toast({
          title: "Error loading roadmap",
          description: "The roadmap image could not be loaded",
          variant: "destructive",
        });
        setLoading(false);
      };
    }
  }, [selectedRoadmap, toast]);

  const filteredRoadmaps = useMemo(() => {
    let filtered = roadmaps;
    
    // Filter by category
    if (activeCategory !== "all") {
      filtered = filtered.filter(roadmap => roadmap.category === activeCategory);
    }
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(roadmap => 
        roadmap.label.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  }, [activeCategory, searchQuery]);

  const handleDownload = () => {
    if (!imageUrl) return;
    
    // Get the current roadmap name for the filename
    const roadmapName = roadmaps.find(r => r.value === selectedRoadmap)?.label || "roadmap";
    const filename = `${roadmapName.toLowerCase().replace(/\s+/g, '-')}-roadmap.png`;
    
    // Method 1: Use the canvas approach to download the image
    const downloadUsingCanvas = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      // Enable cross-origin loading
      img.crossOrigin = 'anonymous';
      
      // Handle loading errors
      img.onerror = () => {
        // Fall back to direct method on error
        openInNewTab();
        
        toast({
          title: "Download method changed",
          description: "Using alternate download method. Save the image from the new tab.",
          duration: 5000,
        });
      };
      
      img.onload = () => {
        // Set canvas dimensions to match the image
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw image on canvas
        ctx.drawImage(img, 0, 0);
        
        try {
          // Convert canvas to blob and download
          canvas.toBlob((blob) => {
            if (!blob) {
              openInNewTab();
              return;
            }
            
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            toast({
              title: "Download successful",
              description: `${roadmapName} roadmap has been downloaded`,
              duration: 3000,
            });
          }, 'image/png');
        } catch (err) {
          // Fall back to direct method if canvas approach fails
          openInNewTab();
        }
      };
      
      // Try loading image with CORS proxy
      // First try with the original URL (this may work in some environments)
      img.src = imageUrl;
    };
    
    // Method 2: Open in new tab as fallback
    const openInNewTab = () => {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Image opened in new tab",
        description: "Right-click on the image and select 'Save image as...'",
        duration: 5000,
      });
    };
    
    // Try the canvas method first
    try {
      downloadUsingCanvas();
    } catch (err) {
      // Fall back to opening in new tab
      openInNewTab();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto mb-10 text-center animate-fade-in">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 font-playfair bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
            Interactive Developer Roadmaps
          </h1>
          <p className="text-lg text-muted-foreground">
            Select a roadmap to visualize your learning path
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto mb-8 animate-fade-in">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search roadmaps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto mb-8">
          <RoadmapCategories 
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
          />
        </div>
        
        <div className="max-w-4xl mx-auto mb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredRoadmaps.map((roadmap) => (
              <RoadmapCard 
                key={roadmap.value}
                roadmap={roadmap}
                onClick={() => setSelectedRoadmap(roadmap.value)}
                isActive={selectedRoadmap === roadmap.value}
              />
            ))}
            {filteredRoadmaps.length === 0 && (
              <Card className="col-span-full p-8 text-center">
                <p className="text-muted-foreground">
                  No roadmaps found. Try adjusting your search or filters.
                </p>
              </Card>
            )}
          </div>
        </div>

        {loading ? (
          <RoadmapSkeleton />
        ) : (
          imageUrl && (
            <div ref={roadmapImageRef} className="max-w-6xl mx-auto mt-10">
              <Card className="p-4 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold font-playfair">
                    {roadmaps.find(r => r.value === selectedRoadmap)?.label} Development Roadmap
                  </h2>
                  <Button 
                    onClick={handleDownload}
                    className="bg-primary hover:bg-primary/90 text-white transition-all"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Roadmap
                  </Button>
                </div>
                <ScrollArea className="w-full">
                  <ZoomableImage src={imageUrl} alt="Roadmap" />
                </ScrollArea>
              </Card>
            </div>
          )
        )}
      </main>
    </div>
  );
};

export default RoadmapPage;