import { describe, expect, it } from "vitest";
import {
  loginSchema,
  registerSchema,
  resetearContrasenaSchema,
  solicitarResetSchema,
} from "./auth.schema";

// Fija los mensajes que ven los formularios, para que un cambio de versión de zod no los rompa.
// Se queda con el primer error de cada campo, que es el que muestra react-hook-form.
function mensajes(resultado: { success: boolean; error?: { issues: { path: PropertyKey[]; message: string }[] } }) {
  const porCampo: Record<string, string> = {};
  for (const i of resultado.error?.issues ?? []) porCampo[i.path.join(".")] ??= i.message;
  return porCampo;
}

describe("loginSchema", () => {
  it("acepta un email y una contraseña válidos", () => {
    expect(loginSchema.safeParse({ email: "a@b.com", contraseña: "123456" }).success).toBe(true);
  });

  it("pide el correo cuando está vacío", () => {
    expect(mensajes(loginSchema.safeParse({ email: "", contraseña: "123456" })).email).toBe(
      "El correo es obligatorio",
    );
  });

  it("rechaza un correo mal formado", () => {
    expect(mensajes(loginSchema.safeParse({ email: "nope", contraseña: "123456" }))).toEqual({
      email: "Formato de correo inválido",
    });
  });

  it("exige al menos 6 caracteres de contraseña", () => {
    expect(mensajes(loginSchema.safeParse({ email: "a@b.com", contraseña: "123" }))).toEqual({
      contraseña: "La contraseña debe tener al menos 6 caracteres",
    });
  });
});

describe("registerSchema", () => {
  it("exige rolId numérico", () => {
    const r = registerSchema.safeParse({ email: "a@b.com", contraseña: "123456", rolId: "2" });
    expect(r.success).toBe(false);
    expect(Object.keys(mensajes(r))).toEqual(["rolId"]);
  });
});

describe("solicitarResetSchema", () => {
  it("rechaza un correo mal formado", () => {
    expect(mensajes(solicitarResetSchema.safeParse({ email: "x" }))).toEqual({
      email: "Formato de correo inválido",
    });
  });
});

describe("resetearContrasenaSchema", () => {
  it("marca la confirmación cuando las contraseñas no coinciden", () => {
    const r = resetearContrasenaSchema.safeParse({ nuevaContrasena: "123456", confirmarContrasena: "654321" });
    expect(mensajes(r)).toEqual({ confirmarContrasena: "Las contraseñas no coinciden" });
  });

  it("pide la confirmación cuando está vacía", () => {
    const r = resetearContrasenaSchema.safeParse({ nuevaContrasena: "123456", confirmarContrasena: "" });
    expect(mensajes(r).confirmarContrasena).toBe("Confirmá tu contraseña");
  });
});
