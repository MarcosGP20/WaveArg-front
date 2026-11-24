import Image from "next/image";
import Link from "next/link";
import { mapColorToHex, needsDarkBorder } from "@/lib/colorMap";
import { textoCuotas } from "@/lib/cuotas";
import { resumenDeOpciones, type TarjetaDeModelo as Datos } from "@/lib/home";
import { formatearPrecio } from "@/lib/precio";

const MAXIMO_COLORES = 6;

// La tarjeta de un modelo de iPhone, la misma en la home y en el catálogo: el precio más bajo de
// lo que hay (o de lo que se filtró), las cuotas y las unidades que quedan. Toda la tarjeta lleva
// a la ficha con esa variante elegida (?v=). `children` es para acciones propias de cada página
// (en el catálogo, comparar): van fuera del link.
export default function TarjetaDeModelo({
  tarjeta,
  destacado = false,
  children,
}: {
  tarjeta: Datos;
  destacado?: boolean;
  children?: React.ReactNode;
}) {
  const { producto, desde, unidades, estado, capacidades, colores } = tarjeta;

  return (
    <article className="flex h-full flex-col rounded-panel bg-superficie transition-colors duration-300 ease-ola has-[a:hover]:bg-borde">
      <Link
        href={`/products/${producto.id}?v=${desde.id}`}
        className={`group flex flex-1 flex-col rounded-panel p-3 md:p-6 ${children ? "md:pb-4" : ""}`}
      >
        <div className="relative aspect-square md:aspect-[4/3]">
          {/* mix-blend-multiply: el fondo blanco de las fotos se funde con el panel gris. */}
          <Image
            src={desde.imagenes?.[0] ?? producto.imagenes?.[0] ?? "/placeholder.png"}
            alt=""
            fill
            sizes="(min-width: 1152px) 352px, (min-width: 768px) 33vw, 50vw"
            className="object-contain p-2 mix-blend-multiply transition-transform duration-500 ease-ola group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {destacado && <span className="rounded-lg bg-color-principal px-2 py-1 caption-1 text-white">Destacado</span>}
          <span
            className={`rounded-lg px-2 py-1 caption-1 ${
              estado === "Usado" ? "bg-white text-tinta" : "bg-principal-suave text-color-principal"
            }`}
          >
            {estado}
          </span>
          {unidades <= 3 && (
            <span className="rounded-lg bg-white px-2 py-1 caption-1 tabular-nums text-tinta">
              {unidades === 1 ? "Queda 1" : `Quedan ${unidades}`}
            </span>
          )}
        </div>
        <h3 className="mt-3 body-1 text-tinta md:heading-6">{producto.nombre}</h3>
        <p className="mt-1 caption-2 text-tinta-suave">{resumenDeOpciones(capacidades, colores)}</p>
        {colores.length > 1 && (
          <span aria-hidden="true" className="mt-2 flex flex-wrap items-center gap-1">
            {colores.slice(0, MAXIMO_COLORES).map((color) => (
              <span
                key={color}
                className={`size-3 rounded-full ${needsDarkBorder(color) ? "ring-1 ring-inset ring-black/20" : ""}`}
                style={{ backgroundColor: mapColorToHex(color) }}
              />
            ))}
          </span>
        )}
        <p className="mt-auto pt-4 caption-2 text-tinta-suave">Desde</p>
        <p className="heading-6 tabular-nums text-tinta md:heading-5">{formatearPrecio(desde.precio)}</p>
        <p className="mt-1 caption-2 text-tinta-suave">{textoCuotas(desde.precio)}</p>
        {/* Toda la tarjeta es el link: el botón es su parte visible. */}
        <span className="mt-4 rounded-lg bg-white px-3 py-3 text-center button-sm text-tinta ring-1 ring-inset ring-borde-fuerte transition-colors duration-300 ease-ola group-hover:bg-color-principal group-hover:text-white group-hover:ring-color-principal md:rounded-control md:button-md">
          Comprar
        </span>
      </Link>
      {children && <div className="px-3 pb-3 md:px-6 md:pb-6">{children}</div>}
    </article>
  );
}
