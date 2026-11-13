import { describe, expect, it } from "vitest";
import { leadDesdeFormulario, linkAvisoWhatsApp, mensajeDeAviso } from "./leads";

describe("leadDesdeFormulario", () => {
  it("manda null en los opcionales vacíos", () => {
    expect(leadDesdeFormulario({ email: "ana@correo.com", modelo: "", whatsapp: "" })).toEqual({
      email: "ana@correo.com",
      modelo: null,
      whatsapp: null,
      origen: "home",
    });
  });
});

describe("mensajeDeAviso", () => {
  const lead = leadDesdeFormulario({ email: "ana@correo.com", modelo: "iPhone 15 Pro", whatsapp: "" });

  it("lleva el mail y el modelo que busca", () => {
    expect(mensajeDeAviso(lead)).toBe(
      "Hola, quiero que me avisen cuando entren iPhones.\nBusco: iPhone 15 Pro\nMi mail: ana@correo.com",
    );
  });

  it("sin modelo no deja una línea vacía", () => {
    expect(mensajeDeAviso({ ...lead, modelo: null })).toBe(
      "Hola, quiero que me avisen cuando entren iPhones.\nMi mail: ana@correo.com",
    );
  });

  it("el link de WhatsApp lleva el mensaje codificado", () => {
    expect(linkAvisoWhatsApp(lead)).toContain(encodeURIComponent("Mi mail: ana@correo.com"));
  });
});
