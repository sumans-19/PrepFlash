import axios from "axios";
import { Article, Internship, Job } from "../types/index"
import { stripHtml } from "@/lib/utils";

const API_KEY = "f159e0fa42a04a0096fb6474db3b10ab";
// Replace with your actual API key

export const fetchArticles = async (): Promise<Article[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      
      const newsApiUrl = `https://newsapi.org/v2/everything?q=IT+sector+trends+OR+tech+industry+trends+OR+enterprise+technology+OR+digital+transformation+OR+cloud+computing+OR+cybersecurity+trends+OR+emerging+tech+enterprise+OR+IT+market+outlook&language=en&sortBy=publishedAt&pageSize=15&apiKey=${API_KEY}`;

      const res = await fetch(newsApiUrl);

      if (!res.ok) {
        throw new Error("Failed to fetch technology news");
      }
      const getDefaultImageForCategory = (category: string): string => {
        const defaultImages = {
          "Technology": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=60",
          "AI": "https://images.unsplash.com/photo-1677442135736-22808c820cee?w=800&auto=format&fit=crop&q=60",
          "Programming": "https://images.unsplash.com/photo-1542903660-eedba2cda473?w=800&auto=format&fit=crop&q=60",
          "Data Science": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60"
        };

        return defaultImages[category] || defaultImages["Technology"];
      };

      const json = await res.json();

      // Filter out articles with any empty required fields
      const articles: Article[] = json.articles
        .filter((article: any) => (
          article.title &&
          article.description &&
          article.publishedAt &&
          article.source?.name &&
          article.url
        ))
        .map((article: any) => ({
          id: article.publishedAt + "-" + article.title,
          title: article.title,
          description: article.description,
          category: "",
          imageUrl: article.urlToImage || getDefaultImageForCategory("Technology"),
          publishedAt: article.publishedAt,
          source: article.source.name,
          url: article.url,
        }));

      // Simulate delay like in mock function
      setTimeout(() => {
        resolve(articles);
      }, 500);
    } catch (error) {
      reject(error);
    }
  });
};








export const fetchJobs = async (): Promise<Job[]> => {
  try {
    const res = await fetch(
      'https://www.themuse.com/api/public/jobs?category=Software%20Engineering&location=India&page=1'
    );

    if (!res.ok) {
      throw new Error("Failed to fetch job listings");
    }

    const data = await res.json();

    const jobs: Job[] = data.results
      .filter((job: any) =>
        job.locations.some((loc: any) =>
          loc.name.toLowerCase().includes("india") || loc.name.toLowerCase().includes("remote")
        )
      )
      .map((job: any) => ({
        id: job.id.toString(),
        company: job.company?.name || "Unknown Company",
        logo: job.refs?.landing_page,
        title: job.name,
        location: job.locations.map((loc: any) => loc.name).join(", ") || "Remote",
        salary: job.salary || "Not specified",
        type: job.type || "Full-time",
        description: stripHtml(job.contents),
        skills: job.categories?.map((cat: any) => cat.name) || [],
        postedAt: job.publication_date,
        deadline: "",
        applicationUrl: job.refs?.landing_page || "#",
      }))
      // Sort by publication date (newest first)
      .sort((a: Job, b: Job) => {
        const dateA = new Date(a.postedAt).getTime();
        const dateB = new Date(b.postedAt).getTime();
        return dateB - dateA; // Descending order (newest first)
      });

    // Return the sorted jobs with a delay
    return new Promise((resolve) => setTimeout(() => resolve(jobs), 500));
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return [];
  }
};

// services/api.ts


export const fetchInternships = async ({
  company,
  location,
}: {
  company?: string;
  location?: string;
}): Promise<Internship[]> => {
  try {
    const params = new URLSearchParams();
    if (company) params.append("company", company);
    if (location) params.append("location", location);

    const response = await axios.get(`http://localhost:3000/api/internships?${params.toString()}`);

    return response.data.map((internship: any) => ({
      title: internship.title || "No title",
      company: internship.company || "No company",
      location: internship.location || "No location",
      stipend: internship.stipend || "No stipend",
      duration: internship.duration || "No duration",
      postedAt: internship.postedAt || "No posted date",
      applicationUrl: internship.applicationUrl || "https://internshala.comundefined",
    }));
  } catch (error) {
    console.error("Error fetching internships:", error);
    return [];
  }
};


// This is the actual API service implementation
// Using Google Cloud Speech-to-Text and Gemini API

export interface InterviewSetup {
  jobRole: string;
  techStack: string;
  difficultyLevel: string;
  questionCount: number;
}

export interface InterviewQuestion {
  id: number;
  question: string;
}

export interface InterviewResponse {
  questionId: number;
  audioBlob?: Blob;
  transcription?: string;
  duration?: number;
}

export interface InterviewFeedback {
  clarity: number;
  confidence: number;
  knowledgeDepth: number;
  fillerWordCount: number;
  averageResponseTime: number;
  overallScore: number;
  strengths: string[];
  improvements: string[];
}

// Speech-to-Text API implementation
export const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
  try {
    // For development purposes, we're using a simulated response
    // In production, replace this with actual Google Cloud Speech-to-Text API call

    console.log("Transcribing audio...", audioBlob);

    // Simulated response for development
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("This is a simulated transcription of the audio recording. In production, this would be the actual transcription from Google Cloud Speech-to-Text.");
      }, 1000);
    });

    /* 
    // Production code for Google Cloud Speech-to-Text (requires API key)
    const base64Audio = await blobToBase64(audioBlob);
    
    const response = await fetch('https://speech.googleapis.com/v1/speech:recognize?key=YOUR_GOOGLE_API_KEY', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        config: {
          encoding: 'WEBM_OPUS',
          sampleRateHertz: 48000,
          languageCode: 'en-US',
        },
        audio: {
          content: base64Audio.split(',')[1],
        },
      }),
    });
 
    const data = await response.json();
    return data.results[0].alternatives[0].transcript;
    */
  } catch (error) {
    console.error("Error transcribing audio:", error);
    return "Error transcribing audio. Please try again.";
  }
};

// Helper function to convert Blob to Base64
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

// Generate interview questions with Gemini API
export const generateInterviewQuestions = async (
  setup: InterviewSetup
): Promise<InterviewQuestion[]> => {
  try {
    console.log("Generating interview questions with setup:", setup);

    // Gemini API prompt for generating interview questions
    const prompt = `
        As an expert interviewer for ${setup.jobRole} positions, 
        create ${setup.questionCount} ${setup.difficultyLevel} level interview questions 
        that focus on ${setup.techStack}.
        
        The questions should:
        1. Be appropriate for a ${setup.difficultyLevel} level candidate
        2. Focus specifically on ${setup.techStack} skills and knowledge
        3. Include a mix of technical knowledge, problem-solving, and experience-based questions
        4. Be clear and concise, suitable for verbal responses
        
        Please format your response as a JSON array of objects with 'id' and 'question' properties.
        For example: [{"id": 1, "question": "Tell me about your experience with React hooks."}]
      `;

    // For development, return mock questions
    // In production, this would call the Gemini API
    return new Promise((resolve) => {
      setTimeout(() => {
        const questions = [
          { id: 1, question: `Tell me about your experience with ${setup.techStack}.` },
          { id: 2, question: `Describe a challenging project you worked on as a ${setup.jobRole}.` },
          { id: 3, question: `How do you stay updated with the latest trends in ${setup.techStack}?` },
          { id: 4, question: `What's your approach to debugging complex issues in ${setup.techStack}?` },
          { id: 5, question: `How would you explain ${setup.techStack} to someone with no technical background?` },
          { id: 6, question: `Describe a time when you had to learn a new technology quickly to solve a problem.` },
          { id: 7, question: `What are the biggest challenges you've faced working with ${setup.techStack}?` },
          { id: 8, question: `How do you ensure code quality when working on ${setup.techStack} projects?` },
          { id: 9, question: `Describe your ideal development environment for ${setup.techStack}.` },
          { id: 10, question: `Where do you see ${setup.techStack} evolving in the next few years?` }
        ].slice(0, setup.questionCount);

        resolve(questions);
      }, 1500);
    });

    /* 
    // Production code for Gemini API (uncomment and use environment variables)
    const apiKey = process.env.GEMINI_API_KEY; // Access from environment variable
    
    const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=' + apiKey, {
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
          temperature: 0.7,
          maxOutputTokens: 2048
        }
      })
    });
 
    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;
    
    // Parse the JSON response from Gemini
    try {
      const questions = JSON.parse(text);
      return questions;
    } catch (e) {
      console.error("Failed to parse Gemini response as JSON:", e);
      // Fallback to default questions
      return defaultQuestions(setup).slice(0, setup.questionCount);
    }
    */
  } catch (error) {
    console.error("Error generating interview questions:", error);

    // Fallback questions in case of error
    return [
      { id: 1, question: `Tell me about your experience with ${setup.techStack}.` },
      { id: 2, question: `Describe a challenging project you worked on as a ${setup.jobRole}.` },
      { id: 3, question: `How do you stay updated with the latest trends in ${setup.techStack}?` }
    ].slice(0, setup.questionCount);
  }
};

// Analyze interview performance - integration with Gemini API
export const analyzeInterviewPerformance = async (
  responses: InterviewResponse[]
): Promise<InterviewFeedback> => {
  try {
    console.log("Analyzing interview performance:", responses);

    // Gemini API prompt for analyzing interview performance
    const prompt = `
        As an expert interviewer and coach, analyze the following interview responses:
        
        ${responses.map(r => `Question ${r.questionId}: ${r.transcription || 'No transcription available'}`).join('\n\n')}
        
        Please provide feedback in JSON format with the following structure:
        {
          "clarity": <score from 1-10>,
          "confidence": <score from 1-10>,
          "knowledgeDepth": <score from 1-10>,
          "fillerWordCount": <estimated number of filler words like "um", "uh">,
          "averageResponseTime": <average response time in seconds>,
          "overallScore": <overall score from 1-10>,
          "strengths": ["strength1", "strength2", "strength3"],
          "improvements": ["improvement1", "improvement2", "improvement3"]
        }
        
        Base your analysis on the content, structure, and clarity of the responses.
      `;

    // For development, return mock feedback
    // In production, this would leverage Gemini API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          clarity: 8.5,
          confidence: 7.8,
          knowledgeDepth: 8.2,
          fillerWordCount: 12,
          averageResponseTime: 65, // seconds
          overallScore: 8.0,
          strengths: [
            "Strong technical knowledge demonstration",
            "Clear communication of complex concepts",
            "Good problem-solving approach"
          ],
          improvements: [
            "Consider reducing filler words like 'um' and 'uh'",
            "Take a moment to organize thoughts before responding",
            "Provide more specific examples from past experiences"
          ]
        });
      }, 2000);
    });

    /* 
    // Production code for Gemini API
    const apiKey = process.env.GEMINI_API_KEY;
    
    const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=' + apiKey, {
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
          temperature: 0.4,
          maxOutputTokens: 2048
        }
      })
    });
 
    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;
    
    // Parse the JSON response from Gemini
    try {
      return JSON.parse(text);
    } catch (e) {
      console.error("Failed to parse Gemini response as JSON:", e);
      // Return default feedback
      return defaultFeedback();
    }
    */
  } catch (error) {
    console.error("Error analyzing interview performance:", error);

    // Default feedback in case of error
    return {
      clarity: 7.0,
      confidence: 7.0,
      knowledgeDepth: 7.0,
      fillerWordCount: 10,
      averageResponseTime: 60,
      overallScore: 7.0,
      strengths: [
        "Good communication skills",
        "Solid technical knowledge",
        "Clear explanations"
      ],
      improvements: [
        "Work on reducing filler words",
        "Try to provide more specific examples",
        "Structure your answers using the STAR method"
      ]
    };
  }
};

// Text-to-Speech function using Web Speech API
export const textToSpeech = async (text: string): Promise<void> => {
  return new Promise((resolve) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => resolve();
    speechSynthesis.speak(utterance);
  });
};