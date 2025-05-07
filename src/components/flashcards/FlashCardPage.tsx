import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, X } from 'lucide-react';
import { FlashCard as FlashCardType } from '../../types';
import FlashCard from './FlashCard';
import AIChat from './AIChat';
import GeminiService from '../../services/GeminiService';
import { jobRoles } from '../../data/jobRoles';
import { ThemeToggle } from '../ui/theme-toggle';

const FlashCardPage: React.FC = () => {
    const { roleId } = useParams<{ roleId: string }>();
    const navigate = useNavigate();
    const [cards, setCards] = useState<FlashCardType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [touchStartY, setTouchStartY] = useState<number | null>(null);
    const [touchEndY, setTouchEndY] = useState<number | null>(null);
    const cardContainerRef = useRef<HTMLDivElement>(null);

    const selectedRole = jobRoles.find(role => role.id === roleId);

    useEffect(() => {
        const loadCards = async () => {
            if (!roleId) return;

            try {
                setLoading(true);
                setError(null);
                const fetchedCards = await GeminiService.getFlashCards(roleId, 10);
                setCards(fetchedCards);
            } catch (error) {
                console.error('Error loading flash cards:', error);
                setError(
                    error instanceof Error
                        ? error.message
                        : 'Failed to load flash cards. Please check your internet connection and try again.'
                );
            } finally {
                setLoading(false);
            }
        };

        loadCards();
    }, [roleId]);

    const nextCard = () => {
        if (currentCardIndex < cards.length - 1) {
            setCurrentCardIndex(prev => prev + 1);
        }
    };

    const prevCard = () => {
        if (currentCardIndex > 0) {
            setCurrentCardIndex(prev => prev - 1);
        }
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStartY(e.targetTouches[0].clientY);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEndY(e.targetTouches[0].clientY);
    };

    const handleTouchEnd = () => {
        if (!touchStartY || !touchEndY) return;

        const distance = touchStartY - touchEndY;
        const minSwipeDistance = 50;

        if (Math.abs(distance) < minSwipeDistance) return;

        if (distance > 0) {
            // Swipe up for next card
            nextCard();
        } else {
            // Swipe down for previous card
            prevCard();
        }

        setTouchStartY(null);
        setTouchEndY(null);
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                e.preventDefault();

                if (e.key === 'ArrowUp') {
                    // Up arrow for next card
                    nextCard();
                } else {
                    // Down arrow for previous card
                    prevCard();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentCardIndex, cards.length]);

    const handleRetry = async () => {
        setLoading(true);
        setError(null);
        try {
            const fetchedCards = await GeminiService.getFlashCards(roleId || '', 10);
            setCards(fetchedCards);
        } catch (error) {
            console.error('Error retrying flash cards:', error);
            setError(
                error instanceof Error
                    ? error.message
                    : 'Failed to load flash cards. Please check your internet connection and try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    const progress = cards.length ? ((currentCardIndex + 1) / cards.length) * 100 : 0;

    return (
        <>
            <header className="sticky top-0 z-10 bg-card/80 backdrop-blur-sm border-b border-border">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    {/* Logo + Brand Name */}
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            Prep<span className="font-black">Toolkit</span>
                        </h1>
                    </div>
                    <ThemeToggle></ThemeToggle>
                </div>
            </header>
            <div className="min-h-screen flex flex-col mt-8">
                <div className="flex-1 max-w-6xl mx-auto w-full px-4 pb-24">
                    <button
                        onClick={() => navigate(`/prep-options/${roleId}`)}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
                    >
                        <ArrowLeft size={16} />
                        Back to Preparation Options
                    </button>

                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            {selectedRole?.name} Flash Cards
                        </h1>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Use up/down arrow keys or swipe to navigate between cards.
                        </p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Main content - Flash Cards */}
                        <div className="flex-1">
                            {loading ? (
                                <div className="w-full h-64 rounded-xl border border-border bg-card flex items-center justify-center">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                        <p className="text-muted-foreground">Loading flash cards...</p>
                                    </div>
                                </div>
                            ) : error ? (
                                <div className="w-full p-6 rounded-xl border border-destructive/20 bg-destructive/10 text-destructive">
                                    <p className="font-medium mb-2">Error</p>
                                    <p>{error}</p>
                                    <button
                                        onClick={handleRetry}
                                        className="mt-4 px-4 py-2 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
                                    >
                                        Try Again
                                    </button>
                                </div>
                            ) : cards.length > 0 ? (
                                <div className="relative">
                                    {/* Progress bar */}
                                    <div className="mb-6 sticky top-20 z-10 bg-background/80 backdrop-blur-sm p-4 rounded-lg">
                                        <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary transition-all duration-300 ease-out"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                        <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                                            <span>Card {currentCardIndex + 1} of {cards.length}</span>
                                            <span>{Math.round(progress)}% Complete</span>
                                        </div>
                                    </div>

                                    {/* Cards container */}
                                    <div
                                        ref={cardContainerRef}
                                        className="relative min-h-[400px]"
                                        onTouchStart={handleTouchStart}
                                        onTouchMove={handleTouchMove}
                                        onTouchEnd={handleTouchEnd}
                                    >
                                        {cards.map((card, index) => (
                                            <div
                                                key={card.id}
                                                className={`
                                                    absolute top-0 left-0 w-full transition-all duration-300
                                                    ${index === currentCardIndex
                                                        ? 'opacity-100 translate-y-0 pointer-events-auto'
                                                        : 'opacity-0 translate-y-8 pointer-events-none'
                                                    }
                                                `}
                                            >
                                                <FlashCard
                                                    card={card}
                                                    isActive={index === currentCardIndex}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full h-64 rounded-xl border border-border bg-card flex items-center justify-center">
                                    <p className="text-muted-foreground">No flash cards available for this role.</p>
                                </div>
                            )}
                        </div>

                        {/* AI Chat Panel - Always visible on desktop */}
                        <div className="hidden lg:block w-[400px] h-[600px] bg-background border border-border rounded-lg overflow-hidden sticky top-28">
                            <div className="h-full">
                                
                                <div className="h-[calc(100%)]">
                                    <AIChat jobRoleId={roleId || ''} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile AI Chat Panel */}
                <div className="lg:hidden fixed bottom-0 left-0 right-0 z-20 bg-background border-t border-border rounded-t-xl shadow-lg">
                    <div className="p-3 border-b border-border">
                        <h2 className="font-semibold flex items-center justify-center gap-2">
                            <MessageSquare size={18} />
                            AI Assistant
                        </h2>
                    </div>
                    <div className="h-[400px]">
                        <AIChat jobRoleId={roleId || ''} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default FlashCardPage;