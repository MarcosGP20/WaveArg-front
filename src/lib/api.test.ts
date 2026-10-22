import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError, CODIGO_VINCULAR_GOOGLE, loginWithGoogle, vincularGoogle } from "./api";

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
