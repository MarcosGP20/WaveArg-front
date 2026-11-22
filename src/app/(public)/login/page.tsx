"use client";

import { LoginForm } from "@/components/LoginComponent";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect } from "react";

export default function LoginPage() {
  // src/proxy.ts manda a /account/profile a quien llega con una cookie de sesión válida, así que
  // acá la sesión falta o venció. Si el navegador todavía tiene el usuario guardado como logueado,
  // está desactualizado: se limpia en vez de redirigir con él, que rebotaba entre /login y
  // /account. Corre sólo al montar: el login exitoso de esta misma página no lo dispara.
  useEffect(() => {
    if (useAuthStore.getState().isLoggedIn) void useAuthStore.getState().logout();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F8FB] p-4">
      <LoginForm />
    </div>
  );
}
