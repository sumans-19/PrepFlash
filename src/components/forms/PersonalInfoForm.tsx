import React from 'react';
import { useResumeContext } from '../../context/ResumeContext';
import FormSection from './FormSection';
import TextInput from '../ui/TextInput';

const PersonalInfoForm: React.FC = () => {
  const { resumeData, updatePersonalInfo } = useResumeContext();
  const { personalInfo } = resumeData;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updatePersonalInfo(name, value);
  };

  return (
    <FormSection
      title="Personal Information"
      description="Enter your contact details"
      className="bg-muted p-6 rounded-2xl shadow-sm border border-border"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput
          label="Full Name"
          name="name"
          placeholder="John Doe"
          value={personalInfo.name}
          onChange={handleChange}
          required
        />
        <TextInput
          label="Email"
          name="email"
          type="email"
          placeholder="john.doe@example.com"
          value={personalInfo.email}
          onChange={handleChange}
          required
        />
        <TextInput
          label="Phone"
          name="phone"
          placeholder="+1 (123) 456-7890"
          value={personalInfo.phone}
          onChange={handleChange}
          required
        />
        <TextInput
          label="Location"
          name="location"
          placeholder="New York, NY"
          value={personalInfo.location}
          onChange={handleChange}
          required
        />
        <TextInput
          label="LinkedIn (optional)"
          name="linkedin"
          placeholder="linkedin.com/in/johndoe"
          value={personalInfo.linkedin}
          onChange={handleChange}
        />
        <TextInput
          label="Website (optional)"
          name="website"
          placeholder="johndoe.com"
          value={personalInfo.website}
          onChange={handleChange}
        />
      </div>
    </FormSection>
  );
};

export default PersonalInfoForm;
