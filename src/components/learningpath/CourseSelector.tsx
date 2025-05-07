// components/learningpath/CourseSelector.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CourseSelectorProps {
  paths: string[];
  onSelect: (path: string) => void;
}

const dropdownVariants = {
  open: { opacity: 1, scaleY: 1, transition: { duration: 0.3, ease: [0.19, 1.0, 0.22, 1.0] } },
  closed: { opacity: 0, scaleY: 0, transition: { duration: 0.2, ease: [0.19, 1.0, 0.22, 1.0] } },
};

const listItemVariants = {
  initial: { y: -10, opacity: 0 },
  animate: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: { delay: i * 0.05, duration: 0.3, ease: [0.19, 1.0, 0.22, 1.0] },
  }),
  exit: (i: number) => ({
    y: -10,
    opacity: 0,
    transition: { delay: i * 0.03, duration: 0.2, ease: [0.19, 1.0, 0.22, 1.0] },
  }),
};

const CustomDropdown: React.FC<CourseSelectorProps> = ({ paths, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const toggleOpen = () => setIsOpen(!isOpen);

  const handleOptionClick = (path: string) => {
    setSelectedOption(path);
    onSelect(path);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full md:w-auto">
      <motion.button
        className="w-full md:w-64 bg-black/30 border border-white/20 rounded-lg py-3 px-4 font-semibold text-white shadow-md flex items-center justify-between hover:bg-black/40 transition-colors duration-300"
        onClick={toggleOpen}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
      >
        {selectedOption || 'Select a Learning Path'}
        {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            className="absolute top-full left-0 mt-2 w-full md:w-64 bg-black/40 border border-white/20 rounded-md shadow-lg overflow-hidden z-10"
            variants={dropdownVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            {paths.map((path, index) => (
              <motion.li
                key={path}
                variants={listItemVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                custom={index}
                className="px-4 py-3 text-white font-medium cursor-pointer hover:bg-black/50 transition-colors duration-300"
                onClick={() => handleOptionClick(path)}
              >
                {path}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

const CourseSelector: React.FC<CourseSelectorProps> = ({ paths, onSelect }) => {
  return (
    <CustomDropdown paths={paths} onSelect={onSelect} />
  );
};

export default CourseSelector;