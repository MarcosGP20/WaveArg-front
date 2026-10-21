import { createHmac } from "node:crypto";
import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const SECRET = "secreto-de-test";

function firmar(dataId: string, requestId: string, ts: string, secret = SECRET) {
  const v1 = createHmac("sha256", secret).update(`id:${dataId};request-id:${requestId};ts:${ts};`).digest("hex");
  return `ts=${ts},v1=${v1}`;
}

function notificacion(headers: Record<string, string>) {
  return new NextRequest("http://localhost:3000/api/mercadopago/webhook?type=payment&data.id=123", {
    method: "POST",
    headers,
  });
}

describe("webhook de MercadoPago (route de Next)", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv("MERCADOPAGO_WEBHOOK_SECRET", SECRET);
    fetchMock.mockReset().mockResolvedValue(new Response(null, { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("reenvía al backend la firma y el request-id de MP (el backend también la valida)", async () => {
    const { POST } = await import("./route");
    const signature = firmar("123", "req-1", "1700000000000");

    const response = await POST(notificacion({ "x-signature": signature, "x-request-id": "req-1" }));

    expect(response.status).toBe(200);
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toContain("/MercadoPago/webhook?type=payment&data.id=123");
    expect(init.headers["x-signature"]).toBe(signature);
    expect(init.headers["x-request-id"]).toBe("req-1");
  });

  it("rechaza una firma inválida sin llamar al backend", async () => {
    const { POST } = await import("./route");

    const response = await POST(notificacion({ "x-signature": firmar("123", "req-1", "1", "otro"), "x-request-id": "req-1" }));

    expect(response.status).toBe(401);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("en producción sin secreto rechaza todo (fail-closed)", async () => {
    vi.stubEnv("MERCADOPAGO_WEBHOOK_SECRET", "");
    vi.stubEnv("NODE_ENV", "production");
    const { POST } = await import("./route");

    const response = await POST(notificacion({}));

    expect(response.status).toBe(500);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
