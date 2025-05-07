import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Users, Award, CalendarDays, MessageSquare, Star,
  Trophy, Bell, Settings, Link, Share2, Edit, User,
  BookOpen, LayoutList, LayoutDashboard, Sparkles,
  MessageCircle, ThumbsUp, Send
} from "lucide-react";
import { DashboardNav } from '@/components/DashboardNav';

// Leaderboard component
const Leaderboard = () => {
  const [sortBy, setSortBy] = useState("points");
  const [timeframe, setTimeframe] = useState("week");
  const [users, setUsers] = useState([
    { id: 1, name: "Alex Johnson", points: 1250, streak: 12, solved: 45, avatar: "https://i.pravatar.cc/150?img=1" },
    { id: 2, name: "Jamie Smith", points: 980, streak: 8, solved: 32, avatar: "https://i.pravatar.cc/150?img=2" },
    { id: 3, name: "Taylor Kim", points: 870, streak: 15, solved: 28, avatar: "https://i.pravatar.cc/150?img=3" },
    { id: 4, name: "Morgan Lee", points: 760, streak: 7, solved: 24, avatar: "https://i.pravatar.cc/150?img=4" },
    { id: 5, name: "Casey Brown", points: 650, streak: 5, solved: 19, avatar: "https://i.pravatar.cc/150?img=5" },
  ]);

  useEffect(() => {
    const sortedUsers = [...users].sort((a, b) => {
      if (sortBy === "points") return b.points - a.points;
      if (sortBy === "streak") return b.streak - a.streak;
      return b.solved - a.solved;
    });
    setUsers(sortedUsers);
  }, [sortBy]);

  const getScoreColor = (index: number) => {
    if (index === 0) return "text-amber-400";
    if (index === 1) return "text-slate-400";
    if (index === 2) return "text-amber-700";
    return "text-muted-foreground";
  };

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-indigo-950/70 to-slate-900/90 backdrop-blur-md">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-400" />
            <span>Interview Champions</span>
          </CardTitle>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTimeframe("day")}
              className={timeframe === "day" ? "bg-primary/20 text-primary" : ""}
            >
              Day
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTimeframe("week")}
              className={timeframe === "week" ? "bg-primary/20 text-primary" : ""}
            >
              Week
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTimeframe("month")}
              className={timeframe === "month" ? "bg-primary/20 text-primary" : ""}
            >
              Month
            </Button>
          </div>
        </div>
        <CardDescription>
          Top performers based on points, streaks, and problems solved
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex mb-4 border-b border-slate-800 pb-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSortBy("points")}
            className={sortBy === "points" ? "border-b-2 border-primary rounded-none" : ""}
          >
            Points
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSortBy("streak")}
            className={sortBy === "streak" ? "border-b-2 border-primary rounded-none" : ""}
          >
            Streak
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSortBy("solved")}
            className={sortBy === "solved" ? "border-b-2 border-primary rounded-none" : ""}
          >
            Problems Solved
          </Button>
        </div>

        <div className="space-y-4">
          {users.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-6 font-medium text-center">{index + 1}</div>
                <Avatar className="h-10 w-10 border-2 border-slate-700">
                  <img src={user.avatar} alt={user.name} className="object-cover" />
                </Avatar>
                <div>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {user.solved} problems · {user.streak} day streak
                  </div>
                </div>
              </div>
              <div className={`font-bold text-lg ${getScoreColor(index)}`}>
                {user.points}
                <span className="text-xs ml-1">pts</span>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-center pt-0">
        <Button variant="outline" className="w-full">
          View Full Leaderboard
        </Button>
      <Button variant="outline" className="w-full">
        View Daily Challenges
      </Button>
      </CardFooter>
    </Card>
  );
};

// Daily Streak component
const DailyStreak = () => {
  const { toast } = useToast();
  const [currentStreak, setCurrentStreak] = useState(7);
  const [longestStreak, setLongestStreak] = useState(14);
  const [todayCompleted, setTodayCompleted] = useState(false);

  // Mock days of the week with completion status
  const [weekData, setWeekData] = useState([
    { day: "Mon", completed: true },
    { day: "Tue", completed: true },
    { day: "Wed", completed: true },
    { day: "Thu", completed: true },
    { day: "Fri", completed: true },
    { day: "Sat", completed: true },
    { day: "Sun", completed: false }, // Today
  ]);

  const handleCompleteChallenge = () => {
    setTodayCompleted(true);
    setCurrentStreak(currentStreak + 1);

    const updatedWeekData = weekData.map((item, index) =>
      index === 6 ? { ...item, completed: true } : item
    );
    setWeekData(updatedWeekData);

    if (currentStreak + 1 > longestStreak) {
      setLongestStreak(currentStreak + 1);
    }

    toast({
      title: "Daily challenge completed!",
      description: `You've maintained a ${currentStreak + 1}-day streak. Keep it up!`,
    });
  };

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-indigo-950/70 to-slate-900/90 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-primary" />
          <span>Daily Interview Streak</span>
        </CardTitle>
        <CardDescription>
          Complete daily challenges to build your streak
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-7 gap-2">
          {weekData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className={`flex flex-col items-center justify-center p-3 rounded-lg ${item.completed
                  ? "bg-primary/20 border border-primary/30"
                  : "bg-slate-800/50 border border-slate-700/30"
                }`}
            >
              <div className="text-sm font-medium">{item.day}</div>
              <div className="mt-1">
                {item.completed ? (
                  <Star className="h-5 w-5 text-primary fill-primary" />
                ) : (
                  <Star className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-slate-900/50">
            <div className="text-3xl font-bold text-primary">{currentStreak}</div>
            <div className="text-sm text-muted-foreground">Current Streak</div>
          </div>
          <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-slate-900/50">
            <div className="text-3xl font-bold">{longestStreak}</div>
            <div className="text-sm text-muted-foreground">Longest Streak</div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-3">Today's Challenge</h3>
          <Card className="bg-slate-800/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">System Design Interview</CardTitle>
              <CardDescription>Solve one system design problem</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Design a scalable notification system for a social media platform
              </p>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                disabled={todayCompleted}
                onClick={handleCompleteChallenge}
              >
                {todayCompleted ? "Completed!" : "Mark as Complete"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

// Discussion Forum component
const DiscussionForum = () => {
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState("all");
  const [newPost, setNewPost] = useState("");

  const [posts, setPosts] = useState([
    {
      id: 1,
      author: "Taylor Kim",
      avatar: "https://i.pravatar.cc/150?img=3",
      category: "system-design",
      title: "Approaches to database sharding",
      content: "What are some effective strategies for database sharding in high-traffic applications? I'm working on a project that needs to scale horizontally.",
      likes: 24,
      comments: 8,
      time: "2 hours ago",
    },
    {
      id: 2,
      author: "Alex Johnson",
      avatar: "https://i.pravatar.cc/150?img=1",
      category: "algorithms",
      title: "Optimizing dynamic programming solutions",
      content: "I'm struggling with optimizing a DP solution for a knapsack problem variant. Any tips on reducing the space complexity?",
      likes: 15,
      comments: 12,
      time: "4 hours ago",
    },
    {
      id: 3,
      author: "Jamie Smith",
      avatar: "https://i.pravatar.cc/150?img=2",
      category: "behavioral",
      title: "Handling conflict resolution questions",
      content: "What's your go-to framework for answering conflict resolution questions in behavioral interviews?",
      likes: 32,
      comments: 18,
      time: "6 hours ago",
    },
  ]);

  const handlePostSubmit = () => {
    if (!newPost.trim()) return;

    const newPostObj = {
      id: posts.length + 1,
      author: "You",
      avatar: "https://i.pravatar.cc/150?img=8",
      category: "general",
      title: newPost.slice(0, 50) + (newPost.length > 50 ? "..." : ""),
      content: newPost,
      likes: 0,
      comments: 0,
      time: "Just now",
    };

    setPosts([newPostObj, ...posts]);
    setNewPost("");

    toast({
      title: "Post created!",
      description: "Your discussion has been posted to the forum.",
    });
  };

  const filterPosts = () => {
    if (activeCategory === "all") return posts;
    return posts.filter(post => post.category === activeCategory);
  };

  const handleLike = (postId: number) => {
    setPosts(posts.map(post =>
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    ));
  };

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-indigo-950/70 to-slate-900/90 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          <span>Interview Discussion Forum</span>
        </CardTitle>
        <CardDescription>
          Share your experiences and learn from the community
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Post creation */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Start a discussion</h3>
          <div className="flex gap-2">
            <Input
              placeholder="Share your interview experience or ask a question..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              className="bg-slate-900/50"
            />
            <Button onClick={handlePostSubmit} disabled={!newPost.trim()}>
              <Send className="h-4 w-4 mr-2" />
              Post
            </Button>
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveCategory("all")}
            className={activeCategory === "all" ? "bg-primary/20 text-primary" : ""}
          >
            All Topics
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveCategory("algorithms")}
            className={activeCategory === "algorithms" ? "bg-primary/20 text-primary" : ""}
          >
            Algorithms
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveCategory("system-design")}
            className={activeCategory === "system-design" ? "bg-primary/20 text-primary" : ""}
          >
            System Design
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveCategory("behavioral")}
            className={activeCategory === "behavioral" ? "bg-primary/20 text-primary" : ""}
          >
            Behavioral
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveCategory("career")}
            className={activeCategory === "career" ? "bg-primary/20 text-primary" : ""}
          >
            Career Advice
          </Button>
        </div>

        {/* Posts list */}
        <div className="space-y-4">
          {filterPosts().map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="bg-slate-900/50 hover:bg-slate-800/50 transition-colors">
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <img src={post.avatar} alt={post.author} />
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{post.author}</p>
                        <p className="text-xs text-muted-foreground">{post.time}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-slate-800 text-xs">
                      {post.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-base mt-2">{post.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{post.content}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground"
                    onClick={() => handleLike(post.id)}
                  >
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    {post.likes}
                  </Button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    {post.comments}
                  </Button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="outline" className="w-full">
          View All Discussions
        </Button>
      </CardFooter>
    </Card>
  );
};

// Study Group feature - New feature #1
const StudyGroups = () => {
  const { toast } = useToast();
  const [groups, setGroups] = useState([
    {
      id: 1,
      name: "System Design Masters",
      members: 16,
      focus: "System Design",
      meetingDay: "Wednesdays",
      meetingTime: "7:00 PM",
      capacity: 20,
    },
    {
      id: 2,
      name: "Algorithm Wizards",
      members: 12,
      focus: "Data Structures & Algorithms",
      meetingDay: "Tuesdays",
      meetingTime: "6:30 PM",
      capacity: 15,
    },
    {
      id: 3,
      name: "Frontend Interview Prep",
      members: 8,
      focus: "Frontend Technologies",
      meetingDay: "Saturdays",
      meetingTime: "10:00 AM",
      capacity: 12,
    }
  ]);

  const handleJoin = (groupId: number) => {
    setGroups(groups.map(group =>
      group.id === groupId ? { ...group, members: group.members + 1 } : group
    ));

    toast({
      title: "Group joined!",
      description: "You've successfully joined the study group.",
    });
  };

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-indigo-950/70 to-slate-900/90 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-emerald-400" />
          <span>Study Groups</span>
        </CardTitle>
        <CardDescription>
          Join collaborative study groups to prepare together
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {groups.map((group, index) => (
          <motion.div
            key={group.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className="bg-slate-900/50 overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-emerald-400 to-blue-500" />
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center justify-between">
                  {group.name}
                  <Badge variant="outline" className="bg-slate-800 text-xs">
                    {group.focus}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex justify-between text-sm">
                  <div className="text-muted-foreground">
                    <p>{group.meetingDay} at {group.meetingTime}</p>
                    <div className="mt-1 flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      <span>
                        {group.members}/{group.capacity} members
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="h-2 w-32 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-blue-500"
                        style={{ width: `${(group.members / group.capacity) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => handleJoin(group.id)}
                  disabled={group.members >= group.capacity}
                >
                  {group.members >= group.capacity ? "Group Full" : "Join Group"}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
        <Button className="w-full">
          <Users className="h-4 w-4 mr-2" />
          Create Study Group
        </Button>
      </CardContent>
    </Card>
  );
};

// Achievements feature - New feature #2
const Achievements = () => {
  const [recentAchievements, setRecentAchievements] = useState([
    {
      id: 1,
      title: "Problem Solver",
      description: "Solved 50 practice problems",
      icon: "🏆",
      progress: 100,
      completed: true,
      date: "2 days ago"
    },
    {
      id: 2,
      title: "Consistency Champion",
      description: "Maintained a 10-day streak",
      icon: "🔥",
      progress: 100,
      completed: true,
      date: "5 days ago"
    }
  ]);

  const [inProgressAchievements, setInProgressAchievements] = useState([
    {
      id: 3,
      title: "Feedback Master",
      description: "Receive feedback on 10 interview answers",
      icon: "🎯",
      progress: 70,
      completed: false,
      current: 7,
      target: 10
    },
    {
      id: 4,
      title: "Community Contributor",
      description: "Create 5 discussion topics",
      icon: "👥",
      progress: 60,
      completed: false,
      current: 3,
      target: 5
    },
    {
      id: 5,
      title: "Algorithm Expert",
      description: "Master all algorithm categories",
      icon: "🧠",
      progress: 25,
      completed: false,
      current: 2,
      target: 8
    }
  ]);

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-indigo-950/70 to-slate-900/90 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-amber-400" />
          <span>Achievements</span>
        </CardTitle>
        <CardDescription>
          Track your progress and earn badges
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {recentAchievements.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-3 text-muted-foreground">Recently Earned</h3>
            <div className="space-y-3">
              {recentAchievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg border border-amber-500/20"
                >
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <div className="font-medium">{achievement.title}</div>
                    <div className="text-xs text-muted-foreground flex justify-between">
                      <span>{achievement.description}</span>
                      <span>{achievement.date}</span>
                    </div>
                  </div>
                  <div>
                    <Badge className="bg-amber-500/20 text-amber-300 border-amber-400/30">
                      Earned
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h3 className="text-sm font-medium mb-3 text-muted-foreground">In Progress</h3>
          <div className="space-y-3">
            {inProgressAchievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
                className="p-3 bg-slate-900/50 rounded-lg border border-slate-800/50"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <div className="font-medium">{achievement.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {achievement.description}
                    </div>
                  </div>
                  <div className="text-sm font-medium">
                    {achievement.current}/{achievement.target}
                  </div>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${achievement.progress}%` }}
                    transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                    className="h-full bg-gradient-to-r from-emerald-500 to-blue-500"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <Button variant="outline" className="w-full">
          <Award className="h-4 w-4 mr-2" />
          View All Achievements
        </Button>
      </CardContent>
    </Card>
  );
};

// Resource Hub feature - New feature #3
const ResourceHub = () => {
  const [activeTab, setActiveTab] = useState("recent");
  const [resources, setResources] = useState([
    {
      id: 1,
      title: "System Design Interview Guide",
      type: "PDF",
      author: "Alex Johnson",
      tags: ["system-design", "advanced"],
      stars: 124,
      downloads: 1320,
      thumbnail: "https://www.cadence.com/content/dam/cadence-www/global/en_US/images/resources/whitepaper/intelligent-system-design-wp-1.jpg",
    },
    {
      id: 2,
      title: "Mastering Binary Trees",
      type: "Article",
      author: "Taylor Kim",
      tags: ["algorithms", "trees", "intermediate"],
      stars: 89,
      downloads: 940,
      thumbnail: "https://www.cadence.com/content/dam/cadence-www/global/en_US/images/resources/whitepaper/intelligent-system-design-wp-1.jpg",
    },
    {
      id: 3,
      title: "Behavioral Interview Cheatsheet",
      type: "Infographic",
      author: "Jamie Smith",
      tags: ["behavioral", "beginner"],
      stars: 203,
      downloads: 2150,
      thumbnail: "https://www.cadence.com/content/dam/cadence-www/global/en_US/images/resources/whitepaper/intelligent-system-design-wp-1.jpg",
    },
  ]);

  const handleStar = (resourceId: number) => {
    setResources(resources.map(resource =>
      resource.id === resourceId ? { ...resource, stars: resource.stars + 1 } : resource
    ));
  };

  const handleDownload = (resourceId: number) => {
    setResources(resources.map(resource =>
      resource.id === resourceId ? { ...resource, downloads: resource.downloads + 1 } : resource
    ));
  };

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-indigo-950/70 to-slate-900/90 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-blue-400" />
          <span>Resource Hub</span>
        </CardTitle>
        <CardDescription>
          Community-shared interview preparation materials
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveTab("recent")}
            className={activeTab === "recent" ? "bg-primary/20 text-primary" : ""}
          >
            Recent
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveTab("popular")}
            className={activeTab === "popular" ? "bg-primary/20 text-primary" : ""}
          >
            Popular
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveTab("saved")}
            className={activeTab === "saved" ? "bg-primary/20 text-primary" : ""}
          >
            Saved
          </Button>
        </div>

        <div className="space-y-3">
          {resources.map((resource, index) => (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg hover:bg-slate-800/50 transition-colors"
            >
              <div className="w-10 h-10 rounded overflow-hidden bg-slate-800">
                <img src={resource.thumbnail} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{resource.title}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <span>{resource.type}</span>
                  <span className="mx-1">•</span>
                  <span>{resource.author}</span>
                </div>
                <div className="flex gap-1 mt-1">
                  {resource.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs py-0">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleStar(resource.id)}
                >
                  <div className="flex items-center gap-1 text-xs">
                    <Star className="h-3 w-3 text-amber-400" />
                    {resource.stars}
                  </div>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleDownload(resource.id)}
                >
                  <div className="flex items-center gap-1 text-xs">
                    <BookOpen className="h-3 w-3" />
                    {resource.downloads}
                  </div>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <Button variant="outline" className="w-full">
          <BookOpen className="h-4 w-4 mr-2" />
          Browse All Resources
        </Button>
      </CardContent>
    </Card>
  );
};

// Mock Interview Scheduler - New feature #4
const MockInterviewScheduler = () => {
  const { toast } = useToast();
  const [interviews, setInterviews] = useState([
    {
      id: 1,
      type: "System Design",
      date: "May 5, 2025",
      time: "3:00 PM",
      duration: "45 min",
      interviewer: "Alex Johnson",
      status: "upcoming",
    },
  ]);

  const [slots] = useState([
    { id: 1, date: "May 7, 2025", time: "10:00 AM", interviewer: "Taylor Kim", expertise: "Algorithms" },
    { id: 2, date: "May 7, 2025", time: "2:30 PM", interviewer: "Jamie Smith", expertise: "Frontend" },
    { id: 3, date: "May 8, 2025", time: "11:00 AM", interviewer: "Morgan Lee", expertise: "System Design" },
    { id: 4, date: "May 9, 2025", time: "4:00 PM", interviewer: "Casey Brown", expertise: "Behavioral" },
  ]);

  const handleBookSlot = (slotId: number) => {
    toast({
      title: "Interview booked!",
      description: "Your mock interview has been scheduled.",
    });
  };

  const handleCancelInterview = (interviewId: number) => {
    setInterviews(interviews.filter(interview => interview.id !== interviewId));
    toast({
      title: "Interview canceled",
      description: "Your mock interview has been canceled.",
    });
  };

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-indigo-950/70 to-slate-900/90 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-blue-400" />
          <span>Mock Interview Scheduler</span>
        </CardTitle>
        <CardDescription>
          Practice with peer interviews to sharpen your skills
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {interviews.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-3 text-muted-foreground">Upcoming Interviews</h3>
            <div className="space-y-3">
              {interviews.map((interview, index) => (
                <motion.div
                  key={interview.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-3 rounded-lg bg-blue-950/30 border border-blue-900/50"
                >
                  <div className="flex justify-between items-center mb-2">
                    <Badge className="bg-blue-600/30 text-blue-400 border-blue-500/30">
                      {interview.type}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {interview.duration}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {interview.date} at {interview.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>With {interview.interviewer}</span>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCancelInterview(interview.id)}
                    >
                      Cancel
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h3 className="text-sm font-medium mb-3 text-muted-foreground">Available Slots</h3>
          <div className="space-y-3">
            {slots.map((slot, index) => (
              <motion.div
                key={slot.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="p-3 rounded-lg bg-slate-900/50 border border-slate-800/50 hover:bg-slate-800/30 transition-colors"
              >
                <div className="flex justify-between items-center mb-1">
                  <div className="text-sm font-medium">{slot.date}</div>
                  <Badge variant="outline" className="text-xs">
                    {slot.expertise}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    {slot.time} with {slot.interviewer}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleBookSlot(slot.id)}
                  >
                    Book
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <Button>
            <CalendarDays className="h-4 w-4 mr-2" />
            Add Availability
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Collaborative Whiteboard - New feature #5
const CollaborativeWhiteboard = () => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const handleStartSession = () => {
    setIsOpen(true);
    toast({
      title: "Feature coming soon!",
      description: "Collaborative whiteboarding will be available in the next update.",
    });
  };

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-indigo-950/70 to-slate-900/90 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LayoutDashboard className="h-5 w-5 text-purple-400" />
          <span>Collaborative Whiteboard</span>
        </CardTitle>
        <CardDescription>
          Practice system design and algorithms with real-time collaboration
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="aspect-video rounded-lg overflow-hidden bg-slate-900/70 border border-slate-800/50 flex items-center justify-center">
          <div className="text-center p-6">
            <div className="mb-4">
              <LayoutDashboard className="h-12 w-12 mx-auto text-purple-500/70" />
            </div>
            <h3 className="text-lg font-medium mb-2">Interactive Whiteboard</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Collaborate with peers on system design diagrams, algorithm visualizations, and code snippets in real-time
            </p>
            <Button onClick={handleStartSession}>
              <Sparkles className="h-4 w-4 mr-2" />
              Start New Session
            </Button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <Card className="bg-slate-900/50 p-3">
            <div className="text-xs font-medium mb-1">Features</div>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li className="flex items-center gap-1">
                <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                Real-time drawing
              </li>
              <li className="flex items-center gap-1">
                <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                Code snippets
              </li>
              <li className="flex items-center gap-1">
                <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                Sharing & export
              </li>
            </ul>
          </Card>
          <Card className="bg-slate-900/50 p-3">
            <div className="text-xs font-medium mb-1">Use Cases</div>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li className="flex items-center gap-1">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                System design
              </li>
              <li className="flex items-center gap-1">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                Algorithm tracing
              </li>
              <li className="flex items-center gap-1">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                Mock interviews
              </li>
            </ul>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

// Main Community Page component
const CommunityPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background/90 to-slate-950/90">
      {/* Add DashboardNav component at the top */}
      <DashboardNav />

      {/* Hero section with animated background */}
      <div className="relative py-20 px-4 overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 to-slate-950/30" />

        {/* Animated dots/circles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-primary/10"
              initial={{
                x: Math.random() * 100 - 50 + "%",
                y: Math.random() * 100 - 50 + "%",
                scale: Math.random() * 0.5 + 0.5,
              }}
              animate={{
                x: [
                  Math.random() * 100 - 50 + "%",
                  Math.random() * 100 - 50 + "%",
                  Math.random() * 100 - 50 + "%",
                ],
                y: [
                  Math.random() * 100 - 50 + "%",
                  Math.random() * 100 - 50 + "%",
                  Math.random() * 100 - 50 + "%",
                ],
              }}
              transition={{
                duration: Math.random() * 20 + 20,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                width: Math.random() * 300 + 50,
                height: Math.random() * 300 + 50,
                opacity: 0.1,
                filter: "blur(40px)",
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            className="text-center mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-blue-400 to-purple-400 bg-clip-text text-transparent pb-2">
              Community Features
            </h1>
            <p className="text-xl text-muted-foreground mt-4 max-w-2xl mx-auto">
              Prepare together, succeed together. Join our community features to enhance your interview preparation experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Button
                variant="ghost"
                size="lg"
                className="w-full h-auto py-4 bg-gradient-to-br from-slate-900/90 to-slate-900/70 hover:from-slate-800/90 hover:to-slate-800/70 border border-slate-700/40"
              >
                <div className="flex flex-col items-center text-center">
                  <Trophy className="h-8 w-8 mb-2 text-amber-400" />
                  <div className="font-medium">Leaderboard</div>
                  <div className="text-xs text-muted-foreground">
                    Compete and rank up
                  </div>
                </div>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Button
                variant="ghost"
                size="lg"
                className="w-full h-auto py-4 bg-gradient-to-br from-slate-900/90 to-slate-900/70 hover:from-slate-800/90 hover:to-slate-800/70 border border-slate-700/40"
              >
                <div className="flex flex-col items-center text-center">
                  <CalendarDays className="h-8 w-8 mb-2 text-primary" />
                  <div className="font-medium">Daily Streak</div>
                  <div className="text-xs text-muted-foreground">
                    Build consistent habits
                  </div>
                </div>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Button
                variant="ghost"
                size="lg"
                className="w-full h-auto py-4 bg-gradient-to-br from-slate-900/90 to-slate-900/70 hover:from-slate-800/90 hover:to-slate-800/70 border border-slate-700/40"
              >
                <div className="flex flex-col items-center text-center">
                  <MessageSquare className="h-8 w-8 mb-2 text-blue-400" />
                  <div className="font-medium">Discussion Forum</div>
                  <div className="text-xs text-muted-foreground">
                    Share experiences & tips
                  </div>
                </div>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto max-w-6xl px-4 pb-20">
        <Tabs defaultValue="leaderboard" className="mb-8">
          <div className="flex justify-center mb-4 overflow-x-auto pb-2 scrollbar-none">
            <TabsList className="bg-slate-900/50">
              <TabsTrigger value="leaderboard" className="flex items-center gap-2 data-[state=active]:bg-primary/20">
                <Trophy className="h-4 w-4" />
                <span>Leaderboard</span>
              </TabsTrigger>
              <TabsTrigger value="dailyStreak" className="flex items-center gap-2 data-[state=active]:bg-primary/20">
                <CalendarDays className="h-4 w-4" />
                <span>Daily Streak</span>
              </TabsTrigger>
              <TabsTrigger value="forum" className="flex items-center gap-2 data-[state=active]:bg-primary/20">
                <MessageSquare className="h-4 w-4" />
                <span>Forum</span>
              </TabsTrigger>
              <TabsTrigger value="study" className="flex items-center gap-2 data-[state=active]:bg-primary/20">
                <Users className="h-4 w-4" />
                <span>Study Groups</span>
              </TabsTrigger>
              <TabsTrigger value="more" className="flex items-center gap-2 data-[state=active]:bg-primary/20">
                <Sparkles className="h-4 w-4" />
                <span>More</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="leaderboard" className="space-y-8">
            <Leaderboard />
          </TabsContent>

          <TabsContent value="dailyStreak" className="space-y-8">
            <DailyStreak />
          </TabsContent>

          <TabsContent value="forum" className="space-y-8">
            <DiscussionForum />
          </TabsContent>

          <TabsContent value="study" className="space-y-8">
            <StudyGroups />
          </TabsContent>

          <TabsContent value="more" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Achievements />
              <ResourceHub />
              <MockInterviewScheduler />
              <CollaborativeWhiteboard />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CommunityPage;
