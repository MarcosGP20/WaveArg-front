"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { ApiError, CODIGO_VINCULAR_GOOGLE, loginWithGoogle, vincularGoogle } from "@/lib/api";
import type { AuthResponse } from "@/interfaces/auth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const GoogleLoginButton = dynamic(() => import("@/components/GoogleLoginButton"), { ssr: false });

interface GoogleAuthProps {
  onSuccess: (response: AuthResponse) => void | Promise<void>;
  onStatus: (mensaje: string) => void;
  onError: (mensaje: string) => void;
  text?: "signin_with" | "signup_with" | "continue_with" | "signin";
}

interface VinculoPendiente {
  credential: string;
  email: string;
}

/**
 * Botón de Google para login y registro. Si el email ya tiene una cuenta con contraseña, el
 * backend responde 409 VINCULAR_GOOGLE: se le pregunta al usuario si quiere unificarlas y,
 * si acepta, se llama a /Auth/google/vincular con el mismo idToken.
 */
export default function GoogleAuth({ onSuccess, onStatus, onError, text = "continue_with" }: GoogleAuthProps) {
  const [vinculo, setVinculo] = useState<VinculoPendiente | null>(null);

  const ingresar = async (credential: string, vincular: boolean) => {
    onError("");
    onStatus(vincular ? "Unificando tus cuentas..." : "Verificando cuenta de Google...");
    try {
      const response = vincular ? await vincularGoogle(credential) : await loginWithGoogle(credential);
      if (response?.token) await onSuccess(response);
    } catch (error: unknown) {
      onStatus("");
      if (!vincular && error instanceof ApiError && error.status === 409 && error.data.codigo === CODIGO_VINCULAR_GOOGLE) {
        setVinculo({ credential, email: String(error.data.email ?? "") });
        return;
      }
      onError(error instanceof Error ? error.message : "Error al ingresar con Google.");
    }
  };

  const confirmar = () => {
    if (!vinculo) return;
    const { credential } = vinculo;
    setVinculo(null);
    void ingresar(credential, true);
  };

  const cancelar = () => {
    setVinculo(null);
    onError("Para usar tu cuenta existente, ingresá con tu email y contraseña.");
  };

  return (
    <>
      <GoogleLoginButton
        onSuccess={({ credential }) => credential && ingresar(credential, false)}
        onError={() => onError("Error al conectar con Google. Intentá de nuevo.")}
        text={text}
      />

      {/* Cerrar (Esc, afuera o cualquier botón) sólo descarta el vínculo; el mensaje va en el botón Cancelar. */}
      <AlertDialog open={vinculo !== null} onOpenChange={(open) => !open && setVinculo(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Unificar tus cuentas?</AlertDialogTitle>
            <AlertDialogDescription>
              Ya tenés una cuenta en Wave Arg con <strong>{vinculo?.email}</strong>. Si la unificás con Google,
              vas a poder entrar con Google o con tu contraseña, y vas a ver todos tus pedidos en un solo lugar.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelar}>No, usar mi contraseña</AlertDialogCancel>
            <AlertDialogAction onClick={confirmar}>Sí, unificar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
