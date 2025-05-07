import { CourseRoadmap as CourseRoadmapType } from "@/types/weeklyGoals";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { BookOpen, CheckCircle, Clock, ArrowRight } from "lucide-react";

interface CourseRoadmapProps {
  roadmap: CourseRoadmapType;
}

export default function CourseRoadmap({ roadmap }: CourseRoadmapProps) {
  return (
    <section className="mb-12 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with enhanced styling */}
        <div className="mb-8 flex items-center space-x-3">
          <div className="h-10 w-1.5 rounded-full bg-gradient-to-b from-indigo-500 to-purple-600"></div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Course Roadmap
            <span className="ml-2 text-sm font-normal text-slate-500 dark:text-slate-400">
              Your learning journey
            </span>
          </h2>
        </div>

        {/* Connection lines between cards */}
        <div className="hidden lg:block absolute left-1/2 top-32 h-[calc(100%-4rem)] w-0.5 bg-gradient-to-b from-indigo-500/50 to-purple-500/50 -z-10"></div>

        <div className="relative">
          {roadmap.milestones.map((milestone, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="mb-6"
            >
              <Card className="overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-900/90 backdrop-blur">
                <CardHeader className="bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50 dark:from-indigo-950/40 dark:via-purple-950/40 dark:to-indigo-950/40 py-6 px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300">
                        {i === 0 ? (
                          <BookOpen size={18} />
                        ) : i === roadmap.milestones.length - 1 ? (
                          <CheckCircle size={18} />
                        ) : (
                          <Clock size={18} />
                        )}
                      </div>
                      <CardTitle className="text-xl font-bold">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                          Phase {i + 1}
                        </span>
                        <span className="mx-2 text-slate-400">•</span>
                        {milestone.title}
                      </CardTitle>
                    </div>
                    <Badge className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200 px-3 py-1 rounded-full">
                      {milestone.weeks.length} {milestone.weeks.length === 1 ? "Week" : "Weeks"}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  <p className="text-base text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                    {milestone.description}
                  </p>
                  
                  <div className="flex flex-col gap-4">
                    <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400">Weekly Schedule</h4>
                    <div className="flex flex-wrap gap-2">
                      {milestone.weeks.map((week) => (
                        <Badge
                          key={week}
                          className="bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 hover:from-indigo-100 hover:to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 dark:text-indigo-300 dark:hover:from-indigo-800/50 dark:hover:to-purple-800/50 px-3 py-1.5 rounded-lg border border-indigo-100 dark:border-indigo-800/50 transition-all duration-300"
                        >
                          <Clock size={14} className="inline-block mr-1.5" />
                          Week {week}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {i < roadmap.milestones.length - 1 && (
                    <div className="mt-6 flex justify-end">
                      <ArrowRight className="text-indigo-400 dark:text-indigo-600 animate-pulse" size={18} />
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}