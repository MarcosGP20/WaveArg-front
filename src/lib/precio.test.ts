import { describe, expect, it } from "vitest";
import { formatearPrecio } from "./precio";

// Mismo formato que se ve en pantalla; los sliders de precio lo usan como aria-valuetext
// para que el lector diga "$800.000" en vez de "800000" (front#13).
describe("formatearPrecio", () => {
  it("usa separador de miles argentino y signo pesos", () => {
    expect(formatearPrecio(800000)).toBe("$800.000");
    expect(formatearPrecio(1200000)).toBe("$1.200.000");
  });

  it("no agrega decimales", () => {
    expect(formatearPrecio(30000)).toBe("$30.000");
  });
});
