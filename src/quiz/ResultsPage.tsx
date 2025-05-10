import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, BarChart, Brain, Zap } from 'lucide-react';
import { QuizQuestion, QuizResult } from '@/types/index';
import GeminiService from '@/services/GeminiService3';
import { jobRoles } from '@/data/jobRoles';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { DashboardNav } from '@/components/DashboardNav';

const ResultsPage: React.FC = () => {
    const { roleId } = useParams<{ roleId: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [results, setResults] = useState<QuizResult | null>(null);

    const state = location.state as {
        questions: QuizQuestion[];
        answers: number[];
        timeTaken: number;
    } | undefined;

    const selectedRole = jobRoles.find(role => role.id === roleId);

    useEffect(() => {
        // If navigation state is missing, redirect back to quiz page
        if (!state) {
            navigate(`/quiz/${roleId}`);
            return;
        }

        const analyzeResults = async () => {
            try {
                setLoading(true);
                const { questions, answers, timeTaken } = state;
                const analysisResults = await GeminiService.analyzeQuizResults(
                    roleId || '',
                    questions,
                    answers,
                    timeTaken
                );
                setResults(analysisResults);
            } catch (error) {
                console.error('Error analyzing results:', error);
            } finally {
                setLoading(false);
            }
        };

        analyzeResults();
    }, [state, roleId, navigate]);

    // Format time from seconds to mm:ss
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    // Calculate score percentage
    const calculateScore = () => {
        if (!results) return 0;
        return Math.round((results.correctAnswers / results.totalQuestions) * 100);
    };

    // Get score color based on percentage
    const getScoreColor = () => {
        const score = calculateScore();
        if (score >= 80) return 'text-green-500';
        if (score >= 60) return 'text-yellow-500';
        return 'text-red-500';
    };

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
                        Your Quiz Results
                    </h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Here's how you performed in the {selectedRole?.name} mini quiz.
                    </p>
                </div>

                {loading ? (
                    <div className="w-full h-64 rounded-xl border border-border bg-card flex items-center justify-center">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-muted-foreground">Analyzing your results...</p>
                        </div>
                    </div>
                ) : results ? (
                    <div className="space-y-8">
                        {/* Score overview card */}
                        <div className="bg-card border border-border rounded-xl p-6 md:p-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="flex flex-col items-center justify-center p-6 bg-muted/50 rounded-lg">
                                    <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                        {calculateScore()}%
                                    </div>
                                    <div className="text-muted-foreground text-sm">Overall Score</div>
                                </div>

                                <div className="flex flex-col items-center justify-center p-6 bg-muted/50 rounded-lg">
                                    <div className="flex items-center gap-2 text-xl font-bold mb-2">
                                        <CheckCircle size={20} className="text-green-500" />
                                        <span>{results.correctAnswers}/{results.totalQuestions}</span>
                                    </div>
                                    <div className="text-muted-foreground text-sm">Correct Answers</div>
                                </div>

                                <div className="flex flex-col items-center justify-center p-6 bg-muted/50 rounded-lg">
                                    <div className="text-xl font-bold mb-2">
                                        {formatTime(results.timeTaken)}
                                    </div>
                                    <div className="text-muted-foreground text-sm">Time Taken</div>
                                </div>
                            </div>
                        </div>

                        {/* Weak areas card */}
                        <div className="bg-card border border-border rounded-xl p-6 md:p-8">
                            <h2 className="text-xl font-medium mb-6 flex items-center gap-2">
                                <Brain size={20} className="text-accent" />
                                Areas for Improvement
                            </h2>

                            <div className="space-y-4">
                                {results.weakAreas.map((area, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                                            <span className="text-sm text-accent">{index + 1}</span>
                                        </div>
                                        <div className="text-foreground">{area}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Suggestions card */}
                        <div className="bg-card border border-border rounded-xl p-6 md:p-8">
                            <h2 className="text-xl font-medium mb-6 flex items-center gap-2">
                                <Zap size={20} className="text-secondary" />
                                Improvement Suggestions
                            </h2>

                            <div className="space-y-4">
                                {results.suggestions.map((suggestion, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                                            <span className="text-sm text-secondary">{index + 1}</span>
                                        </div>
                                        <div className="text-foreground">{suggestion}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => navigate(`/quiz/${roleId}`)}
                                className="px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                            >
                                Retake Quiz
                            </button>

                            <button
                                onClick={() => navigate(`/flash-cards/${roleId}`)}
                                className="px-6 py-3 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors"
                            >
                                Study Flash Cards
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-card border border-border rounded-xl p-8 text-center">
                        <p className="text-muted-foreground">No results available. Please take the quiz first.</p>
                        <button
                            onClick={() => navigate(`/quiz/${roleId}`)}
                            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md"
                        >
                            Take Quiz
                        </button>
                    </div>
                )}
            </div>
            </div>
        </>
    );
};

export default ResultsPage;