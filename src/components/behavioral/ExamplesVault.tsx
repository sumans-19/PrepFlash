
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BookOpen, Search, ThumbsUp, BookCopy, Star } from 'lucide-react';

// Sample data for example answers
const exampleAnswers = [
  {
    id: 1,
    question: "Tell me about a time when you had to work with a difficult colleague.",
    role: "Product Manager",
    company: "Tech Startup",
    experience: "Mid-level",
    answers: [
      {
        id: 101,
        rating: 9.5,
        answer: "In my previous role as a product manager at a fast-growing startup, I collaborated with a senior developer who was technically brilliant but often resistant to input from others, especially regarding changing requirements. Rather than escalating or avoiding him, I took time to understand his perspective. I learned he valued technical excellence and was concerned about stability.\n\nI started scheduling brief one-on-one syncs before team meetings to preview changes and get his technical input early. I also created a more structured requirements document that clearly highlighted technical considerations and gave him credit for his insights during meetings.\n\nWithin a month, our working relationship improved significantly. We were able to launch three features ahead of schedule, and he eventually became one of my strongest allies when presenting to stakeholders. The experience taught me that difficult relationships often indicate unmet needs rather than personality conflicts.",
        strengths: [
          "Addresses the situation directly without blaming",
          "Shows specific actions taken",
          "Includes measurable results",
          "Demonstrates growth and learning"
        ]
      },
      {
        id: 102,
        rating: 8.7,
        answer: "As a product manager at my previous company, I worked with a designer who strongly disagreed with the direction for a key feature. Instead of dismissing his concerns, I scheduled a dedicated workshop with the design team to understand their perspective.\n\nI prepared by gathering user research data that supported some of their points while clarifying business requirements. During the workshop, I focused on creating a shared understanding rather than winning the argument. I acknowledged valid design concerns and suggested a compromise approach that preserved the core user experience while meeting business goals.\n\nThe designer appreciated being heard and became more collaborative. The resulting feature ended up performing 20% better in usability tests than our original concept. This experience reinforced my belief in the value of productive conflict and seeking diverse perspectives.",
        strengths: [
          "Used data to facilitate resolution",
          "Showed empathy and understanding",
          "Focused on shared goals",
          "Quantified the positive outcome"
        ]
      }
    ]
  },
  {
    id: 2,
    question: "Describe a project that failed and what you learned from it.",
    role: "Software Engineer",
    company: "FAANG",
    experience: "Senior",
    answers: [
      {
        id: 201,
        rating: 9.2,
        answer: "At my previous role at a major tech company, I led a team developing a new internal tool for our customer service department. Despite strong technical execution, the project ultimately failed to achieve adoption. We spent three months building what we thought was exactly what the department needed, but when we launched, usage was less than 10%.\n\nUpon investigation, I realized we had consulted primarily with department managers but hadn't spent enough time with the actual end users. Our tool solved the problems management saw, but missed critical workflows that the front-line staff needed.\n\nI took responsibility for this oversight and implemented three changes to our process: First, I established a 'user panel' of actual end users for all future internal tools. Second, I instituted mandatory shadowing sessions for engineers to observe end users in their environment. Third, we adopted a more iterative approach with bi-weekly demos to end users from the very beginning of development.\n\nWhen we rebuilt the tool six months later, adoption exceeded 90%, and we've applied this user-centric approach to all internal tools since then. This experience fundamentally changed how I approach building software, emphasizing that technical excellence without user understanding leads to shelf-ware.",
        strengths: [
          "Takes full ownership of the failure",
          "Provides specific metrics",
          "Details concrete process improvements",
          "Shows measurable improvement after changes"
        ]
      }
    ]
  },
  {
    id: 3,
    question: "Tell me about a time you had to make a difficult decision with limited information.",
    role: "Engineering Manager",
    company: "Fortune 500",
    experience: "Senior",
    answers: [
      {
        id: 301,
        rating: 9.8,
        answer: "As an Engineering Manager at a Fortune 500 company, I faced a critical decision when our authentication service started experiencing intermittent failures affecting thousands of users. We had a major product launch scheduled in 48 hours, and I needed to decide whether to proceed with the launch, delay it, or roll back recent changes.\n\nWith limited diagnostic information, I implemented a structured decision-making process. First, I assembled a cross-functional team including infrastructure, security, and product stakeholders. We mapped out what we knew for certain versus assumptions. I established clear criteria for our decision: user impact, business cost, security risk, and engineering capacity.\n\nGiven the incomplete data, I decided to create parallel workstreams: one team worked on stabilizing the current system while another prepared a simplified alternative authentication path as a backup. I also established hourly checkpoints and clear thresholds for when we would make the final go/no-go decision.\n\nUltimately, 12 hours before launch, we identified the root cause—an obscure configuration issue in a third-party service. We implemented a fix and ran accelerated load tests, which gave us confidence to proceed with the launch. The launch succeeded without authentication issues.\n\nThis experience reinforced my approach to decisions with incomplete information: establish clear decision criteria, create parallel contingency plans, set decision timeframes, and continuously gather data. I now apply this framework to all high-stakes decisions with uncertainty.",
        strengths: [
          "Clearly explains the stakes and constraints",
          "Shows a methodical approach to uncertainty",
          "Demonstrates leadership and stakeholder management",
          "Explains the lasting impact on future decision-making"
        ]
      }
    ]
  },
  {
    id: 4,
    question: "Describe a situation where you had to influence others without formal authority.",
    role: "Product Manager",
    company: "Fortune 500",
    experience: "Senior",
    answers: [
      {
        id: 401,
        rating: 9.6,
        answer: "At my previous company, I identified an opportunity to improve our customer onboarding process that would require changes across multiple teams—engineering, design, customer success, and marketing—none of which reported to me. Our existing process had a 35% drop-off rate, significantly impacting our revenue metrics.\n\nRather than pushing my solution, I first invested time in building relationships with key stakeholders in each department. I scheduled one-on-one coffees to understand their priorities and challenges. This helped me identify potential allies and concerns I would need to address.\n\nNext, I gathered concrete data showing the business impact of the current drop-off rate—approximately $2.4M in lost annual revenue. I created a concise presentation connecting the onboarding improvements to each team's existing priorities and KPIs.\n\nTo overcome initial resistance, particularly from the engineering team who had limited bandwidth, I proposed a phased approach with a small pilot that would require minimal initial investment. I also volunteered to handle the project management and stakeholder communication overhead.\n\nI secured buy-in by finding a natural champion in each team rather than going directly to leadership. These champions helped advocate for the project from within their teams. Within three months, we implemented the new onboarding flow, reducing the drop-off rate to 18%, which translated to approximately $1.5M in recovered annual revenue.\n\nThis experience taught me that influence without authority comes from understanding others' motivations, providing clear value aligned with their goals, and removing obstacles to make collaboration as frictionless as possible.",
        strengths: [
          "Uses specific metrics to demonstrate impact",
          "Shows empathy by understanding stakeholder needs",
          "Details a methodical approach to building influence",
          "Demonstrates value creation across multiple teams"
        ]
      }
    ]
  },
  {
    id: 5,
    question: "Tell me about a time when you had to deliver difficult feedback.",
    role: "Engineering Manager",
    company: "FAANG",
    experience: "Senior",
    answers: [
      {
        id: 501,
        rating: 9.4,
        answer: "As an Engineering Manager at a FAANG company, I had a senior developer on my team who was technically brilliant but was creating friction during code reviews. He would often leave overly critical comments without constructive suggestions and would sometimes debate minor stylistic choices for days, delaying releases.\n\nRather than addressing this in a team setting, which could have been embarrassing, I prepared for a private conversation by gathering specific examples of problematic interactions and their impact on team velocity and morale. I also gathered examples of constructive code review feedback as models.\n\nDuring our 1:1, I started by affirming his technical strengths and contributions. Then I clearly stated my observation about the review style, showing specific examples and explaining how it was affecting team members and our delivery timelines. I was careful to focus on the behavior rather than making it personal.\n\nInitially, he was defensive, explaining that he was just maintaining high standards. I acknowledged his intent but redirected to the impact, sharing that two junior team members had mentioned feeling discouraged from contributing to certain areas of the codebase. This perspective shift was critical—he hadn't considered the experience from their point of view.\n\nWe collaborated on a plan: he would focus feedback on 1-2 important issues per review, use a question-based approach for stylistic suggestions, and pair directly with junior developers on complex changes. I also encouraged him to mentor more, leveraging his expertise constructively.\n\nWithin two months, our team's PR review time decreased by 40%, and in our next engagement survey, team collaboration scores improved significantly. He later thanked me, saying the feedback helped him grow as a technical leader beyond just being a strong individual contributor.",
        strengths: [
          "Balances positive recognition with constructive feedback",
          "Uses specific examples rather than generalizations",
          "Shows actionable suggestions for improvement",
          "Measures the positive outcome of the conversation"
        ]
      }
    ]
  }
];

// Filter options
const roles = ["All Roles", "Product Manager", "Software Engineer", "Engineering Manager", "Designer", "Data Scientist"];
const companies = ["All Companies", "FAANG", "Fortune 500", "Tech Startup", "Consulting"];
const experienceLevels = ["All Levels", "Junior", "Mid-level", "Senior", "Leadership"];

const ExamplesVault = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState("All Roles");
  const [selectedCompany, setSelectedCompany] = useState("All Companies");
  const [selectedExperience, setSelectedExperience] = useState("All Levels");
  const [expandedExample, setExpandedExample] = useState<number | null>(null);
  const [expandedAnswer, setExpandedAnswer] = useState<number | null>(101); // Default to first answer
  
  // Filter examples based on search and filters
  const filteredExamples = exampleAnswers.filter(example => {
    // Search term filter
    const matchesSearch = example.question.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Role filter
    const matchesRole = selectedRole === "All Roles" || example.role === selectedRole;
    
    // Company filter
    const matchesCompany = selectedCompany === "All Companies" || example.company === selectedCompany;
    
    // Experience filter
    const matchesExperience = selectedExperience === "All Levels" || example.experience === selectedExperience;
    
    return matchesSearch && matchesRole && matchesCompany && matchesExperience;
  });
  
  const handleExampleClick = (exampleId: number) => {
    setExpandedExample(expandedExample === exampleId ? null : exampleId);
    
    // If opening a new example, reset the expanded answer to the first one
    if (expandedExample !== exampleId) {
      const example = exampleAnswers.find(e => e.id === exampleId);
      if (example && example.answers.length > 0) {
        setExpandedAnswer(example.answers[0].id);
      } else {
        setExpandedAnswer(null);
      }
    }
  };
  
  const handleAnswerSelect = (answerId: number) => {
    setExpandedAnswer(answerId);
  };
  
  const getCurrentExample = () => {
    return exampleAnswers.find(e => e.id === expandedExample);
  };
  
  const getCurrentAnswer = () => {
    const example = getCurrentExample();
    return example?.answers.find(a => a.id === expandedAnswer);
  };
  
  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <h2 className="text-xl font-semibold">Real Examples Vault</h2>
        <div className="relative w-full md:w-auto">
          <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by question..."
            className="pl-9 w-full md:w-80"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="w-full sm:w-auto">
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="w-full sm:w-36">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              {roles.map(role => (
                <SelectItem key={role} value={role}>{role}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full sm:w-auto">
          <Select value={selectedCompany} onValueChange={setSelectedCompany}>
            <SelectTrigger className="w-full sm:w-36">
              <SelectValue placeholder="Company" />
            </SelectTrigger>
            <SelectContent>
              {companies.map(company => (
                <SelectItem key={company} value={company}>{company}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full sm:w-auto">
          <Select value={selectedExperience} onValueChange={setSelectedExperience}>
            <SelectTrigger className="w-full sm:w-36">
              <SelectValue placeholder="Experience" />
            </SelectTrigger>
            <SelectContent>
              {experienceLevels.map(level => (
                <SelectItem key={level} value={level}>{level}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Examples list */}
        <div className="col-span-1">
          <h3 className="font-medium mb-4">Top-Rated Examples</h3>
          
          {filteredExamples.length === 0 ? (
            <Card className="p-6 text-center">
              <p className="text-muted-foreground">No examples match your filters. Try changing your search criteria.</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredExamples.map(example => (
                <Card 
                  key={example.id} 
                  className={`cursor-pointer transition-all ${
                    expandedExample === example.id 
                      ? 'border-interview-blue ring-1 ring-interview-blue/20'
                      : 'hover:border-slate-300'
                  }`}
                  onClick={() => handleExampleClick(example.id)}
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium line-clamp-2">{example.question}</h4>
                      <div className="flex items-center space-x-1 text-amber-500">
                        <Star className="h-3.5 w-3.5 fill-amber-500" />
                        <span className="text-xs font-medium">
                          {example.answers.reduce((acc, a) => acc + a.rating, 0) / example.answers.length}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mb-3">
                      <Badge variant="outline" className="bg-slate-50">
                        {example.role}
                      </Badge>
                      <Badge variant="outline" className="bg-slate-50">
                        {example.company}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">{example.answers.length} example{example.answers.length !== 1 ? 's' : ''}</span>
                      <span className="flex items-center gap-1 text-interview-blue">
                        <BookOpen className="h-3.5 w-3.5" />
                        View
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
        
        {/* Example detail */}
        <div className="col-span-1 lg:col-span-2">
          {expandedExample ? (
            <>
              <Card className="p-6 mb-4">
                <h3 className="font-semibold text-lg mb-3">{getCurrentExample()?.question}</h3>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">{getCurrentExample()?.role}</Badge>
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">{getCurrentExample()?.company}</Badge>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">{getCurrentExample()?.experience}</Badge>
                </div>
                
                {/* Tab-like selection between multiple answers */}
                <div className="mb-4">
                  <div className="flex space-x-2 border-b">
                    {getCurrentExample()?.answers.map((answer, index) => (
                      <div 
                        key={answer.id}
                        className={`px-4 py-2 cursor-pointer transition-colors ${
                          expandedAnswer === answer.id 
                            ? 'border-b-2 border-interview-blue text-interview-blue font-medium'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                        onClick={() => handleAnswerSelect(answer.id)}
                      >
                        Example {index + 1} 
                        <span className="ml-1 text-xs">
                          ({answer.rating})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Selected answer */}
                <div className="prose prose-slate max-w-none">
                  <div className="bg-slate-50 p-4 rounded-lg">
                    {getCurrentAnswer()?.answer.split('\n\n').map((paragraph, i) => (
                      <p key={i} className="mb-4 last:mb-0">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </Card>
              
              {/* Analysis */}
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <ThumbsUp className="h-5 w-5 text-green-600" />
                  <h3 className="font-medium">What Makes This Effective</h3>
                </div>
                
                <ul className="space-y-3 mb-6">
                  {getCurrentAnswer()?.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-green-100 text-green-800 flex items-center justify-center flex-shrink-0">
                        {index + 1}
                      </div>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="flex justify-between">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <BookCopy className="h-4 w-4" />
                    Save to My Examples
                  </Button>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Rating:</span>
                    <div className="flex items-center space-x-1 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-amber-500" />
                      ))}
                    </div>
                    <span className="font-medium ml-1">{getCurrentAnswer()?.rating}/10</span>
                  </div>
                </div>
              </Card>
            </>
          ) : (
            <Card className="h-full flex items-center justify-center p-6 bg-slate-50">
              <div className="text-center">
                <BookOpen className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="font-medium mb-2">Select an Example</h3>
                <p className="text-muted-foreground text-sm">
                  Choose an example from the list to view top-rated responses
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamplesVault;
