import React, { useState, useEffect } from 'react';
import { ChevronRight, RotateCcw, RefreshCw, Users, MessageSquare } from 'lucide-react';
import { generateGeminiResponse } from '../../services/geminiService4';

type ScenarioNode = {
  id: string;
  text: string;
  choices: ScenarioChoice[];
  feedback?: string;
  isEnding?: boolean;
};

type ScenarioChoice = {
  id: string;
  text: string;
  nextNodeId: string;
  traits: string[];
};

type Scenario = {
  title: string;
  context: string;
  startNodeId: string;
  nodes: Record<string, ScenarioNode>;
};

// Sample scenario data
const SAMPLE_SCENARIO: Scenario = {
  title: "Team Conflict Resolution",
  context: "You're managing a project team of five people. Two team members, Alex and Jordan, are in open conflict over the technical approach to a key feature. Their disagreement is causing delays and affecting team morale.",
  startNodeId: "start",
  nodes: {
    "start": {
      id: "start",
      text: "How do you handle this situation?",
      choices: [
        {
          id: "choice1",
          text: "Call a team meeting and have Alex and Jordan discuss their viewpoints in front of everyone",
          nextNodeId: "team_meeting",
          traits: ["Transparency", "Team-oriented", "Directness"]
        },
        {
          id: "choice2",
          text: "Meet with Alex and Jordan privately to mediate their disagreement",
          nextNodeId: "private_mediation",
          traits: ["Diplomacy", "Conflict resolution", "Privacy"]
        },
        {
          id: "choice3",
          text: "Make an executive decision on which technical approach to use",
          nextNodeId: "executive_decision",
          traits: ["Decisiveness", "Authority", "Efficiency"]
        }
      ]
    },
    "team_meeting": {
      id: "team_meeting",
      text: "You call a team meeting. Alex and Jordan present their perspectives, but the discussion becomes heated. Other team members seem uncomfortable. What do you do now?",
      choices: [
        {
          id: "tm_choice1",
          text: "Step in and shift to a structured decision-making framework",
          nextNodeId: "structured_approach",
          traits: ["Organization", "Mediation", "Process-oriented"]
        },
        {
          id: "tm_choice2",
          text: "End the meeting and schedule separate discussions",
          nextNodeId: "separate_discussions",
          traits: ["Adaptability", "Emotional intelligence", "De-escalation"]
        }
      ]
    },
    "private_mediation": {
      id: "private_mediation",
      text: "In your private meeting, you discover that Alex feels Jordan isn't respecting their expertise, while Jordan believes Alex is ignoring important technical constraints. How do you proceed?",
      choices: [
        {
          id: "pm_choice1",
          text: "Help them find a technical compromise that incorporates elements from both approaches",
          nextNodeId: "compromise_solution",
          traits: ["Collaboration", "Problem-solving", "Mediation"]
        },
        {
          id: "pm_choice2",
          text: "Address the underlying respect and communication issues",
          nextNodeId: "address_underlying",
          traits: ["Emotional intelligence", "Relationship building", "Root cause analysis"]
        }
      ]
    },
    "executive_decision": {
      id: "executive_decision",
      text: "You decide to go with Jordan's approach, as it seems more aligned with the project constraints. Alex appears disengaged in the next team meeting. What's your next step?",
      choices: [
        {
          id: "ed_choice1",
          text: "Speak privately with Alex to address their concerns",
          nextNodeId: "reconnect_alex",
          traits: ["Empathy", "Follow-up", "Individual consideration"]
        },
        {
          id: "ed_choice2",
          text: "Assign Alex to lead a different important component of the project",
          nextNodeId: "reassign_alex",
          traits: ["Strategic thinking", "Team utilization", "Motivation"]
        }
      ]
    },
    "structured_approach": {
      id: "structured_approach",
      text: "You implement a decision matrix evaluating both approaches against key criteria. This creates more objective discussion. The team ultimately favors a hybrid of both approaches. What do you do to ensure successful implementation?",
      choices: [
        {
          id: "sa_choice1",
          text: "Create detailed documentation of the agreed approach and assign clear responsibilities",
          nextNodeId: "clear_documentation",
          traits: ["Organization", "Clarity", "Accountability"]
        },
        {
          id: "sa_choice2",
          text: "Schedule regular check-ins to evaluate progress and address any issues quickly",
          nextNodeId: "regular_checkins",
          traits: ["Proactive", "Communication", "Continuous improvement"]
        }
      ]
    },
    "separate_discussions": {
      id: "separate_discussions",
      isEnding: true,
      text: "You hold separate discussions with the team members. While this de-escalates the immediate tension, the technical decision remains unresolved, and the delay continues affecting the project timeline.",
      feedback: "This approach successfully de-escalated the conflict but didn't resolve the underlying technical disagreement. In conflict situations, finding temporary calm is sometimes necessary, but ultimately the core issue still needs resolution to move the project forward. Consider combining this approach with a structured decision-making process.",
      choices: []
    },
    "compromise_solution": {
      id: "compromise_solution",
      isEnding: true,
      text: "You help Alex and Jordan create a hybrid solution that incorporates the strengths of both approaches. The team successfully implements this solution, and both Alex and Jordan feel their expertise was valued.",
      feedback: "Excellent outcome! You've demonstrated strong mediation skills by helping the team members find common ground. This approach resolved both the technical disagreement and the interpersonal conflict, allowing the project to move forward with a solution that may be stronger than either original proposal.",
      choices: []
    },
    "address_underlying": {
      id: "address_underlying",
      isEnding: true,
      text: "You facilitate a conversation about respectful communication and valuing diverse expertise. Alex and Jordan gain better understanding of each other's perspectives, but still struggle to agree on the technical approach.",
      feedback: "You've addressed the relationship aspect of the conflict, which is valuable for long-term team health. However, the immediate technical decision remains unresolved. This illustrates how conflicts often have both relationship and task dimensions. Consider addressing both simultaneously for the best outcome.",
      choices: []
    },
    "reconnect_alex": {
      id: "reconnect_alex",
      isEnding: true,
      text: "You meet with Alex privately to acknowledge their expertise and explain the reasoning behind your decision. You find ways to incorporate some of Alex's ideas into the implementation details. Alex appreciates the recognition and becomes more engaged again.",
      feedback: "Good recovery! While making executive decisions can sometimes be necessary, this approach shows you understand the importance of maintaining team cohesion and engagement. By reconnecting with Alex, you've mitigated potential negative effects of your decisive action.",
      choices: []
    },
    "reassign_alex": {
      id: "reassign_alex",
      isEnding: true,
      text: "You assign Alex to lead another critical component. While Alex performs well in the new role, there's lingering tension with Jordan, and Alex remains skeptical of the approach taken on the original feature.",
      feedback: "This pragmatic solution utilized Alex's skills effectively but didn't address the interpersonal conflict or technical disagreement. Sometimes reframing responsibilities can work, but be aware of unresolved tensions that might affect future collaboration.",
      choices: []
    },
    "clear_documentation": {
      id: "clear_documentation",
      isEnding: true,
      text: "Your thorough documentation ensures everyone understands the hybrid approach and their responsibilities. The implementation proceeds smoothly with minimal conflicts.",
      feedback: "Excellent! Clear documentation and role definition help prevent misunderstandings and provide accountability. This approach demonstrates strong project management skills and ensures the team's consensus decision is implemented effectively.",
      choices: []
    },
    "regular_checkins": {
      id: "regular_checkins",
      isEnding: true,
      text: "Your regular check-ins catch several implementation issues early. The team collaboratively resolves these challenges, and both Alex and Jordan contribute valuable insights throughout the process.",
      feedback: "Great approach! Regular check-ins demonstrate proactive leadership and create continuous opportunities for collaboration. This ongoing involvement helps maintain team engagement and allows for course correction as needed.",
      choices: []
    }
  }
};

export const ScenarioSection: React.FC = () => {
  const [scenarios, setScenarios] = useState<Scenario[]>([SAMPLE_SCENARIO]);
  const [currentScenario, setCurrentScenario] = useState<Scenario>(SAMPLE_SCENARIO);
  const [currentNodeId, setCurrentNodeId] = useState<string>("");
  const [currentNode, setCurrentNode] = useState<ScenarioNode | null>(null);
  const [pathHistory, setPathHistory] = useState<string[]>([]);
  const [userTraits, setUserTraits] = useState<string[]>([]);
  const [gameState, setGameState] = useState<'selection' | 'playing' | 'complete'>('selection');
  const [isGeneratingScenario, setIsGeneratingScenario] = useState(false);
  
  // Initialize the scenario when it's selected
  useEffect(() => {
    if (currentScenario && gameState === 'playing') {
      setCurrentNodeId(currentScenario.startNodeId);
      setPathHistory([]);
      setUserTraits([]);
    }
  }, [currentScenario, gameState]);
  
  // Update current node when node ID changes
  useEffect(() => {
    if (currentNodeId && currentScenario) {
      setCurrentNode(currentScenario.nodes[currentNodeId]);
    }
  }, [currentNodeId, currentScenario]);
  
  const handleScenarioSelect = (scenario: Scenario) => {
    setCurrentScenario(scenario);
    setGameState('playing');
  };
  
  const handleChoice = (choice: ScenarioChoice) => {
    // Add current node to history
    setPathHistory(prev => [...prev, currentNodeId]);
    
    // Add traits to user's profile
    setUserTraits(prev => [...prev, ...choice.traits]);
    
    // Move to next node
    setCurrentNodeId(choice.nextNodeId);
    
    // Check if we've reached an ending
    const nextNode = currentScenario.nodes[choice.nextNodeId];
    if (nextNode.isEnding) {
      setGameState('complete');
    }
  };
  
  const handleRestart = () => {
    setCurrentNodeId(currentScenario.startNodeId);
    setPathHistory([]);
    setUserTraits([]);
    setGameState('playing');
  };
  
  const handleBackToScenarios = () => {
    setGameState('selection');
  };
  
  const generateNewScenario = async () => {
    setIsGeneratingScenario(true);
    
    try {
      const prompt = `
        Create an interactive workplace behavioral scenario with branching choices.
        
        The scenario should:
        1. Present a realistic workplace challenge involving interpersonal dynamics or ethical dilemmas
        2. Have at least 3 initial choices, each leading to different paths
        3. Include at least 2 levels of depth (choices leading to more choices)
        4. End with feedback that evaluates the user's decision-making
        
        Format as a JSON object with this structure:
        {
          "title": "Scenario Title",
          "context": "Initial situation description",
          "startNodeId": "start",
          "nodes": {
            "start": {
              "id": "start",
              "text": "What do you do?",
              "choices": [
                {
                  "id": "choice1",
                  "text": "Option 1 description",
                  "nextNodeId": "node1",
                  "traits": ["Trait1", "Trait2"]
                },
                // more choices...
              ]
            },
            "node1": {
              "id": "node1",
              "text": "Result of choice 1, new situation...",
              "choices": [...],
              "isEnding": false
            },
            // For ending nodes include:
            "ending1": {
              "id": "ending1",
              "text": "Final outcome description",
              "feedback": "Evaluation of this path",
              "isEnding": true,
              "choices": []
            }
          }
        }
      `;
      
      const response = await generateGeminiResponse(prompt);
      
      try {
        const parsedResponse = JSON.parse(response);
        setScenarios(prev => [...prev, parsedResponse]);
        setCurrentScenario(parsedResponse);
        setGameState('playing');
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError);
        alert('Error generating scenario. Please try again.');
      }
    } catch (error) {
      console.error('Error generating scenario:', error);
    } finally {
      setIsGeneratingScenario(false);
    }
  };
  
  // Helper to count unique traits
  const getTopTraits = () => {
    const traitCounts: Record<string, number> = {};
    userTraits.forEach(trait => {
      traitCounts[trait] = (traitCounts[trait] || 0) + 1;
    });
    
    return Object.entries(traitCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([trait]) => trait);
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Scenario Selection Screen */}
      {gameState === 'selection' && (
        <div>
          <h2 className="text-3xl font-bold mb-6 text-center">Interactive Scenarios</h2>
          <p className="text-center mb-8 text-indigo-200">
            Choose a scenario to navigate through realistic workplace situations. 
            Each choice you make reveals your behavioral tendencies and leads to different outcomes.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {scenarios.map((scenario, index) => (
              <div 
                key={index}
                className="glass-card p-6 hover:transform hover:scale-105 transition-all cursor-pointer"
                onClick={() => handleScenarioSelect(scenario)}
              >
                <h3 className="text-xl font-bold mb-2">{scenario.title}</h3>
                <p className="text-indigo-200 mb-4 line-clamp-3">{scenario.context}</p>
                <button 
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-all"
                  onClick={(e) => {
                    e.stopPropagation(); 
                    handleScenarioSelect(scenario);
                  }}
                >
                  Start Scenario
                </button>
              </div>
            ))}
            
            <div className="glass-card p-6 border-dashed border-2 border-indigo-500/50 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-indigo-600/30 flex items-center justify-center mb-4">
                <RefreshCw className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Generate New Scenario</h3>
              <p className="text-indigo-200 mb-4">
                Create a unique workplace scenario using AI
              </p>
              <button 
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-all"
                onClick={generateNewScenario}
                disabled={isGeneratingScenario}
              >
                {isGeneratingScenario ? 'Generating...' : 'Generate Scenario'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Gameplay Screen */}
      {gameState === 'playing' && currentNode && (
        <div className="glass-card p-8 relative">
          <div className="absolute top-4 right-4 text-xs text-indigo-300">
            {pathHistory.length > 0 ? `Decision ${pathHistory.length + 1}` : "Initial Decision"}
          </div>
          
          <h2 className="text-2xl font-bold mb-4">{currentScenario.title}</h2>
          
          {pathHistory.length === 0 && (
            <div className="bg-indigo-900/30 p-4 rounded-lg mb-6">
              <p className="text-indigo-100">{currentScenario.context}</p>
            </div>
          )}
          
          <p className="text-xl mb-6">{currentNode.text}</p>
          
          <div className="flex flex-col gap-4 mb-6">
            {currentNode.choices.map(choice => (
              <button
                key={choice.id}
                className="p-4 bg-indigo-800/50 hover:bg-indigo-700/70 rounded-lg text-left transition-all flex items-start"
                onClick={() => handleChoice(choice)}
              >
                <ChevronRight className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>{choice.text}</span>
              </button>
            ))}
          </div>
          
          {pathHistory.length > 0 && (
            <div className="flex justify-between items-center">
              <button
                onClick={() => {
                  const prevNodeId = pathHistory[pathHistory.length - 1];
                  setCurrentNodeId(prevNodeId);
                  setPathHistory(prev => prev.slice(0, -1));
                  
                  // Remove last added traits (approximate - not perfect)
                  const currentChoices = currentScenario.nodes[pathHistory[pathHistory.length - 1]].choices;
                  const choiceThatLedHere = currentChoices.find(c => c.nextNodeId === currentNodeId);
                  if (choiceThatLedHere) {
                    const traitsToRemove = choiceThatLedHere.traits.length;
                    setUserTraits(prev => prev.slice(0, -traitsToRemove));
                  }
                }}
                className="px-4 py-2 border border-indigo-400 hover:bg-indigo-800/30 rounded-lg transition-all"
                disabled={pathHistory.length === 0}
              >
                Back
              </button>
              
              {pathHistory.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-indigo-300">Path:</span>
                  {pathHistory.map((_, idx) => (
                    <div 
                      key={idx} 
                      className={`w-2 h-2 rounded-full ${idx === pathHistory.length - 1 ? 'bg-indigo-400' : 'bg-indigo-600'}`}
                    />
                  ))}
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      {/* Completion Screen */}
      {gameState === 'complete' && currentNode && (
        <div className="glass-card p-8">
          <h2 className="text-2xl font-bold mb-4">Scenario Complete</h2>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Outcome</h3>
            <p className="text-indigo-100 mb-4">{currentNode.text}</p>
            
            <div className="bg-indigo-900/30 p-4 rounded-lg mb-4">
              <h4 className="font-semibold mb-2">Feedback:</h4>
              <p className="text-indigo-200">{currentNode.feedback}</p>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Your Decision Profile</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
              {getTopTraits().map((trait, index) => (
                <div 
                  key={index} 
                  className="bg-indigo-900/40 px-3 py-1.5 rounded-full text-center text-sm"
                >
                  {trait}
                </div>
              ))}
            </div>
            
            <p className="text-indigo-300 text-sm">
              Based on your choices, these are the key behavioral traits you demonstrated.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleRestart}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Replay Scenario
            </button>
            
            <button
              onClick={handleBackToScenarios}
              className="px-4 py-2 border border-indigo-400 hover:bg-indigo-800/30 rounded-lg transition-all"
            >
              Choose Different Scenario
            </button>
          </div>
        </div>
      )}
    </div>
  );
};