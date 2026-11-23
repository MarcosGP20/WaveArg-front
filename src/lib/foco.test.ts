import { describe, expect, it } from "vitest";
import { focoSalioDe } from "./foco";

const dentro = {};
const afuera = {};
const contenedor = { contains: (n: unknown) => n === dentro };

describe("focoSalioDe", () => {
  it("el foco pasa a un elemento de adentro: no salió", () => {
    expect(focoSalioDe(contenedor, dentro)).toBe(false);
  });
  it("el foco pasa a un elemento de afuera: salió", () => {
    expect(focoSalioDe(contenedor, afuera)).toBe(true);
  });
  it("relatedTarget null: no cuenta (lo cubre el click afuera)", () => {
    expect(focoSalioDe(contenedor, null)).toBe(false);
  });
  it("sin contenedor: no salió", () => {
    expect(focoSalioDe(null, afuera)).toBe(false);
  });
});
