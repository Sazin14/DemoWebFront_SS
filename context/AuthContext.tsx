"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import * as authService from "@/lib/auth/auth";
import type { User } from "@/lib/auth/types";

interface AuthContextValue {
  currentUser: User | null;
  isReady: boolean;
  initializationError: string | null;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [initializationError, setInitializationError] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const initialize = window.setTimeout(() => {
      try {
        setCurrentUser(authService.getCurrentUser());
      } catch (error) {
        setInitializationError(
          error instanceof Error
            ? error.message
            : "Temporary authentication data could not be loaded.",
        );
      } finally {
        setIsReady(true);
      }
    }, 0);

    return () => window.clearTimeout(initialize);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const user = authService.login(email, password);
    setCurrentUser(user);
    return user;
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const user = authService.register(name, email, password);
    setCurrentUser(user);
    return user;
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setCurrentUser(null);
  }, []);

  const value = useMemo(
    () => ({
      currentUser,
      isReady,
      initializationError,
      login,
      register,
      logout,
    }),
    [currentUser, isReady, initializationError, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }
  return context;
}
