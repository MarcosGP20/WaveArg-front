import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { accesoAdmin } from "./acceso-admin";
import { SECRETO_TEST, tokenFirmado } from "@/test/jwt-fixtures";

const fetchMock = vi.fn();

beforeAll(() => {
  process.env.JWT_SECRET = SECRETO_TEST;
});

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
});

describe("accesoAdmin", () => {
  it("un admin degradado en la DB va al perfil aunque su token diga Admin (#119)", async () => {
    fetchMock.mockResolvedValue(Response.json({ id: 42, email: "a@wave.local", rol: "Cliente" }));

    expect(await accesoAdmin(await tokenFirmado("Admin"))).toBe("perfil");
  });

  it("si el back rechaza la sesión (contraseña cambiada, cuenta borrada) va al login", async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 401 }));

    expect(await accesoAdmin(await tokenFirmado("Admin"))).toBe("login");
  });

  it("un token inválido va al login sin consultar al back", async () => {
    expect(await accesoAdmin(await tokenFirmado("Admin", { secreto: "otra-clave-de-al-menos-32-bytes!!!" }))).toBe("login");
    expect(await accesoAdmin(undefined)).toBe("login");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("si el back no responde decide con el rol del token ya verificado", async () => {
    fetchMock.mockRejectedValue(new TypeError("fetch failed"));
    expect(await accesoAdmin(await tokenFirmado("Admin"))).toBe("permitido");

    fetchMock.mockResolvedValue(new Response("Bad Gateway", { status: 502 }));
    expect(await accesoAdmin(await tokenFirmado("Cliente"))).toBe("perfil");
  });
});
