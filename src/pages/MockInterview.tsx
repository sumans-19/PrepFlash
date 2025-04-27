
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { DashboardNav } from '@/components/DashboardNav';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/sonner';
import { Loader, Mic, ArrowRight } from 'lucide-react';
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

const MockInterview = () => {
  const navigate = useNavigate();
  const [jobRole, setJobRole] = useState('');
  const [industry, setIndustry] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [techStack, setTechStack] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const [isUserLoaded, setIsUserLoaded] = useState(false);

  // Fetch user data on component mount
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const displayName = userData.displayName || user.displayName || "User";
            setUserName(displayName);
            
            // Pre-fill preferences if available
            if (userData.jobRole) setJobRole(userData.jobRole);
            if (userData.industry) setIndustry(userData.industry);
            if (userData.techStack) {
              setTechStack(typeof userData.techStack === 'string' 
                ? userData.techStack 
                : Array.isArray(userData.techStack) ? userData.techStack.join(', ') : '');
            }
            if (userData.experienceLevel) setExperienceLevel(userData.experienceLevel);
          } else {
            setUserName(user.displayName || "User");
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
          toast.error('Could not load user profile.');
          setUserName(user.displayName || "User");
        } finally {
          setIsUserLoaded(true);
        }
      } else {
        setIsUserLoaded(true);
      }
    });
    
    return () => unsubscribe();
  }, []);

  const handleStartInterview = async () => {
    if (!jobRole || !industry || !experienceLevel) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    
    try {
      // Navigate to the interview page with state
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
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">
                Practice Your Interview Skills
              </CardTitle>
              <p className="text-muted-foreground mt-2">
                Complete this form to start an AI-powered mock interview with personalized feedback
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isUserLoaded ? (
                <div className="flex justify-center py-8">
                  <Loader className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <>
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
                        <SelectItem value="beginner">Beginner (0-2 yrs)</SelectItem>
                        <SelectItem value="intermediate">Intermediate (2-5 yrs)</SelectItem>
                        <SelectItem value="senior">Senior (5-8 yrs)</SelectItem>
                        <SelectItem value="expert">Expert (8+ yrs)</SelectItem>
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
                    className="w-full mt-4"
                    onClick={handleStartInterview}
                    disabled={isLoading}
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                        Preparing Interview...
                      </>
                    ) : (
                      <>
                        <Mic className="mr-2 h-5 w-5" />
                        Start Voice Interview
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default MockInterview;
