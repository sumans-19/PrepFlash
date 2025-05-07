import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ChevronRight, X } from "lucide-react";

interface DialogFooterProps {
  progress: number;
  onClose: () => void;
}

export default function DialogFooter({ progress, onClose }: DialogFooterProps) {
  // Determine color based on progress
  const getProgressColor = () => {
    if (progress < 30) return "bg-red-500";
    if (progress < 70) return "bg-amber-500";
    return "bg-emerald-500";
  };

  return (
    <div className="relative">
      {/* Top Progress Indicator */}
      <div className="absolute top-0 left-0 right-0 h-1">
        <div 
          className={`h-full transition-all duration-700 ease-in-out ${getProgressColor()}`} 
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 py-5 px-6 flex justify-between items-center border-t border-slate-200 dark:border-slate-800 shadow-inner">
        <div className="flex items-center gap-5">
          <div className="relative flex items-center">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300 mr-3">Progress</span>
            <div className="relative">
              <Progress 
                value={progress} 
                className="w-40 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700" 
              />
              <div 
                className={`absolute top-0 left-0 h-2.5 rounded-full transition-all duration-700 ${getProgressColor()} opacity-10`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="ml-3 flex items-center">
              <span className={`
                text-sm font-bold tracking-tight tabular-nums
                ${progress < 30 ? 'text-red-600 dark:text-red-400' : ''}
                ${progress >= 30 && progress < 70 ? 'text-amber-600 dark:text-amber-400' : ''}
                ${progress >= 70 ? 'text-emerald-600 dark:text-emerald-400' : ''}
              `}>
                {progress}%
              </span>
              <ChevronRight 
                className={`h-3.5 w-3.5 opacity-70 ml-0.5
                  ${progress < 30 ? 'text-red-600 dark:text-red-400' : ''}
                  ${progress >= 30 && progress < 70 ? 'text-amber-600 dark:text-amber-400' : ''}
                  ${progress >= 70 ? 'text-emerald-600 dark:text-emerald-400' : ''}
                `} 
              />
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            onClick={onClose} 
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 dark:border-slate-700 dark:hover:border-slate-600 shadow-sm transition-all duration-200 px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <span>Close</span>
            <X className="h-4 w-4 opacity-70" />
          </Button>
        </div>
      </div>
    </div>
  );
}