
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { practiceProblems } from '@/data/web/practiceProblemsData';
import CodeEditor from '@/components/webdev/CodeEditor';
import { interviewProblems } from '@/data/web/interviewProblemsData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

const PracticeProblems: React.FC = () => {
  const [selectedProblem, setSelectedProblem] = useState<string | null>(null);
  const [selectedInterview, setSelectedInterview] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState<string>("standard");
  const [companyFilter, setCompanyFilter] = useState<string>("All");
  
  const handleProblemSelect = (id: string) => {
    setSelectedProblem(id === selectedProblem ? null : id);
    setSelectedInterview(null); // Reset interview selection
  };

  const handleInterviewSelect = (id: string) => {
    setSelectedInterview(id === selectedInterview ? null : id);
    setSelectedProblem(null); // Reset problem selection
  };

  const getSelectedProblem = () => {
    return practiceProblems.find(problem => problem.id === selectedProblem);
  };

  const getSelectedInterview = () => {
    return interviewProblems.find(problem => problem.id === selectedInterview);
  };

  const companies = ["All", ...Array.from(new Set(interviewProblems.map(problem => problem.company)))];
  const filteredInterviews = companyFilter === "All" 
    ? interviewProblems 
    : interviewProblems.filter(problem => problem.company === companyFilter);

  const getActiveItem = () => {
    if (selectedProblem) {
      return getSelectedProblem();
    }
    if (selectedInterview) {
      return getSelectedInterview();
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {!getActiveItem() ? (
        <Tabs defaultValue={currentTab} className="w-full" onValueChange={setCurrentTab}>
          <TabsList className="grid grid-cols-2 w-full mb-6">
            <TabsTrigger value="standard">Standard Problems</TabsTrigger>
            <TabsTrigger value="interview">Interview Questions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="standard" className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold section-header pb-2">Practice Problems</h2>
            <p className="text-lg text-muted-foreground mb-4">Select a problem to practice your skills</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {practiceProblems.map(problem => (
                <Card 
                  key={problem.id}
                  className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-primary"
                  onClick={() => handleProblemSelect(problem.id)}
                >
                  <CardContent className="p-4">
                    <h3 className="text-lg font-medium">{problem.title}</h3>
                    <p className="text-sm text-muted-foreground">{problem.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="interview" className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold section-header pb-2">Interview Questions</h2>
            <p className="text-lg text-muted-foreground mb-4">Practice popular interview questions from top companies</p>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {companies.map(company => (
                <button
                  key={company}
                  onClick={() => setCompanyFilter(company)}
                  className={`
                    px-5 py-2.5 rounded-full text-sm font-medium transition-all
                    ${companyFilter === company 
                      ? 'bg-primary text-white' 
                      : 'bg-secondary hover:bg-secondary/80 text-foreground'
                    }
                  `}
                >
                  {company}
                </button>
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredInterviews.map(problem => (
                <Card 
                  key={problem.id}
                  className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-primary"
                  onClick={() => handleInterviewSelect(problem.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-medium">{problem.title}</h3>
                      <Badge className="bg-blue-500">{problem.company}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{problem.description}</p>
                    <p className="text-xs mt-2 text-muted-foreground">Difficulty: {problem.difficulty}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        <Card className="glassmorphism mb-8 animate-fade-in">
          <CardContent className="p-6">
            <div className="mb-6">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedProblem(null);
                  setSelectedInterview(null);
                }}
                className="mb-4"
              >
                <ChevronLeft className="mr-2 h-4 w-4" /> Back to problems
              </Button>
              
              <div className="flex justify-between items-start">
                <h2 className="text-2xl font-bold">{getActiveItem()?.title}</h2>
                {selectedInterview && (
                  <Badge className="bg-blue-500">{getSelectedInterview()?.company}</Badge>
                )}
              </div>
              <p className="text-muted-foreground mt-1">{getActiveItem()?.description}</p>
              
              {selectedInterview && (
                <p className="mt-2 text-sm">
                  <span className="font-semibold">Difficulty:</span> {getSelectedInterview()?.difficulty}
                </p>
              )}
            </div>
            
            <div className="mb-4">
              <h3 className="font-semibold text-lg mb-2">Instructions:</h3>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                {getActiveItem()?.instructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ul>
            </div>
            
            <CodeEditor defaultCode={getActiveItem()?.defaultCode || ""} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PracticeProblems;