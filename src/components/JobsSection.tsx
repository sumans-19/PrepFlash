import { useQuery } from "@tanstack/react-query";
import { fetchJobs } from "../services/api";
import JobCard from "./JobCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";
import { useState } from "react";

const JobsSection = () => {
  const { data: jobs, isLoading } = useQuery({
    queryKey: ["jobs"],
    queryFn: fetchJobs,
  });

  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredJobs = jobs?.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.skills.some((skill) =>
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const renderSkeletonCards = () => {
    return Array(4)
      .fill(0)
      .map((_, index) => (
        <div key={index} className="bg-card rounded-lg shadow-md p-5">
          <div className="flex items-start gap-4">
            <Skeleton className="w-12 h-12 rounded-md" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-1/3 mb-2" />
                <Skeleton className="h-4 w-16 rounded-full" />
              </div>
              <Skeleton className="h-4 w-1/4 mb-3" />
              <div className="flex flex-wrap gap-4 mb-3">
                <Skeleton className="h-4 w-1/6" />
                <Skeleton className="h-4 w-1/6" />
                <Skeleton className="h-4 w-1/6" />
              </div>
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-full mb-3" />
              <div className="flex flex-wrap gap-2 mb-4">
                <Skeleton className="h-4 w-16 rounded-full" />
                <Skeleton className="h-4 w-16 rounded-full" />
                <Skeleton className="h-4 w-16 rounded-full" />
              </div>
              <Skeleton className="h-9 w-28" />
            </div>
          </div>
        </div>
      ));
  };

  return (
    <section className="py-10 bg-muted">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <h2 className="text-2xl font-bold">Job Opportunities</h2>
          
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              className="pl-10 pr-4 w-full md:w-80"
              placeholder="Search jobs, companies, skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-6">
          {isLoading
            ? renderSkeletonCards()
            : filteredJobs?.map((job) => <JobCard key={job.id} job={job} />)}
          
          {filteredJobs?.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No jobs found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or check back later for new opportunities.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default JobsSection;