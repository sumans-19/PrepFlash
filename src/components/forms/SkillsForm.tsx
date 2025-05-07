import React from 'react';
import { useResumeContext } from '../../context/ResumeContext';
import FormSection from './FormSection';
import TextInput from '../ui/TextInput';
import { Plus, Trash2 } from 'lucide-react';

const SkillsForm: React.FC = () => {
  const { resumeData, addSkill, updateSkill, removeSkill } = useResumeContext();
  const { skills } = resumeData;

  const hardSkills = skills.filter((skill) => skill.type === 'hard');
  const softSkills = skills.filter((skill) => skill.type === 'soft');

  const handleChange = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateSkill(id, name, value);
  };

  return (
    <FormSection title="Skills" description="List your hard and soft skills">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-white-800">Hard Skills</h3>
          <button
            onClick={() => addSkill('hard')}
            className="inline-flex items-center px-3 py-1 bg-teal-600 text-white text-sm rounded-md hover:bg-teal-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Hard Skill
          </button>
        </div>
        {hardSkills.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No hard skills added yet</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hardSkills.map((skill) => (
              <div key={skill.id} className="flex items-center gap-2">
                <TextInput
                  name="name"
                  placeholder="JavaScript, Python, Project Management, etc."
                  value={skill.name}
                  onChange={(e) => handleChange(skill.id, e)}
                  required
                  className="flex-grow"
                />
                <button
                  onClick={() => removeSkill(skill.id)}
                  className="inline-flex items-center text-red-600 hover:text-red-800 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-white-800">Soft Skills</h3>
          <button
            onClick={() => addSkill('soft')}
            className="inline-flex items-center px-3 py-1 bg-teal-600 text-white text-sm rounded-md hover:bg-teal-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Soft Skill
          </button>
        </div>
        {softSkills.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No soft skills added yet</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {softSkills.map((skill) => (
              <div key={skill.id} className="flex items-center gap-2">
                <TextInput
                  name="name"
                  placeholder="Leadership, Communication, Teamwork, etc."
                  value={skill.name}
                  onChange={(e) => handleChange(skill.id, e)}
                  required
                  className="flex-grow"
                />
                <button
                  onClick={() => removeSkill(skill.id)}
                  className="inline-flex items-center text-red-600 hover:text-red-800 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </FormSection>
  );
};

export default SkillsForm;