// Application constants

import { useState } from "react";

// Interviewer configuration
export const interviewer = {
  id: "67572f36-beb4-4852-ab9c-1ea10f8ad736", // Replace with your actual Vapi agent ID in production
  name: "AI Interviewer",
  avatar: "/interviewer-avatar.png",
  role: "Interview Assistant",
};

// type Stage = "idle" | "generating" | "ready" | "calling" | "done";
// const [stage, setStage] = useState<Stage>("idle");

  
  // Interview types
  export const interviewTypes = {
    BEHAVIORAL: 'behavioral',
    TECHNICAL: 'technical',
    LEADERSHIP: 'leadership',
    GENERAL: 'general'
  };
  
  // Interview difficulty levels
  export const difficultyLevels = {
    BEGINNER: 'beginner',
    INTERMEDIATE: 'intermediate',
    ADVANCED: 'advanced'
  };
  
  // Default interview settings
  export const defaultInterviewSettings = {
    duration: 15, // minutes
    questionCount: 5,
    type: interviewTypes.BEHAVIORAL,
    difficulty: difficultyLevels.INTERMEDIATE
  };

  
  // Feedback categories for interview assessment
  export const feedbackCategories = {
    COMMUNICATION: 'communication',
    CONTENT: 'content',
    CONFIDENCE: 'confidence',
    CLARITY: 'clarity',
  };