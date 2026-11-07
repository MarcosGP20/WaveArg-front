import { NextRequest } from "next/server";
import { beforeAll, describe, expect, it } from "vitest";
import { decidirAccesoCuenta } from "@/lib/acceso-cuenta";
import { AUTH_COOKIE_NAME } from "@/lib/auth-cookie";
import { verificarSesion, type Sesion } from "@/lib/sesion";
import { proxy } from "@/proxy";
import { SECRETO_TEST, tokenDe, tokenFirmado } from "@/test/jwt-fixtures";

beforeAll(() => {
  process.env.JWT_SECRET = SECRETO_TEST;
});

const cliente: Sesion = { id: "42", email: "cliente@wave.local", rol: "Cliente", exp: 0 };

// Lo que hace account/layout.tsx con la cookie: verificarla y decidir.
async function destinoDelLayout(token: string | undefined): Promise<string> {
  const acceso = decidirAccesoCuenta(await verificarSesion(token));
  return acceso.tipo === "redirigir" ? acceso.destino : "renderiza";
}

describe("decidirAccesoCuenta", () => {
  it("sin sesión manda a /login", () => {
    expect(decidirAccesoCuenta(null)).toEqual({ tipo: "redirigir", destino: "/login" });
  });

  it.each(["Admin", "admin", "ADMIN"])("con rol %s manda a /admin", (rol) => {
    expect(decidirAccesoCuenta({ ...cliente, rol })).toEqual({ tipo: "redirigir", destino: "/admin" });
  });

  it.each([undefined, null])("un cliente con el store vacío (%s) entra sin limpiar nada", (idGuardado) => {
    expect(decidirAccesoCuenta(cliente, idGuardado)).toEqual({ tipo: "renderizar", sesion: cliente, limpiarUsuario: false });
  });

  it("con el usuario guardado de la misma persona no limpia", () => {
    expect(decidirAccesoCuenta(cliente, "42")).toMatchObject({ tipo: "renderizar", limpiarUsuario: false });
  });

  it("con el usuario guardado de otro id lo limpia", () => {
    expect(decidirAccesoCuenta(cliente, "7")).toMatchObject({ tipo: "renderizar", limpiarUsuario: true });
  });
});

describe("account/layout con la cookie de sesión", () => {
  it("con una cookie válida de cliente renderiza", async () => {
    expect(await destinoDelLayout(await tokenFirmado("Cliente"))).toBe("renderiza");
  });

  it("con una cookie válida de admin manda a /admin", async () => {
    expect(await destinoDelLayout(await tokenFirmado("Admin"))).toBe("/admin");
  });

  it.each([
    ["vencida", () => tokenFirmado("Cliente", { expiraEnSegundos: -60 })],
    ["firmada con otra clave", () => tokenFirmado("Cliente", { secreto: "otra-clave-de-al-menos-32-bytes-de-largo" })],
    ["con firma falsa", async () => tokenDe("Cliente")],
    ["de otro issuer", () => tokenFirmado("Cliente", { issuer: "OtroSistema" })],
    ["malformada", async () => "no-es-un-jwt"],
  ])("con una cookie %s manda a /login", async (_, token) => {
    expect(await destinoDelLayout(await token())).toBe("/login");
  });
});

// proxy.ts y el layout tienen que coincidir en qué cookie es una sesión válida. Si no, se arma un
// ping-pong: proxy.ts deja /login sólo con sesión válida (manda a /account/profile), y el layout
// de /account manda a /login sin sesión válida.
describe("proxy.ts y account/layout usan el mismo criterio de sesión", () => {
  async function proxyRedirige(path: string, token: string): Promise<string | null> {
    const response = await proxy(
      new NextRequest(new URL(path, "http://localhost:3000"), { headers: { cookie: `${AUTH_COOKIE_NAME}=${token}` } }),
    );
    const location = response.headers.get("location");
    return location ? new URL(location).pathname : null;
  }

  it.each([
    ["cliente válida", () => tokenFirmado("Cliente")],
    ["admin válida", () => tokenFirmado("Admin")],
    ["vencida", () => tokenFirmado("Cliente", { expiraEnSegundos: -60 })],
    ["firmada con otra clave", () => tokenFirmado("Cliente", { secreto: "otra-clave-de-al-menos-32-bytes-de-largo" })],
    ["con firma falsa", async () => tokenDe("Cliente")],
    ["de otro issuer", () => tokenFirmado("Cliente", { issuer: "OtroSistema" })],
    ["malformada", async () => "no-es-un-jwt"],
  ])("cookie %s: no rebota entre /login y /account", async (_, crearToken) => {
    const token = await crearToken();
    const sinSesionParaElLayout = (await destinoDelLayout(token)) === "/login";

    // proxy.ts saca de /account exactamente a quien el layout mandaría a /login...
    expect((await proxyRedirige("/account/profile", token)) === "/login").toBe(sinSesionParaElLayout);
    // ...y saca de /login exactamente a quien el layout dejaría pasar (o mandaría a /admin).
    expect((await proxyRedirige("/login", token)) === "/account/profile").toBe(!sinSesionParaElLayout);
  });
});
