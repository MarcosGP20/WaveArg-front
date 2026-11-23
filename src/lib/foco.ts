/** Mínimo de un nodo contenedor que necesitamos (acepta un HTMLElement real o un doble en tests). */
export interface Contenedor {
  contains(otro: unknown): boolean;
}

/**
 * ¿El foco salió del contenedor? `relatedTarget` es el elemento que recibe el foco (focusout).
 * Null (click en algo no enfocable, o la ventana perdió el foco) no cuenta como salida: los
 * clicks afuera ya los cierra el listener de pointerdown.
 */
export function focoSalioDe(contenedor: Contenedor | null | undefined, relatedTarget: unknown): boolean {
  if (!contenedor || relatedTarget == null) return false;
  return !contenedor.contains(relatedTarget);
}
