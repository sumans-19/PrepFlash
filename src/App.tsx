
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AptitudeQuestionBank from "./pages/AptitudeQuestionBank";
import Auth from "./pages/Auth";
import Practice from "./pages/Practice";
import InterviewPages from "./pages/InterviewPage";
import FeedbackPage from "./pages/FeedbackPage";
import ProfileSetup from "./components/ProfileSetup";
import ProfileDisplay from "./components/ProfileDisplay";
import Dashboard from "./pages/Dashboard";
import ChatPractice from "./pages/ChatPractice";
import AptitudeBrushUp from "./pages/AptitudeBrushUp";
import AptitudeHome from "./pages/AptitudeHome";
import ProjectZone from "./pages/ProjectHome";
import { Features } from "./pages/Features";
import StudyGroupDetail from "./pages/StudyGroupDetail";
import ForumCreatePost from "./pages/ForumCreatePost";
import ProfilePage2 from "./pages/ProfilePage2";
import DailyChallengePage from "./pages/DailyChallengePage";
import VideoMode from "./pages/Index2";
import LearningToolKit from "./pages/LearningToolKit";
import LearningPath from "./pages/LearningPath";
import WebDevelopmentCourse from "./pages/WebDevelopmentCourse";
import { ThemeProvider } from "next-themes";
import AiMlCourse from "./pages/AiMlCourse";
import CommunityPage from "./pages/CommunityPage";
// import ProfilePage from "./pages/ProfilePage";

import React from "react";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>

      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>

        
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/profile-setup" element={<ProfileSetup />} />
              <Route path="/practice" element={<Practice />} />
              <Route path="/voice-practice" element={<InterviewPages />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/interview-feedback" element={<FeedbackPage />} />
              <Route path="/chat-practices" element={<ChatPractice />} />
              <Route path="/features" element={<Features />} />
              <Route path="/projects" element={<ProjectZone />} />
              <Route path="/profile" element={<ProfileDisplay />} />
              <Route path="/video-mode" element={<VideoMode />} />
              {/* <Route path="/profiles" element={<ProfilePage />} /> */}
              <Route path="/aptitude-brush-up" element={<AptitudeBrushUp />} />
              <Route path="/study-groups/:id" element={<StudyGroupDetail />} />
              <Route path="/forum/create" element={<ForumCreatePost />} />
              <Route path="/profile2" element={<ProfilePage2 />} />
              <Route path="/daily-challenge" element={<DailyChallengePage />} />
              <Route path="/community" element={<CommunityPage />} />
              <Route path="/aptitude-questions" element={<AptitudeQuestionBank />} />
              <Route path="/aptitudehome" element={<AptitudeHome />} />

              <Route path="/learningtoolkit" element={<LearningToolKit />} />
              <Route path="/learningpath" element={<LearningPath />} />
              <Route path="/web-development" element={<WebDevelopmentCourse/>} />
              <Route path="/ai/ml" element={<AiMlCourse/>} />

              



              <Route path="*" element={<NotFound />} />
            </Routes>
            </BrowserRouter>
          </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
