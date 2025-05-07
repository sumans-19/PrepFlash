import React from 'react';
import { useResumeContext } from '../../context/ResumeContext';
import FormSection from './FormSection';
import TextInput from '../ui/TextInput';
import TextArea from './TextArea';

import { Plus, Trash2 } from 'lucide-react';

const ExperienceForm: React.FC = () => {
    const { resumeData, addExperience, updateExperience, removeExperience } = useResumeContext();
    const { experience } = resumeData;

    const handleChange = (id: string, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        updateExperience(id, name, value);
    };

    return (
        <FormSection title="Work Experience" description="Add your professional experience">
            {experience.length === 0 ? (
                <div className="text-center py-6">
                    <p className="text-muted-foreground mb-4">No work experience added yet</p>
                    <button
                        onClick={addExperience}
                        className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Experience
                    </button>

                </div>
            ) : (
                <>
                    {experience.map((exp, index) => (
                        <div key={exp.id} className="mb-6 pb-6 border-b border-muted-foreground last:border-b-0">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-foreground">Experience {index + 1}</h3>
                                <button
                                    onClick={() => removeExperience(exp.id)}
                                    className="inline-flex items-center text-red-600 hover:text-red-800 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4 mr-1" />
                                    Remove
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <TextInput
                                    label="Job Title"
                                    name="jobTitle"
                                    placeholder="Software Engineer"
                                    value={exp.jobTitle}
                                    onChange={(e) => handleChange(exp.id, e)}
                                    required
                                />
                                <TextInput
                                    label="Company"
                                    name="company"
                                    placeholder="Acme Inc."
                                    value={exp.company}
                                    onChange={(e) => handleChange(exp.id, e)}
                                    required
                                />
                                <TextInput
                                    label="Start Date"
                                    name="startDate"
                                    placeholder="Jan 2020"
                                    value={exp.startDate}
                                    onChange={(e) => handleChange(exp.id, e)}
                                    required
                                />
                                <TextInput
                                    label="End Date"
                                    name="endDate"
                                    placeholder="Present or Dec 2022"
                                    value={exp.endDate}
                                    onChange={(e) => handleChange(exp.id, e)}
                                    required
                                />
                                <div className="md:col-span-2">
                                    <TextArea
                                        label="Description"
                                        name="description"
                                        placeholder="Describe your responsibilities and achievements"
                                        value={exp.description}
                                        onChange={(e) => handleChange(exp.id, e)}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="text-center mt-4">
                        <button
                            onClick={addExperience}
                            className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Another Experience
                        </button>

                    </div>
                </>
            )}
        </FormSection>
    );
};

export default ExperienceForm;
