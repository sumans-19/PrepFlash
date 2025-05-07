import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Youtube, BookOpen, FileCode, AlertCircle, CheckCircle, Globe } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { generateLearningResources, GeminiResource } from '@/services/GeminiService2';

interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  icon: React.ReactNode;
  thumbnailUrl?: string;
  verified?: boolean;
  language?: string;
}

interface ResourceListProps {
  resources: Resource[];
}

const ResourceList: React.FC<ResourceListProps> = ({ resources }) => {
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [genResources, setGenResources] = useState<Resource[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [topic, setTopic] = useState<string>("web development");
  const [resourceType, setResourceType] = useState<string>("all");
  const [language, setLanguage] = useState<string>("english");
  const { toast } = useToast();
  
  const categories = ["All", ...Array.from(new Set(resources.map(resource => resource.category)))];
  const filteredResources = activeFilter === "All" 
    ? resources 
    : resources.filter(resource => resource.category === activeFilter);

  // Languages available for selection
  const availableLanguages = [
    { value: "english", label: "English" },
    { value: "kannada", label: "Kannada" },
    { value: "telugu", label: "Telugu" },
    { value: "hindi", label: "Hindi" },
    { value: "tamil", label: "Tamil" },
    { value: "french", label: "French" },
    { value: "japanese", label: "Japanese" },
    { value: "italian", label: "Italian" }
  ];

  // Helper function to get icon based on category
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'youtube':
        return <Youtube size={24} />;
      case 'tutorial':
        return <BookOpen size={24} />;
      case 'project':
        return <FileCode size={24} />;
      default:
        return <ExternalLink size={24} />;
    }
  };

  // Extract YouTube video ID from URL
  const extractYoutubeId = (url: string): string | null => {
    // Handle different YouTube URL formats
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Get YouTube thumbnail URL from video ID
  const getYoutubeThumbnail = (url: string): string | null => {
    const videoId = extractYoutubeId(url);
    if (videoId) {
      // Using high quality thumbnail
      return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }
    return null;
  };

  // Check if URL is from a specific domain
  const isFromDomain = (url: string, domain: string): boolean => {
    try {
      return new URL(url).hostname.includes(domain);
    } catch (e) {
      return false;
    }
  };

  // Get topic-specific Unsplash image
  const getUnsplashImage = (topic: string): string => {
    // Sanitize topic for URL
    const sanitizedTopic = encodeURIComponent(topic.replace(/\s+/g, '-').toLowerCase());
    // Create a more reliable image URL that includes a fallback width and height
    return `https://source.unsplash.com/800x450/?${sanitizedTopic}`;
  };
  
  // Get technology-specific images from a curated set
  const getTechImage = (resource: Resource): string => {
    const title = resource.title.toLowerCase();
    const description = resource.description.toLowerCase();
    const url = resource.url.toLowerCase();
    const resourceText = `${title} ${description}`;
    
    // Map of tech keywords to reliable Unsplash/Pexels image URLs
    const techImageMap: Record<string, string> = {
      // Programming Languages
      'javascript': 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&h=450&fit=crop',
      'python': 'https://images.unsplash.com/photo-1526379879527-8559ecfd8bf7?w=800&h=450&fit=crop',
      'java': 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&w=800&h=450',
      'c++': 'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&w=800&h=450',
      'php': 'https://images.unsplash.com/photo-1599507593499-a3f7d7d97667?w=800&h=450&fit=crop',
      'ruby': 'https://images.unsplash.com/photo-1569012871812-f38ee64cd54c?w=800&h=450&fit=crop',
      'swift': 'https://images.unsplash.com/photo-1546776310-eef45dd6d63c?w=800&h=450&fit=crop',
      'golang': 'https://images.pexels.com/photos/2653362/pexels-photo-2653362.jpeg?auto=compress&w=800&h=450',

      // Web Development
      'html': 'https://images.unsplash.com/photo-1621839673705-6617adf9e890?w=800&h=450&fit=crop',
      'css': 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800&h=450&fit=crop',
      'react': 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=800&h=450&fit=crop',
      'angular': 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&w=800&h=450',
      'vue': 'https://images.unsplash.com/photo-1607743386760-88ac62b89b8a?w=800&h=450&fit=crop',
      'node': 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=800&h=450&fit=crop',
      'express': 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&w=800&h=450',
      'django': 'https://images.unsplash.com/photo-1493119508027-2b584f234d6c?w=800&h=450&fit=crop',
      'flask': 'https://images.pexels.com/photos/11035474/pexels-photo-11035474.jpeg?auto=compress&w=800&h=450',
      'frontend': 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&h=450&fit=crop',
      'backend': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=450&fit=crop',
      'fullstack': 'https://images.pexels.com/photos/270360/pexels-photo-270360.jpeg?auto=compress&w=800&h=450',
      'web development': 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=450&fit=crop',

      // Mobile Development
      'android': 'https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=800&h=450&fit=crop',
      'ios': 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=450&fit=crop',
      'flutter': 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&w=800&h=450',
      'react native': 'https://images.unsplash.com/photo-1581276879432-15e50529f34b?w=800&h=450&fit=crop',
      'mobile': 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&h=450&fit=crop',

      // Data Science & AI
      'machine learning': 'https://images.unsplash.com/photo-1488229297570-58520851e868?w=800&h=450&fit=crop',
      'data science': 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&h=450&fit=crop',
      'artificial intelligence': 'https://images.unsplash.com/photo-1554306274-f23873d9a26c?w=800&h=450&fit=crop',
      'neural networks': 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&w=800&h=450',
      'deep learning': 'https://images.unsplash.com/photo-1501786223405-6d024d7c3b8d?w=800&h=450&fit=crop',
      'tensorflow': 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&w=800&h=450',
      'pytorch': 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=450&fit=crop',

      // DevOps & Cloud
      'devops': 'https://images.unsplash.com/photo-1667372393219-f85abff6a30a?w=800&h=450&fit=crop',
      'docker': 'https://images.pexels.com/photos/5483077/pexels-photo-5483077.jpeg?auto=compress&w=800&h=450',
      'kubernetes': 'https://images.unsplash.com/photo-1603732551658-5fabbafa12f0?w=800&h=450&fit=crop',
      'aws': 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&h=450&fit=crop',
      'azure': 'https://images.pexels.com/photos/1148820/pexels-photo-1148820.jpeg?auto=compress&w=800&h=450',
      'google cloud': 'https://images.unsplash.com/photo-1617854818583-09e7f077a156?w=800&h=450&fit=crop',
      'jenkins': 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&w=800&h=450',
      'ci/cd': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=450&fit=crop',

      // Databases
      'sql': 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=450&fit=crop',
      'mysql': 'https://images.pexels.com/photos/4709285/pexels-photo-4709285.jpeg?auto=compress&w=800&h=450',
      'postgresql': 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=450&fit=crop',
      'mongodb': 'https://images.pexels.com/photos/276452/pexels-photo-276452.jpeg?auto=compress&w=800&h=450',
      'redis': 'https://images.unsplash.com/photo-1642432556230-6a7c531339e9?w=800&h=450&fit=crop',
      'database': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop',

      // General Software Engineering
      'algorithms': 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&h=450&fit=crop',
      'data structures': 'https://images.pexels.com/photos/7988086/pexels-photo-7988086.jpeg?auto=compress&w=800&h=450',
      'programming': 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=450&fit=crop',
      'software engineering': 'https://images.unsplash.com/photo-1537432376769-00f5c2f4c8d2?w=800&h=450&fit=crop',
      'computer science': 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&w=800&h=450',
      'coding': 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&h=450&fit=crop',
      'code': 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&w=800&h=450',
    };
    
    // Find matching technologies in the resource content
    for (const [keyword, imageUrl] of Object.entries(techImageMap)) {
      if (resourceText.includes(keyword) || url.includes(keyword)) {
        return imageUrl;
      }
    }
    
    // Default images by category
    if (resource.category === 'Tutorial') {
      return 'https://images.unsplash.com/photo-1513258496099-48168024aec0?w=800&h=450&fit=crop';
    } else if (resource.category === 'Project') {
      return 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=450&fit=crop';
    }
    
    // If no matches, return topic-based Unsplash image
    return getUnsplashImage(topic || 'programming');
  };

  // Get appropriate thumbnail for any resource type
  const getResourceThumbnail = (resource: Resource): string => {
    const url = resource.url;
    const category = resource.category.toLowerCase();
    
    // YouTube-specific thumbnails
    if (category === 'youtube') {
      // Try to get actual video thumbnail
      const youtubeThumbnail = getYoutubeThumbnail(url);
      if (youtubeThumbnail) return youtubeThumbnail;
      
      // If it's a search results page, use a general YouTube thumbnail
      if (url.includes('youtube.com/results')) {
        return "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&h=450&fit=crop";
      }
      
      // Default YouTube image
      return "https://images.unsplash.com/photo-1610041321420-a596dd14ebc9?w=800&h=450&fit=crop";
    }
    
    // Tutorial-specific thumbnails
    if (category === 'tutorial') {
      if (isFromDomain(url, 'w3schools.com')) {
        return "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&h=450&fit=crop";
      } else if (isFromDomain(url, 'geeksforgeeks.org')) {
        return "https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&w=800&h=450";
      } else if (isFromDomain(url, 'mozilla.org') || isFromDomain(url, 'mdn')) {
        return "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=450&fit=crop";
      } else if (isFromDomain(url, 'freecodecamp.org')) {
        return "https://images.unsplash.com/photo-1562813733-b31f71025d54?w=800&h=450&fit=crop";
      }
      
      // Try to get a tech-specific image
      return getTechImage(resource);
    }
    
    // Project-specific thumbnails
    if (category === 'project') {
      if (isFromDomain(url, 'github.com')) {
        return "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&h=450&fit=crop";
      } else if (isFromDomain(url, 'codepen.io')) {
        return "https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg?auto=compress&w=800&h=450";
      } else if (isFromDomain(url, 'codesandbox.io')) {
        return "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=450&fit=crop";
      }
      
      // Try to get a tech-specific image
      return getTechImage(resource);
    }
    
    // Get a general image based on topic
    return getTechImage(resource);
  };

  // Generate AI resources
  const generateAIResources = async () => {
    setIsGenerating(true);
    
    try {
      // Prepare category-specific requests
      const typeMap: Record<string, string[]> = {
        'all': ['YouTube', 'Tutorial', 'Project'],
        'youtube': ['YouTube'],
        'tutorial': ['Tutorial'],
        'project': ['Project']
      };

      const categoriesToFetch = typeMap[resourceType] || typeMap.all;
      
      let allResources: Resource[] = [];
      
      // Fetch resources for each category
      for (const category of categoriesToFetch) {
        try {
          // Use the gemini-api service to generate resources
          // Pass the selected language as a parameter
          const categoryResources = await generateLearningResources(topic, category, language);
          
          // Transform the resources to match our UI component structure
          const transformedResources = categoryResources.map((r: GeminiResource) => {
            const resource = {
              id: r.id || `gen-${category.toLowerCase()}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
              title: r.title,
              description: r.description,
              url: r.url,
              category: category,
              icon: getCategoryIcon(category),
              verified: r.verified,
              language: language // Add language property
            };
            
            return resource;
          });
          
          allResources = [...allResources, ...transformedResources];
        } catch (error) {
          console.error(`Error generating ${category} resources:`, error);
          toast({
            variant: "destructive",
            title: `Error Generating ${category} Resources`,
            description: error.message,
          });
        }
      }
      
      // Add thumbnails to all resources
      const resourcesWithThumbnails = allResources.map(resource => {
        const thumbnailUrl = getResourceThumbnail(resource);
        return { ...resource, thumbnailUrl };
      });
      
      if (resourcesWithThumbnails.length > 0) {
        setGenResources(resourcesWithThumbnails);
        toast({
          title: "Resources Generated",
          description: `Found ${resourcesWithThumbnails.length} resources for ${topic} in ${availableLanguages.find(l => l.value === language)?.label || language}`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "No Resources Found",
          description: "Couldn't generate any valid resources. Please try a different topic, language or resource type.",
        });
      }
    } catch (error) {
      console.error('Error in resource generation process:', error);
      toast({
        variant: "destructive",
        title: "Error Generating Resources",
        description: `Failed to generate resources: ${error.message}`,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Process existing resources to add thumbnails
  useEffect(() => {
    const enhancedResources = resources.map(resource => {
      // Add thumbnails for all resource types
      const thumbnailUrl = getResourceThumbnail(resource);
      return { ...resource, thumbnailUrl };
    });
    
    // We don't actually update the props, but this would be used if we had state management
    // For demonstration purposes, we're showing the implementation
  }, [resources]);

  // Resource card component
  const ResourceCard = ({ resource }: { resource: Resource }) => (
    <div 
      key={resource.id} 
      className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
    >
      <div className="flex flex-col h-full">
        {/* Thumbnail Image Section */}
        <div className="relative w-full h-48 overflow-hidden">
          <img 
            src={resource.thumbnailUrl} 
            alt={`Thumbnail for ${resource.title}`}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              // Fallback if thumbnail fails to load
              (e.target as HTMLImageElement).src = getUnsplashImage(topic || 'programming');
            }}
          />
          <div className="absolute top-2 right-2 flex space-x-2">
            <Badge variant="outline" className="bg-black/70 text-white border-none">
              {resource.category}
            </Badge>
            {resource.verified && (
              <Badge variant="outline" className="bg-green-600/90 text-white border-none flex items-center gap-1">
                <CheckCircle size={12} /> Verified
              </Badge>
            )}
          </div>
          {/* Language badge if available */}
          {resource.language && resource.language !== "english" && (
            <div className="absolute bottom-2 left-2">
              <Badge variant="outline" className="bg-blue-600/90 text-white border-none flex items-center gap-1">
                <Globe size={12} /> {availableLanguages.find(l => l.value === resource.language)?.label || resource.language}
              </Badge>
            </div>
          )}
        </div>
        
        <div className="p-6 flex flex-col flex-grow">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              {resource.icon}
            </div>
            <h3 className="text-xl font-semibold">{resource.title}</h3>
          </div>
          <p className="text-muted-foreground mb-6 flex-grow">{resource.description}</p>
          
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-between"
            onClick={() => window.open(resource.url, '_blank')}
          >
            <span>Visit resource</span>
            <ExternalLink size={16} />
          </Button>
        </div>
      </div>
    </div>
  );

  // Empty State Component
  const EmptyState = ({ message }: { message: string }) => (
    <div className="w-full flex flex-col items-center justify-center py-16 text-center">
      <AlertCircle size={48} className="text-muted-foreground mb-4" />
      <h3 className="text-xl font-medium mb-2">No resources found</h3>
      <p className="text-muted-foreground max-w-md">{message}</p>
    </div>
  );

  return (
    <Tabs defaultValue="curated" className="w-full">
      <TabsList className="grid grid-cols-2 w-full mb-6">
        <TabsTrigger value="curated">Curated Resources</TabsTrigger>
        <TabsTrigger value="ai-generated">AI-Generated Resources</TabsTrigger>
      </TabsList>
      
      <TabsContent value="curated" className="space-y-8 animate-fade-in">
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`
                px-5 py-2.5 rounded-full text-sm font-medium transition-all
                ${activeFilter === category 
                  ? 'bg-primary text-white' 
                  : 'bg-secondary hover:bg-secondary/80 text-foreground'
                }
              `}
            >
              {category}
            </button>
          ))}
        </div>
        
        {/* Resources Grid */}
        {filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredResources.map(resource => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        ) : (
          <EmptyState message="No curated resources are available for this category." />
        )}
      </TabsContent>
      
      <TabsContent value="ai-generated" className="space-y-8 animate-fade-in">
        <Card className="glassmorphism">
          <CardHeader>
            <CardTitle>Generate Learning Resources</CardTitle>
            <CardDescription>
              Find the best resources for your learning journey with AI recommendations powered by Gemini
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="topic">Topic</Label>
                <Input
                  id="topic"
                  placeholder="Enter a topic to explore"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="resource-type">Resource Type</Label>
                <Select value={resourceType} onValueChange={setResourceType}>
                  <SelectTrigger id="resource-type">
                    <SelectValue placeholder="Select resource type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Resources</SelectItem>
                    <SelectItem value="youtube">YouTube Videos</SelectItem>
                    <SelectItem value="tutorial">Tutorials (W3Schools/GeeksforGeeks)</SelectItem>
                    <SelectItem value="project">Projects & Code Examples</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="language-select">Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger id="language-select" className="flex items-center">
                    <Globe size={16} className="mr-2" />
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableLanguages.map(lang => (
                      <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button 
              onClick={generateAIResources} 
              className="w-full bg-gradient-primary"
              disabled={isGenerating}
            >
              {isGenerating ? "Generating Resources..." : "Generate Resources"}
            </Button>
          </CardContent>
        </Card>
        
        {genResources.length > 0 ? (
          <>
            <h2 className="text-2xl font-bold mt-8">
              AI-Generated Resources for {topic} 
              {language !== "english" && (
                <span className="ml-2 text-lg font-normal text-muted-foreground">
                  in {availableLanguages.find(l => l.value === language)?.label || language}
                </span>
              )}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {genResources.map(resource => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          </>
        ) : (
          <EmptyState message={
            isGenerating ? "Generating resources..." : "Generate resources to see them here."
          } />
        )}
      </TabsContent>
    </Tabs>
  );
};

export default ResourceList;