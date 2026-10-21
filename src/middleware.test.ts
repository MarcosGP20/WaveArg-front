import { existsSync } from "node:fs";
import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { middleware } from "@/middleware";
import { AUTH_COOKIE_NAME } from "@/lib/auth-cookie";
import { tokenDe } from "@/test/jwt-fixtures";

function pedir(path: string, token?: string) {
  const headers = token ? { cookie: `${AUTH_COOKIE_NAME}=${token}` } : undefined;
  return middleware(new NextRequest(new URL(path, "http://localhost:3000"), { headers }));
}

function redireccion(response: Response): string | null {
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
      (path) => {
        expect(redireccion(pedir(path))).toBe("/login");
      },
    );

    it.each(["/", "/products", "/products/2", "/login", "/register", "/nosotros"])(
      "deja pasar la ruta pública %s",
      (path) => {
        expect(redireccion(pedir(path))).toBeNull();
      },
    );
  });

  describe("con sesión de cliente", () => {
    const token = tokenDe("Cliente");

    it("deja entrar a /account y /checkout", () => {
      expect(redireccion(pedir("/account/profile", token))).toBeNull();
      expect(redireccion(pedir("/checkout", token))).toBeNull();
    });

    it("manda /admin a /account/profile", () => {
      expect(redireccion(pedir("/admin", token))).toBe("/account/profile");
    });

    it.each(["/login", "/register"])("si ya está logueado, %s lo manda a /account/profile", (path) => {
      expect(redireccion(pedir(path, token))).toBe("/account/profile");
    });
  });

  describe("con sesión de admin", () => {
    it.each(["Admin", "admin", "ADMIN"])("deja entrar a /admin con rol %s", (rol) => {
      expect(redireccion(pedir("/admin/productos", tokenDe(rol)))).toBeNull();
    });
  });

  describe("tokens inválidos", () => {
    it("un token vencido equivale a no tener sesión", () => {
      expect(redireccion(pedir("/account/profile", tokenDe("Cliente", { expiraEnSegundos: -60 })))).toBe("/login");
    });

    it("un token malformado equivale a no tener sesión", () => {
      expect(redireccion(pedir("/checkout", "no-es-un-jwt"))).toBe("/login");
    });
  });
});
