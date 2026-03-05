"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { User } from "@/types";
import { getCurrentUser, setCurrentUser as persistUser } from "@/lib/store";
import { generateId } from "@/lib/utils";

interface UserContextValue {
  user: User | null;
  setUser: (user: User | null) => void;
  signIn: (email: string, country: string, city: string, area: string) => User;
  signOut: () => void;
  updateLocation: (country: string, city: string, area: string) => void;
}

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);

  useEffect(() => {
    setUserState(getCurrentUser());
  }, []);

  const setUser = useCallback((u: User | null) => {
    setUserState(u);
    if (u) persistUser(u);
    else if (typeof window !== "undefined") localStorage.removeItem("echodrop_user");
  }, []);

  const signIn = useCallback((email: string, country: string, city: string, area: string): User => {
    const newUser: User = {
      id: generateId(),
      email,
      country,
      city,
      area,
      deliveryCadence: 2,
    };
    persistUser(newUser);
    setUserState(newUser);
    return newUser;
  }, []);

  const signOut = useCallback(() => {
    if (typeof window !== "undefined") localStorage.removeItem("echodrop_user");
    setUserState(null);
  }, []);

  const updateLocation = useCallback((country: string, city: string, area: string) => {
    if (!user) return;
    const updated: User = { ...user, country, city, area };
    persistUser(updated);
    setUserState(updated);
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser, signIn, signOut, updateLocation }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}
