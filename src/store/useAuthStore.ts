// store/useAuthStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/interfaces/auth";

interface AuthState {
  token: string | null;
  user: User | null;
  isLoggedIn: boolean;
  setAuth: (token: string, user: User) => Promise<void>;
  updateUser: (partial: Partial<User>) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isLoggedIn: false,
      setAuth: async (token: string, user: User) => {
        const response = await fetch("/api/auth/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          throw new Error("No se pudo iniciar la sesion.");
        }

        set({ token, user, isLoggedIn: true });
      },
      updateUser: (partial: Partial<User>) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...partial } : state.user,
        })),
      logout: async () => {
        set({ token: null, user: null, isLoggedIn: false });
        await fetch("/api/auth/session", { method: "DELETE" }).catch(() => {});
      },
    }),
    {
      name: "auth-storage",
      // Solo persistimos user e isLoggedIn.
      // El token vive en la cookie auth-token (src/proxy.ts + fetchFromApi lo leen de ahí).
      // Persistirlo acá era redundante y podía desincronizarse si la cookie expiraba.
      partialize: (state) => ({
        user: state.user,
        isLoggedIn: state.isLoggedIn,
      }),
    }
  )
);
