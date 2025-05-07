import React from 'react';

interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

const FormSection: React.FC<FormSectionProps> = ({ title, description, children}) => {
  return (
    <div className={`mb-4 `}>
      <h2 className="text-xl font-semibold text-foreground mb-1">{title}</h2>
      {description && <p className="text-muted-foreground text-sm mb-4">{description}</p>}
      <div className="mt-4">{children}</div>
    </div>
  );
};

export default FormSection;
