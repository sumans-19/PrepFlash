import { useCallback } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, updateDoc, doc, getDocs, query, where, orderBy, DocumentData } from 'firebase/firestore';
import { toast } from 'sonner';

// Define the session interface here to match what's in ChatPractice.tsx
interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  feedback?: string;
}

interface Session {
  id: string;
  jobRole: string;
  techStack: string;
  difficultyLevel: string;
  questionsCount: number;
  messages: Message[];
  currentQuestionIndex: number;
  feedback: string[];
  overallFeedback?: string;
  createdAt: number;
  status: 'setup' | 'in-progress' | 'completed';
  firestoreId?: string;
  userId?: string;
}

export function useFirestore() {
  // Save a new interview session
  const saveInterviewSession = useCallback(async (userId: string, session: Session): Promise<string | null> => {
    try {
      const sessionWithUserId = {
        userId,
        ...session,
        createdAt: session.createdAt || Date.now(),
      };
      
      const docRef = await addDoc(collection(db, 'interviewSessions'), sessionWithUserId);
      
      // Update the session with the Firestore document ID
      await updateDoc(doc(db, 'interviewSessions', docRef.id), {
        firestoreId: docRef.id
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Error saving interview session:', error);
      toast.error('Failed to save your session data');
      return null;
    }
  }, []);

  // Update an existing interview session
  const updateInterviewSession = useCallback(async (userId: string, session: Session): Promise<boolean | string> => {
    try {
      // If we have a Firestore ID, use it directly
      if (session.firestoreId) {
        await updateDoc(doc(db, 'interviewSessions', session.firestoreId), {
          ...session,
        });
        return true;
      }
      
      // Otherwise, find the document by userId and session ID
      const q = query(
        collection(db, 'interviewSessions'),
        where('userId', '==', userId),
        where('id', '==', session.id)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        // If no document found, create a new one
        return await saveInterviewSession(userId, session);
      }
      
      // Update the existing document
      const docRef = querySnapshot.docs[0].ref;
      await updateDoc(docRef, {
        ...session,
        firestoreId: docRef.id
      });
      
      return true;
    } catch (error) {
      console.error('Error updating interview session:', error);
      toast.error('Failed to update your session data');
      return false;
    }
  }, [saveInterviewSession]);

  // Get all interview sessions for a user
  const getInterviewSessions = useCallback(async (userId: string): Promise<Session[]> => {
    try {
      const q = query(
        collection(db, 'interviewSessions'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data() as DocumentData;
        return {
          ...data,
          firestoreId: doc.id
        } as Session;
      });
    } catch (error) {
      console.error('Error getting interview sessions:', error);
      toast.error('Failed to load your previous sessions');
      return [];
    }
  }, []);

  return {
    saveInterviewSession,
    updateInterviewSession,
    getInterviewSessions,
  };
}
