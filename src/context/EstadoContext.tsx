"use client";
import { createContext, useContext, ReactNode } from "react";
import { ESTADO_POR_DEFECTO, EstadoSitio } from "@/lib/estado";

// El layout raíz consulta el estado en el servidor y lo reparte a los componentes de cliente
// (checkout, botón de Google) sin que cada uno lo pida.
const EstadoContext = createContext<EstadoSitio>(ESTADO_POR_DEFECTO);

export const EstadoProvider = ({ estado, children }: { estado: EstadoSitio; children: ReactNode }) => (
  <EstadoContext.Provider value={estado}>{children}</EstadoContext.Provider>
);

export const useEstado = () => useContext(EstadoContext);
