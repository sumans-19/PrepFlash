
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import FlashCard from './FlashCard';
import { generateFlashcards, GeminiFlashCard } from '@/services/GeminiService2';

const GenerativeFlashCards: React.FC = () => {
  const [difficulty, setDifficulty] = useState<string>("medium");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [flashcards, setFlashcards] = useState<GeminiFlashCard[]>([]);
  const [currentCard, setCurrentCard] = useState(0);
  const [topic, setTopic] = useState<string>("web development");

  const { toast } = useToast();

  const generateCards = async () => {
    setIsLoading(true);
    try {
      const generatedFlashcards = await generateFlashcards(topic, difficulty, 10);
      
      setFlashcards(generatedFlashcards);
      setCurrentCard(0);
      
    } catch (error) {
      console.error('Error generating flashcards:', error);
      toast({
        variant: "destructive",
        title: "Error generating flashcards",
        description: "Please try again or check your API key.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const navigate = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      setCurrentCard((prev) => (prev + 1) % flashcards.length);
    } else {
      setCurrentCard((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    }
  };

  return (
    <div className="space-y-6">
      {flashcards.length === 0 ? (
        <Card className="glassmorphism">
          <CardHeader>
            <CardTitle>Generate AI Flashcards</CardTitle>
            <CardDescription>
              Choose a topic and difficulty level to generate custom flashcards
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="flashcard-topic">Topic</Label>
                <input
                  id="flashcard-topic"
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Enter a topic (e.g., JavaScript, React, HTML)"
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="flashcard-difficulty">Difficulty</Label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger id="flashcard-difficulty" className="w-full">
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
  onClick={generateCards} 
  className="w-full bg-purple-300 text-purple-900 hover:bg-purple-400 disabled:opacity-50 disabled:cursor-not-allowed" 
  disabled={isLoading}
>
  {isLoading ? "Generating Flashcards..." : "Generate Flashcards"}
</Button>

          </CardContent>
        </Card>
      ) : (
        <Card className="glassmorphism">
          <CardContent className="p-6">
            <div className="mb-6">
              <Progress value={((currentCard + 1) / flashcards.length) * 100} className="mb-2" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Card {currentCard + 1} of {flashcards.length}</span>
                <span className="capitalize">{difficulty} Difficulty</span>
              </div>
            </div>
            
            <FlashCard 
              question={flashcards[currentCard].question}
              answer={flashcards[currentCard].answer}
              explanation={flashcards[currentCard].explanation}
            />
            
            <div className="flex justify-between items-center mt-6">
              <Button 
                onClick={() => navigate('prev')}
                variant="outline"
                className="px-6"
              >
                <ChevronLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              
              <div className="flex items-center">
                <div className="flex gap-1">
                  {flashcards.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentCard(index)}
                      className={`
                        w-2.5 h-2.5 rounded-full
                        ${currentCard === index ? 'bg-primary' : 'bg-secondary hover:bg-secondary/80'}
                      `}
                    />
                  ))}
                </div>
              </div>
              
              <Button 
  onClick={() => navigate('next')}
  className="px-6 bg-purple-300 text-purple-900 hover:bg-purple-400"
>
  Next <ChevronRight className="ml-2 h-4 w-4" />
</Button>

            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GenerativeFlashCards;