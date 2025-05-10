import React, { useState } from 'react';
import PersonalInfoForm from './forms/PersonalInfoForm';
import TargetRoleForm from './forms/TargetRoleForm';
import ExperienceForm from './forms/ExperienceForm';
import EducationForm from './forms/EducationForm';
import SkillsForm from './forms/SkillsForm';
import AchievementsForm from './forms/AchievementsForm';
import AdditionalInfoForm from './forms/AdditionalInfoForm';
import ResumePreview from './preview/ResumePreview';
import FormNav from './forms/FormNav';
import { FileText, Eye, PenSquare } from 'lucide-react';
import TemplatesForm from './forms/TemplatesForm';

type FormSection = 'personal' | 'target' | 'experience' | 'education' | 'skills' | 'achievements' | 'additional' |'resumetemplate';
type ViewMode = 'form' | 'preview' | 'edit';

const ResumeBuilder: React.FC = () => {
  const [activeSection, setActiveSection] = useState<FormSection>('personal');
  const [viewMode, setViewMode] = useState<ViewMode>('form');

  const renderForm = () => {
    switch (activeSection) {
      case 'personal':
        return <PersonalInfoForm />;
      case 'target':
        return <TargetRoleForm />;
      case 'experience':
        return <ExperienceForm />;
      case 'education':
        return <EducationForm />;
      case 'skills':
        return <SkillsForm />;
      case 'achievements':
        return <AchievementsForm />;
      case 'additional':
        return <AdditionalInfoForm />;
      case 'resumetemplate':
        return <TemplatesForm />;
      default:
        return <PersonalInfoForm />;
    }
  };

  const renderContent = () => {
    switch (viewMode) {
      case 'form':
        return (
          <>
            <div className="bg-card text-card-foreground rounded-lg shadow-md p-6 mb-6">
              <FormNav activeSection={activeSection} setActiveSection={setActiveSection} />
            </div>
            <div className="bg-card text-card-foreground rounded-lg shadow-md p-6">
              {renderForm()}
              <div className="mt-6 flex justify-between">
                <button
                  className="px-4 py-2 bg-muted text-muted-foreground rounded-md hover:bg-muted/80 transition-colors inline-flex items-center"
                  onClick={() => setViewMode('preview')}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview Resume
                </button>
                <div>
                  {activeSection !== 'personal' && (
                    <button
                      className="px-4 py-2 bg-muted text-muted-foreground rounded-md hover:bg-muted/80 transition-colors mr-3"
                      onClick={() => {
                        const sections: FormSection[] = ['personal', 'target', 'experience', 'education', 'skills', 'achievements', 'additional'];
                        const currentIndex = sections.indexOf(activeSection);
                        if (currentIndex > 0) {
                          setActiveSection(sections[currentIndex - 1]);
                        }
                      }}
                    >
                      Previous
                    </button>
                  )}
                  {activeSection !== 'additional' && (
                    <button
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                      onClick={() => {
                        const sections: FormSection[] = ['personal', 'target', 'experience', 'education', 'skills', 'achievements', 'additional'];
                        const currentIndex = sections.indexOf(activeSection);
                        if (currentIndex < sections.length - 1) {
                          setActiveSection(sections[currentIndex + 1]);
                        }
                      }}
                    >
                      Next
                    </button>
                  )}
                </div>
              </div>
            </div>
          </>
        );
      case 'preview':
      case 'edit':
        return (
          <div className="bg-card text-card-foreground rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {viewMode === 'preview' ? 'Resume Preview' : 'Edit Resume'}
              </h2>
              <div className="flex gap-3">
                <button
                  className="px-4 py-2 bg-muted text-muted-foreground rounded-md hover:bg-muted/80 transition-colors inline-flex items-center"
                  onClick={() => setViewMode('form')}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Back to Form
                </button>
                {/* {viewMode === 'preview' ? (
                  <button
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors inline-flex items-center"
                    onClick={() => setViewMode('edit')}
                  >
                    <PenSquare className="w-4 h-4 mr-2" />
                    Edit Resume
                  </button>
                ) : (
                  <button
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors inline-flex items-center"
                    onClick={() => setViewMode('preview')}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Resume
                  </button>
                )} */}
              </div>
            </div>
            <ResumePreview isEditable={viewMode === 'edit'} />
          </div>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {renderContent()}
    </div>
  );
};

export default ResumeBuilder;