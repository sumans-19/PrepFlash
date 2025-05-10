import React, { useState } from 'react';
import { Brain, Lightbulb, Gamepad2, User, BookOpen, BarChart4 } from 'lucide-react';
import { FlashcardSection } from './FlashcardSection';
import { GameSection } from './GameSection';
import { ScenarioSection } from './ScenarioSection';
import { VaultSection } from './VaultSection';
import { ProgressSection } from './ProgressSection';
import './styles.css';

export const BehavioralMasteryHub: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('flashcards');
  
  const renderSection = () => {
    switch (activeSection) {
      case 'flashcards':
        return <FlashcardSection />;
      case 'game':
        return <GameSection />;
      case 'scenarios':
        return <ScenarioSection />;
      case 'vault':
        return <VaultSection />;
      case 'progress':
        return <ProgressSection />;
      default:
        return <FlashcardSection />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight glow-text">
          Behavioral Mastery Hub
        </h1>
        <p className="max-w-3xl mx-auto text-lg text-indigo-200">
          Master the art of behavioral intelligence through immersive learning experiences, 
          AI-powered insights, and gamified practice modules.
        </p>
      </header>

      <nav className="nav-pills mb-12 flex justify-center flex-wrap gap-2 sm:gap-4">
        <button 
          onClick={() => setActiveSection('flashcards')} 
          className={`nav-pill ${activeSection === 'flashcards' ? 'active' : ''}`}
        >
          <Brain className="w-5 h-5 mr-2" />
          <span>Situational Flashcards</span>
        </button>
        <button 
          onClick={() => setActiveSection('game')} 
          className={`nav-pill ${activeSection === 'game' ? 'active' : ''}`}
        >
          <Gamepad2 className="w-5 h-5 mr-2" />
          <span>Skill Games</span>
        </button>
        <button 
          onClick={() => setActiveSection('scenarios')} 
          className={`nav-pill ${activeSection === 'scenarios' ? 'active' : ''}`}
        >
          <Lightbulb className="w-5 h-5 mr-2" />
          <span>Interactive Scenarios</span>
        </button>
        <button 
          onClick={() => setActiveSection('vault')} 
          className={`nav-pill ${activeSection === 'vault' ? 'active' : ''}`}
        >
          <BookOpen className="w-5 h-5 mr-2" />
          <span>Examples Vault</span>
        </button>
        <button 
          onClick={() => setActiveSection('progress')} 
          className={`nav-pill ${activeSection === 'progress' ? 'active' : ''}`}
        >
          <BarChart4 className="w-5 h-5 mr-2" />
          <span>My Progress</span>
        </button>
      </nav>

      <div className="section-container">
        {renderSection()}
      </div>
    </div>
  );
};