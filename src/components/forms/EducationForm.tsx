import React from 'react';
import { useResume } from '../../context/ResumeContext';
import FormSection from './FormSection';
import TextInput from '../ui/TextInput';

import TextArea from './TextArea';
import { Plus, Trash2 } from 'lucide-react';

const EducationForm: React.FC = () => {
  const { resumeData, addEducation, updateEducation, removeEducation } = useResume();
  const { education } = resumeData;

  const handleChange = (id: string, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateEducation(id, name, value);
  };

  return (
    <FormSection title="Education" description="Add your educational background">
      {education.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-gray-500 mb-4">No education added yet</p>
          <button
            onClick={addEducation}
            className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Education
          </button>
        </div>
      ) : (
        <>
          {education.map((edu, index) => (
            <div key={edu.id} className="mb-6 pb-6 border-b border-gray-200 last:border-b-0">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-white-800">Education {index + 1}</h3>
                <button
                  onClick={() => removeEducation(edu.id)}
                  className="inline-flex items-center text-red-600 hover:text-red-800 transition-colors"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Remove
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInput
                  label="Degree"
                  name="degree"
                  placeholder="Bachelor of Science in Computer Science"
                  value={edu.degree}
                  onChange={(e) => handleChange(edu.id, e)}
                  required
                />
                <TextInput
                  label="Institution"
                  name="institution"
                  placeholder="Stanford University"
                  value={edu.institution}
                  onChange={(e) => handleChange(edu.id, e)}
                  required
                />
                <TextInput
                  label="Year"
                  name="year"
                  placeholder="2018 - 2022"
                  value={edu.year}
                  onChange={(e) => handleChange(edu.id, e)}
                  required
                />
                <div className="md:col-span-2">
                  <TextArea
                    label="Achievements"
                    name="achievements"
                    placeholder="GPA, honors, relevant coursework, etc."
                    value={edu.achievements}
                    onChange={(e) => handleChange(edu.id, e)}
                  />
                </div>
              </div>
            </div>
          ))}
          <div className="text-center mt-4">
            <button
              onClick={addEducation}
              className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Another Education
            </button>
          </div>
        </>
      )}
    </FormSection>
  );
};

export default EducationForm;