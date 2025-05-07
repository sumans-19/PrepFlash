
export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    points: number;
    streak: number;
    solved: number;
    createdAt: Date;
    joinedGroups: string[];
    achievements: Achievement[];
  }
  
  export interface StudyGroup {
    id: string;
    name: string;
    description: string;
    focus: string;
    meetingDay: string;
    meetingTime: string;
    capacity: number;
    members: string[];
    creatorId: string;
    createdAt: Date;
    meetingLink?: string;
    resources?: Resource[];
  }
  
  export interface ForumPost {
    id: string;
    authorId: string;
    authorName: string;
    authorAvatar?: string;
    category: string;
    title: string;
    content: string;
    likes: string[];
    comments: Comment[];
    createdAt: Date;
  }
  
  export interface Comment {
    id: string;
    authorId: string;
    authorName: string;
    authorAvatar?: string;
    content: string;
    createdAt: Date;
  }
  
  export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    progress: number;
    completed: boolean;
    date?: string;
    current?: number;
    target?: number;
  }
  
  export interface Resource {
    id: string;
    title: string;
    type: string;
    author: string;
    tags: string[];
    stars: string[];
    downloads: number;
    thumbnail?: string;
    fileUrl?: string;
  }
  
  export interface DailyChallenge {
    id: string;
    title: string;
    description: string;
    type: string;
    date: Date;
    completedBy: string[];
  }
  