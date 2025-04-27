import { useState, useEffect } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { ProfileData } from '../types/profile';

export const useProfileForm = (userId?: string) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    age: 0,
    gender: '',
    bio: '',
    interests: [],
    dreamCompany: '',
    skills: [],
    targetRole: '',
    engineeringYear: '',
  });

  // Progress bar logic
  useEffect(() => {
    const totalFields = Object.keys(profileData).length;
    let filledFields = 0;

    Object.entries(profileData).forEach(([_, value]) => {
      if (Array.isArray(value) && value.length > 0) filledFields++;
      else if (typeof value === 'string' && value.trim() !== '') filledFields++;
      else if (typeof value === 'number' && value > 0) filledFields++;
    });

    setProgress(Math.round((filledFields / totalFields) * 100));
  }, [profileData]);

  const handleInputChange = (field: keyof ProfileData, value: any) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const goToStep = (step: number) => {
    setIsFlipped(true);
    setTimeout(() => {
      setCurrentStep(step);
      setIsFlipped(false);
    }, 300);
  };

  const goToNextStep = () => {
    if (currentStep < 3) goToStep(currentStep + 1);
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) goToStep(currentStep - 1);
  };

  const saveProfile = async (customUserId?: string) => {
    setIsSubmitting(true);
    try {
      const uid = customUserId || userId || auth.currentUser?.uid;
      if (!uid) throw new Error('No user ID provided');
  
      // 👇 Save profile as a field inside users/{uid}
      await setDoc(doc(db, 'users', uid), {
        profile: profileData,
      }, { merge: true }); // ← keeps other fields if any
  
      toast({
        title: "Profile Created!",
        description: "Your profile has been successfully saved.",
      });
  
      setIsSubmitting(false);
      return true;
  
    } catch (error: any) {
      console.error("Error saving profile:", error.message);
      toast({
        title: "Error",
        description: `Failed to save profile: ${error.message}`,
        variant: "destructive",
      });
      setIsSubmitting(false);
      return false;
    }
  };

  const submitProfile = async () => {
    const success = await saveProfile();
    if (success) navigate('/profile');
  };

  const fetchProfile = async (customUserId?: string) => {
    try {
      const uid = customUserId || userId || auth.currentUser?.uid;
      if (!uid) throw new Error('No user ID provided');
  
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.profile) {
          setProfileData(data.profile);
          return data.profile;
        } else {
          console.warn("No profile data found");
          return null;
        }
      } else {
        console.warn("No such document");
        return null;
      }
  
    } catch (error: any) {
      console.error("Error fetching profile:", error.message);
      toast({
        title: "Error",
        description: "Failed to load profile data.",
        variant: "destructive",
      });
      return null;
    }
  };
  return {
    profileData,
    setProfileData,
    handleInputChange,
    currentStep,
    isFlipped,
    isSubmitting,
    progress,
    goToNextStep,
    goToPreviousStep,
    submitProfile,
    saveProfile,
    fetchProfile,
  };
};
