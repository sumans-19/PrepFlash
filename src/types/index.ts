// Define the emotion types from face-api.js
export interface FaceExpressions {
    neutral: number
    happy: number
    sad: number
    angry: number
    fearful: number
    disgusted: number
    surprised: number
  }
  
  // Type for representing the dominant emotion
  export type DominantEmotion = keyof FaceExpressions
  
  // Interview session data
  export interface InterviewSession {
    id: string
    startTime: Date
    endTime?: Date
    jobDomain: string
    questions: InterviewQuestion[]
    recordingUrl?: string
    emotionData: EmotionDataPoint[]
    overallFeedback?: FeedbackData
  }
  
  export interface InterviewQuestion {
    id: string
    questionText: string
    startTime?: number // timestamp in ms from start of recording
    endTime?: number // timestamp in ms from start of recording
    answer?: string // Transcribed answer if available
    liveTranscript?: string // Live transcription as the user speaks
    feedback?: QuestionFeedback
  }
  
  export interface EmotionDataPoint {
    timestamp: number // ms from start of recording
    expressions: FaceExpressions
    dominantEmotion: DominantEmotion // Updated to use the DominantEmotion type
    confidence: number
    audioLevel?: number // Audio level from 0-1
  }
  
  export interface QuestionFeedback {
    contentScore: number // 0-100
    contentFeedback: string
    emotionalScore: number // 0-100
    emotionalFeedback: string
    voiceAnalysis?: string // Added voice analysis
    paceScore?: number // Score for speaking pace
    clarityScore?: number // Score for clarity of speech
    strengths: string[]
    improvements: string[]
  }
  
  export interface FeedbackData {
    overallScore: number // 0-100
    summary: string
    contentAnalysis: string
    emotionalAnalysis: string
    voiceAnalysis?: string // Added voice analysis
    strengths: string[]
    improvements: string[]
    recommendations: string
  }
  
  // Add difficulty level enum
  export enum DifficultyLevel {
    Easy = "Easy",
    Medium = "Medium",
    Hard = "Hard",
  }
  
  // Add interview setup options interface
  export interface InterviewSetupOptions {
    jobDomain: string
    customJobRole?: string
    technologies?: string
    questionCount: number
    difficultyLevel: DifficultyLevel
  }
  
  // Define job domains for question generation
  export const JOB_DOMAINS = [
    "Software Development",
    "Data Science",
    "Product Management",
    "Marketing",
    "Sales",
    "Customer Service",
    "Finance",
    "Human Resources",
    "Design",
    "Operations",
    "Healthcare",
  ]
  
  // Define recording states
  export type RecordingState = "idle" | "preparing" | "recording" | "paused" | "reviewing" | "processing"
  