import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ESTADO_POR_DEFECTO, obtenerEstado } from "./estado";
import { ApiError, CODIGO_CHECKOUT_PAUSADO, esCheckoutPausado } from "./api";

const fetchMock = vi.fn();

describe("estado del sitio (GET /api/estado)", () => {
  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("trae los interruptores del back", async () => {
    fetchMock.mockResolvedValue(
      Response.json({ mantenimiento: true, checkoutHabilitado: false, googleHabilitado: false }),
    );

    expect(await obtenerEstado()).toEqual({
      mantenimiento: true,
      checkoutHabilitado: false,
      googleHabilitado: false,
    });
    expect(String(fetchMock.mock.calls[0][0])).toMatch(/\/estado$/);
  });

  it("si el back no responde, el sitio sigue abierto", async () => {
    fetchMock.mockRejectedValue(new TypeError("fetch failed"));

    expect(await obtenerEstado()).toEqual(ESTADO_POR_DEFECTO);
    expect(ESTADO_POR_DEFECTO).toEqual({ mantenimiento: false, checkoutHabilitado: true, googleHabilitado: true });
  });

  it("una respuesta de error o incompleta no apaga nada", async () => {
    fetchMock.mockResolvedValueOnce(new Response("Bad Gateway", { status: 502 }));
    expect(await obtenerEstado()).toEqual(ESTADO_POR_DEFECTO);

    fetchMock.mockResolvedValueOnce(Response.json({ checkoutHabilitado: false }));
    expect(await obtenerEstado()).toEqual({ ...ESTADO_POR_DEFECTO, checkoutHabilitado: false });
  });
});

describe("checkout pausado (crear-preferencia)", () => {
  it("reconoce el 503 CHECKOUT_PAUSADO y nada más", () => {
    expect(esCheckoutPausado(new ApiError("Pausado", 503, { codigo: CODIGO_CHECKOUT_PAUSADO }))).toBe(true);
    expect(esCheckoutPausado(new ApiError("Mantenimiento", 503, { codigo: "MANTENIMIENTO" }))).toBe(false);
    expect(esCheckoutPausado(new Error("red"))).toBe(false);
  });
});
