import { describe, expect, it } from "vitest";
import { crearAlmacenCarrito, etiquetaBotonCarrito, parsearCarrito, type ItemCarrito } from "./carrito";

// El botón del carrito es un ícono con un badge: el lector de pantalla necesita la cantidad
// en el nombre accesible (front#10).
describe("etiquetaBotonCarrito", () => {
  it("dice que está vacío cuando no hay productos", () => {
    expect(etiquetaBotonCarrito(0)).toBe("Abrir carrito, vacío");
  });

  it("usa singular con un producto", () => {
    expect(etiquetaBotonCarrito(1)).toBe("Abrir carrito, 1 producto");
  });

  it("usa plural con más de uno", () => {
    expect(etiquetaBotonCarrito(3)).toBe("Abrir carrito, 3 productos");
  });
});

const item = (id: string, quantity = 1): ItemCarrito => ({ id, name: `Item ${id}`, price: 100, quantity });

function storageFalso(inicial: Record<string, string> = {}) {
  const datos = new Map(Object.entries(inicial));
  return {
    datos,
    getItem: (k: string) => datos.get(k) ?? null,
    setItem: (k: string, v: string) => void datos.set(k, v),
    removeItem: (k: string) => void datos.delete(k),
  };
}

describe("parsearCarrito", () => {
  it("devuelve [] si no hay nada guardado", () => {
    expect(parsearCarrito(null)).toEqual([]);
  });

  it("devuelve null si el JSON está corrupto o no es una lista", () => {
    expect(parsearCarrito("{no es json")).toBeNull();
    expect(parsearCarrito('{"id":"1"}')).toBeNull();
  });

  it("devuelve los ítems válidos y descarta los que no tienen la forma de un CartItem", () => {
    const raw = JSON.stringify([item("1-2", 2), { id: 5 }, null, { id: "x", name: "n", price: "caro", quantity: 1 }]);
    expect(parsearCarrito(raw)).toEqual([item("1-2", 2)]);
  });
});

describe("crearAlmacenCarrito", () => {
  it("lee el carrito guardado", () => {
    const almacen = crearAlmacenCarrito(storageFalso({ cart: JSON.stringify([item("1-1")]) }));
    expect(almacen.getSnapshot()).toEqual([item("1-1")]);
  });

  it("si lo guardado está corrupto, arranca vacío y limpia la clave", () => {
    const storage = storageFalso({ cart: "{roto" });
    const almacen = crearAlmacenCarrito(storage);
    expect(almacen.getSnapshot()).toEqual([]);
    expect(storage.datos.has("cart")).toBe(false);
  });

  it("getSnapshot devuelve la misma referencia mientras nada cambie", () => {
    const almacen = crearAlmacenCarrito(storageFalso({ cart: JSON.stringify([item("1-1")]) }));
    expect(almacen.getSnapshot()).toBe(almacen.getSnapshot());
  });

  it("actualizar persiste, devuelve el estado nuevo y avisa a los suscriptos", () => {
    const storage = storageFalso();
    const almacen = crearAlmacenCarrito(storage);
    let avisos = 0;
    almacen.subscribe(() => avisos++);

    almacen.actualizar((prev) => [...prev, item("1-1")]);

    expect(almacen.getSnapshot()).toEqual([item("1-1")]);
    expect(JSON.parse(storage.datos.get("cart")!)).toEqual([item("1-1")]);
    expect(avisos).toBe(1);
  });

  it("dos actualizaciones seguidas se componen", () => {
    const almacen = crearAlmacenCarrito(storageFalso());
    almacen.actualizar((prev) => [...prev, item("1-1")]);
    almacen.actualizar((prev) => [...prev, item("2-1")]);
    expect(almacen.getSnapshot().map((i) => i.id)).toEqual(["1-1", "2-1"]);
  });

  it("notificar relee el storage (otra pestaña cambió el carrito)", () => {
    const storage = storageFalso();
    const almacen = crearAlmacenCarrito(storage);
    almacen.getSnapshot();
    storage.setItem("cart", JSON.stringify([item("9-9")]));
    almacen.notificar();
    expect(almacen.getSnapshot()).toEqual([item("9-9")]);
  });

  it("si el storage no deja escribir, el carrito sigue funcionando en memoria", () => {
    const storage = { ...storageFalso(), setItem: () => { throw new Error("cuota"); } };
    const almacen = crearAlmacenCarrito(storage);
    almacen.actualizar((prev) => [...prev, item("1-1")]);
    expect(almacen.getSnapshot()).toEqual([item("1-1")]);
  });

  it("dejar de estar suscripto corta los avisos", () => {
    const almacen = crearAlmacenCarrito(storageFalso());
    let avisos = 0;
    const baja = almacen.subscribe(() => avisos++);
    baja();
    almacen.actualizar(() => [item("1-1")]);
    expect(avisos).toBe(0);
  });
});
