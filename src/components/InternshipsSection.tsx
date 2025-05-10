import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Building, MapPin } from "lucide-react";
import { fetchInternships } from "../services/api";
import InternshipCard from "./InternshipCard";

const InternshipsSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");

  const { data: internships, isLoading } = useQuery({
    queryKey: ["internships", company, location],
    queryFn: () => fetchInternships({ company, location }),
  });

  const filteredInternships = internships?.filter(
    (internship) =>
      internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      internship.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      internship.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderSkeletonCards = () =>
    Array(4).fill(0).map((_, index) => (
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
              <Skeleton className="h-4 w-1/6" />
            </div>
            <Skeleton className="h-9 w-28" />
          </div>
        </div>
      </div>
    ));

  return (
    <section className="py-10 bg-muted">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <h2 className="text-2xl font-bold">Internship Opportunities</h2>

          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            {/* Search input */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                className="pl-10 pr-4 w-full"
                placeholder="Search internships, companies, locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Company filter with icon and label */}
            <div className="relative md:w-56">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="pl-10 pr-4 w-full"
                aria-label="Filter by company name"
              />
              <label className="absolute -top-5 left-0 text-xs font-medium text-muted-foreground">
                Filter by Company
              </label>
            </div>

            {/* Location filter with icon and label */}
            <div className="relative md:w-56">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-10 pr-4 w-full"
                aria-label="Filter by location"
              />
              <label className="absolute -top-5 left-0 text-xs font-medium text-muted-foreground">
                Filter by Location
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {isLoading
            ? renderSkeletonCards()
            : filteredInternships?.map((internship, index) => (
                <InternshipCard key={index} internship={internship} />
              ))}

          {!isLoading && filteredInternships?.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No internships found</h3>
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

export default InternshipsSection;