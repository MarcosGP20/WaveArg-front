import { describe, expect, it } from "vitest";
import { etiquetaBotonCarrito } from "./carrito";

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
