import React, { useState } from 'react';
import { Loader } from 'lucide-react';

interface InterviewPreparationFormProps {
  onGenerateInterview: (data: {
    jobRole: string;
    techStack: string[];
    experienceLevel: string;
    industry: string;
    questionCount: number;
    additionalInfo: string;
  }) => void;
  isGenerating: boolean;
  userName: string;
  initialValues?: {
    jobRole?: string;
    techStack?: string;
    experienceLevel?: string;
    industry?: string;
  };
}

const InterviewPreparationForm: React.FC<InterviewPreparationFormProps> = ({ 
  onGenerateInterview, 
  isGenerating, 
  userName,
  initialValues = {}
}) => {
  const [jobRole, setJobRole] = useState(initialValues.jobRole || '');
  const [techStackInput, setTechStackInput] = useState(initialValues.techStack || '');
  const [experienceLevel, setExperienceLevel] = useState(initialValues.experienceLevel || 'intermediate');
  const [industry, setIndustry] = useState(initialValues.industry || '');
  const [questionCount, setQuestionCount] = useState(5);
  const [additionalInfo, setAdditionalInfo] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Parse techStack from comma-separated string to array
    const techStack = techStackInput
      .split(',')
      .map(tech => tech.trim())
      .filter(tech => tech.length > 0);
    
    onGenerateInterview({
      jobRole,
      techStack,
      experienceLevel,
      industry,
      questionCount,
      additionalInfo
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="col-span-full">
          <label htmlFor="jobRole" className="block text-sm font-medium text-gray-700 mb-1">
            Target Job Role <span className="text-red-500">*</span>
          </label>
          <input
            id="jobRole"
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            placeholder="e.g. Frontend Developer, Full Stack Engineer"
            value={jobRole}
            onChange={(e) => setJobRole(e.target.value)}
            required
          />
        </div>
        
        <div className="col-span-full">
          <label htmlFor="techStack" className="block text-sm font-medium text-gray-700 mb-1">
            Technical Skills <span className="text-red-500">*</span>
          </label>
          <input
            id="techStack"
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            placeholder="e.g. React, Node.js, TypeScript (comma separated)"
            value={techStackInput}
            onChange={(e) => setTechStackInput(e.target.value)}
            required
          />
          <p className="text-xs text-gray-500 mt-1">Comma separated list of technologies</p>
        </div>
        
        <div>
          <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-700 mb-1">
            Experience Level
          </label>
          <select
            id="experienceLevel"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            value={experienceLevel}
            onChange={(e) => setExperienceLevel(e.target.value)}
          >
            <option value="entry">Entry Level</option>
            <option value="junior">Junior (1-2 years)</option>
            <option value="intermediate">Intermediate (3-5 years)</option>
            <option value="senior">Senior (5+ years)</option>
            <option value="lead">Lead/Architect (8+ years)</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
            Industry
          </label>
          <input
            id="industry"
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            placeholder="e.g. Finance, Healthcare, E-commerce"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
          />
        </div>
        
        <div className="col-span-full">
          <label htmlFor="questionCount" className="block text-sm font-medium text-gray-700 mb-1">
            Number of Questions
          </label>
          <div className="flex items-center space-x-2">
            <input
              id="questionCount"
              type="range"
              min="3"
              max="10"
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              value={questionCount}
              onChange={(e) => setQuestionCount(parseInt(e.target.value))}
            />
            <span className="text-gray-700 font-medium">{questionCount}</span>
          </div>
        </div>
        
        <div className="col-span-full">
          <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-1">
            Additional Information (Optional)
          </label>
          <textarea
            id="additionalInfo"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            placeholder="Any specific topics or areas you want to focus on"
            rows={3}
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
          />
        </div>
      </div>
      
      <button
        type="submit"
        disabled={isGenerating || !jobRole || !techStackInput}
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isGenerating ? (
          <span className="flex items-center justify-center">
            <Loader className="animate-spin -ml-1 mr-2 h-4 w-4" />
            Generating Questions...
          </span>
        ) : (
          <span>Generate Interview Questions</span>
        )}
      </button>
    </form>
  );
};

export default InterviewPreparationForm;