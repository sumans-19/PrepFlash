import { InterviewQuestion } from '../types/index2';
import axios from 'axios';

// Sample questions by domain for prototype
const sampleQuestionsByDomain: Record<string, string[]> = {
  'Software Engineering': [
    'Tell me about a challenging project you worked on and how you overcame technical obstacles.',
    'Describe your experience with agile development methodologies.',
    'How do you approach debugging a complex issue in production?',
    'Describe a time when you had to learn a new technology quickly.',
    'How do you ensure code quality in your projects?',
    'Describe your experience with designing scalable systems.',
    'How do you handle disagreements within your development team?'
  ],
  'Data Science': [
    'Describe a data analysis project where you derived actionable insights.',
    'How do you approach data cleaning and preprocessing?',
    'Tell me about a time when you had to explain complex data findings to non-technical stakeholders.',
    'What techniques do you use to handle imbalanced datasets?',
    'How do you evaluate the performance of your machine learning models?',
    'Describe your experience with deploying models to production.',
    'How do you stay updated with the latest developments in data science?'
  ],
  'Product Management': [
    'Tell me about a successful product you launched and your role in its development.',
    'How do you prioritize features when resources are limited?',
    'Describe how you gather and incorporate user feedback into product decisions.',
    'Tell me about a time when you had to make a difficult product decision.',
    'How do you measure the success of a product feature?',
    'Describe your approach to creating a product roadmap.',
    'How do you collaborate with engineering, design, and other teams?'
  ],
  'UX/UI Design': [
    'Describe your design process from research to implementation.',
    'How do you advocate for user needs when faced with business constraints?',
    'Tell me about a design challenge you faced and how you solved it.',
    'How do you approach usability testing and incorporate findings?',
    'Describe a time when you had to redesign an existing feature based on user feedback.',
    'How do you ensure your designs are accessible and inclusive?',
    'Tell me about your experience with design systems or component libraries.'
  ],
  'Marketing': [
    'Describe a successful marketing campaign you developed and executed.',
    'How do you measure the ROI of your marketing initiatives?',
    'Tell me about a time when a marketing strategy didn\'t work as expected and how you adjusted.',
    'How do you identify and target different customer segments?',
    'Describe your experience with content marketing and SEO strategies.',
    'How do you approach social media marketing across different platforms?',
    'Tell me about how you stay updated with digital marketing trends.'
  ],
  'Sales': [
    'Describe your sales process from prospecting to closing.',
    'Tell me about a difficult client you won over.',
    'How do you handle rejection and objections from potential clients?',
    'Describe a time when you had to negotiate a complex deal.',
    'How do you build long-term relationships with clients?',
    'Tell me about how you prioritize your sales pipeline.',
    'How do you collaborate with other departments like marketing and product?'
  ]
};

// Simulate API call to generate questions
export const generateQuestions = async (domain: string, numQuestions: number): Promise<InterviewQuestion[]> => {
  // Simulate API response delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  try {
    // In a real implementation, this would be an API call to a service like Gemini API
    // For the prototype, we'll use the sample questions
    
    let domainQuestions = sampleQuestionsByDomain[domain] || [];
    
    // If domain is not in our samples, generate generic interview questions
    if (domainQuestions.length === 0) {
      domainQuestions = [
        'Tell me about yourself and your background.',
        'What are your greatest strengths and how do you apply them in your work?',
        'Describe a challenge you faced and how you overcame it.',
        'Why are you interested in this position/field?',
        'Where do you see yourself professionally in five years?',
        'Describe a situation where you had to work with a difficult team member.',
        'What achievement are you most proud of and why?'
      ];
    }
    
    // Shuffle and select the requested number of questions
    const shuffled = [...domainQuestions].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(numQuestions, shuffled.length));
    
    // Create question objects with IDs
    return selected.map((text, index) => ({
      id: `q-${index + 1}`,
      text
    }));
  } catch (error) {
    console.error('Error generating questions:', error);
    throw new Error('Failed to generate interview questions');
  }
};

// In a real implementation, you would have actual API calls:
/*
export const generateQuestions = async (domain: string, numQuestions: number): Promise<InterviewQuestion[]> => {
  try {
    const response = await axios.post('YOUR_API_ENDPOINT/generate-questions', {
      domain,
      numQuestions
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      }
    });
    
    return response.data.questions.map((text: string, index: number) => ({
      id: `q-${index + 1}`,
      text
    }));
  } catch (error) {
    console.error('Error generating questions:', error);
    throw error;
  }
};
*/