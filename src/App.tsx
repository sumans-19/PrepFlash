
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Practice from "./pages/Practice";
import Interview from "./pages/Interview";
// import InterviewPages from "./pages/InterviewPage";
import FeedbackPage from "./pages/FeedbackPage";
import ProfileSetup from "./components/ProfileSetup";
import ProfileDisplay from "./components/ProfileDisplay";
import Dashboard from "./pages/Dashboard";
import ChatPractice from "./pages/ChatPractice";
import Features from "./pages/Features";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/profile-setup" element={<ProfileSetup />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/voice-practice" element={<Interview />} />
          {/* <Route path="/voice-practice" element={<InterviewPages />} /> */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/interview/feedback" element={<FeedbackPage />} />
          <Route path="/interview/:interviewId/feedback" element={<FeedbackPage />} />
          <Route path="/chat-practices" element={<ChatPractice />} />
          <Route path="/features" element={<Features />} />
          <Route path="/profile" element={<ProfileDisplay />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
