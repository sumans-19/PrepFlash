
// AI Interview Engine
// Custom implementation that uses Web Speech API and Gemini AI

// Simple EventEmitter implementation for browser use
export class EventEmitter {
    private events: {[key: string]: Function[]} = {};
  
    constructor() {
      this.events = {};
    }
  
    on(event: string, listener: Function): this {
      if (!this.events[event]) {
        this.events[event] = [];
      }
      this.events[event].push(listener);
      return this;
    }
  
    off(event: string, listener: Function): this {
      if (!this.events[event]) return this;
      this.events[event] = this.events[event].filter(l => l !== listener);
      return this;
    }
  
    emit(event: string, ...args: any[]): boolean {
      if (!this.events[event]) return false;
      this.events[event].forEach(listener => listener(...args));
      return true;
    }
  
    once(event: string, listener: Function): this {
      const onceWrapper = (...args: any[]) => {
        listener(...args);
        this.off(event, onceWrapper);
      };
      this.on(event, onceWrapper);
      return this;
    }
  }
  
  interface SpeechRecognitionEvent extends Event {
    resultIndex: number;
    results: SpeechRecognitionResultList;
  }
  
  interface SpeechRecognitionResult {
    isFinal: boolean;
    [index: number]: SpeechRecognitionAlternative;
  }
  
  interface SpeechRecognitionResultList {
    length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
  }
  
  interface SpeechRecognitionAlternative {
    transcript: string;
    confidence: number;
  }
  
  interface SpeechRecognitionErrorEvent extends Event {
    error: string;
    message: string;
  }
  
  interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
    onend: ((this: SpeechRecognition, ev: Event) => any) | null;
    onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
    onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
    start(): void;
    stop(): void;
    abort(): void;
  }
  
  export interface InterviewConfig {
    userName: string;
    userId: string;
    jobRole?: string;
    experienceLevel?: string;
    techStack?: string[];
    industry?: string;
  }
  
  export interface Message {
    role: "assistant" | "user";
    content: string;
    questionIndex?: number;
    responseTime?: number;
    fillerWords?: string[];
    hesitations?: number;
  }
  
  // List of common filler words to detect in speech
  const FILLER_WORDS = [
    'um', 'uh', 'like', 'you know', 'so', 'actually', 'basically', 'literally',
    'anyway', 'well', 'sort of', 'kind of', 'i mean', 'i guess', 'right'
  ];
  
  // AIInterviewEngine class to handle the interview process
  export class AIInterviewEngine extends EventEmitter {
    private questions: string[] = [];
    private currentQuestionIndex: number = -1;
    private isActive: boolean = false;
    private recognition: SpeechRecognition | null = null;
    private speechSynthesis: SpeechSynthesis;
    private userStartTime: number = 0;
    private userIsResponding: boolean = false;
    private config: InterviewConfig | null = null;
    private interviewPersonas: string[] = [
      "I'm Sarah, an experienced tech recruiter with 10 years in the industry.",
      "Hi, I'm Michael, the senior hiring manager for the engineering department.",
      "Hello! I'm Alex, the team lead for the position you're interviewing for.",
      "I'm Taylor, the HR director responsible for the final hiring decisions."
    ];
    private selectedPersona: string;
    private initialized: boolean = false;
    
    constructor() {
      super();
      this.speechSynthesis = window.speechSynthesis;
      this.selectedPersona = this.interviewPersonas[Math.floor(Math.random() * this.interviewPersonas.length)];
      this.initializeSpeechRecognition();
    }
    
    private initializeSpeechRecognition() {
      // Check if SpeechRecognition is available in the browser
      if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        const SpeechRecognitionClass = (window as any).SpeechRecognition || 
                                     (window as any).webkitSpeechRecognition;
        this.recognition = new SpeechRecognitionClass();
        
        if (this.recognition) {
          this.recognition.continuous = true;
          this.recognition.interimResults = true;
          this.recognition.lang = 'en-US';
          
          this.recognition.onstart = () => {
            console.log('Speech recognition started');
            this.emit('recognition-start');
          };
          
          this.recognition.onend = () => {
            console.log('Speech recognition ended');
            if (this.isActive) {
              try {
                console.log('Attempting to restart speech recognition');
                setTimeout(() => {
                  if (this.isActive) {
                    this.recognition?.start();
                  }
                }, 100);
              } catch (e) {
                console.error('Failed to restart speech recognition:', e);
                this.emit('error', { message: `Failed to restart speech recognition: ${e}` });
              }
            }
          };
          
          this.recognition.onresult = (event: SpeechRecognitionEvent) => {
            let interimTranscript = '';
            let finalTranscript = '';
            
            for (let i = event.resultIndex; i < event.results.length; ++i) {
              if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
                
                if (this.userIsResponding) {
                  const responseTime = (Date.now() - this.userStartTime) / 1000; // Convert to seconds
                  const fillerWordsUsed = this.countFillerWords(finalTranscript);
                  const hesitationCount = this.countHesitations(finalTranscript);
                  
                  const message = {
                    role: 'user' as const,
                    content: finalTranscript.trim(),
                    questionIndex: this.currentQuestionIndex,
                    responseTime,
                    fillerWords: fillerWordsUsed,
                    hesitations: hesitationCount
                  };
                  
                  console.log('User final response:', message);
                  this.emit('message', message);
                  this.userIsResponding = false;
                  
                  setTimeout(() => {
                    if (this.isActive) {
                      this.askNextQuestion();
                    }
                  }, 2000);
                }
              } else {
                interimTranscript += event.results[i][0].transcript;
                
                // Emit interim transcript events for real-time feedback
                if (this.userIsResponding && interimTranscript.trim() !== '') {
                  console.log('User interim response:', interimTranscript);
                  this.emit('interim-transcript', {
                    transcript: interimTranscript.trim()
                  });
                }
              }
            }
          };
          
          this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
            console.error('Speech recognition error:', event.error);
            this.emit('error', { message: `Speech recognition error: ${event.error}` });
            
            // Try to recover if it's not a permission error
            if (event.error !== 'not-allowed' && this.isActive) {
              setTimeout(() => {
                if (this.isActive) {
                  try {
                    this.recognition?.start();
                  } catch (e) {
                    console.error('Failed to restart after error:', e);
                  }
                }
              }, 1000);
            }
          };
          
          this.initialized = true;
        }
      } else {
        console.error('SpeechRecognition API is not supported in this browser');
      }
    }
    
    public async start(questions: string[], config: InterviewConfig): Promise<void> {
      if (questions.length === 0) {
        throw new Error('No questions provided for the interview');
      }
      
      if (!this.initialized) {
        this.initializeSpeechRecognition();
      }
      
      if (!this.recognition) {
        throw new Error('Speech recognition is not available in this browser');
      }
      
      this.questions = questions;
      this.config = config;
      this.currentQuestionIndex = -1;
      this.isActive = true;
      
      try {
        // Pre-initialize voices and then wait a moment for them to load
        this.speechSynthesis.getVoices();
        await this.pause(500);
        
        // Start speech recognition
        this.recognition.start();
        console.log('Starting speech recognition');
        
        this.emit('call-start');
        
        await this.pause(1000);
        await this.speakIntroduction();
        
        this.askNextQuestion();
      } catch (error) {
        console.error('Error starting interview:', error);
        this.isActive = false;
        this.emit('error', { message: `Error starting interview: ${String(error)}` });
        throw error;
      }
    }
    
    public stop(): void {
      if (!this.isActive) return;
      
      this.isActive = false;
      this.speechSynthesis.cancel();
      
      if (this.recognition) {
        try {
          this.recognition.stop();
        } catch (e) {
          console.error('Error stopping speech recognition:', e);
        }
      }
      
      this.speakConclusion().then(() => {
        this.emit('call-end');
      });
    }
    
    public getCurrentQuestionIndex(): number {
      return this.currentQuestionIndex;
    }
    
    private countFillerWords(text: string): string[] {
      const lowerText = text.toLowerCase();
      return FILLER_WORDS.filter(word => lowerText.includes(word));
    }
    
    private countHesitations(text: string): number {
      // Count pauses indicated by ellipses, commas, and stutters
      const pauseMatches = (text.match(/\.\.\.|\,|\-|\s\-\s/g) || []).length;
      const stutterMatches = (text.match(/(\b\w+\-\w+\b|\b\w+\s\w+\s\w+\b)/g) || []).length;
      return pauseMatches + stutterMatches;
    }
    
    private async speakIntroduction(): Promise<void> {
      const { userName, jobRole } = this.config || {};
      const intro = `Hello ${userName}. ${this.selectedPersona} Today we'll be conducting a ${jobRole || 'technical'} interview. I'll ask you a series of questions, and I'd like you to respond naturally as you would in a real interview. Remember to speak clearly and take your time with your answers. Let's begin.`;
      
      console.log('Speaking introduction:', intro);
      await this.speak(intro);
      await this.pause(1000);
    }
    
    private async speakConclusion(): Promise<void> {
      const conclusion = `Thank you for completing this interview. I appreciate your thoughtful responses. I will now analyze your answers to provide feedback on your performance. This will help you prepare for your real interview. Give me a moment to compile the results.`;
      
      console.log('Speaking conclusion:', conclusion);
      await this.speak(conclusion);
    }
    
    private askNextQuestion(): void {
      if (!this.isActive) return;
      
      this.currentQuestionIndex++;
      
      if (this.currentQuestionIndex < this.questions.length) {
        const question = this.questions[this.currentQuestionIndex];
        
        let transitionPhrase = "";
        if (this.currentQuestionIndex > 0) {
          const transitions = [
            "Great. For my next question,",
            "Let's move on to the next question.",
            "Thank you. Now I'd like to ask you about something else.",
            "I appreciate your response. Moving forward,",
            "That's helpful information. Now,"
          ];
          transitionPhrase = transitions[Math.floor(Math.random() * transitions.length)] + " ";
        }
        
        const fullQuestion = `${transitionPhrase}${question}`;
        console.log('Speaking question:', fullQuestion);
        
        this.speak(fullQuestion).then(() => {
          this.userStartTime = Date.now();
          this.userIsResponding = true;
          
          this.emit('message', {
            role: 'assistant',
            content: question,
            questionIndex: this.currentQuestionIndex
          });
        });
      } else {
        this.stop();
      }
    }
    
    private async speak(text: string): Promise<void> {
      return new Promise((resolve, reject) => {
        if (!this.isActive) {
          resolve();
          return;
        }
        
        this.emit('speech-start');
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.95;
        utterance.pitch = 1;
        utterance.volume = 1.0;
        
        // Get available voices and select a natural sounding one if available
        const voices = this.speechSynthesis.getVoices();
        console.log('Available voices:', voices.length);
        
        if (voices.length === 0) {
          // If no voices are available yet, wait and try again
          setTimeout(() => {
            const retryVoices = this.speechSynthesis.getVoices();
            if (retryVoices.length > 0) {
              this.selectVoice(utterance, retryVoices);
            }
            this.speechSynthesis.speak(utterance);
          }, 500);
        } else {
          this.selectVoice(utterance, voices);
          this.speechSynthesis.speak(utterance);
        }
        
        utterance.onend = () => {
          this.emit('speech-end');
          resolve();
        };
        
        utterance.onerror = (event) => {
          this.emit('speech-end');
          console.error('Speech synthesis error:', event);
          reject(event);
        };
      });
    }
    
    private selectVoice(utterance: SpeechSynthesisUtterance, voices: SpeechSynthesisVoice[]): void {
      // Preferred voices in order of preference
      const preferredVoicePatterns = [
        /Google US English/i,
        /Microsoft Zira/i,
        /Samantha/i,
        /English.*Female/i,
        /English.*US/i
      ];
      
      // Try to find a preferred voice
      for (const pattern of preferredVoicePatterns) {
        const matchingVoice = voices.find(voice => pattern.test(voice.name));
        if (matchingVoice) {
          utterance.voice = matchingVoice;
          console.log('Selected voice:', matchingVoice.name);
          return;
        }
      }
      
      // If no preferred voice is found, try to use any English voice
      const englishVoice = voices.find(voice => /en/i.test(voice.lang));
      if (englishVoice) {
        utterance.voice = englishVoice;
        console.log('Using English voice:', englishVoice.name);
        return;
      }
      
      // If still no match, use the first available voice
      if (voices.length > 0) {
        utterance.voice = voices[0];
        console.log('Using first available voice:', voices[0].name);
      }
    }
    
    private pause(ms: number): Promise<void> {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    public resetRecognition(): void {
      if (this.recognition) {
        try {
          this.recognition.stop();
          setTimeout(() => {
            if (this.isActive) {
              this.recognition?.start();
            }
          }, 300);
        } catch (e) {
          console.error('Error resetting speech recognition:', e);
        }
      }
    }
    
    get active(): boolean {
      return this.isActive;
    }
  }
  
  // Create and export a singleton instance
  export const aiInterviewEngine = new AIInterviewEngine();
  