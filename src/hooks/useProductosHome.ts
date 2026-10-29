"use client";

import { useEffect, useState } from "react";
import { getProductos } from "@/lib/api";
import type { Producto } from "@/interfaces/producto";
import { horaDeLectura } from "@/lib/home";

// Una sola request a /Productos por carga de la home, aunque la pidan varias islas.
let pedido: Promise<{ productos: Producto[]; leido: Date }> | null = null;

function cargar() {
  pedido ??= getProductos()
    .then((productos) => ({ productos, leido: new Date() }))
    .catch((e) => {
      pedido = null; // un error no queda cacheado: la próxima visita reintenta
      throw e;
    });
  return pedido;
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
