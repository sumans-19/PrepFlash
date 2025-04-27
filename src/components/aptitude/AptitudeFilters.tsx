
import React from 'react';
import { Topic, Difficulty, Format } from '@/types/aptitude';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuCheckboxItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { X, ChevronDown, Filter } from 'lucide-react';

interface AptitudeFiltersProps {
  topics: Topic[];
  selectedTopics: string[];
  setSelectedTopics: (topics: string[]) => void;
  selectedDifficulty: Difficulty | '';
  setSelectedDifficulty: (difficulty: Difficulty | '') => void;
  selectedRoles: string[];
  setSelectedRoles: (roles: string[]) => void;
  selectedCompanies: string[];
  setSelectedCompanies: (companies: string[]) => void;
  selectedFormat: Format | '';
  setSelectedFormat: (format: Format | '') => void;
}

const ROLES = ['Software Developer', 'Data Scientist', 'Analyst', 'Engineer', 'Consultant', 'Statistician'];
const COMPANIES = ['Amazon', 'Google', 'Microsoft', 'Facebook', 'IBM', 'Deloitte', 'TCS', 'Infosys', 'Accenture'];

const AptitudeFilters = ({
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
  setSelectedFormat
}: AptitudeFiltersProps) => {
  const clearFilters = () => {
    setSelectedTopics([]);
    setSelectedDifficulty('');
    setSelectedRoles([]);
    setSelectedCompanies([]);
    setSelectedFormat('');
  };

  const removeTopicFilter = (topic: string) => {
    setSelectedTopics(selectedTopics.filter(t => t !== topic));
  };
  
  const removeRoleFilter = (role: string) => {
    setSelectedRoles(selectedRoles.filter(r => r !== role));
  };
  
  const removeCompanyFilter = (company: string) => {
    setSelectedCompanies(selectedCompanies.filter(c => c !== company));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center">
        {/* Topics Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Topics <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Select Topics</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {topics.map(topic => (
              <DropdownMenuCheckboxItem
                key={topic.id}
                checked={selectedTopics.includes(topic.id)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedTopics([...selectedTopics, topic.id]);
                  } else {
                    setSelectedTopics(selectedTopics.filter(t => t !== topic.id));
                  }
                }}
              >
                {topic.name}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Difficulty Select */}
        <Select
          value={selectedDifficulty}
          onValueChange={(value) => setSelectedDifficulty(value as Difficulty | '')}
        >
          <SelectTrigger className="w-[130px] h-9">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Difficulties</SelectItem>
            <SelectItem value="Easy">Easy</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Hard">Hard</SelectItem>
          </SelectContent>
        </Select>

        {/* Format Select */}
        <Select
          value={selectedFormat}
          onValueChange={(value) => setSelectedFormat(value as Format | '')}
        >
          <SelectTrigger className="w-[130px] h-9">
            <SelectValue placeholder="Format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Formats</SelectItem>
            <SelectItem value="MCQ">Multiple Choice</SelectItem>
            <SelectItem value="Fill in the blanks">Fill in the blanks</SelectItem>
            <SelectItem value="Descriptive">Descriptive</SelectItem>
          </SelectContent>
        </Select>

        {/* Roles Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Roles <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Select Target Roles</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {ROLES.map(role => (
              <DropdownMenuCheckboxItem
                key={role}
                checked={selectedRoles.includes(role)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedRoles([...selectedRoles, role]);
                  } else {
                    setSelectedRoles(selectedRoles.filter(r => r !== role));
                  }
                }}
              >
                {role}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Companies Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Companies <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Select Companies</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {COMPANIES.map(company => (
              <DropdownMenuCheckboxItem
                key={company}
                checked={selectedCompanies.includes(company)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedCompanies([...selectedCompanies, company]);
                  } else {
                    setSelectedCompanies(selectedCompanies.filter(c => c !== company));
                  }
                }}
              >
                {company}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Reset Filters Button */}
        {(selectedTopics.length > 0 || selectedDifficulty || selectedRoles.length > 0 || 
          selectedCompanies.length > 0 || selectedFormat) && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters}
            className="h-9"
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {(selectedTopics.length > 0 || selectedDifficulty || selectedRoles.length > 0 || 
        selectedCompanies.length > 0 || selectedFormat) && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="flex items-center text-sm text-muted-foreground">
            <Filter className="h-4 w-4 mr-1" /> Active filters:
          </span>
          
          {selectedTopics.map(topicId => {
            const topicName = topics.find(t => t.id === topicId)?.name || topicId;
            return (
              <Badge 
                key={topicId} 
                variant="secondary"
                className="flex items-center gap-1"
              >
                {topicName}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => removeTopicFilter(topicId)} 
                  className="h-4 w-4 p-0 ml-1"
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            );
          })}
          
          {selectedDifficulty && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {selectedDifficulty}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSelectedDifficulty('')} 
                className="h-4 w-4 p-0 ml-1"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          {selectedFormat && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {selectedFormat}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSelectedFormat('')} 
                className="h-4 w-4 p-0 ml-1"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          {selectedRoles.map(role => (
            <Badge 
              key={role} 
              variant="secondary"
              className="flex items-center gap-1"
            >
              {role}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => removeRoleFilter(role)} 
                className="h-4 w-4 p-0 ml-1"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          
          {selectedCompanies.map(company => (
            <Badge 
              key={company} 
              variant="secondary"
              className="flex items-center gap-1"
            >
              {company}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => removeCompanyFilter(company)} 
                className="h-4 w-4 p-0 ml-1"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default AptitudeFilters;
