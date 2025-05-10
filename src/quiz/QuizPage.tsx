import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, AlertCircle } from 'lucide-react';
import { QuizQuestion } from '@/types/index';
import QuestionCard from './QuestionCard';
import GeminiService from '@/services/GeminiService3';
import { jobRoles } from '@/data/jobRoles';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { DashboardNav } from '@/components/DashboardNav';

const QuizPage: React.FC = () => {
  const { roleId } = useParams<{ roleId: string }>();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  const selectedRole = jobRoles.find(role => role.id === roleId);
  const SECONDS_PER_QUESTION = 40; // 1 minute per question

  // Load quiz questions for the selected role
  useEffect(() => {
    const loadQuestions = async () => {
      if (!roleId) return;

      try {
        setLoading(true);
        const fetchedQuestions = await GeminiService.getQuizQuestions(roleId, 10);
        setQuestions(fetchedQuestions);

        // Initialize answers array with -1 (not answered)
        setAnswers(new Array(fetchedQuestions.length).fill(-1));

        // Set time limit based on number of questions
        const timeLimit = fetchedQuestions.length * SECONDS_PER_QUESTION;
        setTimeLeft(timeLimit);
        setTotalTime(timeLimit);
      } catch (error) {
        console.error('Error loading quiz questions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, [roleId]);

  // Timer countdown
  useEffect(() => {
    if (!quizStarted || quizFinished || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setQuizFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizStarted, quizFinished, timeLeft]);

  const startQuiz = () => {
    setQuizStarted(true);
  };

  const handleAnswer = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const submitQuiz = () => {
    setQuizFinished(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // When quiz is finished, navigate to results page
  useEffect(() => {
    if (quizFinished) {
      const timeTaken = totalTime - timeLeft;
      navigate(`/quiz-results/${roleId}`, {
        state: {
          questions,
          answers,
          timeTaken
        }
      });
    }
  }, [quizFinished, questions, answers, roleId, navigate, timeLeft, totalTime]);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <DashboardNav />
      <div className="max-w-4xl mx-auto mt-8">
        <button
          onClick={() => navigate(`/prep-options/${roleId}`)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          Back to Preparation Options
        </button>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {selectedRole?.name} Mini Quiz
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Test your knowledge with this timed mini quiz. Answer all questions before the time runs out.
          </p>
        </div>

        {loading ? (
          <div className="w-full h-64 rounded-xl border border-border bg-card flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-muted-foreground">Loading quiz questions...</p>
            </div>
          </div>
        ) : !quizStarted ? (
          <div className="bg-card border border-border rounded-xl p-8 text-center">
            <h2 className="text-xl font-medium mb-4">Ready to start the quiz?</h2>
            <p className="text-muted-foreground mb-6">
              You'll have {formatTime(totalTime)} to answer {questions.length} questions about {selectedRole?.name} topics.
            </p>
            <button
              onClick={startQuiz}
              className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
            >
              Start Quiz
            </button>
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="bg-card border border-border rounded-xl mb-6 p-4 sticky top-20 z-10">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Question {currentQuestionIndex + 1} of {questions.length}</span>
                  <div className="w-full max-w-xs bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className={`flex items-center gap-2 ${timeLeft < 60 ? 'text-destructive animate-pulse' : ''}`}>
                  <Clock size={16} />
                  <span className="font-mono">{formatTime(timeLeft)}</span>
                </div>
              </div>

              <div className="flex mt-4 gap-2 flex-wrap">
                {questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestionIndex(index)}
                    className={`
                    w-8 h-8 rounded-full text-sm flex items-center justify-center
                    ${currentQuestionIndex === index
                        ? 'bg-primary text-primary-foreground'
                        : answers[index] >= 0
                          ? 'bg-secondary text-secondary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }
                  `}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>

            {questions.map((question, index) => (
              <div key={question.id} className={index === currentQuestionIndex ? 'block' : 'hidden'}>
                <QuestionCard
                  question={question}
                  questionIndex={index}
                  selectedAnswer={answers[index]}
                  onSelectAnswer={handleAnswer}
                />
              </div>
            ))}

            <div className="flex justify-between mt-8">
              <button
                onClick={prevQuestion}
                disabled={currentQuestionIndex === 0}
                className="px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>

              {currentQuestionIndex === questions.length - 1 ? (
                <button
                  onClick={submitQuiz}
                  className="px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Submit Quiz
                </button>
              ) : (
                <button
                  onClick={nextQuestion}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Next
                </button>
              )}
            </div>

            {answers.includes(-1) && (
              <div className="mt-6 p-4 bg-accent/10 border border-accent rounded-lg flex items-center gap-3">
                <AlertCircle size={20} className="text-accent" />
                <p className="text-sm">
                  You have {answers.filter(a => a === -1).length} unanswered questions. Make sure to answer all questions before submitting.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      </div>
    </>
  );
};

export default QuizPage;