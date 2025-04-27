
// Python-inspired AI Interview SDK
// This uses browser Web Speech API for voice interactions

type EventTypes = 'speech-start' | 'speech-end' | 'call-start' | 'call-end' | 'message' | 'error' | 'listening-start' | 'listening-end';
type EventCallback = (data: any) => void;

class PythonAI {
  private eventListeners: Record<string, EventCallback[]> = {};
  private synthesis: SpeechSynthesisUtterance | null = null;
  private recognition: any = null;
  private questions: string[] = [];
  private currentQuestionIndex = -1;
  private isActive = false;
  private isSpeaking = false;
  private voiceOptions: SpeechSynthesisVoice[] = [];
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private userId: string = '';
  private userName: string = '';
  private isListening = false;
  private maxResponseTime = 120000; // 2 minutes in ms
  private responseTimer: any = null;
  
  constructor() {
    // Initialize voice options when available
    if (window.speechSynthesis) {
      // Wait for voices to be loaded
      if (speechSynthesis.getVoices().length > 0) {
        this.voiceOptions = speechSynthesis.getVoices();
        this.selectBestVoice();
      } else {
        speechSynthesis.onvoiceschanged = () => {
          this.voiceOptions = speechSynthesis.getVoices();
          this.selectBestVoice();
        };
      }
    }
  }

  // Select a natural-sounding voice
  private selectBestVoice() {
    const voices = this.voiceOptions;
    
    // Log available voices for debugging
    console.log("Available voices:", voices.map(v => v.name));
    
    // Prioritize natural-sounding voices
    const preferredVoices = voices.filter(voice => 
      voice.name.toLowerCase().includes('google') || 
      voice.name.toLowerCase().includes('premium') ||
      voice.name.toLowerCase().includes('neural') ||
      voice.name.toLowerCase().includes('samantha') ||
      voice.name.toLowerCase().includes('daniel')
    );
    
    if (preferredVoices.length > 0) {
      // Select a female voice if possible
      const femaleVoice = preferredVoices.find(voice => 
        voice.name.toLowerCase().includes('female') ||
        voice.name.toLowerCase().includes('samantha') ||
        voice.name.toLowerCase().includes('karen') ||
        voice.name.toLowerCase().includes('moira') ||
        voice.name.toLowerCase().includes('tessa') ||
        voice.name.toLowerCase().includes('alex')
      );
      
      this.selectedVoice = femaleVoice || preferredVoices[0];
    } else {
      // Fallback to any available voice
      const englishVoices = voices.filter(voice => voice.lang.startsWith('en-'));
      this.selectedVoice = englishVoices.length > 0 ? englishVoices[0] : (voices.length > 0 ? voices[0] : null);
    }
    
    if (this.selectedVoice) {
      console.log("Selected voice:", this.selectedVoice.name);
    } else {
      console.warn("No voice selected. Speech synthesis may not work properly.");
    }
  }

  // Add event listener
  public on(event: EventTypes, callback: EventCallback) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event].push(callback);
    return this;
  }

  // Remove event listener
  public off(event: EventTypes, callback: EventCallback) {
    if (!this.eventListeners[event]) return this;
    this.eventListeners[event] = this.eventListeners[event].filter(cb => cb !== callback);
    return this;
  }

  // Emit event
  private emit(event: EventTypes, data?: any) {
    if (!this.eventListeners[event]) return;
    this.eventListeners[event].forEach(cb => cb(data));
  }

  // Start interview
  public async start(questionsData: string[], options: {
    userName: string;
    userId: string;
    jobRole?: string;
    techStack?: string;
    experienceLevel?: string;
  }) {
    if (this.isActive) {
      console.warn('Interview is already in progress');
      return;
    }

    try {
      // Validate that we have questions and user info
      if (!questionsData || questionsData.length === 0) {
        throw new Error('No questions provided for the interview');
      }

      this.questions = questionsData;
      this.userId = options.userId || 'anonymous-user';
      this.userName = options.userName || 'Candidate';
      this.currentQuestionIndex = -1;
      this.isActive = true;
      
      // Emit call start event
      this.emit('call-start', { userId: this.userId });
      
      // Introduce and start first question after a brief delay
      const jobRoleText = options.jobRole ? ` for the ${options.jobRole} position` : '';
      
      await this.speak(`Hello ${this.userName}, welcome to your interview${jobRoleText}. I'll be asking you ${this.questions.length} questions. Let's begin.`);
      
      // Short pause before first question
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Start asking questions
      this.askNextQuestion();
      
    } catch (error) {
      console.error('Error starting interview:', error);
      this.emit('error', { message: 'Failed to start interview session', error });
    }
  }

  // Stop interview
  public stop() {
    if (!this.isActive) return;
    
    if (this.isSpeaking) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
    }
    
    if (this.isListening) {
      this.stopListening();
    }
    
    if (this.responseTimer) {
      clearTimeout(this.responseTimer);
      this.responseTimer = null;
    }
    
    this.isActive = false;
    this.emit('call-end');
  }

  // Get current question index
  public getCurrentQuestionIndex(): number {
    return this.currentQuestionIndex;
  }

  // Stop listening for answer
  private stopListening() {
    if (this.recognition) {
      try {
        this.recognition.stop();
        this.isListening = false;
        this.emit('listening-end');
      } catch (e) {
        console.log('Recognition already stopped');
      }
    }
  }

  // Speak text and return a promise that resolves when speech ends
  private speak(text: string): Promise<void> {
    return new Promise((resolve) => {
      if (!window.speechSynthesis) {
        console.error('Speech synthesis not supported in this browser');
        this.emit('error', { message: 'Speech synthesis not supported in this browser' });
        resolve();
        return;
      }
      
      this.isSpeaking = true;
      this.emit('speech-start');
      
      // Create utterance
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set voice if available
      if (this.selectedVoice) {
        utterance.voice = this.selectedVoice;
      }
      
      // Configure voice properties for natural speech
      utterance.rate = 0.95;  // Slightly slower for clarity
      utterance.pitch = 1.1;
      utterance.volume = 1.0;
      
      // Speech events
      utterance.onend = () => {
        this.isSpeaking = false;
        this.emit('speech-end');
        resolve();
      };
      
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        this.isSpeaking = false;
        this.emit('speech-end');
        this.emit('error', { message: 'Error during speech synthesis', event });
        resolve();
      };
      
      // Emit message event with assistant message
      this.emit('message', {
        type: 'transcript',
        transcriptType: 'final',
        role: 'assistant',
        transcript: text
      });
      
      // Start speaking
      window.speechSynthesis.speak(utterance);
      this.synthesis = utterance;
    });
  }

  // Ask next question
  private async askNextQuestion() {
    if (!this.isActive) return;
    
    this.currentQuestionIndex++;
    
    if (this.currentQuestionIndex >= this.questions.length) {
      // Interview complete
      await this.speak("That concludes our interview today. Thank you for your time. I'll analyze your responses and provide feedback shortly.");
      this.stop();
      return;
    }
    
    // Ask current question
    const question = this.questions[this.currentQuestionIndex];
    await this.speak(`Question ${this.currentQuestionIndex + 1}: ${question}`);
    
    // Start listening for answer
    this.listenForAnswer();
  }

  // Listen for user's answer
  private listenForAnswer() {
    if (!this.isActive) return;
    
    // Check if speech recognition is available
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      console.error('Speech recognition not supported in this browser');
      this.emit('error', { message: 'Speech recognition not supported in this browser' });
      this.handleUserSpeech('I apologize, but speech recognition is not supported in your browser.');
      return;
    }
    
    // Create speech recognition instance
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || 
                               (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognitionAPI();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    
    let finalTranscript = '';
    let recognitionStartTime = Date.now();
    
    recognition.onstart = () => {
      console.log('Speech recognition started');
      this.isListening = true;
      recognitionStartTime = Date.now();
      this.emit('listening-start');
      
      // Set timeout for maximum answer time
      if (this.responseTimer) {
        clearTimeout(this.responseTimer);
      }
      
      this.responseTimer = setTimeout(() => {
        this.stopListening();
        this.handleUserSpeech(finalTranscript || "I didn't hear a response", (Date.now() - recognitionStartTime) / 1000);
      }, this.maxResponseTime);
    };
    
    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + ' ';
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      
      // If we have a significant interim transcript, show it
      if (interimTranscript.length > 2) {
        this.emit('message', {
          type: 'transcript',
          transcriptType: 'interim',
          role: 'user',
          transcript: interimTranscript
        });
      }
    };
    
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      this.emit('error', { message: 'Speech recognition error', event });
      this.isListening = false;
      this.emit('listening-end');
      this.handleUserSpeech('I apologize, but I couldn\'t hear your response clearly.');
    };
    
    // Stop when the user stops talking (silence detection)
    recognition.onspeechend = () => {
      setTimeout(() => {
        try {
          recognition.stop();
          // Process whatever we have now
          if (finalTranscript.trim().length === 0) {
            this.handleUserSpeech("I didn't catch your answer. Let me ask again.");
            this.askNextQuestion();
          }
        } catch (e) {
          // Recognition might be already stopped
        }
      }, 2000);  // Wait 2 seconds of silence before stopping
    };
    
    recognition.onend = () => {
      this.isListening = false;
      this.emit('listening-end');
      
      if (this.responseTimer) {
        clearTimeout(this.responseTimer);
        this.responseTimer = null;
      }
      
      const responseTime = (Date.now() - recognitionStartTime) / 1000;
      
      if (finalTranscript.trim()) {
        this.handleUserSpeech(finalTranscript, responseTime);
      } else if (Date.now() - recognitionStartTime >= this.maxResponseTime) {
        // If we've been listening for the max time and got nothing
        this.handleUserSpeech("I didn't catch your answer. Let's move on to the next question.");
      } else {
        // Try to restart if we didn't get anything and it wasn't a timeout
        try {
          if (this.isActive) {
            recognition.start();
          }
        } catch (e) {
          console.log("Couldn't restart recognition:", e);
          this.askNextQuestion();
        }
      }
    };
    
    // Start listening
    try {
      recognition.start();
      this.recognition = recognition;
    } catch (e) {
      console.error('Error starting speech recognition:', e);
      this.emit('error', { message: 'Error starting speech recognition', error: e });
      this.handleUserSpeech('I apologize, but there was an error with speech recognition.');
    }
  }

  // Handle user's spoken response
  private handleUserSpeech(transcript: string, responseTime?: number) {
    // Emit message event with user's response
    this.emit('message', {
      type: 'transcript',
      transcriptType: 'final',
      role: 'user',
      transcript: transcript.trim(),
      responseTime,
      questionIndex: this.currentQuestionIndex
    });
    
    // Wait a moment before asking the next question
    setTimeout(() => {
      if (this.isActive) {
        this.askNextQuestion();
      }
    }, 2000);  // 2 seconds delay between answer and next question
  }
  
  // Public method to check if interview is active
  public isInterviewActive(): boolean {
    return this.isActive;
  }
  
  // Public method to check if AI is currently listening
  public isAiListening(): boolean {
    return this.isListening;
  }
  
  // Public method to check if AI is currently speaking
  public isAiSpeaking(): boolean {
    return this.isSpeaking;
  }
  
  // Get total questions count
  public getTotalQuestions(): number {
    return this.questions.length;
  }
}

export const pythonAI = new PythonAI();
