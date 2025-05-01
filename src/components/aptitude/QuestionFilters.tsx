
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Topic } from '@/types/aptitude';

interface QuestionFiltersProps {
  topics: Topic[];
  selectedTopics: string[];
  setSelectedTopics: React.Dispatch<React.SetStateAction<string[]>>;
  selectedDifficulty: string | 'all' | '';
  setSelectedDifficulty: React.Dispatch<React.SetStateAction<string | 'all' | ''>>;
  selectedRoles: string[];
  setSelectedRoles: React.Dispatch<React.SetStateAction<string[]>>;
  selectedCompanies: string[];
  setSelectedCompanies: React.Dispatch<React.SetStateAction<string[]>>;
  selectedFormat: string | 'all' | '';
  setSelectedFormat: React.Dispatch<React.SetStateAction<string | 'all' | ''>>;
}

const QuestionFilters: React.FC<QuestionFiltersProps> = ({
  topics,
  selectedTopics,
  setSelectedTopics,
  selectedDifficulty,
  setSelectedDifficulty,
  selectedRoles,
  setSelectedRoles,
  selectedCompanies,
  setSelectedCompanies,
  selectedFormat,
  setSelectedFormat,
}) => {
  // Helper function for toggling array values
  const toggleArrayValue = (array: string[], value: string, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (array.includes(value)) {
      setter(array.filter((item) => item !== value));
    } else {
      setter([...array, value]);
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedTopics([]);
    setSelectedDifficulty('');
    setSelectedRoles([]);
    setSelectedCompanies([]);
    setSelectedFormat('');
  };

  // Get unique roles and companies from the aptitude hook
  const roles = ['Software Developer', 'Data Scientist', 'Analyst', 'Engineer', 'Statistician'];
  const companies = ['Amazon', 'Microsoft', 'Google', 'Facebook', 'IBM', 'Deloitte'];

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button variant="ghost" size="sm" onClick={resetFilters}>
          Reset Filters
        </Button>
      </div>

      <Accordion type="multiple" defaultValue={['topics', 'difficulty']} className="space-y-2">
        {/* Topics */}
        <AccordionItem value="topics" className="border rounded-md">
          <AccordionTrigger className="px-4">Topics</AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <ScrollArea className="h-48">
              <div className="space-y-2">
                {topics.map((topic) => (
                  <div key={topic.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`topic-${topic.id}`}
                      checked={selectedTopics.includes(topic.id)}
                      onCheckedChange={() => toggleArrayValue(selectedTopics, topic.id, setSelectedTopics)}
                    />
                    <Label htmlFor={`topic-${topic.id}`} className="cursor-pointer">
                      {topic.name}
                    </Label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </AccordionContent>
        </AccordionItem>

        {/* Difficulty */}
        <AccordionItem value="difficulty" className="border rounded-md">
          <AccordionTrigger className="px-4">Difficulty</AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <RadioGroup
              value={selectedDifficulty}
              onValueChange={(value) => setSelectedDifficulty(value)}
            >
              <div className="flex items-center space-x-2 mb-2">
                <RadioGroupItem value="all" id="all-difficulty" />
                <Label htmlFor="all-difficulty">All Difficulties</Label>
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <RadioGroupItem value="Easy" id="easy-difficulty" />
                <Label htmlFor="easy-difficulty">Easy</Label>
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <RadioGroupItem value="Medium" id="medium-difficulty" />
                <Label htmlFor="medium-difficulty">Medium</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Hard" id="hard-difficulty" />
                <Label htmlFor="hard-difficulty">Hard</Label>
              </div>
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>

        {/* Question Format */}
        <AccordionItem value="format" className="border rounded-md">
          <AccordionTrigger className="px-4">Format</AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <RadioGroup
              value={selectedFormat}
              onValueChange={(value) => setSelectedFormat(value)}
            >
              <div className="flex items-center space-x-2 mb-2">
                <RadioGroupItem value="all" id="all-formats" />
                <Label htmlFor="all-formats">All Formats</Label>
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <RadioGroupItem value="MCQ" id="mcq-format" />
                <Label htmlFor="mcq-format">Multiple Choice</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Fill in the blanks" id="fill-format" />
                <Label htmlFor="fill-format">Fill in the blanks</Label>
              </div>
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>

        {/* Target Roles */}
        <AccordionItem value="roles" className="border rounded-md">
          <AccordionTrigger className="px-4">Target Roles</AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <ScrollArea className="h-40">
              <div className="space-y-2">
                {roles.map((role) => (
                  <div key={role} className="flex items-center space-x-2">
                    <Checkbox
                      id={`role-${role}`}
                      checked={selectedRoles.includes(role)}
                      onCheckedChange={() => toggleArrayValue(selectedRoles, role, setSelectedRoles)}
                    />
                    <Label htmlFor={`role-${role}`} className="cursor-pointer">
                      {role}
                    </Label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </AccordionContent>
        </AccordionItem>

        {/* Companies */}
        <AccordionItem value="companies" className="border rounded-md">
          <AccordionTrigger className="px-4">Companies</AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <ScrollArea className="h-40">
              <div className="space-y-2">
                {companies.map((company) => (
                  <div key={company} className="flex items-center space-x-2">
                    <Checkbox
                      id={`company-${company}`}
                      checked={selectedCompanies.includes(company)}
                      onCheckedChange={() => toggleArrayValue(selectedCompanies, company, setSelectedCompanies)}
                    />
                    <Label htmlFor={`company-${company}`} className="cursor-pointer">
                      {company}
                    </Label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default QuestionFilters;
