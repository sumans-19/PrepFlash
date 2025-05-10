import React from 'react';
import TemplateSelector from '../templates/TemplateSelector';
import { useResume } from '../../context/ResumeContext';

const TemplatesForm: React.FC = () => {
  const { templates, selectedTemplate, selectTemplate, currentPrompt } = useResume();

  return (
    <div className="space-y-6">
      <TemplateSelector
        templates={templates}
        selectedTemplate={selectedTemplate}
        onSelectTemplate={selectTemplate}
      />
      
      {/* <div className="mt-8 p-4 bg-gray-50 rounded-md border border-gray-200">
        <h3 className="text-lg font-medium text-gray-800 mb-2">Prompt Template</h3>
        <p className="text-gray-600 text-sm mb-2">
          This prompt will be used to generate your resume when using AI assistance
        </p>
        <div className="p-3 bg-white border border-gray-200 rounded">
          <p className="text-gray-700">{currentPrompt}</p>
        </div>
      </div> */}
    </div>
  );
};

export default TemplatesForm;