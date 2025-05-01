import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';

// Define types
export type InterviewParams = {
  userId: string;
  userName: string;
  jobRole: string;
  techStack: string[];
  experienceLevel: 'beginner' | 'intermediate' | 'expert';
  questionCount: number;
};

export type AnswerFeedback = {
  relevance: number; // 1-10
  clarity: number; // 1-10
  depth: number; // 1-10
  conciseness: number; // 1-10
  confidence: number; // 1-10
  fillerWordCount: number;
  technicalAccuracy: number; // 1-10
  overallScore: number; // 1-10
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
  summary: string;
};

export type AptitudeQuestionParams = {
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  format?: 'MCQ' | 'Conceptual';
};

export type AptitudeQuestionResult = {
  question: string;
  answer: string;
  explanation?: string;
  options?: string[];
};

export type AptitudeBrushUpResult = {
  theory: string;
  formulas: string;
  examples: string;
};

export type AptitudeBrushUpParams = {
  topic: string;
};

// Mock Gemini API key - in production this would come from environment variables
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

// Helper to make API calls to Gemini
async function callGeminiAPI(prompt: string, model = 'gemini-2.0-flash') {
  if (!API_KEY) {
    throw new Error('Gemini API key not found. Please set VITE_GEMINI_API_KEY.');
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }],
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Gemini API error:', data);
      throw new Error(data.error?.message || 'Unknown error from Gemini API');
    }

    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Unexpected response format from Gemini API');
    }

    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
}

// Generate interview questions based on user profile
export async function geminiGenerateQuestions(params: InterviewParams) {
  try {
    const { userId, userName, jobRole, techStack, experienceLevel, questionCount } = params;

    const prompt = `
      Generate ${questionCount} challenging technical interview questions for a ${experienceLevel} ${jobRole}.
      The candidate has experience with the following technologies: ${techStack.join(', ')}.
      Focus on practical knowledge and real-world scenarios.
      Format the response as a list of numbered questions only, without any additional text.
      Questions should include a mix of technical knowledge, problem-solving, and experience-based questions .
    `;

    console.log("Sending prompt to Gemini:", prompt);

    const response = await callGeminiAPI(prompt);

    // Parse the response to extract questions (assuming the response is a list of questions)
    const questions = response
      .split('\n')
      .filter(line => line.trim().match(/^\d+\./) || line.trim().match(/^-/))
      .map(line => line.replace(/^\d+\.\s*|-\s*/, '').trim())
      .slice(0, questionCount);

    // Generate a unique ID for this interview
    const interviewId = uuidv4();

    // In a real application, you might want to store these questions in a database
    console.log(`Generated ${questions.length} questions for interview ${interviewId}`);

    return {
      questions,
      interviewId,
    };
  } catch (error) {
    console.error("Error generating interview questions:", error);
    throw error;
  }
}

// Analyze a user's answer to provide detailed feedback
export async function analyzeAnswer(
  question: string,
  answer: string,
  jobRole: string,
  experienceLevel: string
): Promise<AnswerFeedback> {
  try {
    const prompt = `
      As a technical interviewer for a ${jobRole} position, analyze the following answer to this interview question:

      Question: "${question}"

      Answer: "${answer}"

      The candidate is at a ${experienceLevel} level.

      Provide an objective analysis with numerical ratings (1-10) for:
      - Relevance to the question
      - Clarity of expression
      - Depth of knowledge
      - Conciseness
      - Confidence/communication style
      - Technical accuracy

      Also identify:
      - Count of filler words used (um, uh, like, you know, etc.)
      - 2-3 strengths of the answer
      - 2-3 weaknesses or areas for improvement
      - 2-3 specific suggestions for improvement
      - An overall score (1-10)
      - A brief summary (1-2 sentences)

      Format the response as a JSON object with these exact fields:
      {
        "relevance": number,
        "clarity": number,
        "depth": number,
        "conciseness": number,
        "confidence": number,
        "fillerWordCount": number,
        "technicalAccuracy": number,
        "overallScore": number,
        "strengths": [string, string, ...],
        "weaknesses": [string, string, ...],
        "improvements": [string, string, ...],
        "summary": string
      }
    `;

    const response = await callGeminiAPI(prompt);

    // Extract JSON from the response
    const jsonMatch = response.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error('Failed to extract valid JSON from Gemini response');
    }

    const feedbackJson = JSON.parse(jsonMatch[0]);

    return feedbackJson as AnswerFeedback;
  } catch (error) {
    console.error("Error analyzing answer:", error);
    // Return a default feedback object in case of error
    return {
      relevance: 5,
      clarity: 5,
      depth: 5,
      conciseness: 5,
      confidence: 5,
      fillerWordCount: 0,
      technicalAccuracy: 5,
      overallScore: 5,
      strengths: ['Unable to analyze strengths'],
      weaknesses: ['Unable to analyze weaknesses'],
      improvements: ['Try providing a more detailed answer'],
      summary: 'Analysis failed due to technical error'
    };
  }
}

// Save the feedback for an answer to a persistent storage
export async function saveAnswerFeedback(
  interviewId: string,
  userId: string,
  questionIndex: number,
  question: string,
  answer: string,
  feedback: AnswerFeedback
) {
  try {
    // In a real application, you would save this to Firebase or another database
    console.log(`Saving feedback for interview ${interviewId}, question ${questionIndex + 1}`);

    // For now, we'll just log it to console
    console.log({
      interviewId,
      userId,
      questionIndex,
      question,
      answer,
      feedback,
      timestamp: new Date()
    });

    return { success: true };
  } catch (error) {
    console.error("Error saving feedback:", error);
    return { success: false, error };
  }
}

// Generate an aptitude question based on user parameters
export async function generateAptitudeQuestion(params: AptitudeQuestionParams): Promise<AptitudeQuestionResult> {
  try {
    const { topic, difficulty, format = 'Conceptual' } = params;

    const prompt = `
      Generate a ${difficulty} level aptitude question about ${topic}.
      Make it practical and relevant to real-world scenarios.

      ${format === 'MCQ'
        ? 'Create a multiple choice question with 4 options, ensuring each option is distinct and plausible.'
        : 'Create a conceptual question that tests deep understanding, with a detailed step-by-step solution.'
      }

      The response should follow this format:
      Question: [Your question here]
      ${format === 'MCQ'
        ? 'Options:\nA. [option 1]\nB. [option 2]\nC. [option 3]\nD. [option 4]\nCorrect Answer: [letter]'
        : 'Answer: [detailed solution]'
      }
      Explanation: [Clear explanation of the solution process]

      Include at least one practical application or real-world example in the explanation.
    `;

    console.log("Sending prompt to Gemini for aptitude question:", prompt);

    const response = await callGeminiAPI(prompt);

    // Parse the response to extract question, answer, and explanation
    const questionMatch = response.match(/Question:\s*(.*?)(?=Options:|Answer:|Explanation:|$)/s);
    const optionsMatch = response.match(/Options:\s*(.*?)(?=Correct Answer:|Explanation:|$)/s);
    const correctAnswerMatch = response.match(/Correct Answer:\s*(.*?)(?=Explanation:|$)/s);
    const answerMatch = response.match(/Answer:\s*(.*?)(?=Explanation:|$)/s);
    const explanationMatch = response.match(/Explanation:\s*(.*?)$/s);

    const question = questionMatch ? questionMatch[1].trim() : '';
    let answer = '';
    let options: string[] = [];

    if (format === 'MCQ') {
      if (optionsMatch && optionsMatch[1]) {
        options = optionsMatch[1].trim().split('\n').map(option => option.trim());
      }
      answer = correctAnswerMatch ? correctAnswerMatch[1].trim() : '';
    } else {
      answer = answerMatch ? answerMatch[1].trim() : '';
    }

    const explanation = explanationMatch ? explanationMatch[1].trim() : '';

    return {
      question,
      answer,
      explanation,
      options: format === 'MCQ' ? options : undefined,
    };
  } catch (error) {
    console.error("Error generating aptitude question:", error);
    throw error;
  }
}

// Generate brush-up content for a given aptitude topic
export async function generateAptitudeBrushUp(params: AptitudeBrushUpParams): Promise<AptitudeBrushUpResult> {
  try {
    const { topic } = params;

    const prompt = `
      Generate a comprehensive yet concise brush-up for the aptitude topic: "${topic}".

      The response should be structured into three distinct sections, clearly marked with "### Theory", "### Formulas", and "### Solved Examples":

      ### Theory
      Explain the fundamental concepts and principles of "${topic}" in a clear and easy-to-understand manner. Use analogies or simple examples where helpful. Aim for a balance between thoroughness and brevity, suitable for a quick review.

      ### Formulas
      List all the important formulas and equations related to "${topic}". Present them clearly, possibly with a brief explanation of each variable involved. Use LaTeX formatting for mathematical expressions where appropriate.

      ### Solved Examples
      Provide 2-3 diverse example questions that illustrate the application of the concepts and formulas discussed. Show the step-by-step solution for each example, clearly explaining the reasoning behind each step.

      Ensure the language is precise and avoids jargon where possible. The tone should be informative and helpful for someone looking to quickly refresh their understanding of the topic.
    `;

    console.log("Sending prompt to Gemini for aptitude brush up:", prompt);

    const response = await callGeminiAPI(prompt);

    // Parse the response to extract the three sections
    const theoryMatch = response.match(/### Theory\n(.*?)\n### Formulas/s);
    const formulasMatch = response.match(/### Formulas\n(.*?)\n### Solved Examples/s);
    const examplesMatch = response.match(/### Solved Examples\n(.*?)$/s);

    const theory = theoryMatch ? theoryMatch[1].trim() : 'No theory generated.';
    const formulas = formulasMatch ? formulasMatch[1].trim() : 'No formulas generated.';
    const examples = examplesMatch ? examplesMatch[1].trim() : 'No examples generated.';

    return { theory, formulas, examples };
  } catch (error) {
    console.error("Error generating aptitude brush up:", error);
    return { theory: 'Error generating theory.', formulas: 'Error generating formulas.', examples: 'Error generating examples.' };
  }
}