
import React, { useState } from 'react';
import { DashboardNav } from '@/components/DashboardNav';
import { useAptitude } from '@/hooks/useAptitude';
import QuestionCard from '@/components/aptitude/QuestionCard';
import { toast } from 'sonner';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Button
} from "@/components/ui/button";
import {
  Input
} from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  BookOpen,
  Lightbulb,
  RotateCw,
  Filter,
  BookmarkIcon,
  Clock,
  ChevronRight,
  ChevronLeft,
  FlipHorizontal,
  Book,
  Sparkles,
  PlusCircle,
  MinusCircle,
} from 'lucide-react';
import QuestionFilters from '@/components/aptitude/QuestionFilters';
import { generateAptitudeQuestion } from '@/lib/gemini.sdk';

const AptitudeQuestionBank = () => {
  const {
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
    toggleBookmark,
    markQuestionAttempted,
    getBookmarkedQuestions,
    getRecentlyAttemptedQuestions,
  } = useAptitude();

  // Flashcard state (now for multiple questions)
  const [activeTab, setActiveTab] = useState('generate');
  const [numQuestions, setNumQuestions] = useState(1);
  const [generationConfigs, setGenerationConfigs] = useState([{ id: 0, topic: '', difficulty: 'Medium', question: '', answer: '', showAnswer: false }]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [questionsPerConfig, setQuestionsPerConfig] = useState(1); // New state for questions per config

  // Question bank state (remains the same)
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 5;
  const [questionViewMode, setQuestionViewMode] = useState('all');

  const bookmarkedQuestions = getBookmarkedQuestions();
  const recentlyAttemptedQuestions = getRecentlyAttemptedQuestions();

  let currentQuestions = [];

  switch (questionViewMode) {
    case 'bookmarked':
      currentQuestions = bookmarkedQuestions;
      break;
    case 'recent':
      currentQuestions = recentlyAttemptedQuestions;
      break;
    default:
      currentQuestions = filteredQuestions;
  }

  // Pagination (remains the same)
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestionsPage = currentQuestions.slice(indexOfFirstQuestion, indexOfLastQuestion);
  const totalPages = Math.ceil(currentQuestions.length / questionsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAddQuestionConfig = () => {
    setNumQuestions(prevCount => prevCount + 1);
    setGenerationConfigs(prevConfigs => [
      ...prevConfigs,
      { id: Date.now(), topic: '', difficulty: 'Medium', question: '', answer: '', showAnswer: false },
    ]);
  };

  const handleRemoveQuestionConfig = (idToRemove: number) => {
    if (generationConfigs.length > 1) {
      setNumQuestions(prevCount => prevCount - 1);
      setGenerationConfigs(prevConfigs => prevConfigs.filter(config => config.id !== idToRemove));
    }
  };

  const handleConfigChange = (id: number, field: string, value: any) => {
    setGenerationConfigs(prevConfigs =>
      prevConfigs.map(config =>
        config.id === id ? { ...config, [field]: value } : config
      )
    );
  };

  const handleGenerateQuestions = async () => {
    if (generationConfigs.some(config => !config.topic)) {
      toast.error('Please enter a topic for all questions');
      return;
    }

    setIsGenerating(true);
    const generatedResults: { id: number; question: string; answer: string }[] = [];

    try {
      toast.info(`Generating ${questionsPerConfig} questions per topic...`);

      await Promise.all(
        generationConfigs.map(async (config) => {
          // Modified to generate multiple questions per config
          for (let i = 0; i < questionsPerConfig; i++) {
            const result = await generateAptitudeQuestion({
              topic: config.topic,
              format: 'Conceptual',
              difficulty: config.difficulty as 'Easy' | 'Medium' | 'Hard'
            });
            
            generatedResults.push({ 
              id: i === 0 ? config.id : Date.now() + Math.random(), // Ensure unique ID for each question
              question: result.question, 
              answer: result.answer
            });
          }
        })
      );

      // Update existing configurations with the first question per topic
      const firstQuestionPerTopic = generationConfigs.map(config => {
        const match = generatedResults.find(res => res.id === config.id);
        return match 
          ? { ...config, question: match.question, answer: match.answer, showAnswer: false } 
          : config;
      });
      
      // Create new configurations for the additional questions
      const additionalQuestions = generatedResults.filter(res => 
        !generationConfigs.some(config => config.id === res.id)
      ).map(res => {
        const parentConfig = generationConfigs.find(config => 
          res.id.toString().startsWith(config.id.toString())
        ) || generationConfigs[0];
        
        return {
          id: res.id,
          topic: parentConfig.topic,
          difficulty: parentConfig.difficulty,
          question: res.question,
          answer: res.answer,
          showAnswer: false
        };
      });
      
      // Combine the updated first questions with additional ones
      if (questionsPerConfig > 1) {
        setGenerationConfigs([...firstQuestionPerTopic, ...additionalQuestions]);
        setNumQuestions(firstQuestionPerTopic.length + additionalQuestions.length);
      } else {
        setGenerationConfigs(firstQuestionPerTopic);
      }

      toast.success('Questions generated successfully');
    } catch (error) {
      console.error('Error generating questions:', error);
      toast.error('Failed to generate questions. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFlipCard = (id: number) => {
    setGenerationConfigs(prevConfigs =>
      prevConfigs.map(config =>
        config.id === id ? { ...config, showAnswer: !config.showAnswer } : config
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900">
      <DashboardNav />

      <div className="container max-w-6xl mx-auto px-4 pt-20 pb-16">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Aptitude Ace
          </h1>
          <p className="text-muted-foreground mt-2">
            Generate multiple aptitude questions and practice effectively.
          </p>
        </div>

        <Tabs defaultValue="generate" value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <div className="flex justify-center mb-4">
            <TabsList className="grid grid-cols-2 w-full md:w-[400px]">
              <TabsTrigger value="generate" className="flex items-center justify-center gap-2 p-3 rounded-md transition-colors duration-200 hover:bg-muted/50 data-[state=active]:bg-muted">
                <Lightbulb className="h-5 w-5" />
                <span>Generate Questions</span>
              </TabsTrigger>
              <TabsTrigger value="questionBank" className="flex items-center justify-center gap-2 p-3 rounded-md transition-colors duration-200 hover:bg-muted/50 data-[state=active]:bg-muted">
                <Book className="h-5 w-5" />
                <span>Practice Bank</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Generate Questions Section */}
          <TabsContent value="generate" className="space-y-6">
            <Card className="shadow-md bg-white dark:bg-gray-800/90 border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-amber-500" />
                  Custom Question Generator
                </CardTitle>
                <CardDescription>
                  Specify the topic and difficulty for each question you want to generate.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* New input field for questions per config */}
                <div className="border rounded-md p-4 bg-muted/5 dark:bg-gray-800">
                  <label className="text-sm font-medium block mb-1">Questions per topic</label>
                  <div className="flex items-center gap-3">
                    <Input
                      type="number"
                      min="1"
                      max="5"
                      value={questionsPerConfig}
                      onChange={(e) => setQuestionsPerConfig(Math.max(1, Math.min(5, parseInt(e.target.value) || 1)))}
                      className="w-24"
                    />
                    <span className="text-sm text-muted-foreground">Generate multiple questions for each topic</span>
                  </div>
                </div>
                
                {generationConfigs.map((config, index) => (
                  <div key={config.id} className="border rounded-md p-4 bg-muted/5 dark:bg-gray-800">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className={`text-sm font-semibold ${generationConfigs.length > 1 ? '' : 'text-center'}`}>
                        Question {index + 1}
                      </h4>
                      {generationConfigs.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveQuestionConfig(config.id)}
                        >
                          <MinusCircle className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1">Topic</label>
                      <Input
                        placeholder="e.g., Calculus, Algorithms"
                        value={config.topic}
                        onChange={(e) => handleConfigChange(config.id, 'topic', e.target.value)}
                      />
                    </div>
                    <div className="mt-2">
                      <label className="text-sm font-medium block mb-1">Difficulty</label>
                      <Select
                        value={config.difficulty}
                        onValueChange={(value) => handleConfigChange(config.id, 'difficulty', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Easy">Easy</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {config.question && (
                      <Card className="mt-4 shadow-sm bg-white dark:bg-gray-900 border">
                        <CardHeader>
                          <CardTitle>Generated Question</CardTitle>
                        </CardHeader>
                        <CardContent className="whitespace-pre-line">{config.question}</CardContent>
                        <CardFooter>
                          <Button variant="outline" onClick={() => handleFlipCard(config.id)}>
                            {config.showAnswer ? 'Hide Answer' : 'Show Answer'}
                          </Button>
                        </CardFooter>
                        {config.showAnswer && (
                          <CardContent className="mt-2 bg-muted/10 dark:bg-gray-800 border-t whitespace-pre-line">
                            <p className="text-muted-foreground">{config.answer}</p>
                          </CardContent>
                        )}
                      </Card>
                    )}
                  </div>
                ))}
                {generationConfigs.length < 5 && questionsPerConfig === 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 w-full flex items-center justify-center gap-2"
                    onClick={handleAddQuestionConfig}
                  >
                    <PlusCircle className="h-4 w-4" />
                    Add Another Question
                  </Button>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={handleGenerateQuestions}
                  disabled={isGenerating || generationConfigs.some(config => !config.topic)}
                >
                  {isGenerating ? (
                    <div className="flex items-center justify-center gap-2">
                      <RotateCw className="h-4 w-4 animate-spin" />
                      Generating Questions...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Lightbulb className="h-4 w-4" />
                      Generate {questionsPerConfig * generationConfigs.length} Question{questionsPerConfig * generationConfigs.length > 1 ? 's' : ''}
                    </div>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Question Bank Section (remains the same) */}
          <TabsContent value="questionBank" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Filters */}
              <div className="md:col-span-1">
                <Card className="shadow-md bg-white dark:bg-gray-800/90 border-0 sticky top-24">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Filter className="h-5 w-5 text-indigo-500" />
                      Filter Questions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <QuestionFilters
                      topics={topics}
                      selectedTopics={selectedTopics}
                      setSelectedTopics={setSelectedTopics}
                      selectedDifficulty={selectedDifficulty}
                      setSelectedDifficulty={setSelectedDifficulty}
                      selectedRoles={selectedRoles}
                      setSelectedRoles={setSelectedRoles}
                      selectedCompanies={selectedCompanies}
                      setSelectedCompanies={setSelectedCompanies}
                      selectedFormat={selectedFormat}
                      setSelectedFormat={setSelectedFormat}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Question List */}
              <div className="md:col-span-3">
                <Card className="shadow-md bg-white dark:bg-gray-800/90 border-0">
                  <CardHeader className="border-b pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle>Practice Questions</CardTitle>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={questionViewMode === 'all' ? 'bg-muted' : ''}
                          onClick={() => setQuestionViewMode('all')}
                        >
                          All
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={questionViewMode === 'bookmarked' ? 'bg-muted' : ''}
                          onClick={() => setQuestionViewMode('bookmarked')}
                        >
                          <BookmarkIcon className="h-4 w-4 mr-1" />
                          Bookmarked
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={questionViewMode === 'recent' ? 'bg-muted' : ''}
                          onClick={() => setQuestionViewMode('recent')}
                        >
                          <Clock className="h-4 w-4 mr-1" />
                          Recent
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="py-6">
                    {currentQuestionsPage.length > 0 ? (
                      <div className="space-y-6">
                        {currentQuestionsPage.map(question => (
                          <QuestionCard
                            key={question.id}
                            question={question}
                            onToggleBookmark={toggleBookmark}
                            onMarkAttempted={markQuestionAttempted}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="bg-muted/50 rounded-lg p-8 text-center">
                        <Sparkles className="h-12 w-12 mx-auto mb-4 text-indigo-400" />
                        <h3 className="text-lg font-medium mb-2">No questions found</h3>
                        <p className="text-muted-foreground mb-4">
                          {questionViewMode === 'all' ? 'Try adjusting your filters to find more questions.' :
                            questionViewMode === 'bookmarked' ? 'No bookmarked questions yet. Start bookmarking!' :
                              'No recently attempted questions. Solve some questions to see them here.'}
                        </p>
                        {questionViewMode !== 'all' && (
                          <Button onClick={() => setQuestionViewMode('all')}>
                            Browse All Questions
                          </Button>
                        )}
                      </div>
                    )}

                    {/* Pagination */}
                    {currentQuestions.length > questionsPerPage && (
                      <div className="flex justify-center items-center mt-8">
                        <Button
                          variant="outline"
                          onClick={prevPage}
                          disabled={currentPage === 1}
                          className="mr-4 flex items-center gap-1"
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Previous
                        </Button>
                        <span className="text-sm text-muted-foreground">
                          Page {currentPage} of {totalPages}
                        </span>
                        <Button
                          variant="outline"
                          onClick={nextPage}
                          disabled={currentPage === totalPages}
                          className="ml-4 flex items-center gap-1"
                        >
                          Next
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
export default AptitudeQuestionBank;
