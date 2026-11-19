// Clases compartidas por las secciones de la home (DESIGN.md). Una acción principal por sección.

const base =
  "inline-flex items-center justify-center rounded-control text-center transition-[background-color,border-color,transform] duration-300 ease-ola active:scale-[0.98] motion-reduce:active:scale-100";

/** Acción principal sobre fondo claro: 56px de alto. */
export const botonPrincipal = `${base} button-md bg-color-principal px-8 py-4 text-white hover:bg-color-principal-oscuro`;

/** Acción principal sobre atlantico. */
export const botonSobreOscuro = `${base} button-md bg-white px-8 py-4 text-atlantico hover:bg-espuma`;

/** Link de texto sobre atlantico: la acción secundaria nunca pesa lo mismo que la principal. */
export const enlaceSobreOscuro =
  "body-2 text-white underline decoration-espuma/40 underline-offset-4 transition-colors duration-300 hover:decoration-white";

/** Link de texto sobre fondo claro. */
export const enlace =
  "text-color-principal underline underline-offset-4 transition-colors duration-300 hover:text-color-principal-oscuro";

/** Contenedor de sección: mismo ancho y aire en toda la home. */
export const seccion = "mx-auto max-w-6xl px-4 py-16 md:py-24";

/** Título de sección. */
export const tituloSeccion = "heading-4 text-balance md:heading-3 lg:heading-2";
