"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

type UserRole = "user" | "admin";

type AuthContextType = {
  isLoggedIn: boolean;
  role: UserRole | null;
  login: (role: UserRole) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<UserRole | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("auth");
    const storedRole = localStorage.getItem("role") as UserRole | null;

    if (stored === "true") {
      setIsLoggedIn(true);
      if (storedRole) setRole(storedRole);
    }
  }, []);

  const login = (role: UserRole) => {
    setIsLoggedIn(true);
    setRole(role);
    localStorage.setItem("auth", "true");
    localStorage.setItem("role", role);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setRole(null);
    localStorage.setItem("auth", "false");
    localStorage.removeItem("role");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
