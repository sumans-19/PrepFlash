
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { analyzeBehavioralResponse } from '../../services/behavioralService';
import { BehavioralFlashcard } from '@/types';
import { AlertCircle, Loader } from 'lucide-react';

const flashcardDecks = [
  { id: 'leadership', name: 'Leadership', color: 'bg-purple-800/20 text-purple-200 border-purple-700/50' },
  { id: 'teamwork', name: 'Teamwork', color: 'bg-green-800/20 text-green-200 border-green-700/50' },
  { id: 'communication', name: 'Communication', color: 'bg-amber-800/20 text-amber-200 border-amber-700/50' },
  { id: 'problem-solving', name: 'Problem Solving', color: 'bg-purple-800/20 text-purple-200 border-purple-700/50' },
  { id: 'adaptability', name: 'Adaptability', color: 'bg-rose-800/20 text-rose-200 border-rose-700/50' },
];

// Initial flashcards to show while loading from Gemini API
const initialFlashcards: BehavioralFlashcard[] = [
  {
    id: 1,
    question: "Your team has missed a critical deadline. How do you handle the situation?",
    trait: "Leadership & Accountability",
    insight: "This scenario tests your ability to take ownership of failures and demonstrate leadership under pressure.",
    choices: [
      "Identify who was responsible for the delay and address them directly.",
      "Take responsibility as a team leader and develop a recovery plan.",
      "Explain to stakeholders the external factors that caused the delay.",
      "Focus solely on making up for lost time without addressing the root cause."
    ],
    bestAnswer: 1
  },
  {
    id: 2,
    question: "You disagree with a decision your manager has made. How do you approach this situation?",
    trait: "Communication & Diplomacy",
    insight: "This tests your ability to navigate hierarchical relationships while advocating for your perspective.",
    choices: [
      "Keep your concerns to yourself to avoid conflict.",
      "Request a private meeting to discuss your perspective respectfully.",
      "Share your disagreement openly in a team meeting.",
      "Go to your manager's superior if you feel strongly about your position."
    ],
    bestAnswer: 1
  },
  {
    id: 3,
    question: "A coworker consistently submits work that requires significant revisions, affecting team deadlines. What would you do?",
    trait: "Conflict Resolution & Teamwork",
    insight: "This scenario evaluates how you handle peer-to-peer challenges and balance team success with individual support.",
    choices: [
      "Speak with your manager about the coworker's performance issues.",
      "Offer to review their work before final submission to catch issues early.",
      "Directly tell them their work quality is affecting the team.",
      "Redistribute tasks so this person gets less critical assignments."
    ],
    bestAnswer: 1
  },
];

const FlashcardModule = () => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [selectedDeck, setSelectedDeck] = useState('leadership');
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [userResponse, setUserResponse] = useState('');
  const [responseMode, setResponseMode] = useState('multiple-choice');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [flashcards, setFlashcards] = useState<BehavioralFlashcard[]>(initialFlashcards);
  const [feedback, setFeedback] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const currentCard = flashcards[currentCardIndex];

  // Load flashcards from Gemini API or use backup data
  useEffect(() => {
    const loadFlashcards = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Using the mock data directly since the import is causing issues
        setFlashcards(initialFlashcards);
        setCurrentCardIndex(0);
        setFlipped(false);
        setSelectedChoice(null);
        setUserResponse('');
        setFeedback(null);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Simulate error to show error UI
        if (Math.random() > 0.6) {
          throw new Error("Failed to generate flashcards. Using backup data instead.");
        }
        
      } catch (error) {
        console.error("Error loading flashcards:", error);
        setError("Failed to generate flashcards. Using backup data instead.");
        toast.error("Failed to load flashcards. Using backup data.");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFlashcards();
  }, [selectedDeck]);

  const nextCard = () => {
    setFlipped(false);
    setSelectedChoice(null);
    setUserResponse('');
    setFeedback(null);
    setError(null);
    
    // Simple animation
    if (cardRef.current) {
      cardRef.current.classList.add('opacity-0', 'translate-x-10');
      setTimeout(() => {
        setCurrentCardIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
        if (cardRef.current) {
          cardRef.current.classList.remove('opacity-0', 'translate-x-10');
        }
      }, 300);
    }
  };

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  const submitAnswer = async () => {
    if (responseMode === 'multiple-choice' && selectedChoice === null) {
      toast.error("Please select an answer");
      return;
    }

    if (responseMode === 'open-ended' && !userResponse.trim()) {
      toast.error("Please provide an answer");
      return;
    }

    // Analyze response if in open-ended mode
    if (responseMode === 'open-ended') {
      setIsAnalyzing(true);
      setError(null);
      
      try {
        // For demo purposes, simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // We'll simulate both success and error randomly
        if (Math.random() > 0.3) {
          // Success case
          setFeedback({
            score: 7,
            strengths: ["You addressed the core question", "Your response was clear and concise", "Good use of specific examples"],
            improvements: ["Consider using the STAR method more explicitly", "Add more details about the outcome of your actions"],
            overall: "Good response with clear examples. Structuring with the STAR method would make it even stronger."
          });
        } else {
          // Error case
          throw new Error("Failed to analyze response");
        }
      } catch (error) {
        console.error("Error analyzing response:", error);
        setError("Failed to connect to AI service. Please try again.");
        toast.error("Failed to analyze response");
      } finally {
        setIsAnalyzing(false);
      }
    }

    setFlipped(true);
  };

  return (
    <div className="bg-[#0e0627] text-white p-8 rounded-xl min-h-[600px] max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold bg-gradient-to-r text-transparent bg-clip-text"
            style={{backgroundImage: 'linear-gradient(to right, #b362ff, #4cc9f0)'}}>
          Flashcards
        </h2>
        <div className="flex gap-3">
          <Select value={responseMode} onValueChange={setResponseMode}>
            <SelectTrigger className="w-[180px] bg-[#1a0b2e] border-purple-800/30">
              <SelectValue placeholder="Response Mode" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a0b2e] border-purple-800/30 text-white">
              <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
              <SelectItem value="open-ended">Open Ended (STAR)</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            className="bg-transparent border border-purple-800/30 hover:bg-purple-900/20 text-white" 
            onClick={nextCard}
          >
            Skip
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {flashcardDecks.map(deck => (
            <Badge 
              key={deck.id}
              className={`cursor-pointer px-4 py-1.5 rounded-full border ${
                selectedDeck === deck.id 
                  ? deck.color 
                  : 'bg-[#1a0b2e]/50 text-white/70 hover:bg-[#1a0b2e] border-purple-800/30'
              }`}
              onClick={() => setSelectedDeck(deck.id)}
            >
              {deck.name}
            </Badge>
          ))}
        </div>
      </div>

      <div className="relative mb-6">
        {isLoading ? (
          <Card className="p-6 flex items-center justify-center bg-[#1a0b2e]/80 border-purple-800/30 text-white" style={{ minHeight: '320px' }}>
            <div className="text-center">
              <Loader className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-400" />
              <p className="text-gray-300">Generating flashcards with AI...</p>
            </div>
          </Card>
        ) : (
          <Card 
            ref={cardRef}
            className={`p-6 transition-all duration-300 ease-in-out ${flipped ? 'bg-[#1a0b2e]/80' : 'bg-[#1a0b2e]/60'} border-purple-800/30 text-white`}
            style={{ minHeight: '320px' }}
          >
            {error && (
              <div className="absolute top-0 right-0 m-4 p-3 bg-black/50 backdrop-blur-sm rounded-lg border border-red-500/30 flex items-center gap-2 max-w-md">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <p className="text-sm text-red-200">{error}</p>
              </div>
            )}
            
            {currentCard && !flipped ? (
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Badge className="bg-purple-800/30 text-purple-300 border-purple-700/50">
                    {currentCard.trait}
                  </Badge>
                  <span className="text-sm text-gray-400">Card {currentCardIndex + 1}/{flashcards.length}</span>
                </div>
                
                <h3 className="text-lg font-medium text-white">{currentCard.question}</h3>
                
                {responseMode === 'multiple-choice' ? (
                  <div className="space-y-3 mt-6">
                    {currentCard.choices?.map((choice, index) => (
                      <div 
                        key={index}
                        className={`p-3 border rounded-md cursor-pointer transition-colors ${
                          selectedChoice === index 
                            ? 'border-purple-500 bg-purple-900/30' 
                            : 'border-purple-800/30 hover:bg-[#1a0b2e]'
                        }`}
                        onClick={() => setSelectedChoice(index)}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                            selectedChoice === index 
                              ? 'border-purple-400' 
                              : 'border-purple-800'
                          }`}>
                            {selectedChoice === index && (
                              <div className="h-3 w-3 rounded-full bg-purple-400"></div>
                            )}
                          </div>
                          <span className="text-gray-200">{choice}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2 mt-6">
                    <p className="text-sm text-gray-300">
                      Use the <span className="font-medium text-purple-300">STAR method</span> (Situation, Task, Action, Result) in your response.
                    </p>
                    <Textarea 
                      placeholder="Type your response here..." 
                      className="min-h-[120px] bg-[#0e0627] border-purple-800/50 text-white placeholder:text-gray-500"
                      value={userResponse}
                      onChange={(e) => setUserResponse(e.target.value)}
                    />
                  </div>
                )}
              </div>
            ) : currentCard && flipped ? (
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Badge className="bg-purple-800/30 text-purple-300 border-purple-700/50">
                    Psychological Insight
                  </Badge>
                  <Button variant="ghost" size="sm" onClick={handleFlip} className="text-gray-300 hover:text-white">
                    Back to Question
                  </Button>
                </div>
                
                <h3 className="text-xl font-medium text-white">{currentCard.trait}</h3>
                <p className="text-gray-300">{currentCard.insight}</p>
                
                {responseMode === 'multiple-choice' ? (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2 text-purple-300">Best Approach:</h4>
                    <div className="p-3 border border-green-500/30 bg-green-900/20 rounded-md">
                      {currentCard.choices?.[currentCard.bestAnswer || 0]}
                    </div>
                    
                    {selectedChoice !== null && currentCard.bestAnswer !== undefined && selectedChoice !== currentCard.bestAnswer && (
                      <div className="mt-3 p-3 border border-amber-500/30 bg-amber-900/20 rounded-md">
                        <p className="font-medium text-amber-300 mb-1">Your choice:</p>
                        <p className="text-gray-300">{currentCard.choices?.[selectedChoice]}</p>
                      </div>
                    )}
                  </div>
                ) : feedback ? (
                  <div className="space-y-4 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="text-2xl font-bold text-purple-400">{feedback.score}/10</div>
                      <div className="h-2 flex-1 bg-[#0e0627] rounded-full">
                        <div 
                          className="h-full bg-purple-500 rounded-full" 
                          style={{ width: `${feedback.score * 10}%` }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2 text-green-300">Strengths:</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {feedback.strengths.map((strength: string, i: number) => (
                          <li key={i} className="text-sm text-green-200">{strength}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2 text-amber-300">For Improvement:</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {feedback.improvements.map((improvement: string, i: number) => (
                          <li key={i} className="text-sm text-amber-200">{improvement}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="p-3 bg-[#0e0627]/70 rounded-md">
                      <h4 className="font-medium mb-1 text-purple-300">Overall Feedback:</h4>
                      <p className="text-sm text-gray-300">{feedback.overall}</p>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-400">No flashcard available</p>
              </div>
            )}
          </Card>
        )}
      </div>

      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handleFlip} 
          disabled={isLoading}
          className="bg-transparent border border-purple-800/30 hover:bg-purple-900/20 text-white"
        >
          {flipped ? "Back to Question" : "Show Insight"}
        </Button>
        
        {!flipped ? (
          <Button 
            onClick={submitAnswer} 
            disabled={responseMode === 'multiple-choice' ? selectedChoice === null : !userResponse.trim() || isAnalyzing || isLoading}
            className="bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-90 text-white border-none"
          >
            {isAnalyzing ? 
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </> : 
              "Submit Answer"
            }
          </Button>
        ) : (
          <Button 
            onClick={nextCard} 
            className="bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-90 text-white border-none"
            disabled={isLoading}
          >
            Next Card
          </Button>
        )}
      </div>
    </div>
  );
};

export default FlashcardModule;
