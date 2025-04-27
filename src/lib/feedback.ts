
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";

interface FeedbackParams {
  interviewId: string | null;
  userId: string;
  transcript: { role: string; content: string }[];
  feedbackId?: string | null;
}

interface FeedbackResult {
  success: boolean;
  feedbackId: string | null;
  message?: string;
}

export const createFeedback = async (params: FeedbackParams): Promise<FeedbackResult> => {
  try {
    if (!params.interviewId || !params.userId || params.transcript.length === 0) {
      throw new Error('Missing required parameters for feedback generation');
    }

    // Format transcript for better readability
    const formattedTranscript = params.transcript.map((item) => {
      return `${item.role === 'assistant' ? 'Interviewer' : 'Candidate'}: ${item.content}`;
    }).join('\n\n');

    // Create the feedback document in Firestore
    const feedbackDoc = await addDoc(collection(db, "feedback"), {
      interviewId: params.interviewId,
      userId: params.userId,
      transcript: formattedTranscript,
      status: "processing",
      timestamp: serverTimestamp(),
    });

    console.log('Feedback document created:', feedbackDoc.id);
    
    toast.success("Feedback request submitted successfully!");
    
    return {
      success: true,
      feedbackId: feedbackDoc.id,
    };
  } catch (error) {
    console.error('Error creating feedback:', error);
    toast.error("Failed to create feedback. Please try again.");
    
    return {
      success: false,
      feedbackId: null,
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

// Constants for the interviewer configuration
export const interviewer = {
  id: "interview-coach",
  name: "Interview Coach",
};
