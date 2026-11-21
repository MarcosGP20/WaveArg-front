import { describe, expect, it } from "vitest";
import { MINUTOS_PARA_RECARGAR, tocaRecargar } from "./recarga";

const minuto = 60_000;

describe("tocaRecargar", () => {
  it("no recarga si se fue un rato corto", () => {
    expect(tocaRecargar(0, (MINUTOS_PARA_RECARGAR - 1) * minuto)).toBe(false);
  });

  it("recarga si pasó el umbral desde la última carga", () => {
    expect(tocaRecargar(0, MINUTOS_PARA_RECARGAR * minuto)).toBe(true);
    expect(tocaRecargar(0, 3 * 60 * minuto)).toBe(true);
  });
});
