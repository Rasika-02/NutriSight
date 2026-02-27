import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authApi } from "@/lib/api";

interface User {
  _id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("nutrisight_token");
    const storedUser = localStorage.getItem("nutrisight_user");
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("nutrisight_token");
        localStorage.removeItem("nutrisight_user");
      }
    }
    setLoading(false);
  }, []);

  const saveSession = (userData: User, jwtToken: string) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem("nutrisight_token", jwtToken);
    localStorage.setItem("nutrisight_user", JSON.stringify(userData));
  };

  const login = async (email: string, password: string) => {
    const data = await authApi.login(email, password);
    const { token: jwt, ...userInfo } = data;
    saveSession(userInfo, jwt);
  };

  const signup = async (name: string, email: string, password: string) => {
    const data = await authApi.signup(name, email, password);
    const { token: jwt, ...userInfo } = data;
    saveSession(userInfo, jwt);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("nutrisight_token");
    localStorage.removeItem("nutrisight_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
