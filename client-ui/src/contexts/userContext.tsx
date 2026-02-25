import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

// ✅ Define User type (edit as needed)
type User = {
  id: string;
  name: string;
  email?: string;
};

// ✅ Context type
type UserContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

// ✅ Create context
const UserContext = createContext<UserContextType | undefined>(undefined);

// ✅ Provider props type
type UserProviderProps = {
  children: ReactNode;
};

// ✅ Provider component
export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  // ⭐ memoized value (prevents unnecessary re-renders)
  const value = useMemo(() => ({ user, setUser }), [user]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// ✅ Custom hook (safe)
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }

  return context;
};