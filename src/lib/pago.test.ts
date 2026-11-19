import { describe, expect, it } from "vitest";
import { esUrlDePagoValida } from "./pago";

describe("esUrlDePagoValida", () => {
  it("acepta https en dominios de MercadoPago", () => {
    expect(esUrlDePagoValida("https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=1")).toBe(true);
    expect(esUrlDePagoValida("https://sandbox.mercadopago.com.ar/checkout/v1/redirect")).toBe(true);
    expect(esUrlDePagoValida("https://mercadopago.com/checkout")).toBe(true);
  });
  it("rechaza http, otros hosts y parecidos", () => {
    expect(esUrlDePagoValida("http://www.mercadopago.com.ar/x")).toBe(false);
    expect(esUrlDePagoValida("https://evil.com/mercadopago.com.ar")).toBe(false);
    expect(esUrlDePagoValida("https://mercadopago.com.ar.evil.com/x")).toBe(false);
    expect(esUrlDePagoValida("https://evilmercadopago.com.ar/x")).toBe(false);
    expect(esUrlDePagoValida("https://user@evil.com@www.mercadopago.com.ar.evil.com/")).toBe(false);
  });
  it("rechaza basura y javascript:", () => {
    expect(esUrlDePagoValida("")).toBe(false);
    expect(esUrlDePagoValida("no es url")).toBe(false);
    expect(esUrlDePagoValida("javascript:alert(1)")).toBe(false);
  });
});
