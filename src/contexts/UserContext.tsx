
import { createContext, useContext, ReactNode } from 'react';
import { User } from 'firebase/auth';

interface UserContextType {
  user: User | null;
  loading: boolean;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
});

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
  user: User | null;
  loading: boolean;
}

export const UserProvider = ({ children, user, loading }: UserProviderProps) => {
  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  );
};
