import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardNav } from '@/components/DashboardNav'; // Assuming you have this
import { BrainCircuit, Lightbulb, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const HomePage = () => {
  const navigate = useNavigate();

  const navigateToBrushUp = () => {
    navigate('/aptitude-brush-up'); // Adjust path as needed
  };

  const navigateToQuestionBank = () => {
    navigate('/aptitude-questions'); // Adjust path as needed
  };

  // Color Palette (based on the earlier dashboard code)
  const primary = '#7C3AED'; // Purple-like primary
  const background = '#F3F4F6'; // Light background
  const backgroundDark = '#1E293B';
  const muted = '#9CA3AF'; // Gray-like muted
  const mutedDark = '#4B5563';
  const tealAccent = '#6EE7B7';
  const yellowAccent = '#FBBF24';

  const cardBgLight = 'bg-white/50 backdrop-blur-sm shadow-md';
  const cardBgDark = 'dark:bg-zinc-800/80 backdrop-blur-md shadow-md';
  const textPrimaryLight = 'text-gray-900';
  const textPrimaryDark = 'dark:text-gray-100';
  const textSecondaryLight = 'text-gray-700';
  const textSecondaryDark = 'dark:text-gray-300';

  const stickVariants = {
    initial: { scaleY: 0.8, opacity: 0.5, y: -5 },
    animate: { scaleY: 1, opacity: 1, y: 0, transition: { type: 'spring', stiffness: 50, damping: 7, duration: 0.6, delay: 0.2 } },
    hover: { scaleY: 1.1, opacity: 1, y: -2, transition: { duration: 0.2 } },
  };

  const cardMotionProps = {
    initial: { opacity: 0, scale: 0.9, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    whileHover: { scale: 1.03, boxShadow: `0 6px 15px rgba(0, 0, 0, 0.15)` },
    transition: { duration: 0.3, ease: "easeInOut" },
  };

  const buttonMotionProps = {
    whileHover: { scale: 1.05 },
    transition: { type: 'spring', stiffness: 150, damping: 10 },
  };

  return (
    <div className={`min-h-screen ${background} dark:bg-gray-900 flex flex-col items-center justify-center`}>
      <DashboardNav /> {/* Assuming this has fixed positioning or doesn't interfere with centering */}
      <div className="relative w-full max-w-5xl px-4 flex flex-col items-center gap-12">
        {/* Concise Aptitude Question Bank Teaser */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
          className="text-center w-full md:w-3/4"
        >
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
            Aptitude Mastery Awaits
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Sharpen your skills with our comprehensive question bank. Practice topic-specific questions and track your progress.
          </p>
        </motion.div>

        <div className="relative w-full max-w-5xl px-4 flex gap-8 md:gap-16">
          {/* Left Stick Animation */}
          <motion.div
            className="hidden md:block absolute left-4 top-1/2 -translate-y-1/2 w-1 h-16 bg-teal-400 rounded-full cursor-pointer"
            variants={stickVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
          />

          <div className="flex flex-col md:flex-row items-center justify-center gap-8 w-full">
            {/* Flashcards for Brush Up Card */}
            <motion.div
              className={`relative w-full max-w-md rounded-xl overflow-hidden border-2 ${cardBgLight} ${cardBgDark}`}
              onClick={navigateToBrushUp}
              {...cardMotionProps}
            >
              <div className="absolute inset-0 opacity-10" style={{ background: `linear-gradient(135deg, ${tealAccent}40 0%, transparent 100%)` }}></div>
              <div className="p-8 flex flex-col items-center justify-center text-center relative z-10 h-80 md:h-96"> {/* Adjusted height */}
                <motion.div className="w-16 h-16 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center mb-6"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                >
                  <Lightbulb className={`w-8 h-8 text-teal-500 dark:text-teal-300`} />
                </motion.div>
                <h2 className={`text-xl font-semibold ${textPrimaryLight} ${textPrimaryDark} mb-3`}>
                  Interactive Flashcards
                </h2>
                <p className={`text-sm ${textSecondaryLight} ${textSecondaryDark} mb-4 md:mb-6`}>
                  Quickly review key aptitude concepts and formulas.
                </p>
                <motion.button
                  className={`bg-${tealAccent} hover:bg-${tealAccent}CC text-white py-3 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 shadow-md ${buttonMotionProps.whileHover} ${buttonMotionProps.transition}`}
                  onClick={navigateToBrushUp}
                  style={{ background: tealAccent }}
                >
                  <Sparkles className="w-5 h-5 mr-2 inline-block" /> Brush Up Now
                </motion.button>
              </div>
              <div className={`absolute inset-0 border-2 border-teal-300 dark:border-teal-700 rounded-xl pointer-events-none transition-opacity duration-300 opacity-0 hover:opacity-100`}></div>
            </motion.div>

            {/* Question Preparation Card */}
            <motion.div
              className={`relative w-full max-w-md rounded-xl overflow-hidden border-2 ${cardBgLight} ${cardBgDark}`}
              onClick={navigateToQuestionBank}
              {...cardMotionProps}
            >
              <div className="absolute inset-0 opacity-10" style={{ background: `linear-gradient(135deg, ${yellowAccent}40 0%, transparent 100%)` }}></div>
              <div className="p-8 flex flex-col items-center justify-center text-center relative z-10 h-80 md:h-96"> {/* Adjusted height */}
                <motion.div className="w-16 h-16 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center mb-6"
                  animate={{ rotate: [-360, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                >
                  <BrainCircuit className={`w-8 h-8 text-yellow-500 dark:text-yellow-300`} />
                </motion.div>
                <h2 className={`text-xl font-semibold ${textPrimaryLight} ${textPrimaryDark} mb-3`}>
                  AI-Powered Question Bank
                </h2>
                <p className={`text-sm ${textSecondaryLight} ${textSecondaryDark} mb-4 md:mb-6`}>
                  Practice with AI-generated questions and track your progress.
                </p>
                <motion.button
                  className={`bg-${yellowAccent} hover:bg-${yellowAccent}CC text-white py-3 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-md ${buttonMotionProps.whileHover} ${buttonMotionProps.transition}`}
                  onClick={navigateToQuestionBank}
                  style={{ background: yellowAccent }}
                >
                  Explore Questions <ArrowRight className="w-5 h-5 ml-2 inline-block" />
                </motion.button>
              </div>
              <div className={`absolute inset-0 border-2 border-yellow-300 dark:border-yellow-700 rounded-xl pointer-events-none transition-opacity duration-300 opacity-0 hover:opacity-100`}></div>
            </motion.div>
          </div>

          {/* Right Stick Animation */}
          <motion.div
            className="hidden md:block absolute right-4 top-1/2 -translate-y-1/2 w-1 h-16 bg-yellow-400 rounded-full cursor-pointer"
            variants={stickVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;