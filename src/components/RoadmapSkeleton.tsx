import { Card } from "@/components/ui/card";

export const RoadmapSkeleton = () => {
  return (
    <Card className="w-full max-w-6xl mx-auto p-4 animate-pulse">
      <div className="h-8 w-3/4 bg-muted dark:bg-muted rounded mb-6 mx-auto"></div>
      <div className="space-y-4">
        <div className="h-64 bg-muted dark:bg-muted rounded"></div>
        <div className="grid grid-cols-3 gap-4">
          <div className="h-8 bg-muted dark:bg-muted rounded col-span-1"></div>
          <div className="h-8 bg-muted dark:bg-muted rounded col-span-1"></div>
          <div className="h-8 bg-muted dark:bg-muted rounded col-span-1"></div>
        </div>
      </div>
    </Card>
  );
};