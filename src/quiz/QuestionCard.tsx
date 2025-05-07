import React from 'react';
import { CheckCircle } from 'lucide-react';
import { QuizQuestion } from '@/types/index';

interface QuestionCardProps {
  question: QuizQuestion;
  questionIndex: number;
  selectedAnswer: number;
  onSelectAnswer: (questionIndex: number, answerIndex: number) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionIndex,
  selectedAnswer,
  onSelectAnswer
}) => {
  return (
    <div className="bg-card border border-border rounded-xl p-6 md:p-8 transition-all duration-300">
      <h3 className="text-lg md:text-xl font-medium mb-6">{question.question}</h3>
      
      <div className="space-y-3">
        {question.options.map((option, optionIndex) => (
          <button
            key={optionIndex}
            onClick={() => onSelectAnswer(questionIndex, optionIndex)}
            className={`
              w-full text-left p-4 rounded-lg border transition-all duration-200 flex justify-between items-center
              ${selectedAnswer === optionIndex
                ? 'border-primary bg-primary/10 text-foreground'
                : 'border-border bg-card/60 hover:bg-muted/50 text-foreground'
              }
            `}
          >
            <span>{option}</span>
            {selectedAnswer === optionIndex && (
              <CheckCircle size={18} className="text-primary" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;