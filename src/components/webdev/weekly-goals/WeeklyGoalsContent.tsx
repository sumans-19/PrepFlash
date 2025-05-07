import { useState } from "react";
import { Goal } from "@/types/weeklyGoals";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Calendar, CheckCheck, Target, AlertTriangle, ChevronRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import GoalItem from "./GoalItem";
import { motion } from "framer-motion";

interface WeeklyGoalsContentProps {
  goals: Record<string, Goal[]>;
  toggleGoal: (weekId: string, goalId: string) => void;
  activeWeek: string;
  setActiveWeek: (week: string) => void;
}

export default function WeeklyGoalsContent({ 
  goals, 
  toggleGoal, 
  activeWeek, 
  setActiveWeek 
}: WeeklyGoalsContentProps) {
  const weeks = Object.keys(goals).sort();
  
  // Count completed goals per week - fixed to handle undefined or non-array values
  const getWeekProgress = (weekId: string) => {
    const weekGoals = goals[weekId];
    if (!weekGoals || !Array.isArray(weekGoals) || weekGoals.length === 0) return 0;
    
    const completed = weekGoals.filter(goal => goal.completed).length;
    return Math.round((completed / weekGoals.length) * 100);
  };

  // Get week status for color indicators
  const getWeekStatusColor = (progress: number) => {
    if (progress === 100) return "text-emerald-500 dark:text-emerald-400";
    if (progress >= 50) return "text-amber-500 dark:text-amber-400";
    if (progress > 0) return "text-indigo-500 dark:text-indigo-400";
    return "text-slate-400 dark:text-slate-500";
  };

  const getProgressColor = (progress: number) => {
    if (progress === 100) return "bg-emerald-500 dark:bg-emerald-500";
    if (progress >= 50) return "bg-amber-500 dark:bg-amber-500";
    if (progress > 0) return "bg-indigo-500 dark:bg-indigo-500";
    return "bg-slate-300 dark:bg-slate-600";
  };

  // Get number of goals that are completed in a week
  const getCompletedCount = (weekId: string) => {
    const weekGoals = goals[weekId];
    if (!weekGoals || !Array.isArray(weekGoals)) return 0;
    return weekGoals.filter(goal => goal.completed).length;
  };
  
  // Get total number of goals in a week
  const getTotalCount = (weekId: string) => {
    const weekGoals = goals[weekId];
    if (!weekGoals || !Array.isArray(weekGoals)) return 0;
    return weekGoals.length;
  };

  return (
    <div className="mb-12">
      {/* Header with stylized title */}
      <div className="flex items-center mb-6">
        <div className="h-10 w-1.5 rounded-full bg-gradient-to-b from-purple-500 to-indigo-600"></div>
        <div className="ml-4">
          <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Weekly Goals
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track your progress throughout the course
          </p>
        </div>
      </div>
      
      <Tabs 
        defaultValue={activeWeek} 
        onValueChange={setActiveWeek} 
        className="w-full"
      >
        {/* Week Tabs - Enhanced with indicators */}
        <div className="relative mb-6">
          <div className="absolute h-0.5 bottom-0 left-0 right-0 bg-slate-200 dark:bg-slate-800"></div>
          <div className="flex overflow-x-auto pb-0.5 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
            <TabsList className="bg-transparent h-auto p-0 flex gap-1">
              {weeks.map((weekId) => {
                const weekNumber = weekId.replace('week', '');
                const weekProgress = getWeekProgress(weekId);
                const isActive = activeWeek === weekId;
                
                return (
                  <TabsTrigger 
                    key={weekId} 
                    value={weekId}
                    className={`
                      relative px-6 py-3 rounded-none border-0 text-sm font-medium
                      ${isActive 
                        ? "text-indigo-600 dark:text-indigo-400" 
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                      }
                    `}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`
                        flex items-center justify-center h-6 w-6 rounded-full text-xs font-medium
                        ${weekProgress === 100 
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400" 
                          : weekProgress > 0 
                            ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400"
                            : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400"
                        }
                      `}>
                        {weekNumber}
                      </div>
                      <span>Week {weekNumber}</span>
                      
                      {/* Status indicator */}
                      {weekProgress === 100 ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      ) : weekProgress > 0 ? (
                        <span className="relative h-3 w-3">
                          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${getWeekStatusColor(weekProgress)}`}></span>
                          <span className={`relative inline-flex rounded-full h-3 w-3 ${getWeekStatusColor(weekProgress)}`}></span>
                        </span>
                      ) : null}
                    </div>
                    
                    {/* Active indicator line */}
                    {isActive && (
                      <motion.div 
                        layoutId="activeTabIndicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400"
                      />
                    )}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>
        </div>
        
        {/* Week Content */}
        {weeks.map((weekId) => {
          const weekProgress = getWeekProgress(weekId);
          const completedCount = getCompletedCount(weekId);
          const totalCount = getTotalCount(weekId);
          
          return (
            <TabsContent key={weekId} value={weekId} className="mt-0 outline-none">
              <Card className="border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden bg-white dark:bg-slate-900">
                <CardHeader className="p-6 pb-4 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-900/70">
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`
                        flex h-10 w-10 rounded-full items-center justify-center
                        ${weekProgress === 100 
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" 
                          : "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"
                        }
                      `}>
                        {weekProgress === 100 ? (
                          <CheckCheck className="h-5 w-5" />
                        ) : (
                          <Target className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold">Week {weekId.replace('week', '')} Goals</CardTitle>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                          {completedCount} of {totalCount} goals completed
                        </p>
                      </div>
                    </div>
                    
                    {/* Progress indicator */}
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between px-0.5">
                          <span className="text-xs text-slate-500 dark:text-slate-400">Progress</span>
                          <span className={`text-xs font-medium
                            ${weekProgress === 100 ? "text-emerald-600 dark:text-emerald-400" : ""}
                            ${weekProgress > 0 && weekProgress < 100 ? "text-indigo-600 dark:text-indigo-400" : ""}
                            ${weekProgress === 0 ? "text-slate-500 dark:text-slate-400" : ""}
                          `}>
                            {weekProgress}%
                          </span>
                        </div>
                        <div className="relative">
                          <Progress 
                            value={weekProgress} 
                            className={`w-32 sm:w-40 h-2 rounded-full bg-slate-100 dark:bg-slate-800`}
                          />
                          <div className={`
                            absolute inset-0 h-2 rounded-full opacity-10 transition-all duration-500
                            ${getProgressColor(weekProgress)}
                          `}></div>
                        </div>
                      </div>
                      
                      {/* Status badge */}
                      {weekProgress === 100 ? (
                        <span className="flex items-center gap-1 text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-2.5 py-1 rounded-md border border-emerald-100 dark:border-emerald-900/50">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Complete</span>
                        </span>
                      ) : weekProgress === 0 ? (
                        <span className="flex items-center gap-1 text-xs font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700">
                          <Calendar className="h-3 w-3" />
                          <span>Not Started</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 px-2.5 py-1 rounded-md border border-indigo-100 dark:border-indigo-900/50">
                          <ChevronRight className="h-3 w-3" />
                          <span>In Progress</span>
                        </span>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6 divide-y divide-slate-100 dark:divide-slate-800">
                  <div className="space-y-4">
                    {goals[weekId]?.map((goal) => (
                      <GoalItem 
                        key={goal.id} 
                        goal={goal} 
                        weekId={weekId} 
                        onToggle={toggleGoal} 
                      />
                    ))}
                    
                    {(!goals[weekId] || goals[weekId].length === 0) && (
                      <div className="flex items-center justify-center py-8">
                        <div className="text-center">
                          <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto mb-3 opacity-50" />
                          <p className="text-slate-500 dark:text-slate-400">No goals found for this week.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}