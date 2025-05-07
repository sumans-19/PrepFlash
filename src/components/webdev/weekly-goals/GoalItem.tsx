import { Goal } from "@/types/weeklyGoals";
import { Check, Calendar, Clock, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";

interface GoalItemProps {
  goal: Goal;
  weekId: string;
  onToggle: (weekId: string, goalId: string) => void;
}

export default function GoalItem({ goal, weekId, onToggle }: GoalItemProps) {
  // Calculate if goal is due soon (for demonstration - assumes deadline is a date string)
  const isDueSoon = () => {
    // Example implementation - replace with actual date logic
    return goal.deadline.includes("Fri") || goal.deadline.includes("Thu");
  };

  const isPastDue = () => {
    // Example implementation - replace with actual date logic
    return goal.deadline.includes("Mon") || goal.deadline.includes("Tue");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.01 }}
      className={`flex items-start gap-4 p-4 rounded-xl transition-all duration-200 
        ${goal.completed 
          ? "bg-slate-50/70 dark:bg-slate-900/30 border border-slate-200/70 dark:border-slate-800/30" 
          : "bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md"
        }`}
    >
      <div className="mt-1">
        <Checkbox
          id={goal.id}
          checked={goal.completed}
          onCheckedChange={() => onToggle(weekId, goal.id)}
          className={`h-5 w-5 rounded-md border-2 border-indigo-400 
            data-[state=checked]:bg-gradient-to-br data-[state=checked]:from-indigo-500 data-[state=checked]:to-purple-600 
            data-[state=checked]:border-indigo-600 transition-all duration-300
            ${goal.completed ? "" : "hover:border-indigo-500 hover:shadow-indigo-100 dark:hover:shadow-indigo-900/20"}`}
        />
      </div>
      
      <div className="grid gap-2 flex-1">
        <div className="flex justify-between">
          <label
            htmlFor={goal.id}
            className={`font-medium text-base cursor-pointer transition-all duration-300
              ${goal.completed 
                ? "text-slate-400 dark:text-slate-500 line-through" 
                : "text-slate-800 dark:text-slate-200"
              }`}
          >
            {goal.title}
          </label>

          {/* Status indicator */}
          {goal.completed ? (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
            >
              <Check className="h-3 w-3" />
              <span>Completed</span>
            </motion.span>
          ) : isPastDue() ? (
            <span className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400">
              <AlertTriangle className="h-3 w-3" />
              <span>Overdue</span>
            </span>
          ) : isDueSoon() ? (
            <span className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
              <Clock className="h-3 w-3" />
              <span>Due Soon</span>
            </span>
          ) : null}
        </div>
        
        {goal.description && (
          <p className={`text-sm leading-relaxed
            ${goal.completed 
              ? "text-slate-400 dark:text-slate-500" 
              : "text-slate-600 dark:text-slate-400"
            }`}
          >
            {goal.description}
          </p>
        )}
        
        <div className="flex items-center mt-1 gap-3 flex-wrap">
          <Badge 
            className={`
              px-2.5 py-0.5 rounded-md flex items-center gap-1.5 text-xs font-medium
              ${goal.completed 
                ? "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400" 
                : "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800/50"
              }
            `}
          >
            <Calendar className="h-3 w-3" />
            <span>Due: {goal.deadline}</span>
          </Badge>
          
          {/* Progress indicator for partially complete goals (optional) */}
          {!goal.completed && goal.id.includes("3") && (
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-16 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div className="h-full bg-indigo-500 dark:bg-indigo-600" style={{ width: "60%" }}></div>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">60%</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}