import { describe, expect, it } from "vitest";
import type { Producto, Variante } from "@/interfaces/producto";
import { estadoDelModelo, horaDeLectura, unidadesEnStock, varianteMasBarata } from "./home";

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
