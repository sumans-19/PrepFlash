
// Simple wrapper for VAPI API (Voice AI)
// This is a stub implementation - you would need to replace this with your actual VAPI SDK

import { EventEmitter } from 'events';

class VapiSDK extends EventEmitter {
  private isActive = false;
  private isSpeaking = false;
  private currentQuestionIndex = 0;
  private questions: string[] = [];
  private userAnswers: string[] = [];
  private speakTimeout: NodeJS.Timeout | null = null;
  private transcript: { role: string; content: string }[] = [];
  
  constructor() {
    super();
    this.handleUserSpeech = this.handleUserSpeech.bind(this);
  }

  async start(interviewerId: string, params: { variableValues: any }) {
    try {
      console.log('Starting VAPI interview with params:', params);
      this.isActive = true;
      this.currentQuestionIndex = 0;
      this.questions = params.variableValues.questions.split('\n').map((q: string) => q.replace('- ', ''));
      this.userAnswers = [];
      this.transcript = [];
      
      // Simulate call connection
      setTimeout(() => {
        this.emit('call-start');
        this.askNextQuestion();
      }, 1500);
      
      return true;
    } catch (error) {
      console.error('Error starting VAPI call:', error);
      this.emit('error', error);
      return false;
    }
  }

  stop() {
    console.log('Stopping VAPI call');
    this.isActive = false;
    if (this.speakTimeout) {
      clearTimeout(this.speakTimeout);
    }
    this.emit('call-end');
  }

  private askNextQuestion() {
    // ... keep existing code (for asking the next question)
    if (!this.isActive || this.currentQuestionIndex >= this.questions.length) {
      this.stop();
      return;
    }
    
    const question = this.questions[this.currentQuestionIndex];
    
    // Simulate AI speaking
    this.isSpeaking = true;
    this.emit('speech-start');
    
    // Add question to transcript
    const message = { role: 'assistant', content: question, transcript: question, transcriptType: 'final', type: 'transcript' };
    this.transcript.push({ role: 'assistant', content: question });
    this.emit('message', message);
    
    // Simulate speech end after a delay
    this.speakTimeout = setTimeout(() => {
      this.isSpeaking = false;
      this.emit('speech-end');
      
      // Wait for user to answer (simulate with browser's speech recognition)
      this.startListening();
    }, 3000);
  }
  
  private startListening() {
    if (!this.isActive) return;
    
    console.log('Listening for user speech...');
    
    // Check if browser supports speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      // Fixed TypeScript errors by using proper type casting
      const SpeechRecognitionAPI = (window as any).SpeechRecognition || 
                                  (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognitionAPI();
      
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      let finalTranscript = '';
      
      recognition.onstart = () => {
        console.log('Speech recognition started');
        this.emit('message', { 
          role: 'user', 
          content: '...', 
          transcript: '...', 
          transcriptType: 'interim', 
          type: 'transcript' 
        });
      };
      
      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        
        // Emit interim results
        if (interimTranscript) {
          this.emit('message', { 
            role: 'user', 
            content: interimTranscript, 
            transcript: interimTranscript, 
            transcriptType: 'interim', 
            type: 'transcript' 
          });
        }
      };
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        this.handleUserSpeech('I apologize, but I couldn\'t hear your response clearly.');
      };
      
      recognition.onend = () => {
        // If we didn't get a final result, use what we have
        if (!finalTranscript) {
          finalTranscript = 'I apologize, but I couldn\'t hear your response clearly.';
        }
        
        this.handleUserSpeech(finalTranscript);
      };
      
      // Start recognition
      try {
        recognition.start();
        
        // Safety timeout - stop listening after 30 seconds
        setTimeout(() => {
          if (recognition) {
            recognition.stop();
          }
        }, 30000);
      } catch (e) {
        console.error('Speech recognition error on start:', e);
        this.simulateUserSpeech();
      }
    } else {
      console.log('Speech recognition not supported, simulating user speech');
      this.simulateUserSpeech();
    }
  }
  
  private simulateUserSpeech() {
    // Fallback for browsers without speech recognition
    setTimeout(() => {
      const simulatedAnswers = [
        "I have three years of experience with React and TypeScript. In my previous role, I built a dashboard application that improved team productivity by 25%.",
        "I approach problem-solving methodically. First, I identify the core issue, then brainstorm solutions, evaluate trade-offs, and implement the best approach.",
        "My greatest strength is my ability to learn quickly and adapt to new technologies. I'm always looking to improve my skills.",
        "In difficult team situations, I focus on clear communication and finding common ground. I believe most conflicts come from misunderstandings.",
        "I'm interested in this role because I want to work on challenging problems in a collaborative environment."
      ];
      
      const answer = simulatedAnswers[this.currentQuestionIndex % simulatedAnswers.length];
      this.handleUserSpeech(answer);
    }, 5000);
  }
  
  private handleUserSpeech(speech: string) {
    if (!this.isActive) return;
    
    // Add user answer to transcript
    const message = { role: 'user', content: speech, transcript: speech, transcriptType: 'final', type: 'transcript' };
    this.transcript.push({ role: 'user', content: speech });
    this.userAnswers.push(speech);
    this.emit('message', message);
    
    // Proceed to next question after a short delay
    setTimeout(() => {
      this.currentQuestionIndex++;
      this.askNextQuestion();
    }, 2000);
  }
  
  getTranscript() {
    return this.transcript;
  }
  
  getCurrentQuestion() {
    return this.questions[this.currentQuestionIndex] || null;
  }
  
  getCurrentQuestionIndex() {
    return this.currentQuestionIndex;
  }
  
  getUserAnswers() {
    return this.userAnswers;
  }
}

export const vapi = new VapiSDK();
