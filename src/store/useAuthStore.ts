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
        // Cookie para que el middleware y la API lean el mismo token
        if (typeof document !== "undefined") {
          const sevenDaysInSeconds = 7 * 24 * 60 * 60;
          // JWT es seguro en cookie tal cual (no encodear) para que el middleware lo pueda decodificar.
          document.cookie = `auth-token=${token}; path=/; max-age=${sevenDaysInSeconds}; SameSite=Strict`;
        }
        return set({ token, user, isLoggedIn: true });
      },
      logout: () => {
        if (typeof document !== "undefined") {
          document.cookie = "auth-token=; path=/; max-age=0; SameSite=Strict";
        }
        return set({ token: null, user: null, isLoggedIn: false });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
