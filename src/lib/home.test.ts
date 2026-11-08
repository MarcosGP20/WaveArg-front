import { describe, expect, it } from "vitest";
import type { Producto, Variante } from "@/interfaces/producto";
import {
  estadoDeLaVariante,
  estadoDelModelo,
  filasDelParte,
  horaDeLectura,
  unidadesEnStock,
  varianteMasBarata,
} from "./home";

function variante(id: number, precio: number, stock: number, esUsado = false): Variante {
  return { id, color: "Azul", memoria: "128GB", precio, stock, esUsado, detalleEstado: "", fotoEstadoUrl: null };
}

function producto(variantes: Variante[]): Producto {
  return {
    id: 1,
    nombre: "iPhone 14",
    modelo: "",
    descripcion: "",
    stockTotal: variantes.reduce((s, v) => s + v.stock, 0),
    imagenes: [],
    variantes,
  };
}

describe("varianteMasBarata", () => {
  it("elige la más barata entre las que tienen stock", () => {
    const p = producto([variante(1, 500, 0), variante(2, 900, 2), variante(3, 700, 1)]);
    expect(varianteMasBarata(p)?.id).toBe(3);
  });

  it("sin stock no hay variante", () => {
    expect(varianteMasBarata(producto([variante(1, 500, 0)]))).toBeNull();
  });
});

describe("estadoDelModelo", () => {
  it("sólo cuenta las variantes con stock", () => {
    expect(estadoDelModelo(producto([variante(1, 500, 2), variante(2, 400, 0, true)]))).toBe("Nuevo sellado");
    expect(estadoDelModelo(producto([variante(1, 500, 0), variante(2, 400, 1, true)]))).toBe("Usado");
  });

  it("con nuevos y usados en stock lo dice", () => {
    expect(estadoDelModelo(producto([variante(1, 500, 2), variante(2, 400, 1, true)]))).toBe("Nuevo y usado");
  });
});

describe("unidadesEnStock", () => {
  it("suma las variantes aunque stockTotal del back diga otra cosa", () => {
    const p = { ...producto([variante(1, 500, 20), variante(2, 400, 3)]), stockTotal: 0 };
    expect(unidadesEnStock(p)).toBe(23);
  });
});

describe("horaDeLectura", () => {
  it("devuelve horas y minutos en 24 h", () => {
    expect(horaDeLectura(new Date(2026, 9, 28, 14, 5))).toBe("14:05");
  });
});

describe("filasDelParte", () => {
  const usado = variante(1, 700, 1, true);
  const nuevoCaro = variante(2, 1200, 2);
  const nuevoBarato = variante(3, 900, 5);
  const agotado = variante(4, 500, 0);
  const p = producto([usado, nuevoCaro, nuevoBarato, agotado]);

  it("da una fila por variante con stock: nuevos primero y del más barato al más caro", () => {
    expect(filasDelParte([p]).map((f) => f.variante)).toEqual([nuevoBarato, nuevoCaro, usado]);
  });

  it("filtra por estado", () => {
    expect(filasDelParte([p], "usados").map((f) => f.variante)).toEqual([usado]);
    expect(filasDelParte([p], "nuevos").map((f) => f.variante)).toEqual([nuevoBarato, nuevoCaro]);
  });
});

describe("estadoDeLaVariante", () => {
  it("en usados suma el detalle que cargó el admin", () => {
    expect(estadoDeLaVariante({ ...variante(1, 1, 1, true), detalleEstado: "Batería 91%" })).toBe("Usado, batería 91%");
    expect(estadoDeLaVariante(variante(1, 1, 1, true))).toBe("Usado");
    expect(estadoDeLaVariante(variante(1, 1, 1))).toBe("Nuevo sellado");
  });
});
