import { describe, expect, it } from "vitest";
import type { Variante } from "@/interfaces/producto";
import {
  capacidadesDelColor,
  coloresDelEstado,
  estadosDisponibles,
  memoriaEnGB,
  resolverVariante,
  varianteInicial,
} from "./configurador";

let siguienteId = 1;
function v(color: string, memoria: string, esUsado: boolean, precio: number, stock: number): Variante {
  return { id: siguienteId++, color, memoria, esUsado, precio, stock, detalleEstado: "", fotoEstadoUrl: null };
}

const negro128 = v("Negro", "128 GB", false, 1000, 2);
const negro256 = v("Negro", "256 GB", false, 1200, 0);
const blanco1tb = v("Blanco", "1 TB", false, 1800, 1);
const usadoNegro128SinStock = v("Negro", "128 GB", true, 700, 0);
const usadoNegro128 = v("Negro", "128 GB", true, 750, 1);
const variantes = [negro128, negro256, blanco1tb, usadoNegro128SinStock, usadoNegro128];

describe("memoriaEnGB", () => {
  it("convierte TB a GB para ordenar", () => {
    expect(memoriaEnGB("128 GB")).toBe(128);
    expect(memoriaEnGB("1 TB")).toBe(1024);
    expect(memoriaEnGB("sin dato")).toBe(0);
  });
});

describe("resolverVariante", () => {
  it("respeta color y capacidad cuando existen", () => {
    expect(resolverVariante(variantes, { esUsado: false, color: "Negro", memoria: "256 GB" })).toBe(negro256);
  });

  it("al cambiar de estado conserva el color si puede", () => {
    expect(resolverVariante(variantes, { esUsado: true, color: "Negro", memoria: "1 TB" })).toBe(usadoNegro128);
  });

  it("entre unidades iguales elige la que tiene stock", () => {
    expect(resolverVariante(variantes, { esUsado: true, color: "Negro", memoria: "128 GB" })).toBe(usadoNegro128);
  });
});

describe("estadosDisponibles", () => {
  it("da el precio desde de cada estado contando sólo lo que tiene stock", () => {
    expect(estadosDisponibles(variantes)).toEqual([
      { esUsado: false, desde: 1000, hayStock: true },
      { esUsado: true, desde: 750, hayStock: true },
    ]);
  });

  it("omite el estado que el producto no tiene", () => {
    expect(estadosDisponibles([negro128])).toHaveLength(1);
  });
});

describe("coloresDelEstado", () => {
  it("lista los colores del estado y si alguno tiene stock", () => {
    expect(coloresDelEstado(variantes, false)).toEqual([
      { color: "Negro", hayStock: true },
      { color: "Blanco", hayStock: true },
    ]);
  });
});

describe("capacidadesDelColor", () => {
  it("muestra todas las capacidades del estado, ordenadas, y deshabilita las que no hay", () => {
    expect(capacidadesDelColor(variantes, false, "Negro")).toEqual([
      { memoria: "128 GB", variante: negro128, disponible: true },
      { memoria: "256 GB", variante: negro256, disponible: false },
      { memoria: "1 TB", variante: undefined, disponible: false },
    ]);
  });
});

describe("varianteInicial", () => {
  it("usa la del link si existe", () => {
    expect(varianteInicial(variantes, String(usadoNegro128.id))).toBe(usadoNegro128);
  });

  it("sin link, elige una nueva con stock", () => {
    expect(varianteInicial(variantes, "no-existe")).toBe(negro128);
  });
});
