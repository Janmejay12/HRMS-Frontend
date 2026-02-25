import React, { createContext, useEffect, useState } from "react";

interface User {
  email: string;
  role: string;
}
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  hasRole: (role: string) => boolean;
}
const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  
  const hasRole = (role: string) => {
    return user?.role. role ?? false;
  };
  return <div></div>;
};

export default AuthContext;
