"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  role: string;
  username: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUserState] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const initAuth = () => {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (storedToken) setTokenState(storedToken);
      if (storedUser) setUserState(JSON.parse(storedUser));

      if (!storedToken) router.push("/forbidden");

      setMounted(true);
    };

    const timer = setTimeout(initAuth, 0);
    return () => clearTimeout(timer);
  }, [router]);

  const setAuth = (t: string, u: User) => {
    if (!mounted) return;
    localStorage.setItem("token", t);
    localStorage.setItem("user", JSON.stringify(u));
    setTokenState(t);
    setUserState(u);
  };

  const logout = () => {
    if (!mounted) return;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setTokenState(null);
    setUserState(null);
    router.push("/login");
  };

  if (!mounted) return null;

  return <AuthContext.Provider value={{ token, user, setAuth, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
