import React, { useState, useEffect, useRef } from 'react';
import { useParticles } from '../../hooks/useParticles';
import { generateGeminiResponse } from '../../services/geminiService4';
import { Brain, Clock, Award, RefreshCw, Info } from 'lucide-react';

type Bubble = {
  id: number;
  text: string;
  x: number;
  y: number;
  size: number;
  speed: number;
  color: string;
  popped: boolean;
  correct: boolean;
};

type GameState = 'setup' | 'playing' | 'finished';

export const GameSection: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('setup');
  const [scenario, setScenario] = useState<string>('');
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isGenerating, setIsGenerating] = useState(false);
  const [gameType, setGameType] = useState<'response' | 'trait'>('response');
  
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);
  
  // Set up floating particles background effect
  useParticles(gameContainerRef, 5);
  
  // Generate a new behavioral scenario and response options
  const generateGame = async (type: 'response' | 'trait') => {
    setIsGenerating(true);
    
    try {
      let prompt = '';
      
      if (type === 'response') {
        prompt = `
          Generate a workplace behavioral scenario and 8 possible responses. 
          3 should be good responses (professional, effective) and 5 should be poor responses (unprofessional, ineffective).
          
          Format the response as JSON:
          {
            "scenario": "Detailed workplace scenario...",
            "responses": [
              {"text": "Response 1", "correct": true/false},
              {"text": "Response 2", "correct": true/false},
              ...
            ]
          }
          
          Make sure the scenario is realistic and applicable to professional settings.
        `;
      } else {
        prompt = `
          Generate a professional behavior description and 8 personality traits.
          3 traits should match the behavior (appropriate traits) and 5 should not match (inappropriate traits).
          
          Format the response as JSON:
          {
            "scenario": "Detailed description of a professional behavior...",
            "responses": [
              {"text": "Trait 1", "correct": true/false},
              {"text": "Trait 2", "correct": true/false},
              ...
            ]
          }
          
          Make the behavior description detailed and specific to workplace scenarios.
        `;
      }
      
      const response = await generateGeminiResponse(prompt);
      
      try {
        const parsedResponse = JSON.parse(response);
        setScenario(parsedResponse.scenario);
        
        // Create bubbles from the responses
        const colors = [
          'from-blue-400 to-blue-600',
          'from-purple-400 to-purple-600',
          'from-pink-400 to-pink-600',
          'from-indigo-400 to-indigo-600',
          'from-teal-400 to-teal-600'
        ];
        
        const newBubbles = parsedResponse.responses.map((resp: any, index: number) => ({
          id: index,
          text: resp.text,
          x: Math.random() * 80 + 10, // 10% to 90% of container width
          y: Math.random() * 60 + 20, // 20% to 80% of container height
          size: Math.random() * 20 + 80, // Size between 80px and 100px
          speed: Math.random() * 0.5 + 0.2, // Speed of upward movement
          color: colors[index % colors.length],
          popped: false,
          correct: resp.correct
        }));
        
        setBubbles(newBubbles);
        setScore(0);
        setTimeLeft(60);
        setGameState('playing');
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError);
        alert('Error generating game content. Please try again.');
      }
    } catch (error) {
      console.error('Error generating game:', error);
      alert('Error communicating with AI service. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleStartGame = (type: 'response' | 'trait') => {
    setGameType(type);
    generateGame(type);
  };
  
  const handleBubblePop = (id: number, correct: boolean) => {
    // Update bubbles to mark this one as popped
    setBubbles(prevBubbles =>
      prevBubbles.map(bubble =>
        bubble.id === id ? { ...bubble, popped: true } : bubble
      )
    );
    
    // Update score
    if (correct) {
      setScore(prevScore => prevScore + 10);
    } else {
      setScore(prevScore => Math.max(0, prevScore - 5));
    }
  };
  
  // Timer effect
  useEffect(() => {
    if (gameState === 'playing') {
      // Start timer
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setGameState('finished');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameState]);
  
  // Move bubbles effect
  useEffect(() => {
    if (gameState !== 'playing') return;
    
    const moveInterval = setInterval(() => {
      setBubbles(prevBubbles =>
        prevBubbles.map(bubble => {
          if (bubble.popped) return bubble;
          
          // Move bubble upward
          const newY = bubble.y - bubble.speed;
          
          // If bubble goes off screen top, bring it back to bottom
          if (newY < -10) {
            return {
              ...bubble,
              y: 100, // Below the bottom
              x: Math.random() * 80 + 10 // Random horizontal position
            };
          }
          
          // Add slight horizontal movement
          const newX = bubble.x + (Math.random() * 0.4 - 0.2);
          const boundedX = Math.max(5, Math.min(95, newX)); // Keep within bounds
          
          return {
            ...bubble,
            y: newY,
            x: boundedX
          };
        })
      );
    }, 50);
    
    return () => clearInterval(moveInterval);
  }, [gameState]);
  
  // Check if all correct bubbles are popped
  useEffect(() => {
    if (gameState === 'playing') {
      const allCorrectPopped = bubbles
        .filter(bubble => bubble.correct)
        .every(bubble => bubble.popped);
      
      if (allCorrectPopped && bubbles.length > 0) {
        // Bonus for finishing early
        const timeBonus = timeLeft * 2;
        setScore(prevScore => prevScore + timeBonus);
        setGameState('finished');
        
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      }
    }
  }, [bubbles, gameState, timeLeft]);
  
  return (
    <div ref={gameContainerRef} className="relative min-h-[600px] py-4 overflow-hidden">
      {gameState === 'setup' && (
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-white">Behavioral Skill Games</h2>
          <p className="mb-8 text-indigo-200">
            Choose a game type to practice and test your behavioral intelligence in a fun, 
            interactive way. Pop the correct bubbles to score points!
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div 
              className="glass-card p-6 hover:transform hover:scale-105 transition-all cursor-pointer"
              onClick={() => !isGenerating && handleStartGame('response')}
            >
              <div className="bg-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Response Bubbles</h3>
              <p className="text-indigo-200 mb-4">
                Given a workplace scenario, pop the bubbles with the most appropriate responses.
              </p>
              <button 
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-all"
                onClick={() => !isGenerating && handleStartGame('response')}
                disabled={isGenerating}
              >
                {isGenerating ? 'Generating...' : 'Start Game'}
              </button>
            </div>
            
            <div 
              className="glass-card p-6 hover:transform hover:scale-105 transition-all cursor-pointer"
              onClick={() => !isGenerating && handleStartGame('trait')}
            >
              <div className="bg-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Info className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Trait Matcher</h3>
              <p className="text-indigo-200 mb-4">
                Match the correct personality traits to the described behavior.
              </p>
              <button 
                className="w-full py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-all"
                onClick={() => !isGenerating && handleStartGame('trait')}
                disabled={isGenerating}
              >
                {isGenerating ? 'Generating...' : 'Start Game'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {gameState === 'playing' && (
        <div className="relative h-[600px]">
          {/* Game HUD */}
          <div className="absolute top-0 left-0 right-0 z-10 glass-card p-4 rounded-b-none flex justify-between">
            <div className="flex items-center">
              <Award className="w-5 h-5 mr-2 text-yellow-400" />
              <span className="font-bold text-lg">{score} pts</span>
            </div>
            
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2 text-red-400" />
              <span className="font-bold text-lg">{timeLeft}s</span>
            </div>
          </div>
          
          {/* Scenario */}
          <div className="absolute top-16 left-0 right-0 z-10 glass-card p-4 mx-4 text-center">
            <h3 className="font-bold mb-2">
              {gameType === 'response' ? 'Workplace Scenario' : 'Behavior Description'}
            </h3>
            <p>{scenario}</p>
            <p className="mt-2 text-indigo-300 text-sm">
              {gameType === 'response' 
                ? 'Pop the bubbles with appropriate responses!' 
                : 'Pop the bubbles with matching personality traits!'}
            </p>
          </div>
          
          {/* Bubbles */}
          <div className="absolute inset-0 overflow-hidden pt-36">
            {bubbles.map(bubble => (
              !bubble.popped && (
                <div
                  key={bubble.id}
                  className={`absolute rounded-full bg-gradient-to-br ${bubble.color} flex items-center justify-center p-4 cursor-pointer transition-transform hover:scale-105 select-none text-center shadow-lg animate-pulse`}
                  style={{
                    left: `${bubble.x}%`,
                    top: `${bubble.y}%`,
                    width: `${bubble.size}px`,
                    height: `${bubble.size}px`,
                    animation: `pulse 2s infinite ease-in-out`,
                  }}
                  onClick={() => handleBubblePop(bubble.id, bubble.correct)}
                >
                  <span className="text-white text-xs font-medium">{bubble.text}</span>
                </div>
              )
            ))}
          </div>
        </div>
      )}
      
      {gameState === 'finished' && (
        <div className="max-w-2xl mx-auto glass-card p-8 text-center">
          <h2 className="text-3xl font-bold mb-2">Game Complete!</h2>
          
          <div className="my-8">
            <div className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl font-bold">{score}</span>
            </div>
            <p className="text-xl font-semibold">Final Score</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-8 max-w-md mx-auto">
            <div className="glass-card p-4">
              <p className="text-indigo-300 text-sm">Time Remaining</p>
              <p className="text-2xl font-bold">{timeLeft}s</p>
            </div>
            <div className="glass-card p-4">
              <p className="text-indigo-300 text-sm">Correct Bubbles</p>
              <p className="text-2xl font-bold">
                {bubbles.filter(b => b.correct && b.popped).length} / {bubbles.filter(b => b.correct).length}
              </p>
            </div>
          </div>
          
          <button 
            onClick={() => handleStartGame(gameType)}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-all flex items-center justify-center gap-2 mx-auto"
          >
            <RefreshCw className="w-5 h-5" />
            Play Again
          </button>
          
          <button 
            onClick={() => setGameState('setup')}
            className="mt-4 px-6 py-3 bg-transparent border border-indigo-400 hover:bg-indigo-900/30 rounded-lg transition-all mx-auto"
          >
            Change Game Type
          </button>
        </div>
      )}
    </div>
  );
};