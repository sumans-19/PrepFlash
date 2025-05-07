
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

// Mock scenarios data
const scenarios = [
  {
    id: 'conflict-resolution',
    title: 'Team Conflict Resolution',
    description: 'Navigate interpersonal challenges in a cross-functional team.',
    difficulty: 'Medium',
    duration: '10-15 min',
    skills: ['Conflict Resolution', 'Communication', 'Empathy'],
    progress: 0,
    image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=500&auto=format&fit=crop'
  },
  {
    id: 'project-crisis',
    title: 'Project Crisis Management',
    description: 'Handle a critical project facing unexpected challenges and deadlines.',
    difficulty: 'Hard',
    duration: '15-20 min',
    skills: ['Leadership', 'Problem Solving', 'Decision Making'],
    progress: 25,
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=500&auto=format&fit=crop'
  },
  {
    id: 'feedback-delivery',
    title: 'Delivering Difficult Feedback',
    description: 'Provide constructive criticism to a team member who is underperforming.',
    difficulty: 'Medium',
    duration: '8-10 min',
    skills: ['Communication', 'Leadership', 'Empathy'],
    progress: 50,
    image: 'https://images.unsplash.com/photo-1573164574572-cb89e39749b4?q=80&w=500&auto=format&fit=crop'
  },
  {
    id: 'stakeholder-management',
    title: 'Stakeholder Disagreement',
    description: 'Navigate conflicting requirements from multiple stakeholders.',
    difficulty: 'Hard',
    duration: '12-15 min',
    skills: ['Negotiation', 'Communication', 'Strategic Thinking'],
    progress: 75,
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=500&auto=format&fit=crop'
  },
];

// Active scenario sample data
const scenarioSteps = [
  {
    id: 1,
    content: "You're leading a cross-functional team working on a high-priority product launch. With two weeks remaining until the deadline, you notice tensions rising between the marketing and engineering teams.",
    choices: [
      "Call an immediate meeting with both teams to address the tension",
      "Speak with each team lead separately to understand their perspectives",
      "Focus on the work first and let the teams sort out their differences",
      "Escalate the issue to senior management for resolution"
    ]
  },
  {
    id: 2,
    content: "After speaking with both team leads, you discover the core issue: Marketing promised features to customers that engineering says aren't feasible within the deadline.",
    choices: [
      "Side with engineering and ask marketing to adjust customer expectations",
      "Push engineering to work overtime to deliver what marketing promised",
      "Facilitate a negotiation between teams to find middle ground",
      "Create a phased release plan with clear priorities"
    ]
  },
  {
    id: 3,
    content: "The teams have agreed on a phased approach, but one senior engineer is still resistant, claiming the compromise will lead to technical debt and future problems.",
    choices: [
      "Overrule the engineer, as the team consensus is more important",
      "Give the engineer's concerns more weight as they have technical expertise",
      "Create space for the engineer to document concerns while proceeding with the plan",
      "Ask the engineer to propose an alternative that meets both teams' needs"
    ]
  }
];

const ScenarioModule = () => {
  const [activeScenario, setActiveScenario] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedChoices, setSelectedChoices] = useState<Record<number, number>>({});
  const [showOutcome, setShowOutcome] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleStartScenario = (scenarioId: string) => {
    setActiveScenario(scenarioId);
    setCurrentStep(1);
    setSelectedChoices({});
    setShowOutcome(false);
  };
  
  const handleSelectChoice = (choiceIndex: number) => {
    setSelectedChoices({...selectedChoices, [currentStep]: choiceIndex});
    
    if (currentStep < scenarioSteps.length) {
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 500);
    } else {
      setShowOutcome(true);
    }
  };
  
  const handleExitScenario = () => {
    setActiveScenario(null);
  };
  
  const handleGenerateCustomScenario = async () => {
    setIsGenerating(true);
    toast.info("Generating custom scenario with Gemini AI...");
    
    try {
      // In a real implementation, this would call Gemini API
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success("New scenario generated!");
      
      // Simulate a successful generation
      handleStartScenario('project-crisis');
    } catch (error) {
      console.error("Error generating scenario:", error);
      toast.error("Failed to generate scenario. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };
  
  if (activeScenario) {
    // Find the selected scenario
    const scenario = scenarios.find(s => s.id === activeScenario);
    const currentStepData = scenarioSteps[currentStep - 1];
    
    return (
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold">{scenario?.title}</h2>
            <div className="flex gap-2 mt-1">
              {scenario?.skills.map((skill) => (
                <Badge key={skill} variant="outline" className="bg-slate-50">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleExitScenario}>
            Exit Scenario
          </Button>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Progress</span>
            <span>{currentStep} of {scenarioSteps.length} steps</span>
          </div>
          <Progress value={(currentStep / scenarioSteps.length) * 100} className="h-2" />
        </div>
        
        {showOutcome ? (
          <Card className="p-6 bg-gradient-to-br from-interview-blue/10 to-interview-purple/10 border-interview-blue/20">
            <h3 className="text-lg font-semibold mb-4">Scenario Outcome</h3>
            <div className="space-y-6">
              <p className="leading-relaxed">
                Based on your choices, you demonstrated strong skills in mediation and collaborative problem-solving. 
                Your approach prioritized finding common ground while still acknowledging technical concerns.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg border">
                  <h4 className="font-medium text-interview-blue mb-2">Strengths</h4>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li>Effective stakeholder management</li>
                    <li>Balanced team negotiation</li>
                    <li>Pragmatic decision making</li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded-lg border">
                  <h4 className="font-medium text-amber-600 mb-2">Development Areas</h4>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li>Technical risk assessment</li>
                    <li>Expectation setting with clients</li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded-lg border">
                  <h4 className="font-medium text-purple-600 mb-2">Key Behaviors</h4>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li>Collaborative leadership</li>
                    <li>Conflict resolution</li>
                    <li>Strategic compromise</li>
                  </ul>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Interview Tip:</h4>
                <p className="text-sm text-muted-foreground">
                  When describing this scenario in interviews, emphasize how you balanced multiple stakeholders' needs
                  while maintaining product quality and team morale. Highlight your structured approach to problem-solving.
                </p>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleExitScenario} className="bg-interview-blue hover:bg-interview-indigo">
                  Complete Scenario
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="p-6">
            <div className="space-y-6">
              <div className="prose max-w-none">
                <p className="text-lg">{currentStepData.content}</p>
              </div>
              
              <h3 className="font-medium">What would you do?</h3>
              <div className="space-y-3">
                {currentStepData.choices.map((choice, index) => (
                  <div 
                    key={index}
                    className={`p-4 border rounded-md cursor-pointer transition-all ${
                      selectedChoices[currentStep] === index 
                        ? 'border-interview-blue bg-interview-blue/5' 
                        : 'hover:bg-slate-50 hover:border-slate-300'
                    }`}
                    onClick={() => handleSelectChoice(index)}
                  >
                    {choice}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Interactive Story Scenarios</h2>
        <Button 
          onClick={handleGenerateCustomScenario} 
          disabled={isGenerating}
          className="bg-interview-purple hover:bg-interview-indigo"
        >
          {isGenerating ? "Generating..." : "Generate Custom Scenario"}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {scenarios.map((scenario) => (
          <Card key={scenario.id} className="overflow-hidden border hover:shadow-md transition-shadow">
            <div className="h-40 overflow-hidden">
              <img 
                src={scenario.image} 
                alt={scenario.title} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg">{scenario.title}</h3>
                <Badge 
                  variant="outline"
                  className={`
                    ${scenario.difficulty === 'Easy' && 'bg-green-50 text-green-700 border-green-200'} 
                    ${scenario.difficulty === 'Medium' && 'bg-amber-50 text-amber-700 border-amber-200'}
                    ${scenario.difficulty === 'Hard' && 'bg-rose-50 text-rose-700 border-rose-200'}
                  `}
                >
                  {scenario.difficulty}
                </Badge>
              </div>
              
              <p className="text-muted-foreground text-sm mb-3">{scenario.description}</p>
              
              <div className="flex gap-2 mb-4">
                {scenario.skills.map((skill) => (
                  <Badge key={skill} variant="outline" className="bg-slate-50">
                    {skill}
                  </Badge>
                ))}
              </div>
              
              <div className="flex justify-between text-xs text-muted-foreground mb-2">
                <span>Completion</span>
                <span>{scenario.duration}</span>
              </div>
              
              {scenario.progress > 0 ? (
                <div className="mb-4">
                  <Progress value={scenario.progress} className="h-1.5" />
                </div>
              ) : (
                <div className="mb-4"></div>
              )}
              
              <Button 
                onClick={() => handleStartScenario(scenario.id)}
                className="w-full"
                variant={scenario.progress > 0 ? "outline" : "default"}
              >
                {scenario.progress > 0 ? "Resume Scenario" : "Start Scenario"}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ScenarioModule;