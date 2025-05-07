
export interface Goal {
    id: string;
    title: string;
    deadline: string;
    completed: boolean;
    description?: string;
  }
  
  export interface WeeklyGoalsByWeek {
    [week: string]: Goal[];
  }
  
  export interface CourseRoadmap {
    duration: string;
    milestones: {
      title: string;
      description: string;
      weeks: number[];
    }[];
  }
  
  export interface WeeklyGoalsProps {
    courseType: string;
  }