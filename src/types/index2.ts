export interface InterviewQuestion {
    id: string;
    text: string;
  }
  
  export interface EmotionData {
    timestamp: number;
    emotion: string;
    score: number;
  }
  
  export interface EmotionSummary {
    primaryEmotion: string;
    primaryPercentage: number;
    secondaryEmotions: Record<string, number>;
    stabilityScore: number;
    emotionChanges: number;
    dominantEmotions: string[];
    emotionDurations: Record<string, number>;
    faceDetectionRate: number;
  }
  
  export interface FeedbackResult {
    emotionFeedback: string;
    contentFeedback: string;
    overallRecommendations: string;
  }
  
  export interface InterviewSetup {
    domain: string;
    numQuestions: number;
  }
  
  export interface TranscriptResult {
    text: string;
    confidence: number;
  }
  
  export interface RecordingResult {
    videoBlob: Blob | null;
    audioBlob: Blob | null;
    emotions: EmotionData[];
    emotionSummary: EmotionSummary | null;
  }