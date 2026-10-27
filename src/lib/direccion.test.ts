import { describe, expect, it } from "vitest";
import { primerCampoInvalido, validarDireccion } from "./direccion";

const completa = { calle: "Av. Corrientes 1234", ciudad: "Rosario", provincia: "Santa Fe", codigoPostal: "2000" };

describe("validarDireccion", () => {
  it("no devuelve errores con una dirección completa", () => {
    expect(validarDireccion(completa)).toEqual({});
  });

  it("explica qué falta en cada campo vacío", () => {
    expect(validarDireccion({ calle: " ", ciudad: "", provincia: "", codigoPostal: "" })).toEqual({
      calle: "Ingresá la calle y el número",
      ciudad: "Ingresá la ciudad o localidad",
      provincia: "Elegí una provincia",
      codigoPostal: "Ingresá el código postal",
    });
  });

  it("acepta 4 dígitos o el CPA, con o sin letra de provincia", () => {
    for (const cp of ["2000", "C1043AAB", "S2000", " 2000 "]) {
      expect(validarDireccion({ ...completa, codigoPostal: cp })).toEqual({});
    }
  });

  it("rechaza un código postal mal formado y da un ejemplo", () => {
    expect(validarDireccion({ ...completa, codigoPostal: "20" }).codigoPostal).toBe(
      "El código postal no es válido (ej: 2000 o C1043AAB)",
    );
  });
});

describe("primerCampoInvalido", () => {
  it("sigue el orden del formulario: calle, ciudad, código postal, provincia", () => {
    expect(primerCampoInvalido({ provincia: "x", codigoPostal: "x" })).toBe("codigoPostal");
    expect(primerCampoInvalido({ provincia: "x", ciudad: "x" })).toBe("ciudad");
    expect(primerCampoInvalido({ provincia: "x" })).toBe("provincia");
  });

  it("devuelve null si no hay errores", () => {
    expect(primerCampoInvalido({})).toBeNull();
  });
});
