import React from 'react';
import { useResumeContext } from '../../context/ResumeContext';
import FormSection from './FormSection';

import TextArea from './TextArea';

const AdditionalInfoForm: React.FC = () => {
  const { resumeData, updateAdditionalInfo } = useResumeContext();
  const { additionalInfo } = resumeData;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateAdditionalInfo(e.target.value);
  };

  return (
    <FormSection title="Additional Information" description="Add hobbies, languages, links, or any other relevant information">
      <TextArea
        label="Additional Info"
        name="additionalInfo"
        placeholder="Languages: English (Native), Spanish (Intermediate)
Hobbies: Photography, Hiking, Reading
Links: github.com/johndoe, medium.com/@johndoe"
        value={additionalInfo}
        onChange={handleChange}
        rows={8}
      />
    </FormSection>
  );
};

export default AdditionalInfoForm;