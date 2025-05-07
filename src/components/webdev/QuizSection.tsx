import React from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import MultipleChoiceQuiz from './quiz/MultipleChoiceQuiz';
import FlashCardQuiz from './quiz/FlashCardQuiz';
import PracticeProblems from './quiz/PracticeProblems';
import GenerativeMultipleChoice from './GenerativeMultipleChoice';
import GenerativeFlashCards from './GenerativeFlashCards';
import GenerativePractice from './GenerativePractice';
import { Brain, Lightbulb, Puzzle, Bot } from 'lucide-react'; // Corrected import: Robot -> Bot
import { cn } from '@/lib/utils';

const QuizSection: React.FC = () => {
  return (
    <div className="animate-fade-in">
      <Tabs defaultValue="multiple-choice" className="w-full rounded-xl shadow-lg overflow-hidden bg-gradient-to-br from-gray-900 to-zinc-800 text-gray-100 border border-zinc-700">
        <TabsList className="grid w-full grid-cols-3 bg-zinc-800/80 backdrop-blur-md border-b border-zinc-700">
          <TabsTrigger value="multiple-choice" className="text-lg py-4 flex items-center justify-center hover:bg-zinc-700/50 transition-colors duration-200">
            <Brain className="mr-2 h-5 w-5 text-blue-400" /> Multiple Choice
          </TabsTrigger>
          <TabsTrigger value="flashcards" className="text-lg py-4 flex items-center justify-center hover:bg-zinc-700/50 transition-colors duration-200">
            <Lightbulb className="mr-2 h-5 w-5 text-yellow-400" /> Flashcards
          </TabsTrigger>
          <TabsTrigger value="practice" className="text-lg py-4 flex items-center justify-center hover:bg-zinc-700/50 transition-colors duration-200">
            <Puzzle className="mr-2 h-5 w-5 text-purple-400" /> Practice Problems
          </TabsTrigger>
        </TabsList>

        {/* Multiple Choice Quiz */}
        <TabsContent value="multiple-choice" className="p-6">
          <Tabs defaultValue="predefined" className="mb-8 rounded-md overflow-hidden bg-zinc-800/50 backdrop-blur-md border border-zinc-700">
            <TabsList className="w-full border-b border-zinc-700 bg-zinc-700/80">
              <TabsTrigger value="predefined" className="w-1/2 py-3 text-blue-300 hover:bg-zinc-600/50 transition-colors duration-200 flex items-center justify-center">
                Predefined Questions
              </TabsTrigger>
              <TabsTrigger value="generative" className="w-1/2 py-3 text-blue-300 hover:bg-zinc-600/50 transition-colors duration-200 flex items-center justify-center">
                <Bot className="mr-2 h-4 w-4 text-blue-400" /> AI-Generated Questions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="predefined" className="p-6">
              <MultipleChoiceQuiz />
            </TabsContent>

            <TabsContent value="generative" className="p-6">
              <GenerativeMultipleChoice />
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* Flashcard Quiz */}
        <TabsContent value="flashcards" className="p-6">
          <Tabs defaultValue="predefined" className="mb-8 rounded-md overflow-hidden bg-zinc-800/50 backdrop-blur-md border border-zinc-700">
            <TabsList className="w-full border-b border-zinc-700 bg-zinc-700/80">
              <TabsTrigger value="predefined" className="w-1/2 py-3 text-yellow-300 hover:bg-zinc-600/50 transition-colors duration-200 flex items-center justify-center">
                Predefined Flashcards
              </TabsTrigger>
              <TabsTrigger value="generative" className="w-1/2 py-3 text-yellow-300 hover:bg-zinc-600/50 transition-colors duration-200 flex items-center justify-center">
                <Bot className="mr-2 h-4 w-4 text-yellow-400" /> AI-Generated Flashcards
              </TabsTrigger>
            </TabsList>

            <TabsContent value="predefined" className="p-6">
              <FlashCardQuiz />
            </TabsContent>

            <TabsContent value="generative" className="p-6">
              <GenerativeFlashCards />
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* Practice Problems */}
        <TabsContent value="practice" className="p-6">
          <Tabs defaultValue="predefined" className="mb-8 rounded-md overflow-hidden bg-zinc-800/50 backdrop-blur-md border border-zinc-700">
            <TabsList className="w-full border-b border-zinc-700 bg-zinc-700/80">
              <TabsTrigger value="predefined" className="w-1/2 py-3 text-purple-300 hover:bg-zinc-600/50 transition-colors duration-200 flex items-center justify-center">
                Predefined Problems
              </TabsTrigger>
              <TabsTrigger value="generative" className="w-1/2 py-3 text-purple-300 hover:bg-zinc-600/50 transition-colors duration-200 flex items-center justify-center">
                <Bot className="mr-2 h-4 w-4 text-purple-400" /> AI-Generated Problems
              </TabsTrigger>
            </TabsList>

            <TabsContent value="predefined" className="p-6">
              <PracticeProblems />
            </TabsContent>

            <TabsContent value="generative" className="p-6">
              <GenerativePractice />
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QuizSection;