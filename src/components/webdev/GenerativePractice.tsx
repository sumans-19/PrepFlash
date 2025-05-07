
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { generatePracticeProblems, GeminiPracticeProblem } from '@/services/GeminiService2';

const GenerativePractice: React.FC = () => {
  const [difficulty, setDifficulty] = useState<string>("medium");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [problems, setProblems] = useState<GeminiPracticeProblem[]>([]);
  const [selectedProblem, setSelectedProblem] = useState<string | null>(null);
  const [topic, setTopic] = useState<string>("web development");

  const { toast } = useToast();

  const generateProblems = async () => {
    setIsLoading(true);
    try {
      const generatedProblems = await generatePracticeProblems(topic, difficulty, 10);
      
      setProblems(generatedProblems);
      setSelectedProblem(null);
      
    } catch (error) {
      console.error('Error generating practice problems:', error);
      toast({
        variant: "destructive",
        title: "Error generating practice problems",
        description: "Please try again or check your API key.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleProblemSelect = (id: string) => {
    setSelectedProblem(id === selectedProblem ? null : id);
  };

  const getSelectedProblem = () => {
    return problems.find(problem => problem.id === selectedProblem);
  };

  return (
    <div className="space-y-6">
      {problems.length === 0 || (!selectedProblem && problems.length > 0) ? (
        <>
          <Card className="glassmorphism mb-6">
            <CardHeader>
              <CardTitle>Generate AI Practice Problems</CardTitle>
              <CardDescription>
                Choose a topic and difficulty level to generate custom practice problems
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="practice-topic">Topic</Label>
                  <input
                    id="practice-topic"
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Enter a topic (e.g., JavaScript, React, HTML)"
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="practice-difficulty">Difficulty</Label>
                  <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger id="practice-difficulty" className="w-full">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                      <SelectItem value="expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button 
  onClick={generateProblems} 
  className="w-full bg-purple-300 text-purple-900 hover:bg-purple-400 disabled:opacity-50 disabled:cursor-not-allowed" 
  disabled={isLoading}
>
  {isLoading ? "Generating Problems..." : "Generate Practice Problems"}
</Button>

            </CardContent>
          </Card>
          
          {problems.length > 0 && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-2xl font-bold section-header pb-2">AI-Generated Practice Problems</h2>
              <p className="text-lg text-muted-foreground mb-4">Select a problem to practice your skills</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {problems.map(problem => (
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
            </div>
          )}
        </>
      ) : (
        <Card className="glassmorphism mb-8 animate-fade-in">
          <CardContent className="p-6">
            <div className="mb-6">
              <Button 
                variant="outline" 
                onClick={() => setSelectedProblem(null)}
                className="mb-4"
              >
                <ChevronLeft className="mr-2 h-4 w-4" /> Back to problems
              </Button>
              
              <h2 className="text-2xl font-bold">{getSelectedProblem()?.title}</h2>
              <p className="text-muted-foreground mt-1">{getSelectedProblem()?.description}</p>
            </div>
            
            <div className="mb-4">
              <h3 className="font-semibold text-lg mb-2">Instructions:</h3>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                {getSelectedProblem()?.instructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ul>
            </div>
            
            <div className="border rounded-lg overflow-hidden">
              <textarea
                defaultValue={getSelectedProblem()?.defaultCode}
                className="w-full h-80 p-4 font-mono text-sm bg-zinc-900 text-gray-100 resize-none focus:outline-none code-editor"
                spellCheck="false"
              />
            </div>
            
            <div className="flex justify-end mt-4">
              <Button className="bg-green-600 hover:bg-green-700">
                Run Code
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GenerativePractice;
