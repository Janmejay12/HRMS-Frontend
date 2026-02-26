import React, { createContext, useContext, useEffect, useState } from "react";
import { getUserRole } from "../utils/auth";

interface User {
  role: string | null ;
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
    const storedRole = getUserRole()
    if (storedRole) {
      setUser({role : storedRole})
    }else{
      setUser(null)
    }
  }, []);

  const hasRole = (role: string) => {
    return user?.role === role;
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
