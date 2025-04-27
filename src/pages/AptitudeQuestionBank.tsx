
import React, { useState } from 'react';
import { DashboardNav } from '@/components/DashboardNav';
import { useAptitude } from '@/hooks/useAptitude';
import AptitudeFilters from '@/components/aptitude/AptitudeFilters';
import FormulaCarousel from '@/components/aptitude/FormulaCarousel';
import QuestionCard from '@/components/aptitude/QuestionCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Calculator, Book, BookmarkIcon, History, ChevronLeft, ChevronRight, 
  Bookmark, Clock, Filter, Sparkles
} from 'lucide-react';

const AptitudeQuestionBank = () => {
  const {
    formulas,
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

  const [selectedFormulasTopic, setSelectedFormulasTopic] = useState(topics[0]?.id || '');
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'bookmarked', 'recent'
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 5;
  
  const bookmarkedQuestions = getBookmarkedQuestions();
  const recentlyAttemptedQuestions = getRecentlyAttemptedQuestions();
  
  let currentQuestions = [];
  
  switch (activeTab) {
    case 'bookmarked':
      currentQuestions = bookmarkedQuestions;
      break;
    case 'recent':
      currentQuestions = recentlyAttemptedQuestions;
      break;
    default:
      currentQuestions = filteredQuestions;
  }
  
  // Logic for pagination
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-slate-900">
      <DashboardNav />
      
      <div className="container max-w-5xl mx-auto px-4 pt-20 pb-16">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Aptitude Question Bank
          </h1>
          <p className="text-muted-foreground mt-2">
            Master aptitude skills with targeted practice questions and formulas
          </p>
        </div>
        
        {/* Formulas Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center">
              <Calculator className="h-5 w-5 mr-2 text-purple-500" />
              Formula Cards
            </h2>
          </div>
          
          <FormulaCarousel 
            formulas={formulas}
            topics={topics}
            selectedTopic={selectedFormulasTopic}
            onSelectTopic={setSelectedFormulasTopic}
          />
        </div>
        
        {/* Aptitude Questions Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center">
              <Book className="h-5 w-5 mr-2 text-indigo-500" />
              Practice Questions
            </h2>
          </div>
          
          {/* Questions Tabs */}
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="all" className="flex items-center gap-1">
                  <Filter className="h-4 w-4" />
                  <span>All Questions</span>
                </TabsTrigger>
                <TabsTrigger value="bookmarked" className="flex items-center gap-1">
                  <BookmarkIcon className="h-4 w-4" />
                  <span>Bookmarked</span>
                  {bookmarkedQuestions.length > 0 && (
                    <span className="ml-1 text-xs bg-primary/20 rounded-full px-1.5 py-0.5">
                      {bookmarkedQuestions.length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="recent" className="flex items-center gap-1">
                  <History className="h-4 w-4" />
                  <span>Recently Attempted</span>
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="all" className="mt-4 space-y-6">
              <AptitudeFilters 
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
              
              {currentQuestionsPage.length > 0 ? (
                <div className="grid gap-6">
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
                <div className="bg-white dark:bg-slate-800 rounded-lg p-8 text-center">
                  <Sparkles className="h-12 w-12 mx-auto mb-4 text-indigo-400" />
                  <h3 className="text-lg font-medium mb-2">No questions found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your filters to find more questions
                  </p>
                  <Button onClick={() => {
                    setSelectedTopics([]);
                    setSelectedDifficulty('');
                    setSelectedRoles([]);
                    setSelectedCompanies([]);
                    setSelectedFormat('');
                  }}>
                    Clear All Filters
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="bookmarked" className="mt-4">
              {bookmarkedQuestions.length > 0 ? (
                <div className="grid gap-6">
                  {bookmarkedQuestions
                    .slice(indexOfFirstQuestion, indexOfLastQuestion)
                    .map(question => (
                    <QuestionCard 
                      key={question.id}
                      question={question}
                      onToggleBookmark={toggleBookmark}
                      onMarkAttempted={markQuestionAttempted}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-800 rounded-lg p-8 text-center">
                  <Bookmark className="h-12 w-12 mx-auto mb-4 text-indigo-400" />
                  <h3 className="text-lg font-medium mb-2">No bookmarked questions yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Bookmark important questions to revisit them later
                  </p>
                  <Button onClick={() => setActiveTab('all')}>
                    Browse Questions
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="recent" className="mt-4">
              {recentlyAttemptedQuestions.length > 0 ? (
                <div className="grid gap-6">
                  {recentlyAttemptedQuestions
                    .slice(indexOfFirstQuestion, indexOfLastQuestion)
                    .map(question => (
                    <QuestionCard 
                      key={question.id}
                      question={question}
                      onToggleBookmark={toggleBookmark}
                      onMarkAttempted={markQuestionAttempted}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-800 rounded-lg p-8 text-center">
                  <Clock className="h-12 w-12 mx-auto mb-4 text-indigo-400" />
                  <h3 className="text-lg font-medium mb-2">No recently attempted questions</h3>
                  <p className="text-muted-foreground mb-4">
                    Your recently attempted questions will appear here
                  </p>
                  <Button onClick={() => setActiveTab('all')}>
                    Start Practicing
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
          
          {/* Pagination */}
          {currentQuestions.length > questionsPerPage && (
            <div className="flex justify-between items-center mt-8">
              <Button
                variant="outline"
                onClick={prevPage}
                disabled={currentPage === 1}
                className="flex items-center gap-1"
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
                className="flex items-center gap-1"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AptitudeQuestionBank;
