import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar, Badge, CheckCircle, ChevronDown, ChevronUp, Award, Target, Sparkles } from "lucide-react";
import { Badge as UIBadge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Goal, WeeklyGoalsProps } from "@//types/weeklyGoals";
import { weeklyGoalsData, courseRoadmaps } from "@/data/web/weeklyGoalsData";
import CourseRoadmap from "@/components/webdev/weekly-goals/CourseRoadmap";
import WeeklyGoalsContent from "@/components/webdev/weekly-goals/WeeklyGoalsContent";
import DialogFooter from "@/components/webdev/weekly-goals/DialogFooter";

export default function WeeklyGoals({ courseType }: WeeklyGoalsProps) {
  const STORAGE_KEY = `weekly-goals-${courseType}`;
  const [activeWeek, setActiveWeek] = useState("week1");
  const [goals, setGoals] = useState<Record<string, Goal[]>>({});
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);
  const [animateProgress, setAnimateProgress] = useState(false);
  
  // Load goals from localStorage or use default data
  useEffect(() => {
    const savedGoals = localStorage.getItem(STORAGE_KEY);
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    } else {
      setGoals(weeklyGoalsData[courseType] || {});
    }
  }, [courseType, STORAGE_KEY]);

  // Calculate progress whenever goals change
  useEffect(() => {
    if (Object.keys(goals).length === 0) return;
    
    let totalGoals = 0;
    let completedGoals = 0;
    
    // Count all goals across all weeks
    Object.values(goals).forEach(weekGoals => {
      totalGoals += weekGoals.length;
      completedGoals += weekGoals.filter(goal => goal.completed).length;
    });
    
    const progressValue = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;
    setProgress(progressValue);
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
  }, [goals, STORAGE_KEY]);

  // Trigger animation when dialog opens
  useEffect(() => {
    if (open) {
      setTimeout(() => setAnimateProgress(true), 300);
    } else {
      setAnimateProgress(false);
    }
  }, [open]);

  const toggleGoal = (weekId: string, goalId: string) => {
    setGoals(prevGoals => {
      const updatedWeek = prevGoals[weekId].map(goal => 
        goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
      );
      
      return {
        ...prevGoals,
        [weekId]: updatedWeek
      };
    });
  };

  const roadmap = courseRoadmaps[courseType] || { duration: "", milestones: [] };

  const getProgressColor = () => {
    if (progress < 30) return "from-red-500 to-orange-500";
    if (progress < 70) return "from-yellow-500 to-green-500";
    return "from-green-500 to-emerald-400";
  };

  const generateProgressEmoji = () => {
    if (progress === 100) return "🏆";
    if (progress > 75) return "🚀";
    if (progress > 50) return "💪";
    if (progress > 25) return "👍";
    return "🏁";
  };

  // Enhanced CourseRoadmap component
  const EnhancedCourseRoadmap = ({ roadmap }) => {
    return (
      <div className="mb-8 pt-2">
        <div className="flex items-center gap-2 mb-4">
          <Award className="h-6 w-6 text-indigo-600" />
          <h3 className="text-xl font-semibold text-indigo-900 dark:text-indigo-300">Course Journey</h3>
        </div>
        
        <div className="relative">
          {/* Timeline track */}
          <div className="absolute left-6 top-6 bottom-6 w-1 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full"></div>
          
          <div className="space-y-6">
            {roadmap.milestones.map((milestone, index) => (
              <div key={index} className="flex gap-4 items-start group">
                <div className="relative z-10 flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all duration-300">
                  <span className="text-white font-bold">{index + 1}</span>
                </div>
                
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex-grow transform transition-all duration-300 group-hover:translate-x-1 group-hover:shadow-md">
                  <h4 className="font-semibold text-indigo-900 dark:text-indigo-300 mb-1">
                    {milestone.title}
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    {milestone.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Enhanced WeeklyGoalsContent component
  const EnhancedWeeklyGoalsContent = ({ goals, toggleGoal, activeWeek, setActiveWeek }) => {
    const [expandedWeeks, setExpandedWeeks] = useState({ [activeWeek]: true });
    
    const toggleWeekExpansion = (weekId) => {
      setExpandedWeeks(prev => ({
        ...prev,
        [weekId]: !prev[weekId]
      }));
      
      if (!expandedWeeks[weekId]) {
        setActiveWeek(weekId);
      }
    };
    
    return (
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Target className="h-6 w-6 text-indigo-600" />
          <h3 className="text-xl font-semibold text-indigo-900 dark:text-indigo-300">Weekly Goals</h3>
        </div>
        
        <div className="space-y-3">
          {Object.entries(goals).map(([weekId, weekGoals]) => {
            const isExpanded = expandedWeeks[weekId] || false;
            const completedCount = weekGoals.filter(goal => goal.completed).length;
            const weekProgress = Math.round((completedCount / weekGoals.length) * 100);
            
            return (
              <div 
                key={weekId} 
                className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div 
                  className={`flex items-center justify-between p-4 cursor-pointer ${activeWeek === weekId ? 'bg-indigo-50 dark:bg-indigo-900/30' : ''}`}
                  onClick={() => toggleWeekExpansion(weekId)}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 flex items-center justify-center">
                      <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                        {weekId.replace('week', 'W')}
                      </span>
                      
                      {weekProgress === 100 && (
                        <span className="absolute -top-1 -right-1 text-green-500">
                          <CheckCircle className="h-5 w-5" />
                        </span>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-slate-100">
                        Week {weekId.replace('week', '')}
                      </h4>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full bg-gradient-to-r ${weekProgress === 100 ? 'from-green-500 to-emerald-400' : 'from-indigo-500 to-purple-500'}`}
                            style={{ width: `${weekProgress}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {completedCount}/{weekGoals.length}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <UIBadge 
                      variant="outline" 
                      className={`${
                        weekProgress === 100 
                          ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800' 
                          : 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                      }`}
                    >
                      {weekProgress}%
                    </UIBadge>
                    
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-slate-400" />
                    )}
                  </div>
                </div>
                
                {isExpanded && (
                  <div className="px-4 pb-4 pt-1">
                    <div className="space-y-2 ml-12">
                      {weekGoals.map(goal => (
                        <div 
                          key={goal.id}
                          className={`flex items-start gap-3 p-3 rounded-lg transition-colors duration-300 ${
                            goal.completed 
                              ? 'bg-green-50 dark:bg-green-900/20' 
                              : 'bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                          }`}
                        >
                          <div className="flex-shrink-0 mt-0.5">
                            <div 
                              className={`h-5 w-5 rounded-full flex items-center justify-center cursor-pointer border ${
                                goal.completed 
                                  ? 'bg-green-500 border-green-600 text-white' 
                                  : 'border-slate-300 dark:border-slate-600'
                              }`}
                              onClick={() => toggleGoal(weekId, goal.id)}
                            >
                              {goal.completed && <CheckCircle className="h-4 w-4" />}
                            </div>
                          </div>
                          
                          <div className="flex-grow">
                            <h5 
                              className={`font-medium mb-1 ${
                                goal.completed 
                                  ? 'text-green-800 dark:text-green-400 line-through opacity-80' 
                                  : 'text-slate-900 dark:text-slate-200'
                              }`}
                            >
                              {goal.title}
                            </h5>
                            
                            <p 
                              className={`text-sm ${
                                goal.completed 
                                  ? 'text-green-700/70 dark:text-green-500/70' 
                                  : 'text-slate-600 dark:text-slate-400'
                              }`}
                            >
                              {goal.description}
                            </p>
                            
                            {goal.resources && (
                              <div className="mt-2 flex flex-wrap gap-2">
                                {goal.resources.map((resource, idx) => (
                                  <a
                                    key={idx}
                                    href={resource.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs inline-flex items-center gap-1 px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-800/40 transition-colors"
                                  >
                                    {resource.type === 'video' && '🎥'}
                                    {resource.type === 'article' && '📄'}
                                    {resource.type === 'exercise' && '💻'}
                                    {resource.name}
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Enhanced DialogFooter component
  const EnhancedDialogFooter = ({ progress, onClose }) => {
    return (
      <div className="border-t border-slate-200 dark:border-slate-700 p-6 bg-slate-50 dark:bg-slate-900/50">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16">
              {/* Circular progress */}
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 100 100">
                <circle 
                  cx="50" cy="50" r="45" 
                  className="stroke-slate-200 dark:stroke-slate-700" 
                  strokeWidth="8" 
                  fill="none" 
                />
                <circle 
                  cx="50" cy="50" r="45" 
                  className={`stroke-current ${
                    progress === 100 ? 'text-green-500' : 'text-indigo-600'
                  }`}
                  strokeWidth="8" 
                  strokeLinecap="round"
                  strokeDasharray="283"
                  strokeDashoffset={283 - (283 * progress) / 100}
                  fill="none" 
                  style={{ 
                    transition: animateProgress ? 'stroke-dashoffset 1s ease-in-out' : 'none'
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-slate-900 dark:text-white">
                  {animateProgress ? progress : 0}%
                </span>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                Overall Progress 
                <span className="text-xl">{generateProgressEmoji()}</span>
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {progress === 100 
                  ? 'Amazing! You\'ve completed all goals!' 
                  : `Keep going, you're making great progress!`}
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Close
            </Button>
            
            <Button 
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={onClose}
            >
              Continue Learning
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          className="gap-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
        >
          <span className="absolute inset-0 bg-white/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500"></span>
          <Calendar className="h-4 w-4 relative z-10" />
          <span className="relative z-10">Weekly Goals</span>
          <div className="relative z-10 flex items-center">
            <UIBadge 
              variant="secondary" 
              className={`ml-1 bg-white/20 hover:bg-white/30 ${
                progress === 100 ? 'flex items-center gap-1' : ''
              }`}
            >
              {progress}%
              {progress === 100 && <Sparkles className="h-3 w-3" />}
            </UIBadge>
          </div>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-5xl p-0 gap-0 overflow-hidden rounded-xl border-0 shadow-2xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950">
        <DialogHeader className="p-8 pb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/10 opacity-20"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent"></div>
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-pink-500/20 rounded-full blur-2xl"></div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-center">
              <DialogTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/90">
                Course Roadmap & Weekly Goals
              </DialogTitle>
              <UIBadge 
                variant="outline" 
                className="text-sm font-normal border-white/30 bg-white/10 text-white py-1.5 px-3"
              >
                {roadmap.duration}
              </UIBadge>
            </div>
            <p className="text-white/80 mt-3 text-lg font-light max-w-2xl">
              Track your progress through the {courseType.split('-').join(' ')} course curriculum
            </p>
          </div>
        </DialogHeader>
        
        <div className="p-8 pb-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Course Roadmap Section */}
            <EnhancedCourseRoadmap roadmap={roadmap} />
            
            {/* Weekly Goals Section */}
            <EnhancedWeeklyGoalsContent 
              goals={goals} 
              toggleGoal={toggleGoal} 
              activeWeek={activeWeek} 
              setActiveWeek={setActiveWeek} 
            />
          </div>
        </div>
        
        <EnhancedDialogFooter progress={progress} onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}