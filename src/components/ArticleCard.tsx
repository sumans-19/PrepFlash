import { Article } from "../types/index";
import { formatDistanceToNow } from "date-fns";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface ArticleCardProps {
  article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const formattedDate = formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true });
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="group relative rounded-lg overflow-hidden bg-card shadow-md h-full flex flex-col"
    >
      <div className="aspect-video relative">
        {article.imageUrl ? (
          <img 
            src={article.imageUrl} 
            alt={article.title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground">No image</span>
          </div>
        )}
        <span className="absolute top-2 left-2 badge badge-primary">
          {article.category}
        </span>
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-bold text-lg mb-2 line-clamp-2">{article.title}</h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{article.description}</p>
        <div className="mt-auto flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{formattedDate}</span>
          <span className="text-xs font-medium">{article.source}</span>
        </div>
      </div>
      
      <a 
        href={article.url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="absolute inset-0 z-10"
        aria-label={`Read more about ${article.title}`}
      >
        <span className="sr-only">Read more</span>
      </a>
      
      <div className="gradient-overlay flex items-center justify-center">
        <motion.div 
          whileHover={{ scale: 1.2 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-background/90 rounded-full p-2"
        >
          <ArrowRight className="text-primary h-5 w-5" />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ArticleCard;
