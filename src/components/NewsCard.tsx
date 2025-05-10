import { useState } from "react";
import { Article } from "../types/index";
import { formatDate } from "../utils/dateUtils";
import { Calendar, Share, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface NewsCardProps {
  article: Article;
}

const NewsCard = ({ article }: NewsCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="perspective-1000 h-full w-full" 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className={`card-hover h-full w-full transform transition-all duration-500 ${isHovered ? 'shadow-xl' : 'shadow-md'}`}>
        <div className="relative h-48 overflow-hidden rounded-t-lg">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-700 ease-in-out"
            style={{
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=60";
            }}
          />
          <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-70'}`}></div>
          {/* <div className="absolute bottom-2 left-3">
            <span className="badge badge-primary bg-secondary text-secondary-foreground">{article.category}</span>
          </div> */}
          <div className="absolute bottom-2 right-3 flex space-x-2">
            <span className="badge badge-secondary bg-primary/80 text-white text-xs">
              {article.source}
            </span>
          </div>
        </div>
        
        <CardContent className="p-4">
          <div className="mb-2 flex items-center text-xs text-muted-foreground">
            <Calendar className="mr-1 h-3 w-3" />
            <span>{formatDate(article.publishedAt)}</span>
          </div>
          
          <h3 className="mb-2 line-clamp-2 font-semibold text-foreground transition-colors duration-200 hover:text-primary">
            {article.title}
          </h3>
          
          <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
            {article.description}
          </p>
          
          <div className="mt-auto flex items-center justify-between">
            <Button
              variant="default"
              size="sm"
              className={`relative overflow-hidden transition-all duration-300 bg-primary text-white hover:bg-primary/90 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-90'}`}
              onClick={() => window.open(article.url, '_blank')}
            >
              Read More
            </Button>
            
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full transition-colors duration-200 hover:bg-muted hover:text-primary"
              >
                <Share className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full transition-colors duration-200 hover:bg-muted hover:text-primary"
              >
                <Bookmark className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewsCard;