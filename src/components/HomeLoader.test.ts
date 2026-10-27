import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import HomeLoader from "./HomeLoader";

// React #418 en la home (front#15): el primer render del cliente tiene que dar el mismo HTML
// que el servidor, haya o no visitado la home antes en la sesión. Si el render lee
// sessionStorage, el cliente difiere del servidor y React descarta el HTML.
function sessionStorageCon(valores: Record<string, string>) {
  return { getItem: (k: string) => valores[k] ?? null, setItem: vi.fn(), removeItem: vi.fn() };
}

function renderEnCliente(valores: Record<string, string>) {
  vi.stubGlobal("window", {});
  vi.stubGlobal("sessionStorage", sessionStorageCon(valores));
  return renderToString(createElement(HomeLoader));
}

afterEach(() => vi.unstubAllGlobals());

describe("HomeLoader", () => {
  it("el primer render no depende de sessionStorage: coincide con el del servidor", () => {
    const servidor = renderToString(createElement(HomeLoader));

    expect(renderEnCliente({})).toBe(servidor);
    expect(renderEnCliente({ hasVisited: "true" })).toBe(servidor);
  });
});
