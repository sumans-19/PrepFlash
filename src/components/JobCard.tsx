import { Job } from "../types/index";
import { formatDistanceToNow } from "date-fns";
import { Briefcase, MapPin, Calendar, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const formattedDate = formatDistanceToNow(new Date(job.postedAt), { addSuffix: true });
  
  // Get company initials for the logo fallback
  const getCompanyInitials = (companyName: string) => {
    return companyName
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="bg-card rounded-lg shadow-md p-5"
    >
      <div className="flex items-start gap-4">
        <motion.div 
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="flex-shrink-0"
        >
          <Avatar className="h-14 w-14 rounded-md bg-gradient-to-br from-secondary/30 to-primary/30">
            <AvatarImage 
              src={job.logo} 
              alt={`${job.company} logo`} 
              className="object-cover"
            />
            <AvatarFallback className="rounded-md bg-gradient-to-br from-secondary/20 to-primary/20 text-foreground font-bold">
              {job.logo ? (
                <Building className="h-6 w-6" />
              ) : (
                getCompanyInitials(job.company)
              )}
            </AvatarFallback>
          </Avatar>
        </motion.div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg">{job.title}</h3>
            <motion.span 
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="badge badge-secondary px-3 py-1 text-xs font-semibold rounded-full"
            >
              {job.type}
            </motion.span>
          </div>
          
          <div className="mt-2">
            <p className="font-medium text-primary">{job.company}</p>
          </div>
          
          <div className="mt-3 flex flex-wrap gap-3 items-center text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Briefcase className="h-4 w-4" />
              <span>{job.salary}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Posted {formattedDate}</span>
            </div>
          </div>
          
          <div className="mt-3">
            <p className="text-sm line-clamp-2">{job.description}</p>
          </div>
          
          {job.skills.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {job.skills.map((skill, index) => (
                <motion.span 
                  key={index}
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="badge badge-accent bg-accent/10 px-2 py-1 text-xs font-medium rounded-full"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          )}
          
          <div className="mt-4">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button asChild className="w-full sm:w-auto bg-secondary hover:bg-secondary/80">
                <a href={job.applicationUrl} target="_blank" rel="noopener noreferrer">
                  Apply Now
                </a>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default JobCard;