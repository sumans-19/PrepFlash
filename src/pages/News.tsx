import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { fetchArticles } from "@/services/api";
import NewsGrid from "../components/NewsGrid";

import { Article } from "../types/index";
import { motion } from "framer-motion";

const News = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const getArticles = async () => {
      try {
        setIsLoading(true);
        const data = await fetchArticles();
        setArticles(data);
        setFilteredArticles(data);
      } catch (error) {
        console.error("Error fetching articles:", error);
        toast({
          title: "Error",
          description: "Could not fetch the latest news. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    getArticles();
  }, [toast]);

  return (
    <div className="container mx-auto py-4 relative z-20">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="section-header text-3xl font-bold text-foreground mb-2">
          Technology News
        </h1>
        <p className="text-muted-foreground">
          Stay updated with the latest trends and innovations in the tech world
        </p>
      </motion.div>
      
      
      
      <NewsGrid 
        articles={filteredArticles} 
        isLoading={isLoading} 
      />
      
      {!isLoading && filteredArticles.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-4 mb-4">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-10 w-10 text-muted-foreground" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 14h.01M19 21a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-foreground">No articles found</h3>
          <p className="text-muted-foreground max-w-sm mt-2">
            Try changing your search terms or filters to find more articles
          </p>
        </div>
      )}
    </div>
  );
};

export default News;