import { EventEmitter } from './eventEmitter';
import { VoiceAnalyzer, VoiceMetrics } from './voiceAnalysis';

export interface Message {
  role: "assistant" | "user";
  content: string;
  questionIndex?: number;
  responseTime?: number;
  fillerWords?: string[];
  hesitations?: number;
  voiceMetrics?: VoiceMetrics;
}

export interface InterviewConfig {
  userName: string;
  userId: string;
  jobRole?: string;
  industry?: string;
  experienceLevel?: string;
  techStack?: string[];
}

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
  private voiceAnalyzer: VoiceAnalyzer;
  private analysisInterval: number | null = null;
  private fillerWords: string[] = [
    'um', 'uh', 'like', 'you know', 'actually', 'basically', 'literally',
    'sort of', 'kind of', 'right', 'really', 'just', 'well', 'so'
  ];
  private hesitationCount: number = 0;
  private silenceTimer: number | null = null;
  private lastSpeechTimestamp: number = 0;
  private minSilenceForHesitation: number = 1000;

  constructor() {
    super();
    this.speechSynthesis = window.speechSynthesis;
    this.voiceAnalyzer = new VoiceAnalyzer();
    
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = this.loadVoices.bind(this);
    }
    
    this.initializeSpeechRecognition();
  }

  private initializeSpeechRecognition(): void {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognitionClass();
      
      if (this.recognition) {
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';
        
        this.setupRecognitionHandlers();
      }
    }
  }

  private setupRecognitionHandlers(): void {
    if (!this.recognition) return;

    this.recognition.onstart = () => {
      console.log('Speech recognition started');
      this.emit('recognition-start');
      this.startVoiceAnalysis();
    };

    this.recognition.onend = () => {
      console.log('Speech recognition ended');
      if (this.isActive) {
        setTimeout(() => {
          if (this.isActive) {
            this.recognition?.start();
          }
        }, 300);
      }
    };

    this.recognition.onresult = this.handleSpeechResult.bind(this);
    
    this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error !== 'no-speech') {
        console.error('Speech recognition error:', event);
        this.emit('error', { message: `Speech recognition error: ${event.error}` });
      }
    };
  }

  private startVoiceAnalysis(): void {
    this.voiceAnalyzer.start().catch(console.error);
    
    this.analysisInterval = window.setInterval(() => {
      if (this.userIsResponding) {
        const metrics = this.voiceAnalyzer.analyze();
        this.emit('voice-metrics', metrics);
      }
    }, 100) as unknown as number;
  }

  private stopVoiceAnalysis(): void {
    if (this.analysisInterval) {
      clearInterval(this.analysisInterval);
      this.analysisInterval = null;
    }
    this.voiceAnalyzer.stop();
  }

  private handleSpeechResult(event: SpeechRecognitionEvent): void {
    this.lastSpeechTimestamp = Date.now();
    
    if (this.silenceTimer !== null) {
      window.clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }
    
    this.silenceTimer = window.setTimeout(() => {
      if (this.userIsResponding) {
        this.hesitationCount++;
      }
    }, this.minSilenceForHesitation);

    let interimTranscript = '';
    let finalTranscript = '';
    
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript;
        
        if (this.userIsResponding) {
          const responseTime = (Date.now() - this.userStartTime) / 1000;
          const metrics = this.voiceAnalyzer.analyze();
          const detected = this.detectFillerWords(finalTranscript);
          
          const message: Message = {
            role: 'user',
            content: finalTranscript,
            questionIndex: this.currentQuestionIndex,
            responseTime,
            fillerWords: detected,
            hesitations: this.hesitationCount,
            voiceMetrics: metrics
          };
          
          this.emit('message', message);
          this.userIsResponding = false;
          this.hesitationCount = 0;
          
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

  private detectFillerWords(transcript: string): string[] {
    const lowerText = transcript.toLowerCase();
    return this.fillerWords.filter(word => lowerText.includes(word));
  }

  private loadVoices(): void {
    const voices = this.speechSynthesis.getVoices();
    if (voices.length > 0) {
      console.log('Voices loaded:', voices.length);
      this.voicesLoaded = true;
    }
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
      if (!this.voicesLoaded) {
        this.speechSynthesis.getVoices();
      }
      
      this.recognition.start();
      
      this.emit('call-start');
      
      await this.speakIntroduction();
      
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
    this.stopVoiceAnalysis();
    
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
    await this.pause(1000);
  }
  
  private async speakConclusion(): Promise<void> {
    const conclusion = `Thank you for completing this interview. I will now analyze your responses to provide feedback on your performance. This will help you prepare for your real interview. Please wait a moment while I process the results.`;
    
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
          "Great. Next question.",
          "Let's move on to the next question.",
          "Thank you. Now I'd like to ask you about something else.",
          "I appreciate your response. For my next question,",
          "Moving on,"
        ];
        transitionPhrase = transitions[Math.floor(Math.random() * transitions.length)] + " ";
      }
      
      const fullQuestion = `${transitionPhrase}${question}`;
      
      this.speak(fullQuestion).then(() => {
        this.userStartTime = Date.now();
        this.userIsResponding = true;
        this.hesitationCount = 0;
        
        this.emit('message', {
          role: 'assistant',
          content: question,
          questionIndex: this.currentQuestionIndex
        });
        
        setTimeout(() => {
          if (this.userIsResponding && this.isActive) {
            this.userIsResponding = false;
            this.askNextQuestion();
          }
        }, 60000);
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
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      const voices = this.speechSynthesis.getVoices();
      
      const preferredVoiceNames = [
        'Google US English', 
        'Microsoft David', 
        'Microsoft Zira', 
        'Samantha',
        'Alex',
        'Daniel'
      ];
      
      let selectedVoice = null;
      
      for (const voiceName of preferredVoiceNames) {
        const foundVoice = voices.find(voice => voice.name === voiceName);
        if (foundVoice) {
          selectedVoice = foundVoice;
          break;
        }
      }
      
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
      
      if (!selectedVoice) {
        selectedVoice = voices.find(voice => 
          voice.lang.startsWith('en-') && !voice.name.includes('Google')
        );
      }
      
      if (!selectedVoice && voices.length > 0) {
        selectedVoice = voices[0];
      }
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      
      utterance.onend = () => {
        this.emit('speech-end');
        resolve();
      };
      
      utterance.onerror = (event) => {
        this.emit('speech-end');
        reject(event);
      };
      
      if (!this.speechSynthesis.speaking) {
        this.speechSynthesis.speak(utterance);
      } else {
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
        this.recognition.stop();
        setTimeout(() => {
          if (this.isActive) {
            this.recognition?.start();
          }
        }, 500);
      } catch (e) {
        console.error('Error resetting speech recognition:', e);
      }
    }
  }
}

export const aiInterviewEngine = new InterviewEngine();