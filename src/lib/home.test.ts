import { describe, expect, it } from "vitest";
import type { Producto, Variante } from "@/interfaces/producto";
import {
  estadoDeLaVariante,
  estadoDelModelo,
  filasDelParte,
  horaDeLectura,
  resumenDeOpciones,
  tarjetasDeModelos,
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

describe("tarjetasDeModelos", () => {
  const usado = { ...variante(1, 700, 1, true), memoria: "64GB", color: "Negro" };
  const nuevoCaro = { ...variante(2, 1200, 2), memoria: "1TB", color: "Azul" };
  const nuevoBarato = { ...variante(3, 900, 5), memoria: "256GB", color: "Azul" };
  const agotado = { ...variante(4, 500, 0), memoria: "128GB", color: "Rosa" };
  const p = producto([usado, nuevoCaro, nuevoBarato, agotado]);

  it("arma una tarjeta por modelo sólo con lo que tiene stock", () => {
    const [tarjeta] = tarjetasDeModelos([p]);
    expect(tarjeta.desde).toEqual(usado);
    expect(tarjeta.unidades).toBe(8);
    expect(tarjeta.estado).toBe("Nuevo y usado");
    expect(tarjeta.capacidades).toEqual(["64GB", "256GB", "1TB"]);
    expect(tarjeta.colores).toEqual(["Negro", "Azul"]);
  });

  it("con filtro, el precio y el estado salen de ese estado", () => {
    const [tarjeta] = tarjetasDeModelos([p], "nuevos");
    expect(tarjeta.desde).toEqual(nuevoBarato);
    expect(tarjeta.estado).toBe("Nuevo sellado");
    expect(tarjetasDeModelos([p], "usados")[0].unidades).toBe(1);
  });

  it("un modelo sin stock no tiene tarjeta", () => {
    expect(tarjetasDeModelos([producto([agotado])])).toEqual([]);
    expect(tarjetasDeModelos([producto([nuevoBarato])], "usados")).toEqual([]);
  });
});

describe("resumenDeOpciones", () => {
  it("dice las capacidades y los colores como se leen", () => {
    expect(resumenDeOpciones(["128GB", "256GB", "512GB"], ["Azul", "Negro", "Rosa"])).toBe("128GB, 256GB y 512GB en 3 colores");
    expect(resumenDeOpciones(["128GB", "256GB"], ["Azul", "Negro"])).toBe("128GB y 256GB en 2 colores");
    expect(resumenDeOpciones(["64GB"], ["Azul"])).toBe("64GB en azul");
  });
});

describe("estadoDeLaVariante", () => {
  it("en usados suma el detalle que cargó el admin", () => {
    expect(estadoDeLaVariante({ ...variante(1, 1, 1, true), detalleEstado: "Batería 91%" })).toBe("Usado, batería 91%");
    expect(estadoDeLaVariante(variante(1, 1, 1, true))).toBe("Usado");
    expect(estadoDeLaVariante(variante(1, 1, 1))).toBe("Nuevo sellado");
  });
});
