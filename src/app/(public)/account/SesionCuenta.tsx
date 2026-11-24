"use client";

import { createContext, useContext, useEffect } from "react";
import { useMontado } from "@/hooks/useMontado";
import { useRecargarSiVuelveDeBfcache } from "@/hooks/useRecargarSiVuelveDeBfcache";
import { decidirAccesoCuenta } from "@/lib/acceso-cuenta";
import { useAuthStore } from "@/store/useAuthStore";
import type { User } from "@/interfaces/auth";

interface SesionVerificada {
  id: string;
  email: string;
  rol: string;
}

interface Cuenta {
  // Sesión verificada en el servidor (account/layout.tsx).
  sesion: SesionVerificada;
  // Datos guardados en el navegador (el nombre): solo si son de la misma persona que la sesión.
  usuario: User | null;
}

const CuentaContext = createContext<Cuenta | null>(null);

export function useCuenta(): Cuenta {
  const cuenta = useContext(CuentaContext);
  if (!cuenta) throw new Error("useCuenta se usa dentro de app/(public)/account.");
  return cuenta;
}

export default function SesionCuenta({ sesion, children }: { sesion: SesionVerificada; children: React.ReactNode }) {
  const guardado = useAuthStore((s) => s.user);
  useRecargarSiVuelveDeBfcache();

  // Zustand se hidrata desde localStorage, que el servidor no tiene: lo guardado se usa recién
  // después de montar, para que el primer render coincida con el HTML del servidor.
  const montado = useMontado();

  // El store se alinea con la cookie al entrar a /account (o si cambia la sesión verificada): si
  // estaba vacío (se borró localStorage) o era de otro usuario, se reemplaza por los datos de la
  // sesión (sin nombre, que el token no trae). No reacciona a cambios posteriores del store: si el
  // usuario cierra sesión estando acá (logout vacía el store), no hay que volver a loguearlo.
  const { id, email, rol } = sesion;
  useEffect(() => {
    const actual = useAuthStore.getState().user;
    const acceso = decidirAccesoCuenta({ id, email, rol }, actual?.id);
    if (acceso.tipo === "renderizar" && (acceso.limpiarUsuario || !actual)) {
      useAuthStore.setState({ user: { id, email, rol }, isLoggedIn: true });
    }
  }, [id, email, rol]);

  const usuario = montado && guardado?.id === sesion.id ? guardado : null;
  return <CuentaContext.Provider value={{ sesion, usuario }}>{children}</CuentaContext.Provider>;
}
