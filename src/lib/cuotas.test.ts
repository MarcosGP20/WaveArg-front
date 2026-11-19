import { describe, expect, it } from "vitest";
import { textoCuotas } from "./cuotas";

describe("textoCuotas", () => {
  it("sin cuotas confirmadas no promete ninguna cifra", () => {
    expect(textoCuotas(1_200_000, null)).toBe("En cuotas con Mercado Pago");
    expect(textoCuotas(1_200_000, 1)).toBe("En cuotas con Mercado Pago");
  });

  it("con cuotas confirmadas calcula el valor sobre el precio real", () => {
    expect(textoCuotas(1_200_000, 6)).toBe("6 cuotas sin interés de $200.000");
    expect(textoCuotas(1_000_000, 3)).toBe("3 cuotas sin interés de $333.333");
  });

  it("sin precio no calcula nada", () => {
    expect(textoCuotas(0, 6)).toBe("En cuotas con Mercado Pago");
  });
});
