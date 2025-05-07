import React from 'react';
import { useResumeContext } from '../../context/ResumeContext';
import FormSection from './FormSection';
import TextInput from '../ui/TextInput';

const TargetRoleForm: React.FC = () => {
  const { resumeData, updateTargetRole } = useResumeContext();
  const { targetRole } = resumeData;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateTargetRole(name, value);
  };

  return (
    <FormSection title="Target Role" description="Specify your career objectives">
      <div className="grid grid-cols-1 gap-4">
        <TextInput
          label="Job Title"
          name="title"
          placeholder="Software Engineer"
          value={targetRole.title}
          onChange={handleChange}
          required
        />
        <TextInput
          label="Preferred Industry"
          name="industry"
          placeholder="Technology, Finance, Healthcare, etc."
          value={targetRole.industry}
          onChange={handleChange}
          required
        />
      </div>
    </FormSection>
  );
};

export default TargetRoleForm;