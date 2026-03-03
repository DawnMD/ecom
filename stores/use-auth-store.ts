"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthUser = {
  email: string;
  name: string;
};

type LoginInput = {
  email: string;
  password: string;
};

type AuthState = {
  user: AuthUser | null;
  hasHydrated: boolean;
  login: ({ email }: LoginInput) => void;
  logout: () => void;
  setHasHydrated: (value: boolean) => void;
};

const createDisplayName = (email: string) => {
  const localPart = email.split("@")[0] ?? "";
  if (!localPart) {
    return "Guest";
  }

  return localPart
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      hasHydrated: false,
      login: ({ email }) => {
        set({
          user: {
            email,
            name: createDisplayName(email),
          },
        });
      },
      logout: () => {
        set({ user: null });
      },
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: "auth-store",
      partialize: (state) => ({ user: state.user }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

export const useAuthUser = () => useAuthStore((state) => state.user);

export const useIsAuthenticated = () =>
  useAuthStore((state) => Boolean(state.user));
