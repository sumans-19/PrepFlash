import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Header from "@/components/NewsHeader";
import JobsSection from "../components/JobsSection";
import InternshipsSection from "../components/InternshipsSection";
import { AnimatePresence, motion } from "framer-motion";
import Navigation from "@/components/Jobsnav";

const Index = () => {
  const [activeTab, setActiveTab] = useState("jobs");
  const [queryClient] = useState(() => new QueryClient());

  const variants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 10 }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col">
        <Header activeTab={""} onTabChange={function (tab: string): void {
          throw new Error("Function not implemented.");
        } } />
        
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex-1"
        >
          <AnimatePresence mode="wait">
            {activeTab === "jobs" ? (
              <motion.div
                key="jobs"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={variants}
                transition={{ duration: 0.3 }}
              >
                <JobsSection />
              </motion.div>
            ) : (
              <motion.div
                key="internships"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={variants}
                transition={{ duration: 0.3 }}
              >
                <InternshipsSection />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.main>
        
      
      </div>
    </QueryClientProvider>
  );
};

export default Index;