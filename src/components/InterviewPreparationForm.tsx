
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader } from "lucide-react";

interface InterviewPreparationFormProps {
  onGenerateInterview: (data: {
    jobRole: string;
    techStack: string[];
    experienceLevel: string;
    industry: string;
    questionCount: number;
    additionalInfo: string;
  }) => Promise<void>;
  isGenerating: boolean;
  userName: string;
  initialValues?: {
    jobRole?: string;
    techStack?: string;
    experienceLevel?: string;
    industry?: string;
  };
}

const InterviewPreparationForm: React.FC<InterviewPreparationFormProps> = ({
  onGenerateInterview,
  isGenerating,
  userName,
  initialValues = {}
}) => {
  const [jobRole, setJobRole] = useState(initialValues.jobRole || '');
  const [techStackInput, setTechStackInput] = useState(initialValues.techStack || '');
  const [experienceLevel, setExperienceLevel] = useState(initialValues.experienceLevel || 'intermediate');
  const [industry, setIndustry] = useState(initialValues.industry || 'technology');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [additionalInfo, setAdditionalInfo] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobRole) return;

    const techStack = techStackInput
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0);

    await onGenerateInterview({
      jobRole,
      techStack,
      experienceLevel,
      industry,
      questionCount,
      additionalInfo
    });
  };

  return (
    <Card className="w-full bg-gradient-to-br from-background via-muted/30 to-background dark:from-gray-800 dark:to-gray-900">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold text-center">
          Prepare Your Interview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="jobRole" className="text-sm font-medium block">
              Target Job Role*
            </label>
            <Input
              id="jobRole"
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
              placeholder="e.g. Senior Frontend Developer"
              disabled={isGenerating}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="industry" className="text-sm font-medium block">
                Industry
              </label>
              <Select 
                value={industry} 
                onValueChange={setIndustry}
                disabled={isGenerating}
              >
                <SelectTrigger id="industry">
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="consulting">Consulting</SelectItem>
                  <SelectItem value="media">Media & Entertainment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="experienceLevel" className="text-sm font-medium block">
                Experience Level
              </label>
              <Select 
                value={experienceLevel} 
                onValueChange={setExperienceLevel}
                disabled={isGenerating}
              >
                <SelectTrigger id="experienceLevel">
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner (0-2 yrs)</SelectItem>
                  <SelectItem value="intermediate">Intermediate (2-5 yrs)</SelectItem>
                  <SelectItem value="senior">Senior (5-8 yrs)</SelectItem>
                  <SelectItem value="expert">Expert (8+ yrs)</SelectItem>
                  <SelectItem value="manager">Manager / Team Lead</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="techStack" className="text-sm font-medium block">
              Technical Skills (comma-separated)*
            </label>
            <Input
              id="techStack"
              value={techStackInput}
              onChange={(e) => setTechStackInput(e.target.value)}
              placeholder="e.g. React, Node.js, TypeScript, AWS"
              disabled={isGenerating}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="questionCount" className="text-sm font-medium block">
              Number of Questions
            </label>
            <Select 
              value={String(questionCount)} 
              onValueChange={(value) => setQuestionCount(Number(value))}
              disabled={isGenerating}
            >
              <SelectTrigger id="questionCount">
                <SelectValue placeholder="Select number of questions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3 Questions (Quick)</SelectItem>
                <SelectItem value="5">5 Questions (Standard)</SelectItem>
                <SelectItem value="7">7 Questions (Comprehensive)</SelectItem>
                <SelectItem value="10">10 Questions (Extended)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="additionalInfo" className="text-sm font-medium block">
              Additional Information or Specific Topics (Optional)
            </label>
            <Textarea
              id="additionalInfo"
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              placeholder="Any specific topics you'd like to cover or information about the position..."
              disabled={isGenerating}
              className="min-h-[80px]"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-primary to-primary/80 text-white mt-4"
            disabled={isGenerating || !jobRole || !techStackInput}
          >
            {isGenerating ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Generating Interview Questions...
              </>
            ) : (
              'Generate Interview Questions'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default InterviewPreparationForm;
