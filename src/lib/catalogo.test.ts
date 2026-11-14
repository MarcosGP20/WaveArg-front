import { describe, expect, it } from "vitest";
import type { Producto, Variante } from "@/interfaces/producto";
import { leerFiltros, opcionesDeFiltro, slugDeModelo, tarjetasDelCatalogo, variantesQueCumplen } from "./catalogo";

let id = 0;
function variante(memoria: string, precio: number, stock: number, esUsado = false, color = "Negro"): Variante {
  return { id: ++id, color, memoria, precio, stock, esUsado, detalleEstado: "", fotoEstadoUrl: null };
}
function producto(nombre: string, variantes: Variante[]): Producto {
  return { id: ++id, nombre, modelo: "", descripcion: "", stockTotal: 0, imagenes: [], variantes };
}
const filtros = (query = "") => leerFiltros(new URLSearchParams(query));

const quincePro = producto("iPhone 15 Pro", [variante("256GB", 1900, 2), variante("512 GB", 2300, 1), variante("128GB", 1500, 0)]);
const quince = producto("iPhone 15", [variante("128GB", 1300, 5), variante("128GB", 900, 1, true)]);
const doce = producto("iPhone 12", [variante("64GB", 500, 2, true)]);
const catalogo = [quincePro, quince, doce];

describe("leerFiltros", () => {
  it("lee listas, números y el orden de la URL", () => {
    expect(filtros("estado=nuevo,usado&memoria=128GB,256 gb&precioMin=1000&orden=precio-asc")).toMatchObject({
      estados: ["nuevo", "usado"],
      memorias: ["128gb", "256gb"],
      precioMin: 1000,
      precioMax: null,
      orden: "precio-asc",
    });
  });

  it("un orden o un precio inválidos no rompen nada", () => {
    expect(filtros("orden=cualquiera&precioMax=abc")).toMatchObject({ orden: "predeterminado", precioMax: null });
  });
});

describe("variantesQueCumplen", () => {
  it("nunca devuelve variantes sin stock", () => {
    expect(variantesQueCumplen(quincePro, filtros()).map((v) => v.memoria)).toEqual(["256GB", "512 GB"]);
  });

  it("una misma variante tiene que cumplir todos los filtros", () => {
    // El 15 tiene un usado de 128GB y un nuevo de 128GB: pedir usado no puede traer el nuevo.
    expect(variantesQueCumplen(quince, filtros("estado=usado&memoria=128gb")).map((v) => v.precio)).toEqual([900]);
    expect(variantesQueCumplen(quince, filtros("estado=usado&precioMin=1000"))).toEqual([]);
  });
});

describe("tarjetasDelCatalogo", () => {
  it("el precio de la tarjeta es el de lo que se filtró", () => {
    const [tarjeta] = tarjetasDelCatalogo([quince], filtros("estado=nuevo"));
    expect(tarjeta.desde.precio).toBe(1300);
    expect(tarjeta.estado).toBe("Nuevo sellado");
  });

  it("saca los modelos que no tienen nada de lo pedido", () => {
    expect(tarjetasDelCatalogo(catalogo, filtros("estado=usado")).map((t) => t.producto.nombre)).toEqual(["iPhone 15", "iPhone 12"]);
    expect(tarjetasDelCatalogo(catalogo, filtros("memoria=512gb")).map((t) => t.producto.nombre)).toEqual(["iPhone 15 Pro"]);
  });

  it("filtra por modelo y por familia", () => {
    expect(tarjetasDelCatalogo(catalogo, filtros("modelo=iphone-15")).map((t) => t.producto.nombre)).toEqual(["iPhone 15"]);
    expect(tarjetasDelCatalogo(catalogo, filtros("familia=iphone-15")).map((t) => t.producto.nombre)).toEqual(["iPhone 15 Pro", "iPhone 15"]);
  });

  it("ordena por el precio que muestra la tarjeta", () => {
    expect(tarjetasDelCatalogo(catalogo, filtros("orden=precio-asc")).map((t) => t.desde.precio)).toEqual([500, 900, 1900]);
    expect(tarjetasDelCatalogo(catalogo, filtros("orden=precio-desc")).map((t) => t.desde.precio)).toEqual([1900, 900, 500]);
    expect(tarjetasDelCatalogo(catalogo, filtros()).map((t) => t.producto.nombre)).toEqual(["iPhone 15 Pro", "iPhone 15", "iPhone 12"]);
  });
});

describe("opcionesDeFiltro", () => {
  it("arma las opciones con lo que hay en stock", () => {
    const opciones = opcionesDeFiltro(catalogo);
    expect(opciones.memorias).toEqual([
      { valor: "64gb", texto: "64GB" },
      { valor: "128gb", texto: "128GB" },
      { valor: "256gb", texto: "256GB" },
      { valor: "512gb", texto: "512 GB" },
    ]);
    expect(opciones.modelos.map((m) => m.valor)).toEqual(["iphone-15-pro", "iphone-15", "iphone-12"]);
    expect(opciones.precio).toEqual({ min: 500, max: 2300 });
  });

  it("sin stock no hay rango de precios", () => {
    expect(opcionesDeFiltro([producto("iPhone 14", [variante("128GB", 1000, 0)])])).toEqual({ memorias: [], modelos: [], precio: undefined });
  });
});

describe("slugDeModelo", () => {
  it("saca espacios y símbolos", () => {
    expect(slugDeModelo("iPhone 12 (usado)")).toBe("iphone-12-usado");
  });
});
