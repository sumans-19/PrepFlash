
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { DashboardNav } from '@/components/DashboardNav';
import { geminiGenerateQuestions } from '@/lib/gemini.sdk';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/sonner';
import { Loader } from 'lucide-react';

const MockInterview = () => {
  const navigate = useNavigate();
  const [jobRole, setJobRole] = useState('');
  const [industry, setIndustry] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [techStack, setTechStack] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleStartInterview = async () => {
    if (!jobRole || !industry || !experienceLevel) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    
    try {
      // This is just to prepare parameters - the actual interview will happen in the interview page
      await geminiGenerateQuestions({
        userId: '1', // This will be replaced in the interview page with actual user ID
        userName: 'User', // This will be replaced in the interview page with actual username
        jobRole,
        industry,
        experienceLevel,
        techStack: techStack.split(',').map(item => item.trim()),
        questionCount: 5
      });
      
      // Redirect to the interview page
      navigate('/interview', {
        state: {
          jobRole,
          industry,
          experienceLevel,
          techStack
        }
      });
    } catch (error) {
      console.error('Error preparing interview:', error);
      toast.error('Failed to prepare interview. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <DashboardNav />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                Customize Your Mock Interview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Job Role*</label>
                <Input
                  placeholder="e.g. Software Engineer"
                  value={jobRole}
                  onChange={(e) => setJobRole(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Industry*</label>
                <Select value={industry} onValueChange={setIndustry}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="consulting">Consulting</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Experience Level*</label>
                <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entry">Entry Level</SelectItem>
                    <SelectItem value="mid">Mid Level</SelectItem>
                    <SelectItem value="senior">Senior Level</SelectItem>
                    <SelectItem value="lead">Lead / Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Technical Skills (comma-separated)</label>
                <Input
                  placeholder="e.g. React, Node.js, SQL"
                  value={techStack}
                  onChange={(e) => setTechStack(e.target.value)}
                />
              </div>

              <Button
                className="w-full"
                onClick={handleStartInterview}
                disabled={isLoading}
                style={{
                  background: 'linear-gradient(135deg, #9b87f5 0%, #7E69AB 100%)'
                }}
              >
                {isLoading ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Preparing Interview...
                  </>
                ) : (
                  'Start Interview'
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default MockInterview;
