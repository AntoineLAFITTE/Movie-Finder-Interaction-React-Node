import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as auth from "../services/auth";
import type { User } from "../services/auth";
import { setAccessToken } from "../services/http";

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Au chargement: on  de tente refresh => /me
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/auth/refresh", { method: "POST", credentials: "include" });
        if (r.ok) {
          const data = await r.json();
          if (data?.accessToken) {
            setAccessToken(data.accessToken);
            const me = await auth.me();
            setUser(me);
          }
        }
      } catch {
        // ignore
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      login: async (email, password) => {
        const u = await auth.login(email, password);
        setUser(u);
      },
      register: async (username, email, password) => {
        const u = await auth.register(username, email, password);
        setUser(u);
      },
      logout: async () => {
        await auth.logout();
        setUser(null);
        setAccessToken(null);
      },
    }),
    [user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
