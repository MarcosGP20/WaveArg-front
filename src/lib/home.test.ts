import { describe, expect, it } from "vitest";
import type { Producto, Variante } from "@/interfaces/producto";
import { elegirDestacado, imagenSinFondo, varianteMasBarata } from "./home";

function variante(id: number, precio: number, stock: number): Variante {
  return { id, color: "Azul", memoria: "128GB", precio, stock, esUsado: false, detalleEstado: "", fotoEstadoUrl: null };
}

function producto(id: number, variantes: Variante[]): Producto {
  return {
    id,
    nombre: `iPhone ${id}`,
    modelo: "",
    descripcion: "",
    stockTotal: variantes.reduce((s, v) => s + v.stock, 0),
    imagenes: [],
    variantes,
  };
}

describe("varianteMasBarata", () => {
  it("elige la más barata entre las que tienen stock", () => {
    const p = producto(1, [variante(1, 500, 0), variante(2, 900, 2), variante(3, 700, 1)]);
    expect(varianteMasBarata(p)?.id).toBe(3);
  });

  it("sin stock no hay variante", () => {
    expect(varianteMasBarata(producto(1, [variante(1, 500, 0)]))).toBeNull();
  });
});

describe("elegirDestacado", () => {
  const sinStock = producto(1, [variante(1, 500, 0)]);
  const poco = producto(2, [variante(2, 600, 1)]);
  const mucho = producto(3, [variante(3, 800, 9)]);

  it("respeta el destacado del admin si tiene stock", () => {
    expect(elegirDestacado([poco, mucho], 2)?.id).toBe(2);
  });

  it("si el destacado no tiene stock, va el de más stock", () => {
    expect(elegirDestacado([sinStock, poco, mucho], 1)?.id).toBe(3);
  });

  it("sin destacado, va el de más stock", () => {
    expect(elegirDestacado([poco, mucho], null)?.id).toBe(3);
  });

  it("si nada tiene stock, no hay hero de producto", () => {
    expect(elegirDestacado([sinStock], null)).toBeNull();
  });
});

describe("imagenSinFondo", () => {
  it("pide al CDN de Apple la versión transparente y limita el ancho", () => {
    const { src, sinFondo } = imagenSinFondo(
      "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-14?wid=5120&hei=2880&fmt=p-jpg",
    );
    const url = new URL(src);
    expect(sinFondo).toBe(true);
    expect(url.searchParams.get("fmt")).toBe("png-alpha");
    expect(url.searchParams.get("wid")).toBe("1040");
    expect(url.searchParams.get("hei")).toBe("585");
  });

  it("otras URLs (o rutas locales) vuelven sin tocar", () => {
    expect(imagenSinFondo("https://http2.mlstatic.com/x.jpg")).toEqual({ src: "https://http2.mlstatic.com/x.jpg", sinFondo: false });
    expect(imagenSinFondo("/placeholder.png")).toEqual({ src: "/placeholder.png", sinFondo: false });
  });
});
