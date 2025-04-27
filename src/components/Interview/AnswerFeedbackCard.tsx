import React from 'react';
import { ChevronDown, ChevronUp, CheckCircle, XCircle, Clock, MessageSquare } from 'lucide-react';

interface AnswerFeedbackCardProps {
  question: string;
  answer: string;
  feedback: {
    clarity: number;
    relevance: number;
    completeness: number;
    fillerWordsCount: number;
    fillerWords: string[];
    confidenceLevel: number;
    suggestions: string[];
    overallScore: number;
    responseTime?: number;
    responseTimeScore?: number;
  };
  questionNumber: number;
}

const AnswerFeedbackCard: React.FC<AnswerFeedbackCardProps> = ({
  question,
  answer,
  feedback,
  questionNumber
}) => {
  const [expanded, setExpanded] = React.useState(false);
  
  const scoreColor = (score: number) => {
    if (score >= 8) return "text-green-600 dark:text-green-400";
    if (score >= 5) return "text-amber-600 dark:text-amber-400";
    return "text-red-600 dark:text-red-400";
  };
  
  const scoreText = (score: number) => {
    if (score >= 8) return "Excellent";
    if (score >= 6) return "Good";
    if (score >= 4) return "Average";
    return "Needs Improvement";
  };
  
  const renderScoreMeter = (label: string, score: number) => (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{label}</span>
        <span className={`text-xs font-semibold ${scoreColor(score)}`}>{score}/10</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
        <div 
          className={`h-1.5 rounded-full ${
            score >= 8 ? "bg-green-500" : 
            score >= 5 ? "bg-amber-500" : 
            "bg-red-500"
          }`}
          style={{ width: `${score * 10}%` }}
        ></div>
      </div>
    </div>
  );
  
  return (
    <div className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden mb-4 transition-all duration-300">
      {/* Header */}
      <div 
        className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750"
        onClick={() => setExpanded(!expanded)}
      >
        <div>
          <div className="flex items-center">
            <span className="font-medium text-gray-800 dark:text-gray-200 mr-2">
              Question {questionNumber}
            </span>
            <span className={`text-sm font-semibold rounded-full px-2 py-0.5 ${
              feedback.overallScore >= 8 ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" : 
              feedback.overallScore >= 5 ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300" : 
              "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
            }`}>
              {scoreText(feedback.overallScore)} ({feedback.overallScore}/10)
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">
            {question}
          </p>
        </div>
        <div>
          {expanded ? 
            <ChevronUp className="text-gray-500 dark:text-gray-400" /> : 
            <ChevronDown className="text-gray-500 dark:text-gray-400" />
          }
        </div>
      </div>
      
      {/* Expanded Content */}
      {expanded && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          {/* Question & Answer */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Question</h4>
            <p className="text-gray-800 dark:text-gray-200 mb-4">{question}</p>
            
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Your Answer</h4>
            <p className="text-gray-700 dark:text-gray-300 p-3 bg-gray-50 dark:bg-gray-900/50 rounded border border-gray-200 dark:border-gray-700">
              {answer}
            </p>
          </div>
          
          {/* Performance Metrics */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Performance Metrics</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {renderScoreMeter("Clarity", feedback.clarity)}
              {renderScoreMeter("Relevance", feedback.relevance)}
              {renderScoreMeter("Completeness", feedback.completeness)}
              {renderScoreMeter("Confidence", feedback.confidenceLevel)}
              {feedback.responseTimeScore !== undefined && 
                renderScoreMeter("Response Time", feedback.responseTimeScore)}
            </div>
          </div>
          
          {/* Speech Analysis */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Speech Analysis</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Filler Words */}
              <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded border border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-2">
                  <MessageSquare className="w-4 h-4 text-blue-500 mr-2" />
                  <h5 className="text-sm font-medium">Filler Words</h5>
                </div>
                
                {feedback.fillerWords.length > 0 ? (
                  <>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      You used {feedback.fillerWordsCount} filler words:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {feedback.fillerWords.map((word, index) => (
                        <span key={index} className="text-xs bg-gray-200 dark:bg-gray-800 px-2 py-0.5 rounded">
                          {word}
                        </span>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Great job! You didn't use any filler words.
                  </p>
                )}
              </div>
              
              {/* Response Time */}
              <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded border border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-2">
                  <Clock className="w-4 h-4 text-blue-500 mr-2" />
                  <h5 className="text-sm font-medium">Response Time</h5>
                </div>
                
                {feedback.responseTime !== undefined ? (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    You took {feedback.responseTime.toFixed(1)} seconds to respond.
                    {feedback.responseTimeScore !== undefined && (
                      <span className={`ml-1 font-medium ${scoreColor(feedback.responseTimeScore)}`}>
                        ({feedback.responseTimeScore >= 7 ? "Good" : 
                          feedback.responseTimeScore >= 5 ? "Acceptable" : 
                          "Needs improvement"})
                      </span>
                    )}
                  </p>
                ) : (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Response time not available for this answer.
                  </p>
                )}
              </div>
            </div>
          </div>
          
          {/* Suggestions */}
          <div>
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Areas for Improvement</h4>
            
            <ul className="space-y-2">
              {feedback.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start">
                  <XCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnswerFeedbackCard;