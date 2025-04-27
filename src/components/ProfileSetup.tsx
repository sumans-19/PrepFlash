
import React, { useState, useEffect } from 'react';
import { useProfileForm } from '../hooks/useProfileForm';
import { ProfileData } from '../types/profile';
import { useToast } from '@/components/ui/use-toast';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { interestsCategories, skillCategories } from '../config/profileFeatures';
import { Check, ChevronLeft, ChevronRight, User, BookOpen, Briefcase } from 'lucide-react';

const ProfileSetup = () => {
  const {
    profileData,
    handleInputChange,
    currentStep,
    isFlipped,
    isSubmitting,
    progress,
    goToNextStep,
    goToPreviousStep,
    submitProfile,
  } = useProfileForm();

  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    // Import any available profile data
    setSelectedInterests(profileData.interests || []);
    setSelectedSkills(profileData.skills || []);
  }, [profileData.interests, profileData.skills]);

  // Handle interest toggle
  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      const filtered = selectedInterests.filter(i => i !== interest);
      setSelectedInterests(filtered);
      handleInputChange('interests', filtered);
    } else {
      const updated = [...selectedInterests, interest];
      setSelectedInterests(updated);
      handleInputChange('interests', updated);
    }
  };

  // Handle skill toggle
  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      const filtered = selectedSkills.filter(s => s !== skill);
      setSelectedSkills(filtered);
      handleInputChange('skills', filtered);
    } else {
      const updated = [...selectedSkills, skill];
      setSelectedSkills(updated);
      handleInputChange('skills', updated);
    }
  };

  // Filter skills and interests based on search term
  const filteredInterests = searchTerm 
    ? interestsCategories.filter(i => i.toLowerCase().includes(searchTerm.toLowerCase()))
    : interestsCategories;

  const filteredSkillCategories = searchTerm
    ? skillCategories.map(category => ({
        ...category,
        skills: category.skills.filter(skill => 
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })).filter(category => category.skills.length > 0)
    : skillCategories;

  // Determine if the current step is complete
  const isStepComplete = () => {
    switch (currentStep) {
      case 1:
        return !!profileData.firstName && !!profileData.lastName && !!profileData.age && !!profileData.gender;
      case 2:
        return !!profileData.bio && profileData.interests.length > 0;
      case 3:
        return !!profileData.dreamCompany && !!profileData.targetRole && !!profileData.engineeringYear;
      default:
        return false;
    }
  };

  const renderStepHeader = () => {
    const headers = ['Personal Info', 'About You', 'Career Goals'];
    const icons = [<User key="user" />, <BookOpen key="book" />, <Briefcase key="briefcase" />];
    
    return (
      <div className="flex justify-between mb-6">
        {headers.map((header, idx) => (
          <div 
            key={idx} 
            className={`flex flex-col items-center space-y-2 ${
              idx + 1 === currentStep 
                ? 'text-primary-600 scale-110 transition-all' 
                : idx + 1 < currentStep 
                  ? 'text-green-500' 
                  : 'text-gray-400'
            }`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
              idx + 1 === currentStep 
                ? 'bg-primary text-white animate-pulse-subtle' 
                : idx + 1 < currentStep 
                  ? 'bg-green-100 text-green-500' 
                  : 'bg-gray-100'
            }`}>
              {idx + 1 < currentStep ? <Check size={18} /> : icons[idx]}
            </div>
            <span className="text-xs font-medium">{header}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderStep = () => {
    switch(currentStep) {
      case 1:
        return (
          <div className={`space-y-6 transition-all duration-300 ${isFlipped ? 'opacity-0' : 'animate-fade-in'}`}>
            <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">
              Personal Information
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">First Name</label>
                  <Input
                    placeholder="Your first name"
                    value={profileData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="border-indigo-200 focus:border-indigo-400 hover-lift"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Last Name</label>
                  <Input
                    placeholder="Your last name"
                    value={profileData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="border-indigo-200 focus:border-indigo-400 hover-lift"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Age</label>
                <Input
                  type="number"
                  placeholder="Your age"
                  value={profileData.age || ''}
                  onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                  className="border-indigo-200 focus:border-indigo-400 hover-lift"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Gender</label>
                <Select 
                  value={profileData.gender} 
                  onValueChange={(value) => handleInputChange('gender', value)}
                >
                  <SelectTrigger className="w-full border-indigo-200 focus:border-indigo-400 hover-lift">
                    <SelectValue placeholder="Select your gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className={`space-y-6 transition-all duration-300 ${isFlipped ? 'opacity-0' : 'animate-fade-in'}`}>
            <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">
              About You
            </h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Bio</label>
                <Textarea
                  placeholder="Tell us about yourself, your background and aspirations..."
                  value={profileData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  className="min-h-[120px] border-indigo-200 focus:border-indigo-400 hover-lift resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Interests</label>
                <div className="relative">
                  <Input
                    placeholder="Search interests..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mb-2 border-indigo-200 focus:border-indigo-400"
                  />
                </div>
                
                <div className="flex flex-wrap gap-2 max-h-[200px] overflow-y-auto p-2 border rounded-md border-indigo-100">
                  {filteredInterests.map((interest, index) => (
                    <Badge
                      key={interest}
                      variant={selectedInterests.includes(interest) ? "default" : "outline"}
                      className={`cursor-pointer transition-all hover:shadow-md animate-fade-in ${
                        selectedInterests.includes(interest) 
                          ? 'bg-indigo-500 hover:bg-indigo-600' 
                          : 'hover:bg-indigo-50'
                      }`}
                      style={{
                        animationDelay: `${index * 50}ms`
                      }}
                      onClick={() => toggleInterest(interest)}
                    >
                      {interest}
                    </Badge>
                  ))}
                  {filteredInterests.length === 0 && (
                    <p className="text-sm text-gray-500 p-2">No matching interests found</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Skills</label>
                
                <div className="flex flex-wrap gap-2 max-h-[200px] overflow-y-auto p-2 border rounded-md border-indigo-100">
                  {filteredSkillCategories.map(category => (
                    <div key={category.name} className="w-full">
                      <h4 className="text-xs uppercase tracking-wider text-gray-500 mb-1">{category.name}</h4>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {category.skills.map((skill) => (
                          <Badge
                            key={skill}
                            variant={selectedSkills.includes(skill) ? "default" : "outline"}
                            className={`cursor-pointer transition-all hover:shadow-md ${
                              selectedSkills.includes(skill) 
                                ? 'bg-indigo-500 hover:bg-indigo-600' 
                                : 'hover:bg-indigo-50'
                            }`}
                            onClick={() => toggleSkill(skill)}
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                  {filteredSkillCategories.length === 0 && (
                    <p className="text-sm text-gray-500 p-2">No matching skills found</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className={`space-y-6 transition-all duration-300 ${isFlipped ? 'opacity-0' : 'animate-fade-in'}`}>
            <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">
              Career Goals
            </h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Dream Company</label>
                <Input
                  placeholder="Where do you dream to work?"
                  value={profileData.dreamCompany}
                  onChange={(e) => handleInputChange('dreamCompany', e.target.value)}
                  className="border-indigo-200 focus:border-indigo-400 hover-lift"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Target Role</label>
                <Input
                  placeholder="What position are you aiming for?"
                  value={profileData.targetRole}
                  onChange={(e) => handleInputChange('targetRole', e.target.value)}
                  className="border-indigo-200 focus:border-indigo-400 hover-lift"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Engineering Year</label>
                <Select 
                  value={profileData.engineeringYear} 
                  onValueChange={(value) => handleInputChange('engineeringYear', value)}
                >
                  <SelectTrigger className="w-full border-indigo-200 focus:border-indigo-400 hover-lift">
                    <SelectValue placeholder="Select your year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">First Year</SelectItem>
                    <SelectItem value="2">Second Year</SelectItem>
                    <SelectItem value="3">Third Year</SelectItem>
                    <SelectItem value="4">Fourth Year</SelectItem>
                    <SelectItem value="graduate">Graduate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50 overflow-hidden p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[10%] -left-[10%] w-[500px] h-[500px] bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
        <div className="absolute top-[40%] -right-[10%] w-[600px] h-[600px] bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -bottom-[10%] left-[20%] w-[500px] h-[500px] bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <Card 
        className={`w-full max-w-md p-6 transition-all duration-500 transform shadow-lg bg-white/90 backdrop-blur-md rounded-xl ${
          isFlipped ? 'scale-95 opacity-90' : 'scale-100'
        }`}
      >
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-1 text-gray-800">Create Your Profile</h1>
            <p className="text-gray-500">Let us know more about you to personalize your experience</p>
          </div>
          
          <div className="mb-8">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          {renderStepHeader()}
          
          <div className="min-h-[320px]">
            {renderStep()}
          </div>
          
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
            {currentStep > 1 ? (
              <Button
                variant="outline"
                onClick={goToPreviousStep}
                disabled={isSubmitting}
                className="flex items-center gap-1 hover-lift"
              >
                <ChevronLeft size={16} /> Back
              </Button>
            ) : (
              <div></div>
            )}
            
            <Button
              onClick={currentStep < 3 ? goToNextStep : submitProfile}
              disabled={isSubmitting || !isStepComplete()}
              className={`${isSubmitting ? 'opacity-80' : ''} flex items-center gap-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all hover-lift`}
            >
              {currentStep < 3 ? (
                <>
                  Next <ChevronRight size={16} />
                </>
              ) : isSubmitting ? (
                'Creating Profile...'
              ) : (
                'Complete Profile'
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProfileSetup;
