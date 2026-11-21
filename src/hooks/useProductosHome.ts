"use client";

import { useEffect, useState } from "react";
import { getProductos } from "@/lib/api";
import type { Producto } from "@/interfaces/producto";
import { horaDeLectura } from "@/lib/home";

// Las islas de la home comparten la request de getProductos (lib/api.ts), que vence a los 30 s y
// se limpia con invalidarProductos() al aprobarse un pago: no hay una segunda caché acá que
// pueda quedar con stock viejo.
function cargar() {
  return getProductos().then((productos) => ({ productos, leido: new Date() }));
}

export function useProductosHome() {
  const [datos, setDatos] = useState<{ productos: Producto[]; leido: Date } | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let vigente = true;
    cargar()
      .then((d) => vigente && setDatos(d))
      .catch(() => vigente && setError(true));
    return () => {
      vigente = false;
    };
  }, []);

  return {
    productos: datos?.productos ?? null,
    cargando: datos === null && !error,
    error,
    leidoA: datos ? horaDeLectura(datos.leido) : null,
  };
}
