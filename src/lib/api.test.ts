import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  AccesorioVariantesService,
  ApiError,
  CODIGO_VINCULAR_GOOGLE,
  getProductos,
  invalidarProductos,
  loginUser,
  loginWithGoogle,
  MENSAJE_REGISTRO_POR_DEFECTO,
  registerUser,
  stockActualSiCambio,
  VariantesService,
  vincularGoogle,
} from "./api";
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

describe("edición de stock desde el admin (api.ts)", () => {
  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("manda el stock que el admin vio al abrir el formulario", async () => {
    fetchMock.mockResolvedValue(respuesta(200, {}));

    await VariantesService.update(7, { precio: 100, stock: 5, stockAnterior: 3, color: "Negro", memoria: "128GB" });

    const [, init] = fetchMock.mock.calls[0];
    expect(JSON.parse(init.body)).toMatchObject({ id: 7, stock: 5, stockAnterior: 3 });
  });

  it("si hubo ventas en el medio, el 409 trae el stock actual", async () => {
    fetchMock.mockResolvedValue(
      respuesta(409, { message: "El stock cambió mientras editabas (hubo ventas): ahora hay 2.", stockActual: 2 }),
    );

    const error = await AccesorioVariantesService.update(9, {
      precio: 10,
      stock: 5,
      stockAnterior: 3,
      color: "Negro",
      especificacion: "USB-C",
    }).catch((e: unknown) => e);

    expect(stockActualSiCambio(error)).toBe(2);
    expect(error).toMatchObject({ message: "El stock cambió mientras editabas (hubo ventas): ahora hay 2." });
  });

  it("otros errores no se confunden con un cambio de stock", () => {
    expect(stockActualSiCambio(new ApiError("Ya existe", 409, { message: "Ya existe" }))).toBeNull();
    expect(stockActualSiCambio(new ApiError("Error", 500, { stockActual: 2 }))).toBeNull();
    expect(stockActualSiCambio(new Error("red"))).toBeNull();
  });
});

describe("getProductos: una sola request compartida (api.ts)", () => {
  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
    vi.useFakeTimers();
    invalidarProductos();
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  const lista = [{ id: 1, nombre: "iPhone", variantes: [] }];

  it("dos pedidos simultáneos (catálogo y ficha) hacen una sola request", async () => {
    fetchMock.mockImplementation(async () => respuesta(200, lista));
    const [a, b] = await Promise.all([getProductos(), getProductos()]);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(a).toEqual(lista);
    expect(b).toEqual(lista);
  });

  it("reusa el resultado dentro de la ventana de caché y vuelve a pedir después", async () => {
    fetchMock.mockImplementation(async () => respuesta(200, lista));
    await getProductos();
    vi.advanceTimersByTime(10_000);
    await getProductos();
    expect(fetchMock).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(60_000);
    await getProductos();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("un error no queda cacheado: el siguiente pedido reintenta", async () => {
    fetchMock.mockResolvedValueOnce(respuesta(500, { message: "caído" }));
    await expect(getProductos()).rejects.toBeInstanceOf(ApiError);
    fetchMock.mockImplementation(async () => respuesta(200, lista));
    expect(await getProductos()).toEqual(lista);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("cada llamador recibe su copia: ordenar una no altera la de otro", async () => {
    fetchMock.mockImplementation(async () => respuesta(200, lista));
    const a = await getProductos();
    const b = await getProductos();
    expect(a).not.toBe(b);
    a[0].nombre = "mutado";
    expect(b[0].nombre).toBe("iPhone");
  });

  it("invalidarProductos fuerza una request nueva", async () => {
    fetchMock.mockImplementation(async () => respuesta(200, lista));
    await getProductos();
    invalidarProductos();
    await getProductos();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});

describe("registro (api.ts)", () => {
  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const datos = { email: "ana@test.local", contraseña: "Segura123!", rolId: 0 };

  it("devuelve el mensaje del back, que es el mismo exista o no la cuenta (back#104)", async () => {
    const mensaje = "Listo. Si el email ya tenía una cuenta, te mandamos un mail para que ingreses.";
    fetchMock.mockResolvedValue(respuesta(200, { message: mensaje }));

    expect(await registerUser(datos)).toBe(mensaje);
  });

  it("si el back no manda un mensaje (versión anterior), usa uno por defecto", async () => {
    fetchMock.mockResolvedValue(respuesta(200, "Usuario Registrado"));

    expect(await registerUser(datos)).toBe(MENSAJE_REGISTRO_POR_DEFECTO);
  });
});
