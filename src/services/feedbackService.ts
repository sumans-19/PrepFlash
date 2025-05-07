import { EmotionSummary, InterviewQuestion, FeedbackResult, RecordingResult } from '../types/index2';
import { transcribeAudio } from './audioService';
import axios from 'axios';

// Simulate API calls to generate feedback
// In a production environment, these would be real API calls
// to a service like the Gemini API as seen in the Python code

export const generateFeedback = async (
  recordingResult: RecordingResult,
  questions: InterviewQuestion[],
  emotionSummary: EmotionSummary | null
): Promise<FeedbackResult> => {
  try {
    // Transcribe audio first
    const transcript = await transcribeAudio(recordingResult.audioBlob!);
    
    // In a real application, we would make API calls to generate feedback
    // For the prototype, we'll simulate the response
    
    // Emotion feedback simulation based on the emotion summary
    const emotionFeedback = await simulateEmotionFeedback(emotionSummary);
    
    // Content feedback simulation based on transcript and questions
    const contentFeedback = await simulateContentFeedback(transcript.text, questions);
    
    // Overall recommendations
    const overallRecommendations = await simulateOverallRecommendations(emotionFeedback, contentFeedback);
    
    return {
      emotionFeedback,
      contentFeedback,
      overallRecommendations
    };
  } catch (error) {
    console.error('Error generating feedback:', error);
    throw new Error('Failed to generate feedback');
  }
};

const simulateEmotionFeedback = async (emotionSummary: EmotionSummary | null): Promise<string> => {
  // Simulate API response delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  if (!emotionSummary) {
    return "* Unable to analyze emotions due to insufficient face detection data. Ensure proper lighting and camera positioning for future sessions.";
  }
  
  // Based on the emotion summary, generate feedback
  const { primaryEmotion, stabilityScore } = emotionSummary;
  
  let feedback = '';
  
  // Primary emotion feedback
  if (primaryEmotion === 'confident') {
    feedback += "* Your primary emotion of 'confident' is excellent for interviews. You demonstrated positive energy that interviewers typically respond well to.\n";
  } else if (primaryEmotion === 'composed') {
    feedback += "* Your composed demeanor projects professionalism, though adding moments of enthusiasm at key points could help engage interviewers more effectively.\n";
  } else if (primaryEmotion === 'nervous') {
    feedback += "* Your expressions showed signs of nervousness which is common in interviews. Try practicing deep breathing techniques before important questions.\n";
  } else if (primaryEmotion === 'attentive') {
    feedback += "* Your attentive expressions show you're engaged and listening carefully. This is a strong non-verbal signal to interviewers that you're present and interested.\n";
  } else {
    feedback += `* Your primary emotion of '${primaryEmotion}' was most prevalent. Consider how this might be perceived by interviewers and adjust accordingly.\n`;
  }
  
  // Stability feedback
  if (stabilityScore > 80) {
    feedback += "* Your emotional stability was excellent. Maintaining consistent expressions helps interviewers focus on your content rather than being distracted by emotional shifts.\n";
  } else if (stabilityScore > 60) {
    feedback += "* Your emotional stability was good, with some variations. Minor emotional shifts are natural, but aim for consistency during key moments.\n";
  } else if (stabilityScore > 40) {
    feedback += "* Your emotional expressions changed frequently. While some variation is natural, too many shifts might distract interviewers or convey uncertainty.\n";
  } else {
    feedback += "* Your emotions fluctuated considerably during the interview. Practice maintaining more consistent expressions, especially when answering challenging questions.\n";
  }
  
  // Additional feedback points
  feedback += "* When discussing achievements, your expressions could more consistently convey confidence to reinforce your verbal message.\n";
  feedback += "* Consider practicing in front of a mirror to become more aware of your facial expressions during different types of questions.\n";
  
  return feedback;
};

const simulateContentFeedback = async (transcript: string, questions: InterviewQuestion[]): Promise<string> => {
  // Simulate API response delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Generate feedback based on the transcript and questions
  let feedback = '';
  
  feedback += "* Your answers demonstrated good knowledge of the subject matter, though adding more specific examples would strengthen your responses.\n";
  feedback += "* You structured most answers clearly, but some responses lacked a clear beginning or conclusion. Using the STAR method consistently would improve clarity.\n";
  feedback += "* Your vocabulary was professional and appropriate for an interview setting. Continue using industry-specific terminology appropriately.\n";
  feedback += "* When discussing challenges, you focused on solutions which is excellent. Consider also briefly mentioning what you learned from the experience.\n";
  feedback += "* The length of your answers was generally appropriate. For more complex questions, don't hesitate to take a brief pause before answering to organize your thoughts.\n";
  
  return feedback;
};

const simulateOverallRecommendations = async (emotionFeedback: string, contentFeedback: string): Promise<string> => {
  // Simulate API response delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Generate recommendations based on both feedback types
  return `1. Practice maintaining a balance of confident expressions while delivering structured answers using the STAR method (Situation, Task, Action, Result).

2. Prepare concise, specific examples that highlight your achievements and align them with positive, engaging facial expressions to reinforce your message.

3. When facing challenging questions, take a brief pause to organize your thoughts while maintaining a composed demeanor, then deliver a clear, solution-focused response.`;
};

// In a real implementation, you would have actual API calls:
/*
export const generateEmotionFeedback = async (emotionSummary: EmotionSummary): Promise<string> => {
  try {
    const response = await axios.post('YOUR_API_ENDPOINT/generate-emotion-feedback', {
      emotionData: emotionSummary
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      }
    });
    
    return response.data.feedback;
  } catch (error) {
    console.error('Error generating emotion feedback:', error);
    throw error;
  }
};
*/