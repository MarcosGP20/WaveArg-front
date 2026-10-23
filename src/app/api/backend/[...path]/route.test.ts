import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "./route";

const fetchMock = vi.fn();

function pedir(path: string) {
  return GET(new NextRequest(new URL(`/api/backend/${path}`, "http://localhost:3000")), {
    params: Promise.resolve({ path: path.split("/") }),
  });
}

// Un back que nunca contesta: sólo termina si se aborta la request.
function backColgado(_url: unknown, init?: RequestInit): Promise<Response> {
  return new Promise((_, reject) => {
    init?.signal?.addEventListener("abort", () => reject(init.signal!.reason));
  });
}

describe("proxy /api/backend", () => {
  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
    vi.stubEnv("BACKEND_TIMEOUT_MS", "50");
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("si el back no responde a tiempo, corta y responde 504 con un mensaje", async () => {
    fetchMock.mockImplementation(backColgado);

    const res = await pedir("Productos");

    expect(res.status).toBe(504);
    expect((await res.json()).message).toMatch(/tard/i);
  });

  it("si el back responde, pasa el status y el cuerpo tal cual", async () => {
    fetchMock.mockResolvedValue(Response.json([{ id: 2 }], { status: 200 }));

    const res = await pedir("Productos");

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual([{ id: 2 }]);
  });
});
