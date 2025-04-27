import React, { useEffect, useState } from 'react';
import { useProfileForm } from '../hooks/useProfileForm';
import { useStaggeredAnimation } from '../hooks/useStaggeredAnimation';
import { ProfileData } from '../types/profile';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { careerFeatures, educationFeatures, skillCategories } from '../config/profileFeatures';
import {
  User, Briefcase, School, Star, Award, GraduationCap,
  Heart, Code, Upload, Edit, ChevronRight, Sparkles, ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ProfileDisplay = () => {
  const { profileData, fetchProfile } = useProfileForm();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [completionScore, setCompletionScore] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");

  // Setup staggered animations
  const { isVisible } = useStaggeredAnimation({
    itemCount: 10,
    staggerDelay: 100,
    initialDelay: 300,
  });

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      const data = await fetchProfile();
      if (data) {
        setProfile(data);
        calculateCompletionScore(data);
      }
      setLoading(false);
    };

    loadProfile();
  }, []);

  useEffect(() => {
    if (profileData) {
      setProfile(profileData);
      calculateCompletionScore(profileData);
    }
  }, [profileData]);

  const calculateCompletionScore = (data: ProfileData) => {
    const totalFields = Object.keys(data).length;
    let filledFields = 0;

    Object.entries(data).forEach(([_, value]) => {
      if (Array.isArray(value) && value.length > 0) filledFields++;
      else if (typeof value === 'string' && value.trim() !== '') filledFields++;
      else if (typeof value === 'number' && value > 0) filledFields++;
    });

    setCompletionScore(Math.round((filledFields / totalFields) * 100));
  };

  // Group skills by category
  const getSkillsByCategory = () => {
    if (!profile?.skills?.length) return [];

    return skillCategories.map(category => {
      const matchingSkills = category.skills.filter(skill =>
        profile.skills.includes(skill)
      );

      return {
        ...category,
        matchingSkills,
      };
    }).filter(category => category.matchingSkills.length > 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50 p-8">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50 p-8">
        <Card className="max-w-md p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Profile Not Found</h2>
          <p className="mb-6 text-gray-600">We couldn't find your profile information. Let's create one now!</p>
          <Button asChild>
            <Link to="/">Create Profile</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[5%] -left-[10%] w-[400px] h-[400px] bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
        <div className="absolute top-[30%] -right-[5%] w-[500px] h-[500px] bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute -bottom-[10%] left-[30%] w-[600px] h-[600px] bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '2.8s' }}></div>
      </div>

      <div className="container max-w-4xl mx-auto px-4 py-10 relative">
        {/* Back Button */}
        
        <Button
          asChild
          variant="ghost"
          className="absolute top-4 left-4 md:top-6 md:left-6 z-10 hover:bg-gray-100 transition-colors"
        >
          <Link to="/dashboard" className="flex items-center gap-2 text-gray-600">
            <ArrowLeft className="w-5 h-5" /> Back to Dashboard
          </Link>
        </Button>

        {/* Profile Header */}
        <div
          className={`mb-8 rounded-xl overflow-hidden shadow-lg transition-all duration-500 transform ${
            isVisible(0) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600 relative"></div>
          <div className="bg-white p-6 pb-8 relative">
            <div className="absolute -top-12 left-6 w-24 h-24 bg-white rounded-full p-1 shadow-lg">
              <div className="w-full h-full rounded-full bg-gradient-to-r from-purple-400 to-indigo-500 flex items-center justify-center text-white">
                <User size={40} />
              </div>
            </div>
            <div className="ml-28">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    {profile.firstName} {profile.lastName}
                  </h1>
                  <p className="text-gray-500">{profile.targetRole || 'Aspiring Tech Professional'}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 hover-lift"
                  asChild
                >
                  <Link to="/">
                    <Edit size={14} />
                    Edit Profile
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Completion */}
        <Card
          className={`mb-8 p-4 hover:shadow-lg transition-shadow duration-300 bg-white/90 backdrop-blur-md animate-fade-in ${
            isVisible(1) ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold flex items-center gap-2">
              <Award size={18} className="text-indigo-500" />
              Profile Completion
            </h2>
            <span className="text-sm font-medium text-gray-700">{completionScore}%</span>
          </div>
          <Progress value={completionScore} className="h-2 mb-2" />
          <p className="text-sm text-gray-500">
            {completionScore < 50 ? (
              'Enhance your profile to get better interview recommendations!'
            ) : completionScore < 80 ? (
              'Your profile is coming along well, just a few more details needed.'
            ) : (
              'Your profile is highly detailed - great job!'
            )}
          </p>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="animate-fade-in">
          <TabsList className={`w-full mb-6 bg-white/50 backdrop-blur-sm ${
            isVisible(2) ? 'opacity-100' : 'opacity-0'
          }`}>
            <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
            <TabsTrigger value="skills" className="flex-1">Skills & Interests</TabsTrigger>
            <TabsTrigger value="career" className="flex-1">Career</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Personal Info Card */}
              <Card
                className={`p-6 hover:shadow-lg transition-shadow duration-300 bg-white/90 backdrop-blur-md ${
                  isVisible(3) ? 'opacity-100 animate-slide-in-left' : 'opacity-0'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-indigo-100 rounded-full">
                    <User className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-sm text-gray-500">First Name</p>
                          <p className="font-medium">{profile.firstName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Last Name</p>
                          <p className="font-medium">{profile.lastName}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-sm text-gray-500">Age</p>
                          <p className="font-medium">{profile.age}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Gender</p>
                          <p className="font-medium capitalize">{profile.gender}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Bio Card */}
              <Card
                className={`p-6 hover:shadow-lg transition-shadow duration-300 bg-white/90 backdrop-blur-md ${
                  isVisible(4) ? 'opacity-100 animate-slide-in-right' : 'opacity-0'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <GraduationCap className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold mb-4">About</h2>
                    <p className="text-gray-700">{profile.bio || 'No bio provided'}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Career Goals */}
            <Card
              className={`p-6 mb-6 hover:shadow-lg transition-shadow duration-300 bg-white/90 backdrop-blur-md ${
                isVisible(5) ? 'opacity-100 animate-slide-in-left' : 'opacity-0'
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold">Career Goals</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <p className="text-sm text-blue-600 mb-1">Dream Company</p>
                  <p className="font-medium text-gray-800">{profile.dreamCompany || 'Not specified'}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <p className="text-sm text-purple-600 mb-1">Target Role</p>
                  <p className="font-medium text-gray-800">{profile.targetRole || 'Not specified'}</p>
                </div>
                <div className="bg-indigo-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <p className="text-sm text-indigo-600 mb-1">Engineering Year</p>
                  <p className="font-medium text-gray-800">
                    {profile.engineeringYear ?
                      (profile.engineeringYear === 'graduate' ? 'Graduate' : `${profile.engineeringYear} Year`) :
                      'Not specified'
                    }
                  </p>
                </div>
              </div>
            </Card>

            {/* Interests Preview */}
            <Card
              className={`p-6 hover:shadow-lg transition-shadow duration-300 bg-white/90 backdrop-blur-md ${
                isVisible(6) ? 'opacity-100 animate-slide-in-right' : 'opacity-0'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-pink-100 rounded-full">
                    <Heart className="w-5 h-5 text-pink-600" />
                  </div>
                  <h2 className="text-xl font-semibold">Interests</h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-indigo-600 hover:text-indigo-800"
                  onClick={() => setActiveTab("skills")}
                >
                  View All <ChevronRight size={16} />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.interests.slice(0, 10).map((interest, index) => (
                  <Badge
                    key={interest}
                    variant="secondary"
                    className="animate-fade-in bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white transition-all hover-lift"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {interest}
                  </Badge>
                ))}
                {profile.interests.length === 0 && (
                  <p className="text-gray-500">No interests added yet</p>
                )}
                {profile.interests.length > 10 && (
                  <Badge variant="outline">+{profile.interests.length - 10} more</Badge>
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="skills">
            {/* Skills Section */}
            <Card className="p-6 mb-6 hover:shadow-lg transition-shadow duration-300 bg-white/90 backdrop-blur-md animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-100 rounded-full">
                  <Code className="w-5 h-5 text-indigo-600" />
                </div>
                <h2 className="text-xl font-semibold">Skills</h2>
              </div>

              {getSkillsByCategory().length > 0 ? (
                <div className="space-y-6">
                  {getSkillsByCategory().map((category, categoryIndex) => (
                    <div key={category.name} className="animate-fade-in" style={{ animationDelay: `${categoryIndex * 100}ms` }}>
                      <div className="flex items-center gap-2 mb-3">
                      <h3 className="font-medium text-gray-700">{category.name}</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {category.matchingSkills.map((skill, index) => (
                          <Badge
                            key={skill}
                            className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition-colors hover-lift"
                            style={{ animationDelay: `${index * 50 + categoryIndex * 100}ms` }}
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">You haven't added any skills yet.</p>
                  <Button asChild variant="outline">
                    <Link to="/">Add Skills</Link>
                  </Button>
                </div>
              )}
            </Card>

            {/* Interests Section */}
            <Card className="p-6 hover:shadow-lg transition-shadow duration-300 bg-white/90 backdrop-blur-md animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-pink-100 rounded-full">
                  <Heart className="w-5 h-5 text-pink-600" />
                </div>
                <h2 className="text-xl font-semibold">Interests</h2>
              </div>

              {profile.interests.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest, index) => (
                    <Badge
                      key={interest}
                      variant="secondary"
                      className="animate-fade-in bg-gradient-to-r from-pink-400 to-rose-500 hover:from-pink-500 hover:to-rose-600 text-white transition-all hover-lift"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">You haven't added any interests yet.</p>
                  <Button asChild variant="outline">
                    <Link to="/">Add Interests</Link>
                  </Button>
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="career">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Career Goals */}
              <Card className="p-6 hover:shadow-lg transition-shadow duration-300 bg-white/90 backdrop-blur-md animate-fade-in">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-indigo-100 rounded-full">
                    <Briefcase className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h2 className="text-xl font-semibold">Career Goals</h2>
                </div>
                <div className="space-y-4">
                  {careerFeatures.map((feature, index) => (
                    <div key={feature.id} className="p-4 bg-gray-50 rounded-lg animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                      <div className="flex items-center gap-3 mb-1">
                        <feature.icon size={16} className="text-indigo-600" />
                        <h3 className="font-medium text-gray-700">{feature.title}</h3>
                      </div>
                      <p className="text-gray-500 text-sm mb-2">{feature.description}</p>
                      <p className="font-medium">
                        {feature.id === 'dream-company'
                          ? profile.dreamCompany || 'Not specified'
                          : profile.targetRole || 'Not specified'
                        }
                      </p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Education */}
              <Card className="p-6 hover:shadow-lg transition-shadow duration-300 bg-white/90 backdrop-blur-md animate-fade-in">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <School className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-semibold">Education</h2>
                </div>
                <div className="space-y-4">
                  {educationFeatures.map((feature, index) => (
                    <div key={feature.id} className="p-4 bg-gray-50 rounded-lg animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                      <div className="flex items-center gap-3 mb-1">
                        <feature.icon size={16} className="text-blue-600" />
                        <h3 className="font-medium text-gray-700">{feature.title}</h3>
                      </div>
                      <p className="text-gray-500 text-sm mb-2">{feature.description}</p>
                      <p className="font-medium">
                        {profile.engineeringYear ?
                          (profile.engineeringYear === 'graduate' ? 'Graduate' : `${profile.engineeringYear} Year`) :
                          'Not specified'
                        }
                      </p>
                    </div>
                  ))}
                </div>

                {/* Room for future education sections */}
                <div className="mt-6 p-4 border border-dashed border-gray-300 rounded-lg text-center">
                  <p className="text-gray-500 text-sm mb-2">More education details coming soon</p>
                  <Button variant="outline" size="sm" className="flex items-center gap-1" disabled>
                    <Sparkles size={14} />
                    Add Education History
                  </Button>
                </div>
              </Card>
            </div>

            {/* Additional Career Development Card */}
            <Card className="p-6 hover:shadow-lg transition-shadow duration-300 bg-white/90 backdrop-blur-md animate-fade-in">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-full">
                  <Star className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-xl font-semibold">Career Development</h2>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-5 rounded-lg text-center hover-lift transition-all">
                  <h3 className="font-medium mb-2 text-gray-900">Mock Interviews</h3>
                  <p className="text-sm text-gray-600 mb-3">Practice for your dream job</p>
                  <Button variant="outline" size="sm" disabled>Coming soon</Button>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-sky-50 p-5 rounded-lg text-center hover-lift transition-all">
                  <h3 className="font-medium mb-2 text-gray-900">Resume Builder</h3>
                  <p className="text-sm text-gray-600 mb-3">Create a professional resume</p>
                  <Button variant="outline" size="sm" disabled>Coming soon</Button>
                </div>

                <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-5 rounded-lg text-center hover-lift transition-all">
                  <h3 className="font-medium mb-2 text-gray-900">Interview Tips</h3>
                  <p className="text-sm text-gray-600 mb-3">Expert advice for success</p>
                  <Button variant="outline" size="sm" disabled>Coming soon</Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfileDisplay;