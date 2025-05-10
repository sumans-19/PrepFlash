import React, { useState, useEffect } from 'react';
import { Search, Filter, ThumbsUp, Bookmark, User, Star, Clock } from 'lucide-react';
import { generateGeminiResponse } from '../../services/geminiService4';

type ExampleResponse = {
  id: string;
  question: string;
  answer: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  traits: string[];
  rating: number;
  source: string;
  role: string;
  industry: string;
  bookmarked?: boolean;
};

// Sample data
const SAMPLE_RESPONSES: ExampleResponse[] = [
  {
    id: "1",
    question: "Tell me about a time when you had to deliver difficult feedback to a team member.",
    answer: "In my role as a senior developer, I had a team member who was producing code that didn't meet our quality standards. I scheduled a private meeting and began by highlighting their strengths in UX design. Then I explained our code quality concerns, showing specific examples. I offered to pair-program with them for the next sprint to demonstrate best practices. After implementing this mentoring approach, their code quality improved significantly, and they later thanked me for helping them grow rather than just criticizing.",
    situation: "I was leading a development team with a member who was writing low-quality code.",
    task: "I needed to address the quality issues without damaging their confidence.",
    action: "I structured a private meeting with praise first, specific examples, and offered hands-on mentoring through pair programming.",
    result: "Their code quality improved substantially, and our relationship became stronger as they appreciated the constructive approach.",
    traits: ["Mentorship", "Direct communication", "Problem-solving", "Empathy"],
    rating: 4.8,
    source: "FAANG Interview",
    role: "Engineering Manager",
    industry: "Technology"
  },
  {
    id: "2",
    question: "Describe a situation where you had to adapt quickly to changing priorities.",
    answer: "As a project manager at a marketing agency, we were in the final stages of a major campaign when our client had an unexpected PR crisis. With just 48 hours before launch, they needed us to completely revamp the messaging. I immediately convened the team, divided the work based on strengths, and established 6-hour check-in intervals. I negotiated with other project managers to borrow two additional designers. We reprioritized all deliverables, focused only on critical elements, and successfully delivered the revised campaign on time. The client was impressed with our agility, and this experience led us to create a new 'rapid response' service offering.",
    situation: "Two days before a campaign launch, our client faced a PR crisis requiring complete messaging changes.",
    task: "I needed to reorganize the entire project with minimal time while maintaining quality.",
    action: "I reassembled the team, redistributed work, established frequent check-ins, and negotiated for additional resources.",
    result: "We delivered on time, impressed the client, and created a new service offering based on this experience.",
    traits: ["Crisis management", "Resource allocation", "Adaptability", "Leadership"],
    rating: 4.9,
    source: "McKinsey Interview",
    role: "Project Manager",
    industry: "Marketing"
  },
  {
    id: "3",
    question: "Tell me about a time you failed and what you learned from it.",
    answer: "Early in my career as a product manager, I pushed for a feature my team and I were excited about, but I didn't validate it sufficiently with actual users. I convinced stakeholders based on our assumptions rather than evidence. After three months of development, the feature launched to minimal user adoption. I took responsibility in our retrospective, acknowledging I had prioritized our internal enthusiasm over user needs. This experience transformed my approach to product development. I established a mandatory user testing protocol requiring validation with at least 10 users before any major feature development. In the following year, our feature adoption rates increased by 60% and development efficiency improved as we stopped working on low-value features earlier.",
    situation: "I championed a feature based on team excitement rather than user validation.",
    task: "I needed to handle the poor feature adoption and prevent similar mistakes.",
    action: "I took responsibility publicly and established new user validation protocols.",
    result: "Feature adoption increased 60% the following year, and we wasted less development time on unwanted features.",
    traits: ["Accountability", "Learning orientation", "Process improvement", "Humility"],
    rating: 4.7,
    source: "Top Tech Startup",
    role: "Product Manager",
    industry: "Software"
  }
];

const INDUSTRIES = [
  "Technology", "Finance", "Healthcare", "Marketing", "Education", 
  "Manufacturing", "Retail", "Consulting", "Non-profit", "Government"
];

const ROLES = [
  "Software Engineer", "Product Manager", "Project Manager", "Engineering Manager",
  "Director", "UX Designer", "Data Scientist", "Marketing Manager", "HR Manager",
  "Sales Executive", "Customer Success", "Operations Manager"
];

const TRAITS = [
  "Leadership", "Communication", "Problem-solving", "Adaptability",
  "Teamwork", "Strategic thinking", "Emotional intelligence", "Conflict resolution",
  "Innovation", "Accountability", "Mentorship", "Decision-making"
];

export const VaultSection: React.FC = () => {
  const [responses, setResponses] = useState<ExampleResponse[]>(SAMPLE_RESPONSES);
  const [filteredResponses, setFilteredResponses] = useState<ExampleResponse[]>(SAMPLE_RESPONSES);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedResponse, setSelectedResponse] = useState<ExampleResponse | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Filter states
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedTrait, setSelectedTrait] = useState<string | null>(null);
  
  // Apply filters when any filter state changes
  useEffect(() => {
    let results = responses;
    
    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(response => 
        response.question.toLowerCase().includes(query) || 
        response.answer.toLowerCase().includes(query)
      );
    }
    
    // Apply filters
    if (selectedIndustry) {
      results = results.filter(response => response.industry === selectedIndustry);
    }
    
    if (selectedRole) {
      results = results.filter(response => response.role === selectedRole);
    }
    
    if (selectedTrait) {
      results = results.filter(response => response.traits.includes(selectedTrait));
    }
    
    setFilteredResponses(results);
  }, [responses, searchQuery, selectedIndustry, selectedRole, selectedTrait]);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleBookmark = (id: string) => {
    setResponses(prev => 
      prev.map(response => 
        response.id === id 
          ? { ...response, bookmarked: !response.bookmarked } 
          : response
      )
    );
  };
  
  const resetFilters = () => {
    setSelectedIndustry(null);
    setSelectedRole(null);
    setSelectedTrait(null);
    setSearchQuery("");
  };
  
  const generateNewExamples = async () => {
    setIsGenerating(true);
    
    try {
      const traits = selectedTrait ? [selectedTrait] : TRAITS.slice(0, 3);
      const industry = selectedIndustry || "any industry";
      const role = selectedRole || "any role";
      
      const prompt = `
        Generate 2 high-quality behavioral interview answer examples that would be rated highly in interviews.
        
        For context, these should be for:
        - Role type: ${role}
        - Industry: ${industry}
        - Key traits to demonstrate: ${traits.join(", ")}
        
        For each example, include:
        1. The interview question
        2. A complete answer using the STAR method
        3. The specific situation, task, action, and result broken out separately
        4. 4-5 behavioral traits the answer demonstrates
        5. A role title and industry
        
        Format as JSON array with objects containing: "question", "answer", "situation", "task", "action", "result", "traits" (array), "role", "industry".
        
        Make the examples realistic, detailed, and impressive.
      `;
      
      const response = await generateGeminiResponse(prompt);
      
      try {
        const parsedResponse = JSON.parse(response);
        
        // Add IDs and ratings to the new examples
        const newExamples = parsedResponse.map((item: any, index: number) => ({
          ...item,
          id: `generated-${Date.now()}-${index}`,
          rating: (4.5 + Math.random() * 0.5).toFixed(1), // Random rating between 4.5-5.0
          source: "AI Generated",
          bookmarked: false
        }));
        
        setResponses(prev => [...prev, ...newExamples]);
        
        // If no example is selected, select the first new one
        if (!selectedResponse) {
          setSelectedResponse(newExamples[0]);
        }
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError);
        alert('Error generating examples. Please try again.');
      }
    } catch (error) {
      console.error('Error generating examples:', error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left column - Filters and list */}
      <div className="lg:col-span-1">
        <div className="glass-card p-4 mb-4">
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search questions or answers..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full bg-indigo-900/30 border border-indigo-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder:text-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-indigo-300" />
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <div className="relative">
              <select
                value={selectedIndustry || ''}
                onChange={(e) => setSelectedIndustry(e.target.value || null)}
                className="appearance-none bg-indigo-900/30 border border-indigo-700 rounded-lg pl-8 pr-8 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Industries</option>
                {INDUSTRIES.map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
              <Filter className="absolute left-2 top-2 w-4 h-4 text-indigo-300" />
            </div>
            
            <div className="relative">
              <select
                value={selectedRole || ''}
                onChange={(e) => setSelectedRole(e.target.value || null)}
                className="appearance-none bg-indigo-900/30 border border-indigo-700 rounded-lg pl-8 pr-8 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Roles</option>
                {ROLES.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
              <User className="absolute left-2 top-2 w-4 h-4 text-indigo-300" />
            </div>
            
            <div className="relative">
              <select
                value={selectedTrait || ''}
                onChange={(e) => setSelectedTrait(e.target.value || null)}
                className="appearance-none bg-indigo-900/30 border border-indigo-700 rounded-lg pl-8 pr-8 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Traits</option>
                {TRAITS.map(trait => (
                  <option key={trait} value={trait}>{trait}</option>
                ))}
              </select>
              <Star className="absolute left-2 top-2 w-4 h-4 text-indigo-300" />
            </div>
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={resetFilters}
              className="text-xs text-indigo-300 hover:text-white"
            >
              Reset Filters
            </button>
            
            <span className="text-xs text-indigo-300">
              {filteredResponses.length} {filteredResponses.length === 1 ? 'result' : 'results'}
            </span>
          </div>
        </div>
        
        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
          {filteredResponses.length > 0 ? (
            filteredResponses.map(response => (
              <div 
                key={response.id}
                className={`glass-card p-4 cursor-pointer transition-all hover:transform hover:scale-[1.02] ${selectedResponse?.id === response.id ? 'border-2 border-indigo-500' : ''}`}
                onClick={() => setSelectedResponse(response)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium line-clamp-2">{response.question}</h3>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBookmark(response.id);
                    }}
                    className={`p-1 rounded-full ${response.bookmarked ? 'text-yellow-400' : 'text-indigo-400 hover:text-yellow-400'}`}
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex items-center text-xs text-indigo-300 mb-2">
                  <User className="w-3 h-3 mr-1" />
                  <span className="mr-3">{response.role}</span>
                  <Star className="w-3 h-3 mr-1" />
                  <span>{response.rating}</span>
                </div>
                
                <p className="text-sm text-indigo-200 line-clamp-2">{response.answer}</p>
              </div>
            ))
          ) : (
            <div className="glass-card p-6 text-center">
              <p className="text-indigo-300 mb-2">No examples match your filters</p>
              <button 
                onClick={resetFilters}
                className="text-sm text-indigo-400 hover:text-indigo-300"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
        
        <button
          onClick={generateNewExamples}
          disabled={isGenerating}
          className="mt-4 w-full py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <Clock className="w-4 h-4 animate-spin" />
              <span>Generating examples...</span>
            </>
          ) : (
            <>
              <span>Generate More Examples</span>
            </>
          )}
        </button>
      </div>
      
      {/* Right column - Selected example details */}
      <div className="lg:col-span-2">
        {selectedResponse ? (
          <div className="glass-card p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">{selectedResponse.question}</h2>
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 mr-1" />
                  <span className="font-medium">{selectedResponse.rating}</span>
                </div>
                <button 
                  onClick={() => handleBookmark(selectedResponse.id)}
                  className={`p-1.5 rounded-full ${selectedResponse.bookmarked ? 'text-yellow-400' : 'text-indigo-400 hover:text-yellow-400'}`}
                >
                  <Bookmark className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-6">
              <div className="px-2.5 py-1 bg-indigo-800/50 rounded-full text-xs font-medium">
                {selectedResponse.role}
              </div>
              <div className="px-2.5 py-1 bg-indigo-800/50 rounded-full text-xs font-medium">
                {selectedResponse.industry}
              </div>
              <div className="px-2.5 py-1 bg-purple-800/50 rounded-full text-xs font-medium">
                {selectedResponse.source}
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-2">Full Answer</h3>
              <div className="bg-indigo-900/20 p-4 rounded-lg text-indigo-100">
                <p>{selectedResponse.answer}</p>
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-2">STAR Breakdown</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-indigo-900/20 p-4 rounded-lg">
                  <h4 className="font-medium text-indigo-300 mb-1">Situation</h4>
                  <p className="text-sm">{selectedResponse.situation}</p>
                </div>
                <div className="bg-indigo-900/20 p-4 rounded-lg">
                  <h4 className="font-medium text-indigo-300 mb-1">Task</h4>
                  <p className="text-sm">{selectedResponse.task}</p>
                </div>
                <div className="bg-indigo-900/20 p-4 rounded-lg">
                  <h4 className="font-medium text-indigo-300 mb-1">Action</h4>
                  <p className="text-sm">{selectedResponse.action}</p>
                </div>
                <div className="bg-indigo-900/20 p-4 rounded-lg">
                  <h4 className="font-medium text-indigo-300 mb-1">Result</h4>
                  <p className="text-sm">{selectedResponse.result}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Key Behavioral Traits</h3>
              <div className="flex flex-wrap gap-2">
                {selectedResponse.traits.map((trait, index) => (
                  <div 
                    key={index}
                    className="px-3 py-1.5 bg-indigo-600/30 rounded-full text-sm"
                  >
                    {trait}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="glass-card p-8 flex flex-col items-center justify-center text-center h-full">
            <div className="w-16 h-16 bg-indigo-900/30 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">No Example Selected</h3>
            <p className="text-indigo-300 mb-4">
              Choose an example from the list to see detailed STAR analysis and behavioral traits.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};