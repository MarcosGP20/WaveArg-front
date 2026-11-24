"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { consumirAviso } from "@/lib/aviso-pendiente";

/** Muestra el aviso que dejó una navegación dura anterior (ver useCerrarSesion). */
export default function AvisoPendiente() {
  useEffect(() => {
    let storage: Storage | null = null;
    try {
      storage = window.sessionStorage;
    } catch {
      return;
    }
    const aviso = consumirAviso(storage);
    if (aviso) toast[aviso.tipo](aviso.mensaje);
  }, []);

  return null;
}
