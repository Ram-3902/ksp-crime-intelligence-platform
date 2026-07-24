import React, { createContext, useContext, useState, useEffect } from "react";
import type { User } from "../types";
import { api } from "../api/endpoints";

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (u: string, p: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("ksp_token");
    const savedUser = localStorage.getItem("ksp_user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("ksp_user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (u: string, p: string) => {
    const data = await api.login(u, p);
    setToken(data.access_token);
    setUser(data.user);
    localStorage.setItem("ksp_token", data.access_token);
    localStorage.setItem("ksp_user", JSON.stringify(data.user));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("ksp_token");
    localStorage.removeItem("ksp_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
