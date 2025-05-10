import { Article } from "../types/index";
import NewsCard from "./NewsCard";
import { motion } from "framer-motion";

interface NewsGridProps {
  articles: Article[];
  isLoading: boolean;
}

const NewsGrid = ({ articles, isLoading }: NewsGridProps) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, index) => (
          <div 
            key={index} 
            className="rounded-lg bg-card shadow-md animate-pulse h-[400px]"
          >
            <div className="h-48 rounded-t-lg bg-muted"></div>
            <div className="p-4">
              <div className="h-4 w-1/4 rounded-full bg-muted mb-4"></div>
              <div className="h-6 rounded-md bg-muted mb-4"></div>
              <div className="h-4 rounded-md bg-muted mb-2"></div>
              <div className="h-4 rounded-md bg-muted w-3/4"></div>
              <div className="flex justify-between mt-8">
                <div className="h-8 w-24 rounded-md bg-muted"></div>
                <div className="flex space-x-2">
                  <div className="h-8 w-8 rounded-full bg-muted"></div>
                  <div className="h-8 w-8 rounded-full bg-muted"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <motion.div 
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {articles.map((article) => (
        <motion.div key={article.id} variants={item}>
          <NewsCard article={article} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default NewsGrid;