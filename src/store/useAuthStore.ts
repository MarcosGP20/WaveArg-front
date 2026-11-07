// store/useAuthStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/interfaces/auth";

// Datos del usuario para mostrar (nombre, rol) guardados en el navegador. NO es la sesión: la
// sesión es la cookie httpOnly auth-token, que verifican src/proxy.ts y los layouts de /account y
// /admin. El token no se guarda acá (lo maneja crearSesion en el login).
interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  setAuth: (user: User) => void;
  updateUser: (partial: Partial<User>) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      setAuth: (user: User) => set({ user, isLoggedIn: true }),
      updateUser: (partial: Partial<User>) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...partial } : state.user,
        })),
      logout: async () => {
        set({ user: null, isLoggedIn: false });
        await fetch("/api/auth/session", { method: "DELETE" }).catch(() => {});
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isLoggedIn: state.isLoggedIn,
      }),
    }
  )
);
