import { EventEmitter } from './eventEmitter';

export interface Message {
  role: "assistant" | "user";
  content: string;
  questionIndex?: number;
  responseTime?: number;
  fillerWords?: string[];
  hesitations?: number;
}

export interface InterviewConfig {
  userName: string;
  userId: string;
  jobRole?: string;
  industry?: string; 
  experienceLevel?: string;
  techStack?: string[];
}

// AI Interview Engine that handles speech recognition and synthesis
class InterviewEngine extends EventEmitter {
  private questions: string[] = [];
  private currentQuestionIndex: number = -1;
  private isActive: boolean = false;
  private recognition: SpeechRecognition | null = null;
  private speechSynthesis: SpeechSynthesis;
  private userStartTime: number = 0;
  private userIsResponding: boolean = false;
  private config: InterviewConfig | null = null;
  private voicesLoaded: boolean = false;
  private fillerWords: string[] = ['um', 'uh', 'like', 'you know', 'actually', 'basically', 'literally', 'sort of', 'kind of', 'right', 'really'];
  private hesitationCount: number = 0;
  private silenceTimer: number | null = null;
  private lastSpeechTimestamp: number = 0;
  private minSilenceForHesitation: number = 1000; // 1 second of silence counts as hesitation
  
  constructor() {
    super();
    this.speechSynthesis = window.speechSynthesis;
    
    // Load voices as soon as possible
    this.loadVoices();
    
    // Listen for voiceschanged event to ensure voices are loaded
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = this.loadVoices.bind(this);
    }
    
    this.initializeSpeechRecognition();
  }
  
  private initializeSpeechRecognition(): void {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognitionClass = window.SpeechRecognition || 
                                   window.webkitSpeechRecognition;
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
              // Add a small delay before restarting
              setTimeout(() => {
                if (this.isActive) {
                  this.recognition?.start();
                  console.log('Speech recognition restarted');
                }
              }, 300);
            } catch (e) {
              console.error('Failed to restart speech recognition:', e);
            }
          }
        };
        
        this.recognition.onresult = this.handleSpeechResult.bind(this);
        
        this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error('Speech recognition error:', event.error, event.message);
          
          // Only emit error for critical issues
          if (event.error !== 'no-speech' && event.error !== 'audio-capture') {
            this.emit('error', { message: `Speech recognition error: ${event.error}` });
          }
          
          // Try to recover from certain errors
          if (event.error === 'network' || event.error === 'service-not-allowed') {
            setTimeout(() => this.resetRecognition(), 1000);
          }
        };
      }
    }
  }
  
  private handleSpeechResult(event: SpeechRecognitionEvent): void {
    this.lastSpeechTimestamp = Date.now();
    
    // Clear any existing silence timer when we hear speech
    if (this.silenceTimer !== null) {
      window.clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }
    
    // Set a new silence timer to detect pauses/hesitations
    this.silenceTimer = window.setTimeout(() => {
      if (this.userIsResponding) {
        this.hesitationCount++;
        console.log('Hesitation detected, count:', this.hesitationCount);
      }
    }, this.minSilenceForHesitation);
    
    let interimTranscript = '';
    let finalTranscript = '';
    
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript;
        
        if (this.userIsResponding) {
          const responseTime = (Date.now() - this.userStartTime) / 1000; // Convert to seconds
          
          // Check for filler words
          const detected = this.detectFillerWords(finalTranscript);
          
          const message: Message = {
            role: 'user',
            content: finalTranscript,
            questionIndex: this.currentQuestionIndex,
            responseTime,
            fillerWords: detected,
            hesitations: this.hesitationCount
          };
          
          this.emit('message', message);
          this.userIsResponding = false;
          this.hesitationCount = 0; // Reset hesitation count
          
          // Add a delay before asking the next question
          setTimeout(() => {
            if (this.isActive) {
              this.askNextQuestion();
            }
          }, 2000);
        }
      } else {
        interimTranscript += event.results[i][0].transcript;
        if (interimTranscript) {
          this.emit('interim-transcript', { transcript: interimTranscript });
        }
      }
    }
  }
  
  private loadVoices(): void {
    const voices = this.speechSynthesis.getVoices();
    if (voices.length > 0) {
      console.log('Voices loaded:', voices.length);
      this.voicesLoaded = true;
    }
  }
  
  private detectFillerWords(transcript: string): string[] {
    const lowerText = transcript.toLowerCase();
    return this.fillerWords.filter(word => lowerText.includes(word));
  }
  
  public async start(questions: string[], config: InterviewConfig): Promise<void> {
    if (questions.length === 0) {
      throw new Error('No questions provided for the interview');
    }
    
    if (!this.recognition) {
      throw new Error('Speech recognition is not available in this browser');
    }
    
    this.questions = questions;
    this.config = config;
    this.currentQuestionIndex = -1;
    this.isActive = true;
    this.hesitationCount = 0;
    
    try {
      // Force load voices if not already loaded
      if (!this.voicesLoaded) {
        this.speechSynthesis.getVoices();
      }
      
      this.recognition.start();
      
      this.emit('call-start');
      
      await this.speakIntroduction();
      
      // Ensure we start asking questions
      this.askNextQuestion();
    } catch (error) {
      console.error('Error starting interview:', error);
      this.isActive = false;
      this.emit('error', error);
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
  
  private async speakIntroduction(): Promise<void> {
    const { userName, jobRole } = this.config || {};
    const intro = `Hello ${userName}, I'm your AI interviewer today. We'll be conducting a ${jobRole || 'technical'} interview. I'll ask you a series of questions, and I'd like you to respond naturally as you would in a real interview. Let's begin in a moment.`;
    
    await this.speak(intro);
    await this.pause(1000); // 1 second pause
  }
  
  private async speakConclusion(): Promise<void> {
    const conclusion = `Thank you for completing this interview. I will now analyze your responses to provide feedback on your performance. This will help you prepare for your real interview. Please wait a moment while I process the results.`;
    
    await this.speak(conclusion);
  }
  
  private askNextQuestion(): void {
    if (!this.isActive) return;
    
    this.currentQuestionIndex++;
    console.log('Asking question:', this.currentQuestionIndex, 'of', this.questions.length);
    
    if (this.currentQuestionIndex < this.questions.length) {
      const question = this.questions[this.currentQuestionIndex];
      
      let transitionPhrase = "";
      if (this.currentQuestionIndex > 0) {
        const transitions = [
          "Great. Next question.",
          "Let's move on to the next question.",
          "Thank you. Now I'd like to ask you about something else.",
          "I appreciate your response. For my next question,",
          "Moving on,"
        ];
        transitionPhrase = transitions[Math.floor(Math.random() * transitions.length)] + " ";
      }
      
      const fullQuestion = `${transitionPhrase}${question}`;
      console.log('Speaking question:', fullQuestion);
      
      this.speak(fullQuestion).then(() => {
        this.userStartTime = Date.now();
        this.userIsResponding = true;
        this.hesitationCount = 0;
        
        this.emit('message', {
          role: 'assistant',
          content: question,
          questionIndex: this.currentQuestionIndex
        });
        
        // Safety timeout in case user doesn't respond
        setTimeout(() => {
          if (this.userIsResponding && this.isActive) {
            console.log('User did not respond in time, moving to next question');
            this.userIsResponding = false;
            this.askNextQuestion();
          }
        }, 60000); // 1 minute timeout
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
      utterance.rate = 0.9; // Slightly slower rate for better clarity
      utterance.pitch = 1;
      utterance.volume = 1; // Maximum volume
      
      // Try to get a good quality voice
      const voices = this.speechSynthesis.getVoices();
      console.log('Available voices:', voices.length);
      
      // Choose a high-quality voice with preference order
      const preferredVoiceNames = [
        'Google US English', 
        'Microsoft David', 
        'Microsoft Zira', 
        'Samantha',
        'Alex',
        'Daniel'
      ];
      
      let selectedVoice = null;
      
      // Try to find a preferred voice by exact name
      for (const voiceName of preferredVoiceNames) {
        const foundVoice = voices.find(voice => voice.name === voiceName);
        if (foundVoice) {
          selectedVoice = foundVoice;
          break;
        }
      }
      
      // If no preferred voice found by exact name, try partial match
      if (!selectedVoice) {
        for (const voiceName of preferredVoiceNames) {
          const foundVoice = voices.find(voice => 
            voice.name.includes(voiceName.split(' ')[0])
          );
          if (foundVoice) {
            selectedVoice = foundVoice;
            break;
          }
        }
      }
      
      // Fallback to any English voice if still no match
      if (!selectedVoice) {
        selectedVoice = voices.find(voice => 
          voice.lang.startsWith('en-') && !voice.name.includes('Google')
        );
      }
      
      // Final fallback to any voice
      if (!selectedVoice && voices.length > 0) {
        selectedVoice = voices[0];
      }
      
      if (selectedVoice) {
        console.log('Selected voice:', selectedVoice.name);
        utterance.voice = selectedVoice;
      } else {
        console.warn('No suitable voice found');
      }
      
      utterance.onend = () => {
        this.emit('speech-end');
        console.log('Speech ended');
        resolve();
      };
      
      utterance.onerror = (event) => {
        this.emit('speech-end');
        console.error('Speech synthesis error:', event);
        reject(event);
      };
      
      // Make sure the speech synthesis is not canceled before speaking
      if (!this.speechSynthesis.speaking) {
        this.speechSynthesis.speak(utterance);
      } else {
        console.warn('Speech synthesis is already speaking, waiting...');
        // Add to queue
        setTimeout(() => {
          this.speechSynthesis.speak(utterance);
        }, 500);
      }
    });
  }
  
  private pause(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  get active(): boolean {
    return this.isActive;
  }
  
  public resetRecognition(): void {
    if (this.recognition) {
      try {
        console.log('Resetting speech recognition...');
        this.recognition.stop();
        setTimeout(() => {
          if (this.isActive) {
            this.recognition?.start();
            console.log('Speech recognition reset complete');
          }
        }, 500); // Slightly longer delay for reset
      } catch (e) {
        console.error('Error resetting speech recognition:', e);
      }
    }
  }
}

export const aiInterviewEngine = new InterviewEngine();