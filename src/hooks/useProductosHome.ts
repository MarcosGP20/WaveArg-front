"use client";

import { useEffect, useState } from "react";
import { getProductos } from "@/lib/api";
import type { Producto } from "@/interfaces/producto";
import { elegirDestacado } from "@/lib/home";

// El hero y el riel de modelos usan el mismo listado: una sola request por carga de la home.
let pedido: Promise<Producto[]> | null = null;

function cargar(): Promise<Producto[]> {
  pedido ??= getProductos().catch((e) => {
    pedido = null; // un error no queda cacheado: la próxima visita reintenta
    throw e;
  });
  return pedido;
}

const CLAVE_DESTACADO = "wave-featured-product-id";

export function useProductosHome() {
  const [productos, setProductos] = useState<Producto[] | null>(null);
  const [error, setError] = useState(false);
  const [destacadoId, setDestacadoId] = useState<number | null>(null);

  useEffect(() => {
    let vigente = true;
    try {
      const guardado = Number(localStorage.getItem(CLAVE_DESTACADO));
      if (guardado) setDestacadoId(guardado);
    } catch {}
    cargar()
      .then((p) => vigente && setProductos(p))
      .catch(() => vigente && setError(true));
    return () => {
      vigente = false;
    };
  }, []);

  return {
    productos,
    cargando: productos === null && !error,
    error,
    destacado: productos ? elegirDestacado(productos, destacadoId) : null,
  };
}
