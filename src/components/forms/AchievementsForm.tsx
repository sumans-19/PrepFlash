import React from 'react';
import { useResumeContext } from '../../context/ResumeContext';
import FormSection from './FormSection';
import TextInput from '../ui/TextInput';

import TextArea from './TextArea';

import { Plus, Trash2 } from 'lucide-react';

const AchievementsForm: React.FC = () => {
  const { resumeData, addAchievement, updateAchievement, removeAchievement } = useResumeContext();
  const { achievements } = resumeData;

  const handleChange = (id: string, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateAchievement(id, name, value);
  };

  return (
    <FormSection title="Achievements" description="Add awards, certifications, and other accomplishments">
      {achievements.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-gray-500 mb-4">No achievements added yet</p>
          <button
            onClick={addAchievement}
            className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Achievement
          </button>
        </div>
      ) : (
        <>
          {achievements.map((achievement, index) => (
            <div key={achievement.id} className="mb-6 pb-6 border-b border-gray-200 last:border-b-0">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-white-800">Achievement {index + 1}</h3>
                <button
                  onClick={() => removeAchievement(achievement.id)}
                  className="inline-flex items-center text-red-600 hover:text-red-800 transition-colors"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Remove
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <TextInput
                  label="Title"
                  name="title"
                  placeholder="AWS Certified Solutions Architect, Employee of the Year, etc."
                  value={achievement.title}
                  onChange={(e) => handleChange(achievement.id, e)}
                  required
                />
                <TextArea
                  label="Description"
                  name="description"
                  placeholder="Brief description of the achievement, when received, etc."
                  value={achievement.description}
                  onChange={(e) => handleChange(achievement.id, e)}
                />
              </div>
            </div>
          ))}
          <div className="text-center mt-4">
            <button
              onClick={addAchievement}
              className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Another Achievement
            </button>
          </div>
        </>
      )}
    </FormSection>
  );
};

export default AchievementsForm;