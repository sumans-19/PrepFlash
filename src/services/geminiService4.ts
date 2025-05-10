import { useEffect, useState } from 'react';

// This function simulates a call to the Gemini API
// In a real implementation, you would replace this with an actual API call
export const generateGeminiResponse = async (prompt: string): Promise<string> => {
  console.log('Generating response for prompt:', prompt);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // For demonstration purposes, return a simulated response
  // In a real application, this would be a call to the Gemini API
  if (prompt.includes('behavioral interview answer examples')) {
    return JSON.stringify([
      {
        question: "Tell me about a time you demonstrated leadership in a challenging situation.",
        answer: "As the tech lead on a critical project, we faced a major setback when our database migration corrupted some customer data. I immediately assembled the team, established clear communication channels, and created a war room. I divided the team into three groups: one to stop the corruption, one to recover data, and one to communicate with stakeholders. I personally led the recovery effort, writing scripts to restore from backups while maintaining data integrity. Through this coordinated effort, we recovered 99.9% of the affected data within 12 hours and implemented new safeguards for future migrations.",
        situation: "A database migration caused customer data corruption during a critical project.",
        task: "I needed to lead the team in resolving the crisis while minimizing data loss.",
        action: "I organized the team into focused groups, established clear communication, and personally led the data recovery effort.",
        result: "We recovered 99.9% of affected data within 12 hours and implemented new safeguards.",
        traits: ["Crisis Management", "Leadership", "Technical Problem-Solving", "Communication"],
        role: "Technical Lead",
        industry: "Technology"
      },
      {
        question: "Describe a situation where you had to influence others without direct authority.",
        answer: "While working on a cross-functional project, I noticed our design and development teams were working in silos, leading to frequent rework and missed deadlines. Though I wasn't a manager, I proposed and implemented a daily 15-minute sync between both teams. I created a simple template for sharing updates and concerns, and facilitated the first week of meetings to demonstrate the value. The practice reduced rework by 40% and was later adopted company-wide as a best practice for cross-functional projects.",
        situation: "Design and development teams were working in silos, causing rework and delays.",
        task: "I needed to improve cross-team collaboration without having formal authority.",
        action: "I initiated and facilitated daily cross-team syncs with a structured format.",
        result: "Reduced rework by 40% and the practice became a company-wide standard.",
        traits: ["Initiative", "Influence", "Process Improvement", "Collaboration"],
        role: "Senior Developer",
        industry: "Software"
      }
    ]);
  }
  
  if (prompt.includes('workplace scenario')) {
    return JSON.stringify({
      scenario: "You're leading a project team that's falling behind schedule. Two team members are in disagreement about the technical approach, causing delays. How do you handle this situation?",
      responses: [
        {
          text: "Schedule a team meeting to discuss both approaches objectively and facilitate a consensus",
          correct: true
        },
        {
          text: "Make an executive decision and choose one approach to move forward",
          correct: true
        },
        {
          text: "Assign the team members to different parts of the project to avoid conflict",
          correct: true
        },
        {
          text: "Let them continue debating until they figure it out themselves",
          correct: false
        },
        {
          text: "Report the conflict to HR immediately",
          correct: false
        },
        {
          text: "Take sides with the more senior team member",
          correct: false
        },
        {
          text: "Ignore the situation and hope it resolves itself",
          correct: false
        },
        {
          text: "Tell them to stop arguing and just get back to work",
          correct: false
        }
      ]
    });
  }
  
  return JSON.stringify({
    feedback: {
      strengths: [
        "Good STAR structure with a clear situation, actions, and results",
        "Demonstrated specific behavioral traits including accountability and problem-solving",
        "Provided concrete examples rather than generalizations"
      ],
      improvements: [
        "Consider quantifying your impact more specifically (e.g., metrics, percentages)",
        "Add more detail about your personal contributions in team settings",
        "Highlight what you learned from the experience to show growth mindset"
      ],
      summary: "Overall, you've provided a solid behavioral response that effectively showcases your abilities."
    }
  });
};

// React hook for using Gemini AI in components
export const useGeminiAI = (initialPrompt?: string) => {
  const [prompt, setPrompt] = useState(initialPrompt || '');
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const generateResponse = async (newPrompt?: string) => {
    const promptToUse = newPrompt || prompt;
    if (!promptToUse) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await generateGeminiResponse(promptToUse);
      setResponse(result);
    } catch (err) {
      setError('Error generating AI response. Please try again.');
      console.error('Gemini API error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    // If initialPrompt is provided, generate response immediately
    if (initialPrompt) {
      generateResponse(initialPrompt);
    }
  }, []);
  
  return {
    prompt,
    setPrompt,
    response,
    isLoading,
    error,
    generateResponse
  };
};