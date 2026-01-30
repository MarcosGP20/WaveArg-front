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

        // Guardar token en cookie para que el middleware lo lea
        if (typeof document !== "undefined") {
          const sevenDaysInSeconds = 7 * 24 * 60 * 60;
          document.cookie = `auth-token=${token}; path=/; max-age=${sevenDaysInSeconds}; SameSite=Strict`;
          console.log("🍪 Cookie auth-token guardada");
        }

        return set({ token, user, isLoggedIn: true });
      },
      logout: () => {
        console.log("🚪 Cerrando sesión");

        // Eliminar cookie
        if (typeof document !== "undefined") {
          document.cookie = "auth-token=; path=/; max-age=0; SameSite=Strict";
          console.log("🍪 Cookie auth-token eliminada");
        }

        return set({ token: null, user: null, isLoggedIn: false });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
