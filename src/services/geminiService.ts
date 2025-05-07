
import { toast } from 'sonner';

// Base Gemini API service with error handling
const callGeminiAPI = async (prompt: string, temperature = 0.7, maxTokens = 1024) => {
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Gemini API key not found");
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: maxTokens,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Error from Gemini API: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message || "Unknown error from Gemini API");
    }

    return data;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    toast.error("Failed to connect to AI service. Please try again.");
    throw error;
  }
};

// Parse JSON from Gemini response
const extractJsonFromResponse = (response: any): any => {
  try {
    if (!response.candidates || response.candidates.length === 0) {
      throw new Error("No response from Gemini API");
    }

    const content = response.candidates[0].content.parts[0].text;
    
    // Try to parse JSON from various formats
    const jsonMatch = content.match(/```json\n([\s\S]*)\n```/) || content.match(/{[\s\S]*}/);
    
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1] || jsonMatch[0]);
    }
    
    throw new Error("Failed to extract JSON from response");
  } catch (error) {
    console.error("Error extracting JSON from Gemini response:", error);
    throw error;
  }
};

// Generate behavioral flashcards using Gemini
export const generateBehavioralFlashcards = async (category: string, count = 5): Promise<any[]> => {
  try {
    const prompt = `
      Generate ${count} behavioral interview flashcards for the "${category}" skill category.
      
      Each flashcard should follow this JSON structure:
      {
        "id": (unique number),
        "question": "The behavioral question text",
        "trait": "Primary trait being tested (e.g., Leadership, Communication)",
        "insight": "Psychological insight about what the question is really testing",
        "choices": ["Choice 1", "Choice 2", "Choice 3", "Choice 4"],
        "bestAnswer": (index of the best answer, 0-3)
      }
      
      Return the result as a JSON array with ${count} flashcard objects.
      Make the questions realistic for actual job interviews.
    `;
    
    const response = await callGeminiAPI(prompt, 0.7, 1500);
    const jsonData = extractJsonFromResponse(response);
    
    return Array.isArray(jsonData) ? jsonData : [];
  } catch (error) {
    console.error("Error generating flashcards:", error);
    toast.error("Failed to generate flashcards. Using backup data instead.");
    
    // Return backup data
    return [
      {
        id: 1,
        question: "Describe a situation where you had to make a difficult decision with limited information.",
        trait: "Decision Making",
        insight: "Tests your ability to act decisively under uncertainty and your reasoning process.",
        choices: [
          "I always gather all possible information before making any decision to ensure it's correct.",
          "I weigh the risks, consider the impact, make the best decision with available information, and adjust as needed.",
          "I typically delegate difficult decisions to those with more experience or authority.",
          "I follow my intuition since analysis can lead to decision paralysis."
        ],
        bestAnswer: 1
      },
      {
        id: 2,
        question: "Tell me about a time when you faced significant obstacles on a project. How did you handle it?",
        trait: "Problem Solving & Resilience",
        insight: "Tests your ability to overcome challenges and maintain productivity when things don't go as planned.",
        choices: [
          "I immediately escalate obstacles to my manager so they can help remove them.",
          "I identify alternative approaches, collaborate with teammates, and persistently work toward solutions.",
          "I focus on documenting the obstacles thoroughly to protect myself from blame.",
          "I prefer to work on tasks without obstacles and come back to challenging problems later."
        ],
        bestAnswer: 1
      }
    ];
  }
};

// Generate scenario-based questions
export const generateBehavioralScenario = async (category: string, difficulty: string): Promise<any> => {
  try {
    const prompt = `
      Create an interactive behavioral interview scenario for a ${difficulty} level question about ${category}.
      Format the response as a JSON object with the following structure:
      {
        "title": "Scenario title",
        "introduction": "Initial scenario description",
        "steps": [
          {
            "situation": "Description of step 1",
            "choices": [
              "Choice 1 description",
              "Choice 2 description",
              "Choice 3 description",
              "Choice 4 description"
            ],
            "feedback": {
              "0": "Feedback for choice 1",
              "1": "Feedback for choice 2",
              "2": "Feedback for choice 3",
              "3": "Feedback for choice 4"
            },
            "bestChoice": 1
          }
        ],
        "traits": ["Trait 1", "Trait 2", "Trait 3"],
        "overallFeedback": "Overall feedback text"
      }
    `;
    
    const response = await callGeminiAPI(prompt, 0.7, 1500);
    return extractJsonFromResponse(response);
  } catch (error) {
    console.error("Error generating scenario:", error);
    toast.error("Failed to generate scenario. Please try again.");
    throw error;
  }
};

// Analyze a user's behavioral response
export const analyzeBehavioralResponse = async (question: string, answer: string): Promise<any> => {
  try {
    const prompt = `
      Analyze this behavioral interview response for the following question:
      "${question}"
      
      Response:
      "${answer}"
      
      Evaluate based on:
      1. Use of the STAR method (Situation, Task, Action, Result)
      2. Specificity and detail
      3. Relevance to the question
      4. Communication clarity
      
      Format your analysis as a JSON object with these fields:
      {
        "score": A number from 1-10 representing overall quality,
        "strengths": [Array of 2-4 specific strengths of the response],
        "improvements": [Array of 2-3 suggested improvements],
        "overall": "A 1-2 sentence summary of your evaluation"
      }
    `;
    
    const response = await callGeminiAPI(prompt, 0.3, 1024);
    return extractJsonFromResponse(response);
  } catch (error) {
    console.error("Error analyzing response:", error);
    toast.error("Failed to analyze response. Please try again.");
    throw error;
  }
};

// Generate example answers for behavioral questions
export const generateExampleAnswers = async (question: string, role: string): Promise<any> => {
  try {
    const prompt = `
      Generate 3 example answers for the behavioral question: "${question}" 
      for a ${role} position.
      
      Format each answer with varying quality levels (excellent, good, needs improvement).
      Return as JSON in this format:
      {
        "question": "${question}",
        "role": "${role}",
        "answers": [
          {
            "rating": 9,
            "answer": "Excellent answer text using STAR method",
            "strengths": ["Key strength 1", "Key strength 2"]
          },
          {
            "rating": 7,
            "answer": "Good answer text",
            "strengths": ["Key strength 1", "Key strength 2"]
          },
          {
            "rating": 4,
            "answer": "Needs improvement answer text",
            "strengths": ["Key strength 1"]
          }
        ]
      }
    `;
    
    const response = await callGeminiAPI(prompt, 0.7, 2048);
    return extractJsonFromResponse(response);
  } catch (error) {
    console.error("Error generating example answers:", error);
    toast.error("Failed to generate example answers. Please try again.");
    throw error;
  }
};

// Generate and analyze video practice feedback
export const analyzeVideoResponse = async (
  question: string, 
  transcriptText: string,
  emotionData: { dominant: string, confidence: number }
): Promise<any> => {
  try {
    const prompt = `
      Analyze this video interview response:
      
      Question: "${question}"
      Transcript: "${transcriptText}"
      Dominant emotion detected: ${emotionData.dominant}
      Confidence level: ${emotionData.confidence.toFixed(2)}
      
      Provide feedback on:
      1. Content quality and relevance
      2. Verbal delivery
      3. Emotional presentation
      
      Return as JSON:
      {
        "contentScore": number from 1-10,
        "deliveryScore": number from 1-10,
        "emotionScore": number from 1-10,
        "overallScore": average of above scores,
        "strengths": ["strength 1", "strength 2"],
        "improvements": ["area 1", "area 2"],
        "summary": "1-2 sentence overall evaluation"
      }
    `;
    
    const response = await callGeminiAPI(prompt, 0.4, 1024);
    return extractJsonFromResponse(response);
  } catch (error) {
    console.error("Error analyzing video response:", error);
    toast.error("Failed to analyze response. Please try again.");
    throw error;
  }
};

// Generate behavioral quiz with personality assessment
export const generateBehavioralQuiz = async (category: string, questionCount = 10): Promise<any> => {
  try {
    const prompt = `
      Create a behavioral style quiz for the "${category}" category with ${questionCount} questions.
      
      Format as JSON:
      {
        "title": "Quiz title",
        "description": "Brief description of what this quiz measures",
        "questions": [
          {
            "id": 1,
            "text": "Question text",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "styles": ["Style associated with A", "Style associated with B", "Style associated with C", "Style associated with D"]
          }
        ],
        "results": {
          "Style1": {
            "description": "Description of this style",
            "strengths": ["Strength 1", "Strength 2"],
            "improvements": ["Improvement area 1", "Improvement area 2"],
            "interviewTips": ["Tip 1", "Tip 2", "Tip 3"]
          },
          "Style2": { ... }
        }
      }
    `;
    
    const response = await callGeminiAPI(prompt, 0.7, 2048);
    return extractJsonFromResponse(response);
  } catch (error) {
    console.error("Error generating quiz:", error);
    toast.error("Failed to generate quiz. Please try again.");
    throw error;
  }
};

export default {
  generateBehavioralFlashcards,
  generateBehavioralScenario,
  analyzeBehavioralResponse,
  generateExampleAnswers,
  analyzeVideoResponse,
  generateBehavioralQuiz
};
