import { describe, expect, it } from "vitest";
import { agruparPorModelo } from "./inventario";

const item = (id: number, nombre: string, modelo: string, variantes: number[], imagenes: string[] = []) => ({
  id,
  nombre,
  modelo,
  variantes,
  imagenes,
});

describe("agruparPorModelo", () => {
  it("junta en una fila los registros del mismo nombre y modelo, sin importar mayúsculas", () => {
    const grupos = agruparPorModelo([
      item(1, "iPhone 15", "Pro", [10], ["a.jpg"]),
      item(2, "iphone 15", "PRO", [11], ["b.jpg"]),
      item(3, "iPhone 14", "Base", [12]),
    ]);

    expect(grupos).toHaveLength(2);
    expect(grupos[0]).toMatchObject({ id: 1, variantes: [10, 11], imagenes: ["a.jpg", "b.jpg"] });
    expect(grupos[1]).toMatchObject({ id: 3, variantes: [12] });
  });

  it("no modifica los registros que recibe", () => {
    const primero = item(1, "iPhone 15", "Pro", [10]);
    agruparPorModelo([primero, item(2, "iPhone 15", "Pro", [11])]);

    expect(primero.variantes).toEqual([10]);
  });
});
