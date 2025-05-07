import React from 'react';
import { UserCircle, Briefcase, GraduationCap, Lightbulb, Award, Info } from 'lucide-react';
import { ThemeToggle } from '../ui/theme-toggle';

type FormSection = 'personal' | 'target' | 'experience' | 'education' | 'skills' | 'achievements' | 'additional';

interface FormNavProps {
  activeSection: FormSection;
  setActiveSection: (section: FormSection) => void;
}

const FormNav: React.FC<FormNavProps> = ({ activeSection, setActiveSection }) => {
  const navItems = [
    { id: 'personal', label: 'Personal', icon: <UserCircle className="w-5 h-5" /> },
    { id: 'target', label: 'Target Role', icon: <Briefcase className="w-5 h-5" /> },
    { id: 'experience', label: 'Experience', icon: <Briefcase className="w-5 h-5" /> },
    { id: 'education', label: 'Education', icon: <GraduationCap className="w-5 h-5" /> },
    { id: 'skills', label: 'Skills', icon: <Lightbulb className="w-5 h-5" /> },
    { id: 'achievements', label: 'Achievements', icon: <Award className="w-5 h-5" /> },
    { id: 'additional', label: 'Additional', icon: <Info className="w-5 h-5" /> },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-foreground">Resume Sections</h2>
        <ThemeToggle />
      </div>
      <div className="flex flex-wrap gap-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors border ${
              activeSection === item.id
                ? 'bg-primary text-primary-foreground border-ring'
                : 'bg-muted text-muted-foreground hover:bg-muted/80 border-border'
            }`}
            onClick={() => setActiveSection(item.id as FormSection)}
          >
            <span className="mr-2">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FormNav;
