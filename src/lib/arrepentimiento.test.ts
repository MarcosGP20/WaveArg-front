import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { solicitarArrepentimiento } from "./arrepentimiento";
import { arrepentimientoSchema } from "@/schemas/arrepentimiento.schema";

const base = { nombre: "Juana Pérez", email: "juana@correo.com", numeroPedido: "", detalle: "" };

describe("arrepentimientoSchema", () => {
  it("alcanza con nombre y email: el pedido y el detalle son opcionales", () => {
    expect(arrepentimientoSchema.safeParse(base).success).toBe(true);
  });

  it("rechaza sin nombre o con un email mal escrito", () => {
    expect(arrepentimientoSchema.safeParse({ ...base, nombre: "  " }).success).toBe(false);
    expect(arrepentimientoSchema.safeParse({ ...base, email: "juana@correo" }).success).toBe(false);
  });
});

describe("solicitarArrepentimiento", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("manda la solicitud al back, con null en lo que quedó vacío, y devuelve el código", async () => {
    fetchMock.mockResolvedValue(Response.json({ codigo: "ARR-7KQ2M9XA" }));

    expect(await solicitarArrepentimiento({ ...base, numeroPedido: " 123 " })).toBe("ARR-7KQ2M9XA");
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toMatch(/\/Arrepentimientos$/);
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body)).toEqual({ nombre: "Juana Pérez", email: "juana@correo.com", numeroPedido: "123", detalle: null });
  });
});
