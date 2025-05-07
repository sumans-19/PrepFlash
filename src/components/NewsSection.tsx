import { useQuery } from "@tanstack/react-query";
import { fetchArticles } from "../services/api";
import ArticleCard from "./ArticleCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

const NewsSection = () => {
  const { data: articles, isLoading } = useQuery({
    queryKey: ["articles"],
    queryFn: fetchArticles,
  });

  // Filter only tech-related articles
  const techArticles = articles?.filter(
    (article) => article.category.toLowerCase().includes("tech")
  );

  // Extract unique subcategories within tech
  const subcategories = techArticles
    ? ["All", ...Array.from(new Set(techArticles.map((article) => article.category)))]
    : ["All"];

  const renderSkeletonCards = () => {
    return Array(6)
      .fill(0)
      .map((_, index) => (
        <div key={index} className="rounded-lg overflow-hidden bg-card shadow-md h-full">
          <Skeleton className="h-48 w-full" />
          <div className="p-4">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-2/3 mb-4" />
            <div className="flex justify-between">
              <Skeleton className="h-3 w-1/4" />
              <Skeleton className="h-3 w-1/4" />
            </div>
          </div>
        </div>
      ));
  };

  return (
    <section className="py-10">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Latest Tech News</h2>
        </div>

        {techArticles?.length === 0 && !isLoading ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No tech news articles available at the moment.</p>
          </div>
        ) : (
          <Tabs defaultValue="All" className="mb-8">
           

            {subcategories.map((category) => (
              <TabsContent key={category} value={category}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {isLoading
                    ? renderSkeletonCards()
                    : techArticles
                        ?.filter(
                          (article) =>
                            category === "All" || article.category === category
                        )
                        .map((article) => (
                          <ArticleCard key={article.id} article={article} />
                        ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </section>
  );
};

export default NewsSection;