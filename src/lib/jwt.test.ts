import { describe, expect, it } from "vitest";
import { decodeJWT, getEmailFromJWT, getRoleFromJWT, getUserIdFromJWT } from "@/lib/jwt";
import { fakeJwt, tokenDe } from "@/test/jwt-fixtures";

describe("decodeJWT", () => {
  it("devuelve los claims del payload", () => {
    const token = tokenDe("Admin");

    expect(decodeJWT(token)).toMatchObject({ id: "42", email: "cliente@wave.local", rol: "Admin" });
  });

  it("decodifica payloads base64url que necesitan padding y usan - y _", () => {
    // "??>" en base64 estándar da "Pz8+": en base64url se convierte en "Pz8-"
    const token = fakeJwt({ nota: "??>??>", n: 1 });

    expect(decodeJWT(token)).toEqual({ nota: "??>??>", n: 1 });
  });

  it("respeta caracteres no ASCII (UTF-8) en los claims", () => {
    const token = tokenDe("Cliente", { email: "peña@wave.local" });

    expect(getEmailFromJWT(token)).toBe("peña@wave.local");
  });

  it.each([
    ["vacío", ""],
    ["sin puntos", "abc"],
    ["con dos partes", "a.b"],
    ["payload que no es JSON", "a.bm8tanNvbg.c"],
  ])("devuelve null para un token %s", (_caso, token) => {
    expect(decodeJWT(token)).toBeNull();
  });
});

describe("helpers de claims", () => {
  it("leen id, email y rol con los nombres que usa el backend", () => {
    const token = tokenDe("Admin");

    expect(getUserIdFromJWT(token)).toBe("42");
    expect(getEmailFromJWT(token)).toBe("cliente@wave.local");
    expect(getRoleFromJWT(token)).toBe("Admin");
  });

  it("devuelven null con un token inválido", () => {
    expect(getUserIdFromJWT("basura")).toBeNull();
    expect(getEmailFromJWT("basura")).toBeNull();
    expect(getRoleFromJWT("basura")).toBeNull();
  });
});
