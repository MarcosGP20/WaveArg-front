import { describe, expect, it } from "vitest";
import { CLAVE_AVISO_PENDIENTE, consumirAviso, guardarAviso, type StorageMinimo } from "./aviso-pendiente";

function storageFalso(): StorageMinimo & { datos: Map<string, string> } {
  const datos = new Map<string, string>();
  return {
    datos,
    getItem: (k) => datos.get(k) ?? null,
    setItem: (k, v) => void datos.set(k, v),
    removeItem: (k) => void datos.delete(k),
  };
}

const quetira: StorageMinimo = {
  getItem: () => { throw new Error("boom"); },
  setItem: () => { throw new Error("boom"); },
  removeItem: () => { throw new Error("boom"); },
};

describe("aviso pendiente", () => {
  it("guarda y consume el aviso", () => {
    const s = storageFalso();
    guardarAviso(s, { tipo: "success", mensaje: "Hola" });
    expect(consumirAviso(s)).toEqual({ tipo: "success", mensaje: "Hola" });
  });

  it("consumir dos veces: la segunda devuelve null", () => {
    const s = storageFalso();
    guardarAviso(s, { tipo: "info", mensaje: "x" });
    consumirAviso(s);
    expect(consumirAviso(s)).toBeNull();
  });

  it("JSON corrupto devuelve null y lo borra", () => {
    const s = storageFalso();
    s.setItem(CLAVE_AVISO_PENDIENTE, "{no json");
    expect(consumirAviso(s)).toBeNull();
    expect(s.datos.size).toBe(0);
  });

  it("tipo inválido devuelve null y lo borra", () => {
    const s = storageFalso();
    s.setItem(CLAVE_AVISO_PENDIENTE, JSON.stringify({ tipo: "warning", mensaje: "x" }));
    expect(consumirAviso(s)).toBeNull();
    expect(s.datos.size).toBe(0);
  });

  it("storage que tira o inexistente no rompe", () => {
    expect(() => guardarAviso(quetira, { tipo: "error", mensaje: "x" })).not.toThrow();
    expect(consumirAviso(quetira)).toBeNull();
    expect(consumirAviso(null)).toBeNull();
  });
});
