// Clases compartidas del panel de administración (mismo patrón que components/home/estilos.ts).
// Colores y radios salen de los tokens de DESIGN.md: tinta, superficie, borde, color-principal.

const curva = "transition-colors duration-300 ease-ola";
const foco = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-color-principal/40";

export const tituloPagina = "text-2xl font-semibold text-tinta";
export const subtituloPagina = "mt-1 text-sm text-tinta-suave";

// Panel que contiene una tabla o un grupo de datos.
export const panel = "overflow-hidden rounded-panel bg-superficie";

// Tablas
export const encabezadoTabla = "text-xs font-semibold text-tinta-suave";
export const th = "px-4 py-3 text-left";
export const td = "px-4 py-3";
export const filaTabla = `border-t border-borde ${curva} hover:bg-white/70`;

// Controles de formulario y botones
export const control = `rounded-control border border-borde-fuerte bg-white px-3 py-2 text-sm text-tinta placeholder:text-tinta-suave ${curva} ${foco}`;
export const botonIcono = `inline-flex size-10 items-center justify-center rounded-control border border-borde-fuerte bg-white text-tinta ${curva} ${foco} hover:bg-superficie disabled:opacity-50`;
export const botonPrimario = `inline-flex items-center gap-2 rounded-control bg-color-principal px-3 py-2 text-sm font-semibold text-white ${curva} ${foco} hover:bg-color-principal-oscuro disabled:opacity-50`;
export const botonPeligro = `inline-flex items-center gap-2 rounded-control bg-destructive px-3 py-2 text-sm font-semibold text-white ${curva} ${foco} hover:opacity-90 disabled:opacity-50`;
export const botonTexto = `rounded-control px-2 py-1 text-sm font-medium text-tinta-suave ${curva} ${foco} hover:text-tinta`;
export const enlaceAccion = `inline-flex size-8 items-center justify-center rounded-control text-tinta-suave ${curva} ${foco} hover:bg-white hover:text-color-principal`;
