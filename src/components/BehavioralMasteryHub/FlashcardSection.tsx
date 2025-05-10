import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Mic, RefreshCw, Info, ThumbsUp, ThumbsDown } from 'lucide-react';
import { generateGeminiResponse } from '../../services/geminiService4';
import { useParticles } from '../../hooks/useParticles';

const FLASHCARD_CATEGORIES = [
  { id: 'leadership', name: 'Leadership Skills' },
  { id: 'conflict', name: 'Conflict Resolution' },
  { id: 'teamwork', name: 'Teamwork & Collaboration' },
  { id: 'communication', name: 'Effective Communication' },
  { id: 'decisionMaking', name: 'Decision Making' },
  { id: 'adaptability', name: 'Adaptability & Resilience' }
];

type Flashcard = {
  id: string;
  question: string;
  answer: string;
  insight: string;
  category: string;
};

const SAMPLE_FLASHCARDS: Flashcard[] = [
  {
    id: '1',
    question: 'Your team misses an important deadline. How do you handle this situation?',
    answer: 'I would first identify the root causes without placing blame. Then, I would communicate transparently with stakeholders about the delay and propose a revised timeline. Finally, I would implement process improvements to prevent similar issues in the future, such as adding buffer time or improving progress tracking.',
    insight: 'This scenario tests accountability, problem-solving, and communication under pressure.',
    category: 'leadership'
  },
  {
    id: '2',
    question: 'A colleague consistently interrupts you during meetings. How do you address this behavior?',
    answer: 'I would first speak with them privately, using "I" statements to explain how the interruptions affect my contributions. If needed, I might suggest a meeting structure where everyone has dedicated speaking time. For persistent issues, I might involve a mediator while maintaining professional respect.',
    insight: 'This tests assertiveness, conflict resolution, and professional communication skills.',
    category: 'conflict'
  },
  {
    id: '3',
    question: 'You disagree with a decision made by your manager. How do you respond?',
    answer: 'I would request a private conversation to understand their reasoning first. Then, I would present my perspective with supporting data and focus on business outcomes rather than personal preferences. Regardless of the final decision, I would commit to supporting it professionally once made.',
    insight: 'This scenario evaluates respectful upward communication, data-driven discussion, and organizational commitment.',
    category: 'communication'
  }
];

export const FlashcardSection: React.FC = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>(SAMPLE_FLASHCARDS);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Set up particle effect
  useParticles(containerRef, 8);

  const handleNext = () => {
    setIsFlipped(false);
    setUserAnswer('');
    setAiResponse(null);
    
    setTimeout(() => {
      setCurrentCardIndex((prevIndex) => 
        prevIndex < flashcards.length - 1 ? prevIndex + 1 : 0
      );
    }, 300);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const filteredCards = selectedCategory 
    ? flashcards.filter(card => card.category === selectedCategory)
    : flashcards;

  const currentCard = filteredCards[currentCardIndex % filteredCards.length];

  const handleRecordClick = async () => {
    if (isRecording) {
      // Stop recording
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
    } else {
      // Start recording
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];
        
        mediaRecorder.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };
        
        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          // Here you would send the audioBlob to a speech-to-text service
          // For now, let's simulate the conversion with a delay
          setAiLoading(true);
          setTimeout(() => {
            setUserAnswer("This is a simulated transcript of your voice answer. In a real implementation, we would convert your speech to text using a service like Google's Speech-to-Text API.");
            setAiLoading(false);
          }, 1500);
          
          // Stop all tracks of the stream
          stream.getTracks().forEach(track => track.stop());
        };
        
        mediaRecorder.start();
        setIsRecording(true);
      } catch (err) {
        console.error('Error accessing microphone:', err);
        alert('Could not access microphone. Please check permissions.');
      }
    }
  };

  const handleGenerateAIFeedback = async () => {
    if (!userAnswer.trim()) return;
    
    setAiLoading(true);
    try {
      const prompt = `
        As a behavioral interview coach, provide constructive feedback on this answer:
        
        Question: ${currentCard.question}
        
        Answer: ${userAnswer}
        
        Provide specific feedback on:
        1. Structure and clarity
        2. Use of the STAR method
        3. Demonstration of relevant soft skills
        4. Areas for improvement
        
        Keep your response under 150 words.
      `;
      
      const response = await generateGeminiResponse(prompt);
      setAiResponse(response);
    } catch (error) {
      console.error('Error generating AI feedback:', error);
      setAiResponse('Error generating feedback. Please try again.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleGenerateNewQuestions = async () => {
    setAiLoading(true);
    try {
      const prompt = `
        Generate 3 behavioral interview questions related to ${selectedCategory || 'professional workplace skills'}.
        
        For each question, include:
        1. The question text
        2. A model answer using the STAR method
        3. A brief insight explaining what skills or traits the question tests
        
        Format as a JSON array with objects containing "question", "answer", and "insight" fields.
      `;
      
      const response = await generateGeminiResponse(prompt);
      
      try {
        const parsedResponse = JSON.parse(response);
        const newFlashcards = parsedResponse.map((item: any, index: number) => ({
          id: `generated-${Date.now()}-${index}`,
          question: item.question,
          answer: item.answer,
          insight: item.insight,
          category: selectedCategory || 'general'
        }));
        
        setFlashcards(prevCards => [...prevCards, ...newFlashcards]);
        
        // Set to first new card
        setCurrentCardIndex(flashcards.length);
        setIsFlipped(false);
        setUserAnswer('');
        setAiResponse(null);
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError);
        alert('Error generating new questions. Please try again.');
      }
    } catch (error) {
      console.error('Error generating new questions:', error);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div ref={containerRef} className="relative min-h-[600px] py-4 overflow-hidden">
      {/* Category selector */}
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        <button 
          onClick={() => setSelectedCategory(null)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300
            ${selectedCategory === null ? 'bg-indigo-600 text-white' : 'bg-indigo-900/50 text-indigo-200 hover:bg-indigo-800/50'}`}
        >
          All Categories
        </button>
        {FLASHCARD_CATEGORIES.map(category => (
          <button 
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300
              ${selectedCategory === category.id ? 'bg-indigo-600 text-white' : 'bg-indigo-900/50 text-indigo-200 hover:bg-indigo-800/50'}`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {filteredCards.length > 0 && (
        <div className="max-w-2xl mx-auto">
          {/* Flashcard */}
          <div className={`flip-card h-[400px] w-full mb-8 ${isFlipped ? 'flipped' : ''}`}>
            <div className="flip-card-inner relative w-full h-full">
              {/* Front of card */}
              <div className="flip-card-front glass-card p-8 flex flex-col">
                <span className="text-xs font-medium text-indigo-300 uppercase tracking-wider mb-2">
                  Behavioral Question
                </span>
                <h3 className="text-2xl font-bold mb-4">{currentCard.question}</h3>
                
                <div className="flex-grow flex flex-col">
                  <textarea
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Type your answer here using the STAR method (Situation, Task, Action, Result)..."
                    className="flex-grow p-4 rounded-lg bg-black/20 text-white resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <button 
                    onClick={handleRecordClick}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300
                      ${isRecording 
                        ? 'bg-red-600 text-white pulsing' 
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
                  >
                    <Mic className="w-4 h-4" />
                    {isRecording ? 'Stop Recording' : 'Voice Answer'}
                  </button>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={handleGenerateAIFeedback}
                      disabled={!userAnswer.trim() || aiLoading}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2"
                    >
                      {aiLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Analyzing...</span>
                        </>
                      ) : (
                        <>
                          <Info className="w-4 h-4" />
                          <span>Get AI Feedback</span>
                        </>
                      )}
                    </button>
                    
                    <button 
                      onClick={handleFlip}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all duration-300"
                    >
                      See Answer
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Back of card */}
              <div className="flip-card-back glass-card p-8 flex flex-col">
                <span className="text-xs font-medium text-indigo-300 uppercase tracking-wider mb-2">
                  Model Answer
                </span>
                <h3 className="text-xl font-bold mb-4">{currentCard.question}</h3>
                
                <div className="mb-6 flex-grow overflow-auto pr-2 text-indigo-100">
                  <p>{currentCard.answer}</p>
                </div>
                
                <div className="bg-indigo-900/40 p-4 rounded-lg mb-4">
                  <h4 className="font-bold text-indigo-300 mb-1">Psychological Insight:</h4>
                  <p className="text-sm text-indigo-200">{currentCard.insight}</p>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <button className="p-2 rounded-full bg-indigo-700/50 hover:bg-indigo-700 transition-all duration-300">
                      <ThumbsUp className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-full bg-indigo-700/50 hover:bg-indigo-700 transition-all duration-300">
                      <ThumbsDown className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <button 
                    onClick={handleNext}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all duration-300 flex items-center gap-2"
                  >
                    Next Question
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* AI Feedback Section */}
          {aiResponse && (
            <div className="mb-8 glass-card p-6 animate-fadeIn">
              <h4 className="font-bold text-xl mb-3 text-indigo-100">AI Feedback on Your Answer</h4>
              <div className="bg-black/20 p-4 rounded-lg text-indigo-100">
                <p>{aiResponse}</p>
              </div>
            </div>
          )}
          
          {/* Card navigation */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-indigo-300">
              Card {currentCardIndex + 1} of {filteredCards.length}
            </div>
            
            <button 
              onClick={handleGenerateNewQuestions}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg transition-all duration-300 flex items-center gap-2"
            >
              {aiLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span>Generate New Questions</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};