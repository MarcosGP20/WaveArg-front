import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError, CODIGO_VINCULAR_GOOGLE, loginUser, loginWithGoogle, vincularGoogle } from "./api";
import { useAuthStore } from "@/store/useAuthStore";

const fetchMock = vi.fn();

function respuesta(status: number, body: unknown) {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
}

describe("login con Google y vinculación de cuentas (api.ts)", () => {
  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("un 409 VINCULAR_GOOGLE llega como ApiError con el status y el código", async () => {
    fetchMock.mockResolvedValue(
      respuesta(409, { codigo: CODIGO_VINCULAR_GOOGLE, email: "ana@test.local", message: "¿Querés unificarla?" }),
    );

    const error = await loginWithGoogle("id-token").catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({
      status: 409,
      message: "¿Querés unificarla?",
      data: { codigo: CODIGO_VINCULAR_GOOGLE, email: "ana@test.local" },
    });
  });

  it("vincularGoogle manda el mismo idToken al endpoint de vinculación", async () => {
    fetchMock.mockResolvedValue(respuesta(200, { token: "jwt", rol: "Cliente" }));

    const response = await vincularGoogle("id-token");

    expect(response.token).toBe("jwt");
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toMatch(/\/Auth\/google\/vincular$/);
    expect(JSON.parse(init.body)).toEqual({ idToken: "id-token" });
  });
});

describe("login con email y contraseña (api.ts)", () => {
  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
    // fetchFromApi sólo desloguea en el navegador.
    vi.stubGlobal("window", {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("un login fallido muestra el mensaje del back y no cierra la sesión", async () => {
    const logout = vi.fn();
    vi.spyOn(useAuthStore, "getState").mockReturnValue({ ...useAuthStore.getState(), logout });
    fetchMock.mockResolvedValue(respuesta(400, { message: "Email o contraseña incorrectos." }));

    const error = await loginUser({ email: "ana@test.local", contraseña: "mala" }).catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 400, message: "Email o contraseña incorrectos." });
    expect(logout).not.toHaveBeenCalled();
  });

  it("un 401 de otro endpoint sí cierra la sesión", async () => {
    const logout = vi.fn();
    vi.spyOn(useAuthStore, "getState").mockReturnValue({ ...useAuthStore.getState(), logout });
    fetchMock.mockResolvedValue(respuesta(401, {}));

    await loginUser({ email: "ana@test.local", contraseña: "x" }).catch(() => {});

    expect(logout).toHaveBeenCalledOnce();
  });
});
