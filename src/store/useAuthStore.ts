// store/useAuthStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/interfaces/auth";

interface AuthState {
  token: string | null;
  user: User | null;
  isLoggedIn: boolean;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isLoggedIn: false,
      setAuth: (token: string, user: User) => {
        console.log("💾 Guardando en Zustand:", { token, user });
        return set({ token, user, isLoggedIn: true });
      },
      logout: () => set({ token: null, user: null, isLoggedIn: false }),
    }),
    {
      name: "auth-storage", // nombre de la key en localStorage
    }
  )
);
