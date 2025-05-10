import React, { createContext, useContext, useState, useEffect } from 'react';
import { Template } from '../types/index';
import { defaultTemplates } from '../data/templates';

export type Experience = {
  id: string;
  jobTitle: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
};

export type Education = {
  id: string;
  degree: string;
  institution: string;
  year: string;
  achievements: string;
};

export type Skill = {
  id: string;
  name: string;
  type: 'hard' | 'soft';
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
};

export type ResumeData = {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    website?: string;
  };
  targetRole: {
    title: string;
    industry: string;
  };
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  achievements: Achievement[];
  additionalInfo: string;
};

const initialState: ResumeData = {
  personalInfo: {
    name: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    website: '',
  },
  targetRole: {
    title: '',
    industry: '',
  },
  experience: [],
  education: [],
  skills: [],
  achievements: [],
  additionalInfo: '',
};

type ResumeContextType = {
  resumeData: ResumeData;
  updatePersonalInfo: (field: string, value: string) => void;
  updateTargetRole: (field: string, value: string) => void;
  addExperience: () => void;
  updateExperience: (id: string, field: string, value: string) => void;
  removeExperience: (id: string) => void;
  addEducation: () => void;
  updateEducation: (id: string, field: string, value: string) => void;
  removeEducation: (id: string) => void;
  addSkill: (type: 'hard' | 'soft') => void;
  updateSkill: (id: string, field: string, value: string) => void;
  removeSkill: (id: string) => void;
  addAchievement: () => void;
  updateAchievement: (id: string, field: string, value: string) => void;
  removeAchievement: (id: string) => void;
  updateAdditionalInfo: (value: string) => void;
  selectedTemplate: string;
  selectTemplate: (templateId: string) => void;
  templates: Template[];
  currentPrompt: string;
  activeSection: string;
  setActiveSection: (section: string) => void;
};

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};

export const ResumeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [resumeData, setResumeData] = useState<ResumeData>(initialState);
  const [selectedTemplate, setSelectedTemplate] = useState<string>(defaultTemplates[0].id);
  const [templates] = useState<Template[]>(defaultTemplates);
  const [currentPrompt, setCurrentPrompt] = useState<string>(defaultTemplates[0].promptTemplate);
  const [activeSection, setActiveSection] = useState<string>('personal');

  useEffect(() => {
    const template = templates.find(t => t.id === selectedTemplate);
    if (template) {
      setCurrentPrompt(template.promptTemplate);
    }
  }, [selectedTemplate, templates]);

  const generateId = () => Math.random().toString(36).substring(2, 9);

  const updatePersonalInfo = (field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value,
      },
    }));
  };

  const updateTargetRole = (field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      targetRole: {
        ...prev.targetRole,
        [field]: value,
      },
    }));
  };

  const addExperience = () => {
    const newExperience: Experience = {
      id: generateId(),
      jobTitle: '',
      company: '',
      startDate: '',
      endDate: '',
      description: '',
    };
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, newExperience],
    }));
  };

  const updateExperience = (id: string, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  const removeExperience = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id),
    }));
  };

  const addEducation = () => {
    const newEducation: Education = {
      id: generateId(),
      degree: '',
      institution: '',
      year: '',
      achievements: '',
    };
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, newEducation],
    }));
  };

  const updateEducation = (id: string, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    }));
  };

  const removeEducation = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id),
    }));
  };

  const addSkill = (type: 'hard' | 'soft') => {
    const newSkill: Skill = {
      id: generateId(),
      name: '',
      type,
    };
    setResumeData(prev => ({
      ...prev,
      skills: [...prev.skills, newSkill],
    }));
  };

  const updateSkill = (id: string, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.map(skill =>
        skill.id === id ? { ...skill, [field]: value } : skill
      ),
    }));
  };

  const removeSkill = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill.id !== id),
    }));
  };

  const addAchievement = () => {
    const newAchievement: Achievement = {
      id: generateId(),
      title: '',
      description: '',
    };
    setResumeData(prev => ({
      ...prev,
      achievements: [...prev.achievements, newAchievement],
    }));
  };

  const updateAchievement = (id: string, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      achievements: prev.achievements.map(achievement =>
        achievement.id === id ? { ...achievement, [field]: value } : achievement
      ),
    }));
  };

  const removeAchievement = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      achievements: prev.achievements.filter(achievement => achievement.id !== id),
    }));
  };

  const updateAdditionalInfo = (value: string) => {
    setResumeData(prev => ({
      ...prev,
      additionalInfo: value,
    }));
  };

  return (
    <ResumeContext.Provider
      value={{
        resumeData,
        updatePersonalInfo,
        updateTargetRole,
        addExperience,
        updateExperience,
        removeExperience,
        addEducation,
        updateEducation,
        removeEducation,
        addSkill,
        updateSkill,
        removeSkill,
        addAchievement,
        updateAchievement,
        removeAchievement,
        updateAdditionalInfo,
        selectedTemplate,
        selectTemplate: setSelectedTemplate,
        templates,
        currentPrompt,
        activeSection,
        setActiveSection,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
};