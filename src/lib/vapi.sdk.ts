
import { EventEmitter } from 'events';

class VapiSDK extends EventEmitter {
  private apiKey: string | null = null;
  private baseUrl = 'https://api.vapi.ai';
  private currentQuestionIndex = 0;
  private callInProgress = false;
  private recognition: SpeechRecognition | null = null;

  constructor() {
    super();
    // If you have a VAPI_API_KEY in your environment, use it
    this.apiKey = import.meta.env.VITE_VAPI_API_KEY || null;
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  getCurrentQuestionIndex() {
    return this.currentQuestionIndex;
  }

  async start(assistantId: string, options: any = {}) {
    if (!this.apiKey) {
      throw new Error('VAPI API key not set. Please set it using setApiKey method.');
    }

    if (this.callInProgress) {
      throw new Error('Call already in progress. Please stop the current call first.');
    }

    // Reset the question index
    this.currentQuestionIndex = 0;
    this.callInProgress = true;

    // Simulate call initialization and connection
    setTimeout(() => {
      this.emit('call-start');
      
      // Simulate the assistant introduction message
      setTimeout(() => {
        const username = options.variableValues?.username || 'User';
        const introMessage = {
          type: 'transcript',
          transcriptType: 'final',
          role: 'assistant',
          transcript: `Hello ${username}! I'll be your interviewer today. I'll ask you a series of questions related to your job role. Please answer each question as thoroughly as you can.`
        };
        this.emit('message', introMessage);

        // Parse and ask questions one by one
        this.askNextQuestion(options.variableValues?.questions);
      }, 1500);
    }, 1000);

    return true;
  }

  private askNextQuestion(questionsText: string) {
    if (!this.callInProgress) return;
    
    // Parse the questions (assuming they're in the format "- Question 1\n- Question 2")
    const questions = questionsText.split('\n')
      .map(line => line.replace(/^- /, '').trim())
      .filter(q => q.length > 0);
    
    if (this.currentQuestionIndex < questions.length) {
      // Simulate speech start
      this.emit('speech-start');
      
      // Simulate the assistant asking the question
      setTimeout(() => {
        const question = {
          type: 'transcript',
          transcriptType: 'final',
          role: 'assistant',
          transcript: questions[this.currentQuestionIndex]
        };
        this.emit('message', question);
        this.emit('speech-end');
        
        // Simulate the user answering after a delay
        setTimeout(() => {
          // This is where we would normally wait for the user to speak
          // For simulation, we'll handle user response in a separate method
          this.simulateUserResponding();
        }, 500);

        this.currentQuestionIndex++;
      }, 1000);
    } else {
      // All questions have been asked, end the call
      setTimeout(() => {
        const closingMessage = {
          type: 'transcript',
          transcriptType: 'final',
          role: 'assistant',
          transcript: "That's all the questions I have for you today. Thank you for your time and responses. The interview is now complete."
        };
        this.emit('message', closingMessage);
        
        setTimeout(() => {
          this.stop();
        }, 2000);
      }, 1000);
    }
  }

  private simulateUserResponding() {
    // In a real implementation, this would be triggered by user's voice
    // Here we'll simulate the user speaking by listening for browser speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      
      let finalTranscript = '';
      let isUserSpeaking = false;
      
      this.recognition.onstart = () => {
        finalTranscript = '';
        isUserSpeaking = true;
        this.emit('speech-start');
      };
      
      this.recognition.onresult = (event) => {
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        
        // Emit interim transcript updates (could be used to show typing animation)
        if (interim.length > 0) {
          this.emit('interim-transcript', interim);
        }
      };
      
      this.recognition.onend = () => {
        isUserSpeaking = false;
        this.emit('speech-end');
        
        if (finalTranscript) {
          const userMessage = {
            type: 'transcript',
            transcriptType: 'final',
            role: 'user',
            transcript: finalTranscript
          };
          this.emit('message', userMessage);
        }
        
        // Move to next question after a short pause
        setTimeout(() => {
          this.askNextQuestion(''); // No need to pass questions again
        }, 1500);
      };
      
      // Start recognition
      try {
        this.recognition.start();
      } catch (error) {
        console.error("Speech recognition error:", error);
        this.emit('error', { message: 'Speech recognition failed to start' });
      }
    } else {
      // Fallback for browsers without speech recognition
      console.warn("Speech recognition not supported in this browser");
      this.emit('error', { 
        message: 'Speech recognition is not supported in your browser. Try using Chrome.' 
      });
    }
  }

  stop() {
    if (!this.callInProgress) {
      return false;
    }
    
    this.callInProgress = false;
    
    // Stop the speech recognition if it's active
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        console.error("Error stopping speech recognition:", e);
      }
      this.recognition = null;
    }
    
    this.emit('call-end');
    return true;
  }

  // Mock implementation for the real Vapi SDK
  callStatus() {
    return this.callInProgress ? 'active' : 'inactive';
  }
}

export const vapi = new VapiSDK();
// Speech recognition class
export class SpeechRecognizer extends EventEmitter {
  recognition: SpeechRecognition | null = null;
  isListening: boolean = false;
  transcript: string = '';
  
  constructor() {
    super();
    
    // Check for browser support
    if (typeof window !== 'undefined') {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (SpeechRecognitionAPI) {
        this.recognition = new SpeechRecognitionAPI();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';
        
        this.recognition.onresult = (event) => {
          let interimTranscript = '';
          let finalTranscript = '';
          
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }
          
          this.transcript = finalTranscript || interimTranscript;
          this.emit('result', this.transcript);
        };
        
        this.recognition.onend = () => {
          this.isListening = false;
          this.emit('end');
        };
        
        this.recognition.onerror = (event) => {
          this.emit('error', event);
        };
      }
    }
  }
  
  start() {
    if (this.recognition && !this.isListening) {
      try {
        this.recognition.start();
        this.isListening = true;
        this.emit('start');
      } catch (error) {
        this.emit('error', error);
      }
    }
    return this;
  }
  
  stop() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
        this.isListening = false;
      } catch (error) {
        this.emit('error', error);
      }
    }
    return this;
  }
  
  clear() {
    this.transcript = '';
    return this;
  }
  
  getText() {
    return this.transcript;
  }
}

export default SpeechRecognizer;


