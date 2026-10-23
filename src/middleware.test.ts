import { existsSync } from "node:fs";
import { NextRequest } from "next/server";
import { beforeAll, describe, expect, it } from "vitest";
import { middleware } from "@/middleware";
import { AUTH_COOKIE_NAME } from "@/lib/auth-cookie";
import { SECRETO_TEST, tokenDe, tokenFirmado } from "@/test/jwt-fixtures";

beforeAll(() => {
  process.env.JWT_SECRET = SECRETO_TEST;
});

async function redireccion(path: string, token?: string): Promise<string | null> {
  const headers = token ? { cookie: `${AUTH_COOKIE_NAME}=${token}` } : undefined;
  const response = await middleware(new NextRequest(new URL(path, "http://localhost:3000"), { headers }));
  const location = response.headers.get("location");
  return location ? new URL(location).pathname : null;
}

describe("middleware", () => {
  it("vive en src/: con src/app, Next ignora un middleware en la raíz y nunca lo ejecuta", () => {
    expect(existsSync("src/middleware.ts")).toBe(true);
    expect(existsSync("middleware.ts")).toBe(false);
  });

  describe("sin sesión", () => {
    it.each(["/account/profile", "/account/orders", "/checkout", "/cart", "/admin", "/admin/productos"])(
      "redirige %s a /login",
      async (path) => {
        expect(await redireccion(path)).toBe("/login");
      },
    );

    it.each(["/", "/products", "/products/2", "/login", "/register", "/nosotros"])(
      "deja pasar la ruta pública %s",
      async (path) => {
        expect(await redireccion(path)).toBeNull();
      },
    );
  });

  describe("con sesión de cliente", () => {
    it("deja entrar a /account y /checkout", async () => {
      const token = await tokenFirmado("Cliente");
      expect(await redireccion("/account/profile", token)).toBeNull();
      expect(await redireccion("/checkout", token)).toBeNull();
    });

    it("manda /admin a /account/profile", async () => {
      expect(await redireccion("/admin", await tokenFirmado("Cliente"))).toBe("/account/profile");
    });

    it.each(["/login", "/register"])("si ya está logueado, %s lo manda a /account/profile", async (path) => {
      expect(await redireccion(path, await tokenFirmado("Cliente"))).toBe("/account/profile");
    });
  });

  describe("con sesión de admin", () => {
    it.each(["Admin", "admin", "ADMIN"])("deja entrar a /admin con rol %s", async (rol) => {
      expect(await redireccion("/admin/productos", await tokenFirmado(rol))).toBeNull();
    });
  });

  describe("tokens inválidos", () => {
    it("un token vencido equivale a no tener sesión", async () => {
      expect(await redireccion("/account/profile", await tokenFirmado("Cliente", { expiraEnSegundos: -60 }))).toBe(
        "/login",
      );
    });

    it("un token malformado equivale a no tener sesión", async () => {
      expect(await redireccion("/checkout", "no-es-un-jwt")).toBe("/login");
    });

    it("un token con el rol cambiado a Admin y firma inventada no entra a /admin", async () => {
      expect(await redireccion("/admin/productos", tokenDe("Admin"))).toBe("/login");
    });

    it("un token firmado con otra clave no entra", async () => {
      const ajeno = await tokenFirmado("Admin", { secreto: "otra-clave-que-no-es-la-del-back-123456" });
      expect(await redireccion("/admin/productos", ajeno)).toBe("/login");
    });

    it("un token de otro emisor no entra", async () => {
      expect(await redireccion("/account/profile", await tokenFirmado("Cliente", { issuer: "Otro" }))).toBe("/login");
    });

    it("sin JWT_SECRET configurado no hay sesión válida", async () => {
      const token = await tokenFirmado("Admin");
      delete process.env.JWT_SECRET;
      try {
        expect(await redireccion("/admin/productos", token)).toBe("/login");
      } finally {
        process.env.JWT_SECRET = SECRETO_TEST;
      }
    });
  });
});
