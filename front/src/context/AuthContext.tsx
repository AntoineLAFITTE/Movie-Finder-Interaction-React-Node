import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as auth from "../services/auth";
import type { User } from "../services/auth";
import { getAccessToken, setAccessToken } from "../services/http";

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

  //Au chargement: si token => /me, sinon rien
  useEffect(() => {
    (async () => {
      try {
        const token = getAccessToken();
        if (!token) return;
        const me = await auth.me(); // enverra Authorization via http.ts
        setUser(me);
      } catch {
        setUser(null);
        setAccessToken(null);
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
        const { user: u, accessToken } = await auth.login(email, password);
        setAccessToken(accessToken);
        setUser(u);
      },

      register: async (username, email, password) => {
        const { user: u, accessToken } = await auth.register(username, email, password);
        setAccessToken(accessToken);
        setUser(u);
      },

      logout: async () => {
        await auth.logout(); // côté back tu peux juste clear cookie si tu veux
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
