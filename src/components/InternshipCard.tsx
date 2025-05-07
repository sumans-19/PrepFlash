import { Internship } from "../types/index";
import { Briefcase, MapPin, Calendar, Building, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";

interface InternshipCardProps {
  internship: Internship;
}

const InternshipCard: React.FC<InternshipCardProps> = ({ internship }) => {
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
      className="bg-card rounded-lg shadow-md p-5 border border-border/50"
    >
      <div className="flex items-start gap-4">
        <motion.div 
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="flex-shrink-0"
        >
          <Avatar className="h-14 w-14 rounded-md bg-gradient-to-br from-accent/30 to-primary/30">
            <AvatarImage 
              src={internship.logo} 
              alt={`${internship.company} logo`} 
              className="object-cover"
            />
            <AvatarFallback className="rounded-md bg-gradient-to-br from-accent/20 to-primary/20 text-foreground font-bold">
              {getCompanyInitials(internship.company)}
            </AvatarFallback>
          </Avatar>
        </motion.div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg">{internship.title}</h3>
            <motion.span 
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="badge badge-primary px-3 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary"
            >
              Internship
            </motion.span>
          </div>
          
          <div className="mt-2">
            <p className="font-medium text-primary">{internship.company}</p>
          </div>
          
          <div className="mt-3 flex flex-wrap gap-3 items-center text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{internship.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Briefcase className="h-4 w-4" />
              <span>{internship.stipend}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{internship.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Posted {internship.postedAt}</span>
            </div>
          </div>
          
          <div className="mt-4">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button asChild className="w-full sm:w-auto bg-accent hover:bg-accent/80 text-accent-foreground">
                <a href={internship.applicationUrl} target="_blank" rel="noopener noreferrer">
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

export default InternshipCard;