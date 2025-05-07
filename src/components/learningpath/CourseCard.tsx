// CourseCard.tsx
import {
    Book,
    BookOpen,
    CircleCheck,
    Book as BookIcon,
    Code,
    Server,
    Layout,
    UploadCloud,
 // Assuming you have this icon from lucide-react
    Layers,
    BarChart,
    
    Apple,
    Package,
    Cloud,
    CloudCog,
    CloudLightning,
    Settings,
     // Assuming you have this icon from lucide-react
    Hash,
    Puzzle,
  } from "lucide-react";
  import { cn } from "@/lib/utils";
  
  interface CourseCardProps {
    title: string;
    description: string;
    type: string; // Now a more generic string
    onLearnMore: (type: string) => void; // Type is now a string
  }
  
  const CourseCard = ({ title, description, type, onLearnMore }: CourseCardProps) => {
    const getIcon = () => {
      switch (type) {
        case "frontend":
          return <Code className="w-6 h-6" />;
        case "backend":
          return <Server className="w-6 h-6" />;
        case "frameworks":
          return <Layout className="w-6 h-6" />;
        case "deployment":
          return <UploadCloud className="w-6 h-6" />;
        
        case "deepLearning":
          return <Layers className="w-6 h-6" />;
        case "dataScience":
          return <BarChart className="w-6 h-6" />;
        case "ios":
          return <Apple className="w-6 h-6" />;
        case "mobileDeployment":
          return <Package className="w-6 h-6" />;
        case "aws":
          return <Cloud className="w-6 h-6" />;
        case "azure":
          return <CloudCog className="w-6 h-6" />;
        case "gcp":
          return <CloudLightning className="w-6 h-6" />;
        case "devops":
          return <Settings className="w-6 h-6" />;
        
        case "csharp":
          return <Hash className="w-6 h-6" />;
        case "gameDesign":
          return <Puzzle className="w-6 h-6" />;
        case "basics": // Fallback for the original types
          return <Book className="w-6 h-6" />;
        case "intermediate":
          return <BookOpen className="w-6 h-6" />;
        case "advanced":
          return <CircleCheck className="w-6 h-6" />;
        case "projects":
          return <BookIcon className="w-6 h-6" />;
        default:
          return <Book className="w-6 h-6" />; // Default icon
      }
    };
  
    const getGradient = () => {
      switch (type) {
        case "frontend":
          return "from-blue-100/10 to-blue-200/10 hover:from-blue-100/20 hover:to-blue-200/20";
        case "backend":
          return "from-green-100/10 to-green-200/10 hover:from-green-100/20 hover:to-green-200/20";
        case "frameworks":
          return "from-purple-100/10 to-purple-200/10 hover:from-purple-100/20 hover:to-purple-200/20";
        case "deployment":
          return "from-yellow-100/10 to-yellow-200/10 hover:from-yellow-100/20 hover:to-yellow-200/20";
        case "python":
          return "from-blue-400/10 to-blue-500/10 hover:from-blue-400/20 hover:to-blue-500/20";
        case "machineLearning":
          return "from-red-400/10 to-red-500/10 hover:from-red-400/20 hover:to-red-500/20";
        case "deepLearning":
          return "from-orange-400/10 to-orange-500/10 hover:from-orange-400/20 hover:to-orange-500/20";
        case "dataScience":
          return "from-teal-400/10 to-teal-500/10 hover:from-teal-400/20 hover:to-teal-500/20";
        case "reactNative":
          return "from-pink-400/10 to-pink-500/10 hover:from-pink-400/20 hover:to-pink-500/20";
        case "android":
          return "from-green-500/10 to-green-600/10 hover:from-green-500/20 hover:to-green-600/20";
        case "ios":
          return "from-gray-700/10 to-gray-800/10 hover:from-gray-700/20 hover:to-gray-800/20";
        case "mobileDeployment":
          return "from-indigo-400/10 to-indigo-500/10 hover:from-indigo-400/20 hover:to-indigo-500/20";
        case "aws":
          return "from-orange-300/10 to-orange-400/10 hover:from-orange-300/20 hover:to-orange-400/20";
        case "azure":
          return "from-blue-300/10 to-blue-400/10 hover:from-blue-300/20 hover:to-blue-400/20";
        case "gcp":
          return "from-yellow-400/10 to-yellow-500/10 hover:from-yellow-400/20 hover:to-yellow-500/20";
        case "devops":
          return "from-red-300/10 to-red-400/10 hover:from-red-300/20 hover:to-red-400/20";
        case "unity":
          return "from-cyan-400/10 to-cyan-500/10 hover:from-cyan-400/20 hover:to-cyan-500/20";
        case "unreal":
          return "from-lime-400/10 to-lime-500/10 hover:from-lime-400/20 hover:to-lime-500/20";
        case "csharp":
          return "from-slate-400/10 to-slate-500/10 hover:from-slate-400/20 hover:to-slate-500/20";
        case "gameDesign":
          return "from-violet-400/10 to-violet-500/10 hover:from-violet-400/20 hover:to-violet-500/20";
        case "basics":
          return "from-gray-100/10 to-gray-200/10 hover:from-gray-100/20 hover:to-gray-200/20";
        case "intermediate":
          return "from-gray-200/10 to-gray-300/10 hover:from-gray-200/20 hover:to-gray-300/20";
        case "advanced":
          return "from-gray-300/10 to-gray-400/10 hover:from-gray-300/20 hover:to-gray-400/20";
        case "projects":
          return "from-gray-400/10 to-gray-500/10 hover:from-gray-400/20 hover:to-gray-500/20";
        default:
          return "from-gray-100/10 to-gray-200/10 hover:from-gray-100/20 hover:to-gray-200/20";
      }
    };
  
    const getIconColor = () => {
      switch (type) {
        case "frontend":
          return "text-blue-600";
        case "backend":
          return "text-green-600";
        case "frameworks":
          return "text-purple-600";
        case "deployment":
          return "text-yellow-600";
        case "python":
          return "text-blue-500";
        case "machineLearning":
          return "text-red-500";
        case "deepLearning":
          return "text-orange-500";
        case "dataScience":
          return "text-teal-500";
        case "reactNative":
          return "text-pink-500";
        case "android":
          return "text-green-700";
        case "ios":
          return "text-gray-900";
        case "mobileDeployment":
          return "text-indigo-500";
        case "aws":
          return "text-orange-400";
        case "azure":
          return "text-blue-400";
        case "gcp":
          return "text-yellow-500";
        case "devops":
          return "text-red-400";
        case "unity":
          return "text-cyan-500";
        case "unreal":
          return "text-lime-500";
        case "csharp":
          return "text-slate-500";
        case "gameDesign":
          return "text-violet-500";
        case "basics":
          return "text-gray-600";
        case "intermediate":
          return "text-gray-700";
        case "advanced":
          return "text-gray-800";
        case "projects":
          return "text-gray-900";
        default:
          return "text-gray-600";
      }
    };
  
    return (
      <div
        className={cn(
          "group relative p-8 rounded-2xl transition-all duration-300",
          "hover:scale-105 hover:shadow-2xl",
          "animate-fade-in backdrop-blur-sm",
          "border border-gray-200 dark:border-gray-800",
          "bg-gradient-to-br",
          getGradient()
        )}
      >
        <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-400 to-gray-500 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-1000 group-hover:duration-200" />
        <div className="relative space-y-4">
          <div className={cn("p-3 w-fit rounded-xl bg-white/50 dark:bg-gray-900/50", getIconColor())}>
            {getIcon()}
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            {description}
          </p>
          <div className="pt-4">
            {/* Learn More Link */}
            <span
              onClick={() => onLearnMore(type)}
              className="text-primary text-sm font-semibold cursor-pointer hover:underline hover:text-primary/80 transition"
            >
              Learn more →
            </span>
          </div>
        </div>
      </div>
    );
  };
  
  export default CourseCard;