
import { createContext, useContext, useState, useEffect } from "react";
import { 
  onAuthStateChanged, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  User as FirebaseUser
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { createUserIfNotExists } from "@/lib/firestore";
import { User } from "@/types/models";

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: User | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<FirebaseUser>;
  signIn: (email: string, password: string) => Promise<FirebaseUser>;
  signOut: () => Promise<void>;
  updateUserProfile: (displayName?: string, photoURL?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function signUp(email: string, password: string, name: string) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, {
      displayName: name
    });
    await createUserIfNotExists({
      id: userCredential.user.uid,
      email: userCredential.user.email || '',
      name: name,
      avatar: userCredential.user.photoURL || ''
    });
    return userCredential.user;
  }

  function signIn(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password)
      .then(userCredential => userCredential.user);
  }

  function signOut() {
    return auth.signOut();
  }

  async function updateUserProfile(displayName?: string, photoURL?: string) {
    if (!currentUser) return;
    
    const updateData: {
      displayName?: string;
      photoURL?: string;
    } = {};
    
    if (displayName) updateData.displayName = displayName;
    if (photoURL) updateData.photoURL = photoURL;
    
    await updateProfile(currentUser, updateData);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setLoading(false);
      
      // TODO: Fetch user profile from Firestore if needed
      // if (user) {
      //   const userProfile = await getUserProfile(user.uid);
      //   setUserProfile(userProfile);
      // }
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    loading,
    signUp,
    signIn,
    signOut,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
