import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DashboardNav } from "@/components/DashboardNav";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { toast } from "sonner";

interface UserProfile {
  displayName: string;
  jobRole: string;
  techStack: string;
  experienceLevel: ExperienceLevel;
  bio: string;
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile>({
    displayName: "",
    jobRole: "",
    techStack: "",
    experienceLevel: "intermediate",
    bio: "",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data() as UserProfile;
            setProfile({
              displayName: userData.displayName || user.displayName || "",
              jobRole: userData.jobRole || "",
              techStack: userData.techStack || "",
              experienceLevel: userData.experienceLevel || "intermediate",
              bio: userData.bio || "",
            });
          } else if (user.displayName) {
            setProfile(prev => ({ ...prev, displayName: user.displayName || "" }));
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          toast.error("Failed to load profile. Please try again.");
        }
        setLoading(false);
      } else {
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!auth.currentUser) {
      toast.error("You must be logged in to save your profile.");
      return;
    }

    setSaving(true);
    try {
      await setDoc(doc(db, "users", auth.currentUser.uid), profile, { merge: true });
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background flex items-center justify-center">
        <DashboardNav />
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background pt-24 px-4">
      <DashboardNav />
      <div className="container max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Your Profile</h1>
          <p className="text-muted-foreground">Update your profile information to personalize your interview experiences</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              This information will be used to customize your interview practice sessions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="displayName">Full Name</Label>
              <Input
                id="displayName"
                name="displayName"
                value={profile.displayName}
                onChange={handleChange}
                placeholder="Your name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobRole">Current or Target Job Role</Label>
              <Input
                id="jobRole"
                name="jobRole"
                value={profile.jobRole}
                onChange={handleChange}
                placeholder="e.g. Frontend Developer, Data Scientist"
              />
              <p className="text-sm text-muted-foreground">
                This will be used to tailor interview questions to your field.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="techStack">Tech Stack / Skills</Label>
              <Input
                id="techStack"
                name="techStack"
                value={profile.techStack}
                onChange={handleChange}
                placeholder="e.g. React, Node.js, Python, SQL"
              />
              <p className="text-sm text-muted-foreground">
                List technologies and skills you want to be interviewed on, separated by commas.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="experienceLevel">Experience Level</Label>
              <select
                id="experienceLevel"
                name="experienceLevel"
                value={profile.experienceLevel}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="beginner">Beginner (0-1 years)</option>
                <option value="intermediate">Intermediate (2-4 years)</option>
                <option value="expert">Expert (5+ years)</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">About You</Label>
              <textarea
                id="bio"
                name="bio"
                value={profile.bio}
                onChange={handleChange}
                placeholder="Brief description about your background and career goals"
                className="flex h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => navigate("/dashboard")}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={saving}
              className="bg-gradient-to-r from-primary to-primary/80 text-white"
            >
              {saving ? "Saving..." : "Save Profile"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
