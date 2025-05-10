import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock, Mail, UserPlus, UserRound } from "lucide-react";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { toast } from "sonner";
import { useUser } from "@/contexts/UserContext";
import { sendEmailVerification } from "firebase/auth";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser();

  // Redirect if user is already logged in
  if (user) {
    navigate("/");
  }

  const checkUserProfile = async (userId: string) => {
    try {
      const profileDoc = await getDoc(doc(db, 'profiles', userId));
      return profileDoc.exists();
    } catch (error) {
      console.error("Error checking profile:", error);
      return false;
    }
  };


  const handleSubmit = async () => {
    if (!email || !password || (!isLogin && !name)) {
      setError(isLogin ? "Please enter email and password" : "Please enter name, email, and password");
      return;
    }
  
    setError("");
    setIsLoading(true);
  
    try {
      if (isLogin) {
        const { user } = await signInWithEmailAndPassword(auth, email, password);
        
        if (!user.emailVerified) {
          toast.warning("Email not verified", {
            description: "Please check your inbox for a verification email."
          });
          await sendEmailVerification(user);
          return;
        }
  
        toast.success("Welcome back!", {
          description: "Successfully logged in to your account."
        });
  
        navigate("/profile-setup");
      } else {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
  
        await updateProfile(user, { displayName: name });
  
        await setDoc(doc(db, 'profiles', user.uid), {
          name: name,
          email: user.email,
          createdAt: new Date().toISOString()
        });
  
        // Send verification email
        await sendEmailVerification(user);
  
        toast.success("Account created!", {
          description: "Verification email sent. Please verify your email before continuing."
        });
  
        // Don't navigate until user verifies
        setIsLogin(true); // Switch to login view after sign up
      }
    } catch (err: any) {
      let errorMessage = "An error occurred. Please try again.";
  
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = "This email is already registered. Please sign in instead.";
      } else if (err.code === 'auth/weak-password') {
        errorMessage = "Password should be at least 6 characters long.";
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = "Please enter a valid email address.";
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        errorMessage = "Invalid email or password.";
      }
  
      setError(errorMessage);
      toast.error("Error", {
        description: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-background via-muted to-background p-4 relative">
      <AnimatedBackground />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-2 backdrop-blur-sm bg-card/50">
          <CardHeader className="space-y-3">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-[#9b87f5] via-[#8a78d9] to-[#7E69AB] bg-clip-text text-transparent">
              {isLogin ? "Welcome Back" : "Create Account"}
            </CardTitle>
            <CardDescription>
              {isLogin
                ? "Enter your credentials to access your account"
                : "Fill in the information to create your account"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={isLogin ? "login" : "signup"}
                initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <UserRound className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="name"
                        placeholder="John Doe"
                        className="pl-10"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      className="pl-10 pr-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-10 w-10 px-3 py-2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <Eye className="h-5 w-5 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button
                  className="w-full bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] hover:opacity-90 transition-all"
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : isLogin ? "Sign In" : "Sign Up"}
                </Button>
              </motion.div>
            </AnimatePresence>
          </CardContent>
          <CardFooter>
            <div className="w-full text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors group inline-flex items-center gap-1"
              >
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <span className="text-[#9b87f5] group-hover:underline inline-flex items-center gap-1">
                  {isLogin ? "Sign up" : "Sign in"} 
                  {isLogin && <UserPlus className="h-4 w-4" />}
                </span>
              </button>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default Auth;
