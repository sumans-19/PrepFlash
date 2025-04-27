
import { useState, useEffect } from 'react';
import { AptitudeQuestion, Formula, Topic, Difficulty, Format } from '../types/aptitude';

// Mock data - in a real app, this would come from an API
const MOCK_TOPICS: Topic[] = [
  { id: 'algebra', name: 'Algebra', icon: 'function' },
  { id: 'probability', name: 'Probability', icon: 'percent' },
  { id: 'time-work', name: 'Time & Work', icon: 'clock' },
  { id: 'percentage', name: 'Percentage', icon: 'percent' },
  { id: 'ratio', name: 'Ratio & Proportion', icon: 'divide' },
  { id: 'profit-loss', name: 'Profit & Loss', icon: 'trending-up' },
];

const MOCK_FORMULAS: Formula[] = [
  {
    id: '1',
    topic: 'algebra',
    title: 'Quadratic Formula',
    expression: 'x = (-b ± √(b² - 4ac)) / 2a',
    description: 'Solves quadratic equation ax² + bx + c = 0',
    example: 'For 2x² + 4x + 1 = 0, a=2, b=4, c=1'
  },
  {
    id: '2',
    topic: 'probability',
    title: 'Probability of Event',
    expression: 'P(A) = Number of favorable outcomes / Total number of outcomes',
    description: 'Calculates the likelihood of an event occurring',
    example: 'Probability of getting a 6 when rolling a die is 1/6'
  },
  {
    id: '3',
    topic: 'time-work',
    title: 'Work Done Formula',
    expression: 'Work = Rate × Time',
    description: 'Relates the amount of work done to rate and time',
    example: 'If rate is 5 units/hr and time is 4 hrs, work done = 20 units'
  },
  {
    id: '4',
    topic: 'percentage',
    title: 'Percentage Change',
    expression: 'Percentage Change = ((New Value - Original Value) / Original Value) × 100',
    description: 'Calculates the percentage increase or decrease',
    example: 'If price changes from $50 to $60, percentage change = ((60-50)/50) × 100 = 20%'
  },
  {
    id: '5',
    topic: 'ratio',
    title: 'Proportion',
    expression: 'a/b = c/d',
    description: 'Equality of two ratios',
    example: 'If a:b = 3:4 and c:d = 6:8, then a/b = c/d'
  },
  // Add more mock formulas as needed
];

const MOCK_QUESTIONS: AptitudeQuestion[] = [
  {
    id: '1',
    question: 'If 6 men can complete a piece of work in 12 days, how many men would be required to complete the same work in 3 days?',
    options: ['18 men', '24 men', '30 men', '36 men'],
    correctAnswer: '24 men',
    explanation: 'Using the formula M1D1 = M2D2, we get 6 × 12 = M2 × 3, solving for M2 gives 24 men.',
    topic: 'time-work',
    difficulty: 'Medium',
    targetRole: ['Analyst', 'Software Developer'],
    company: ['Amazon', 'Microsoft'],
    format: 'MCQ',
    timeRequired: 60,
    isBookmarked: false,
  },
  {
    id: '2',
    question: 'What is the probability of getting a sum of 7 when two dice are thrown?',
    options: ['1/6', '5/36', '6/36', '7/36'],
    correctAnswer: '6/36',
    explanation: 'Favorable outcomes are (1,6), (2,5), (3,4), (4,3), (5,2), (6,1). Total outcomes are 36. So probability is 6/36 = 1/6.',
    topic: 'probability',
    difficulty: 'Easy',
    targetRole: ['Data Scientist', 'Statistician'],
    company: ['Google', 'Facebook'],
    format: 'MCQ',
    timeRequired: 45,
    isBookmarked: true,
  },
  {
    id: '3',
    question: 'Solve for x: 2x² - 5x + 3 = 0',
    correctAnswer: 'x = 1 or x = 3/2',
    explanation: 'Using the quadratic formula x = (-b ± √(b² - 4ac))/2a where a=2, b=-5, c=3. We get x = (5 ± √(25-24))/4 = (5 ± 1)/4, so x = 3/2 or x = 1.',
    topic: 'algebra',
    difficulty: 'Hard',
    targetRole: ['Software Developer', 'Engineer'],
    company: ['Deloitte', 'IBM'],
    format: 'Fill in the blanks',
    timeRequired: 90,
    isBookmarked: false,
  },
  // Add more mock questions as needed
];

export const useAptitude = () => {
  const [formulas, setFormulas] = useState<Formula[]>(MOCK_FORMULAS);
  const [questions, setQuestions] = useState<AptitudeQuestion[]>(MOCK_QUESTIONS);
  const [topics, setTopics] = useState<Topic[]>(MOCK_TOPICS);
  const [filteredQuestions, setFilteredQuestions] = useState<AptitudeQuestion[]>(MOCK_QUESTIONS);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | ''>('');
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [selectedFormat, setSelectedFormat] = useState<Format | ''>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Filter questions based on selected criteria
    let filtered = [...questions];
    
    if (selectedTopics.length > 0) {
      filtered = filtered.filter(q => selectedTopics.includes(q.topic));
    }
    
    if (selectedDifficulty && selectedDifficulty !== 'Easy') {
      filtered = filtered.filter(q => q.difficulty === selectedDifficulty);
    }
    
    if (selectedRoles.length > 0) {
      filtered = filtered.filter(q => q.targetRole.some(role => selectedRoles.includes(role)));
    }
    
    if (selectedCompanies.length > 0) {
      filtered = filtered.filter(q => q.company.some(company => selectedCompanies.includes(company)));
    }
    
    if (selectedFormat && selectedFormat !== 'MCQ') {
      filtered = filtered.filter(q => q.format === selectedFormat);
    }
    
    setFilteredQuestions(filtered);
  }, [questions, selectedTopics, selectedDifficulty, selectedRoles, selectedCompanies, selectedFormat]);

  // Get formulas by topic
  const getFormulasByTopic = (topic: string) => {
    return formulas.filter(formula => formula.topic === topic);
  };

  // Toggle bookmark for a question
  const toggleBookmark = (questionId: string) => {
    setQuestions(prevQuestions => 
      prevQuestions.map(q => 
        q.id === questionId ? { ...q, isBookmarked: !q.isBookmarked } : q
      )
    );
  };

  // Update last attempted timestamp for a question
  const markQuestionAttempted = (questionId: string) => {
    setQuestions(prevQuestions => 
      prevQuestions.map(q => 
        q.id === questionId ? { ...q, lastAttempted: new Date() } : q
      )
    );
  };

  // Get bookmarked questions
  const getBookmarkedQuestions = () => {
    return questions.filter(q => q.isBookmarked);
  };

  // Get recently attempted questions
  const getRecentlyAttemptedQuestions = () => {
    return questions
      .filter(q => q.lastAttempted)
      .sort((a, b) => 
        new Date(b.lastAttempted!).getTime() - new Date(a.lastAttempted!).getTime()
      );
  };

  return {
    formulas,
    questions,
    filteredQuestions,
    topics,
    selectedTopics,
    setSelectedTopics,
    selectedDifficulty,
    setSelectedDifficulty,
    selectedRoles,
    setSelectedRoles,
    selectedCompanies,
    setSelectedCompanies,
    selectedFormat,
    setSelectedFormat,
    loading,
    getFormulasByTopic,
    toggleBookmark,
    markQuestionAttempted,
    getBookmarkedQuestions,
    getRecentlyAttemptedQuestions,
  };
};
