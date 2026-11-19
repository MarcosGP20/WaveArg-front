import { beforeAll, describe, expect, it, vi } from "vitest";
import { esAdmin, verificarSesion } from "./sesion";
import { SECRETO_TEST, tokenFirmado } from "@/test/jwt-fixtures";

beforeAll(() => {
  process.env.JWT_SECRET = SECRETO_TEST;
});

const b64url = (bytes: Uint8Array) => Buffer.from(bytes).toString("base64url");
const json = (valor: object) => b64url(new TextEncoder().encode(JSON.stringify(valor)));

// Token firmado con claims y header a medida, para casos que tokenFirmado no cubre (audience,
// claims faltantes, otro algoritmo declarado).
async function tokenA_medida(
  payload: Record<string, unknown>,
  header: Record<string, unknown> = { alg: "HS256", typ: "JWT" },
): Promise<string> {
  const firmado = `${json(header)}.${json(payload)}`;
  const clave = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(SECRETO_TEST),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const firma = await crypto.subtle.sign("HMAC", clave, new TextEncoder().encode(firmado));
  return `${firmado}.${b64url(new Uint8Array(firma))}`;
}

const ahora = () => Math.floor(Date.now() / 1000);
const claimsValidos = () => ({
  id: "42",
  email: "cliente@wave.local",
  rol: "Cliente",
  exp: ahora() + 3600,
  iss: "WaveArg",
  aud: "WaveArgFrontend",
});

describe("verificarSesion", () => {
  it("devuelve la sesión de un token bien firmado, vigente y con issuer y audience correctos", async () => {
    const sesion = await verificarSesion(await tokenFirmado("Cliente"));
    expect(sesion).toMatchObject({ id: "42", email: "cliente@wave.local", rol: "Cliente" });
    expect(sesion?.exp).toBeGreaterThan(ahora());
  });

  it("rechaza un token sin valor", async () => {
    expect(await verificarSesion(undefined)).toBeNull();
    expect(await verificarSesion("")).toBeNull();
  });

  it("rechaza un token con la firma de otra clave", async () => {
    expect(await verificarSesion(await tokenFirmado("Admin", { secreto: "otra-clave-distinta-de-32-bytes-!!!!" }))).toBeNull();
  });

  it("rechaza un token cuyo payload fue adulterado después de firmar", async () => {
    const [header, , firma] = (await tokenFirmado("Cliente")).split(".");
    const adulterado = json({ ...claimsValidos(), rol: "Admin" });
    expect(await verificarSesion(`${header}.${adulterado}.${firma}`)).toBeNull();
  });

  it("rechaza un token vencido", async () => {
    expect(await verificarSesion(await tokenFirmado("Cliente", { expiraEnSegundos: -10 }))).toBeNull();
  });

  it("rechaza un token sin exp", async () => {
    const { exp: _exp, ...sinExp } = claimsValidos();
    expect(await verificarSesion(await tokenA_medida(sinExp))).toBeNull();
  });

  it("rechaza un token de otro issuer", async () => {
    expect(await verificarSesion(await tokenFirmado("Cliente", { issuer: "OtroEmisor" }))).toBeNull();
  });

  it("rechaza un token de otra audience", async () => {
    expect(await verificarSesion(await tokenA_medida({ ...claimsValidos(), aud: "OtraApp" }))).toBeNull();
  });

  it("acepta una audience en lista si incluye la esperada", async () => {
    const token = await tokenA_medida({ ...claimsValidos(), aud: ["Otra", "WaveArgFrontend"] });
    expect(await verificarSesion(token)).not.toBeNull();
  });

  it("rechaza un token que declara otro algoritmo (alg: none)", async () => {
    expect(await verificarSesion(await tokenA_medida(claimsValidos(), { alg: "none", typ: "JWT" }))).toBeNull();
  });

  it("rechaza un token sin id o sin rol (ej. el de reset de contraseña)", async () => {
    const { id: _id, ...sinId } = claimsValidos();
    const { rol: _rol, ...sinRol } = claimsValidos();
    expect(await verificarSesion(await tokenA_medida(sinId))).toBeNull();
    expect(await verificarSesion(await tokenA_medida(sinRol))).toBeNull();
  });

  it("rechaza tokens mal formados sin lanzar", async () => {
    expect(await verificarSesion("no-es-un-jwt")).toBeNull();
    expect(await verificarSesion("a.b")).toBeNull();
    expect(await verificarSesion("a.b.c.d")).toBeNull();
    expect(await verificarSesion("%%%.%%%.%%%")).toBeNull();
  });

  it("sin JWT_SECRET rechaza todo y lo avisa una sola vez", async () => {
    const token = await tokenFirmado("Cliente");
    const secreto = process.env.JWT_SECRET;
    delete process.env.JWT_SECRET;
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      expect(await verificarSesion(token)).toBeNull();
      expect(await verificarSesion(token)).toBeNull();
      expect(error.mock.calls.length).toBeLessThanOrEqual(1);
    } finally {
      error.mockRestore();
      process.env.JWT_SECRET = secreto;
    }
  });
});

describe("esAdmin", () => {
  const sesion = (rol: string) => ({ id: "1", email: "", rol, exp: 0 });

  it("compara el rol sin distinguir mayúsculas", () => {
    expect(esAdmin(sesion("Admin"))).toBe(true);
    expect(esAdmin(sesion("admin"))).toBe(true);
    expect(esAdmin(sesion("ADMIN"))).toBe(true);
  });

  it("no da admin a otros roles ni sin sesión", () => {
    expect(esAdmin(sesion("Cliente"))).toBe(false);
    expect(esAdmin(null)).toBe(false);
  });
});
