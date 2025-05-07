import { useToast } from '@/hooks/use-toast';
import { searchYoutubeVideos, verifyYouTubeVideo } from './YouTubeService';

// The API key will be stored here temporarily
// In a production environment, this should be stored in Supabase secrets
let apiKey = "AIzaSyBVC00OSmDr19izTKyswQz_7Njtn2cA-dA";

export interface GeminiQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface GeminiFlashCard {
  question: string;
  answer: string;
  explanation: string;
}

export interface GeminiPracticeProblem {
  id: string;
  title: string;
  description: string;
  instructions: string[];
  defaultCode: string;
}

export interface GeminiResource {
  id: string; 
  title: string;
  description: string;
  url: string;
  category?: string;
  verified?: boolean;
  language?: string;
  videoId?: string;
  thumbnailUrl?: string; // Added to store the thumbnail URL directly
}

export const setGeminiApiKey = (key: string) => {
  apiKey = key;
};

export const getGeminiApiKey = () => {
  return apiKey;
};

// Helper function to make API calls to Gemini
const callGeminiApi = async (prompt: string) => {
  try {
    // Using the Gemini 2.0 Flash model as mentioned in your example
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API call failed with status: ${response.status}, message: ${JSON.stringify(errorData)}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
};

// Parse Gemini response to extract the text content
const extractTextFromResponse = (response: any): string => {
  try {
    // Navigate through the response structure to get the text
    if (response && 
        response.candidates && 
        response.candidates[0] && 
        response.candidates[0].content && 
        response.candidates[0].content.parts && 
        response.candidates[0].content.parts[0] && 
        response.candidates[0].content.parts[0].text) {
      return response.candidates[0].content.parts[0].text;
    }
    throw new Error("Unexpected response structure from Gemini API");
  } catch (error) {
    console.error("Error extracting text from Gemini response:", error);
    throw error;
  }
};

// Helper to safely parse JSON from Gemini's response
const safeJsonParse = (text: string) => {
  try {
    // Sometimes the API returns text that includes markdown code blocks or other text
    // Try to extract just the JSON part
    const jsonMatch = text.match(/```json([\s\S]*?)```/) || text.match(/```([\s\S]*?)```/);
    const jsonText = jsonMatch ? jsonMatch[1] : text;
    
    // Remove any non-JSON content that might be at the start or end
    const cleanedText = jsonText.replace(/^[^[{]*/, '').replace(/[^}\]]*$/, '');
    
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Failed to parse JSON from response:", text);
    throw new Error("Failed to parse the response from Gemini API. The response was not valid JSON.");
  }
};

// Function to provide fallback resources for different categories
const getFallbackResources = (category: string, topic: string, language: string = 'english'): GeminiResource[] => {
  const sanitizedTopic = encodeURIComponent(topic.toLowerCase());
  const sanitizedLanguage = encodeURIComponent(language.toLowerCase());
  
  // Add language parameter to search queries
  const languageParam = language && language !== 'english' ? `+${sanitizedLanguage}` : '';
  
  switch(category) {
    case 'YouTube':
      return [
        {
          id: `fallback-youtube-1-${Date.now()}`,
          title: `${topic} Tutorial ${language !== 'english' ? `in ${language.charAt(0).toUpperCase() + language.slice(1)}` : 'for Beginners'}`,
          description: `A comprehensive beginner's guide to ${topic} with practical examples and clear explanations.`,
          url: `https://www.youtube.com/results?search_query=${sanitizedTopic}+tutorial${languageParam}`,
          category: 'YouTube',
          verified: true,
          language
        },
        {
          id: `fallback-youtube-2-${Date.now()}`,
          title: `Advanced ${topic} Techniques ${language !== 'english' ? `in ${language.charAt(0).toUpperCase() + language.slice(1)}` : ''}`,
          description: `Take your ${topic} skills to the next level with these advanced concepts and methods.`,
          url: `https://www.youtube.com/results?search_query=advanced+${sanitizedTopic}${languageParam}`,
          category: 'YouTube',
          verified: true,
          language
        }
      ];
    case 'Tutorial':
      return [
        {
          id: `fallback-tutorial-1-${Date.now()}`,
          title: `W3Schools ${topic} Tutorial`,
          description: `Learn ${topic} with W3Schools' interactive tutorials and examples.`,
          url: `https://www.w3schools.com/search.php?q=${sanitizedTopic}`,
          category: 'Tutorial',
          verified: true,
          language
        },
        {
          id: `fallback-tutorial-2-${Date.now()}`,
          title: `GeeksforGeeks ${topic} Guide`,
          description: `Complete guide to ${topic} with code examples and explanations from GeeksforGeeks.`,
          url: `https://www.geeksforgeeks.org/search/?q=${sanitizedTopic}`,
          category: 'Tutorial',
          verified: true,
          language
        }
      ];
    case 'Project':
      return [
        {
          id: `fallback-project-1-${Date.now()}`,
          title: `GitHub ${topic} Projects`,
          description: `Find the most popular open-source ${topic} projects on GitHub.`,
          url: `https://github.com/search?q=${sanitizedTopic}&type=repositories`,
          category: 'Project',
          verified: true,
          language
        },
        {
          id: `fallback-project-2-${Date.now()}`,
          title: `${topic} Example Repositories`,
          description: `Explore example ${topic} implementations and starter projects.`,
          url: `https://github.com/topics/${sanitizedTopic.replace(/\s+/g, '-')}`,
          category: 'Project',
          verified: true,
          language
        }
      ];
    default:
      return [];
  }
};

// Generate Multiple Choice Questions
export const generateMultipleChoiceQuestions = async (
  topic: string, 
  difficulty: string,
  count: number = 10
): Promise<GeminiQuestion[]> => {
  try {
    const prompt = `Generate ${count} multiple-choice questions about ${topic} at a ${difficulty} difficulty level. 
    Each question should have 4 options with one correct answer. Format the response strictly as a JSON array of objects with the properties:
    question (string), options (array of strings), and correctAnswer (string matching one of the options).
    DO NOT include explanations, markdown formatting, or any text outside the JSON structure.`;
    
    const response = await callGeminiApi(prompt);
    const responseText = extractTextFromResponse(response);
    const questions = safeJsonParse(responseText);
    
    // Validate the response structure
    if (!Array.isArray(questions)) {
      throw new Error("Invalid response format: expected an array of questions");
    }
    
    // Ensure each question has the expected structure
    return questions.map((q: any, index: number) => {
      if (!q.question || !Array.isArray(q.options) || !q.correctAnswer) {
        console.error(`Invalid question format at index ${index}:`, q);
        throw new Error(`Invalid question format in the response`);
      }
      return {
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer
      };
    });
  } catch (error) {
    console.error("Error generating multiple choice questions:", error);
    throw new Error(`Failed to generate questions: ${error.message}`);
  }
};

// Generate Flashcards
export const generateFlashcards = async (
  topic: string, 
  difficulty: string,
  count: number = 10
): Promise<GeminiFlashCard[]> => {
  try {
    const prompt = `Generate ${count} flashcards about ${topic} at a ${difficulty} difficulty level.
    Each flashcard should have a question, a short answer, and a detailed explanation. Format the response strictly as a JSON array of objects with the properties:
    question (string), answer (string), and explanation (string with more details).
    DO NOT include markdown formatting or any text outside the JSON structure.`;
    
    const response = await callGeminiApi(prompt);
    const responseText = extractTextFromResponse(response);
    const flashcards = safeJsonParse(responseText);
    
    // Validate the response structure
    if (!Array.isArray(flashcards)) {
      throw new Error("Invalid response format: expected an array of flashcards");
    }
    
    // Ensure each flashcard has the expected structure
    return flashcards.map((f: any, index: number) => {
      if (!f.question || !f.answer || !f.explanation) {
        console.error(`Invalid flashcard format at index ${index}:`, f);
        throw new Error(`Invalid flashcard format in the response`);
      }
      return {
        question: f.question,
        answer: f.answer,
        explanation: f.explanation
      };
    });
  } catch (error) {
    console.error("Error generating flashcards:", error);
    throw new Error(`Failed to generate flashcards: ${error.message}`);
  }
};

// Generate Practice Problems
export const generatePracticeProblems = async (
  topic: string, 
  difficulty: string,
  count: number = 10
): Promise<GeminiPracticeProblem[]> => {
  try {
    const prompt = `Generate ${count} coding practice problems about ${topic} at a ${difficulty} difficulty level.
    Each problem should have a title, description, list of instructions, and starter code. Format the response strictly as a JSON array of objects with the properties:
    id (string), title (string), description (string), instructions (array of strings), and defaultCode (string with code template).
    DO NOT include markdown formatting or any text outside the JSON structure.`;
    
    const response = await callGeminiApi(prompt);
    const responseText = extractTextFromResponse(response);
    const problems = safeJsonParse(responseText);
    
    // Validate the response structure
    if (!Array.isArray(problems)) {
      throw new Error("Invalid response format: expected an array of practice problems");
    }
    
    // Ensure each problem has the expected structure
    return problems.map((p: any, index: number) => {
      if (!p.title || !p.description || !Array.isArray(p.instructions) || !p.defaultCode) {
        console.error(`Invalid practice problem format at index ${index}:`, p);
        throw new Error(`Invalid practice problem format in the response`);
      }
      return {
        id: p.id || `gen-problem-${index}`, // Generate ID if not provided
        title: p.title,
        description: p.description,
        instructions: p.instructions,
        defaultCode: p.defaultCode
      };
    });
  } catch (error) {
    console.error("Error generating practice problems:", error);
    throw new Error(`Failed to generate practice problems: ${error.message}`);
  }
};

// IMPROVED: Generate Learning Resources function with direct YouTube API integration
export const generateLearningResources = async (
  topic: string,
  category: string,
  languageOrCount?: string | number, 
  languageParam?: string
): Promise<GeminiResource[]> => {
  // Determine parameters
  let count = 3;
  let language = 'english';
  
  if (typeof languageOrCount === 'number') {
    count = languageOrCount;
    language = languageParam || 'english';
  } else if (typeof languageOrCount === 'string') {
    language = languageOrCount;
  }

  try {
    // DIRECT YOUTUBE API INTEGRATION for YouTube resources
    if (category === 'YouTube') {
      try {
        // Use our direct YouTube API integration instead of Gemini for YouTube resources
        const youtubeVideos = await searchYoutubeVideos(topic, language, count);
        
        if (youtubeVideos.length > 0) {
          return youtubeVideos;
        }
        
        // If no videos found, fall back to search URL
        console.log("No videos found via YouTube API. Using fallback.");
        return getFallbackResources(category, topic, language);
      } catch (error) {
        console.error("Error searching YouTube videos:", error);
        return getFallbackResources(category, topic, language);
      }
    }
    
    // For non-YouTube resources, use Gemini API as before
    const languageInstruction = language && language !== 'english' 
      ? `These must be resources in ${language} language specifically. Only include resources that are natively in ${language} language, not translated content.`
      : 'These must be resources in English language.';
      
    const resourcePrompt = `
      Generate ${count} high-quality learning resources about "${topic}" in the category "${category}".
      These must be REAL, VERIFIED resources that actually exist and are accessible online.
      ${languageInstruction}
      
      ${category === 'Tutorial' 
        ? `For tutorials, provide ONLY links to major tutorial sites like W3Schools, MDN, GeeksforGeeks, or other well-established educational platforms with their actual titles and URLs. 
          If possible, find tutorials in ${language} language.` 
        : ''}
      ${category === 'Project' 
        ? `For projects, provide ONLY links to real, popular GitHub repositories or other code hosting platforms that actually contain usable code related to the topic.
          If applicable, find projects with documentation in ${language} language.` 
        : ''}
      
      DO NOT invent or fabricate resources. If you're not 100% certain a resource exists, use a general search URL instead.
      
      Format the response strictly as a JSON array of objects with the properties:
      title (string), description (string), and url (string).
      DO NOT include markdown formatting or any text outside the JSON structure.
    `;
    
    const response = await callGeminiApi(resourcePrompt);
    const responseText = extractTextFromResponse(response);
    const resources = safeJsonParse(responseText);
    
    // Validate the response structure
    if (!Array.isArray(resources)) {
      console.warn(`Invalid response format for ${category}. Using fallback resources.`);
      return getFallbackResources(category, topic, language);
    }
    
    // Transform the resources
    const validResources = resources
      .filter((r: any) => r.title && r.description && r.url)
      .map((r: any, index: number) => ({
        id: `gen-${category.toLowerCase()}-${index + 1}-${Date.now()}`,
        title: r.title,
        description: r.description,
        url: r.url,
        category: category,
        verified: true,
        language
      }));
    
    // If we don't have enough valid resources, add some fallbacks
    if (validResources.length < 2) {
      const fallbacks = getFallbackResources(category, topic, language);
      return [...validResources, ...fallbacks].slice(0, count);
    }
    
    return validResources;
  } catch (error) {
    console.error(`Error generating ${category} resources:`, error);
    // Return fallback resources on error
    return getFallbackResources(category, topic, language);
  }
};