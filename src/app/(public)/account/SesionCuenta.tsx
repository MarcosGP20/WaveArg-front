"use client";

import { createContext, useContext, useEffect, useState } from "react";
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

  // Zustand se hidrata desde localStorage, que el servidor no tiene: lo guardado se usa recién
  // después de montar, para que el primer render coincida con el HTML del servidor.
  const [montado, setMontado] = useState(false);
  useEffect(() => setMontado(true), []);

  // El store queda alineado con la cookie: si estaba vacío (se borró localStorage) o era de otro
  // usuario, se reemplaza por los datos de la sesión (sin nombre, que el token no trae).
  useEffect(() => {
    const acceso = decidirAccesoCuenta(sesion, guardado?.id);
    if (acceso.tipo === "renderizar" && (acceso.limpiarUsuario || !guardado)) {
      useAuthStore.setState({ user: { id: sesion.id, email: sesion.email, rol: sesion.rol }, isLoggedIn: true });
    }
  }, [sesion, guardado]);

  const usuario = montado && guardado?.id === sesion.id ? guardado : null;
  return <CuentaContext.Provider value={{ sesion, usuario }}>{children}</CuentaContext.Provider>;
}
