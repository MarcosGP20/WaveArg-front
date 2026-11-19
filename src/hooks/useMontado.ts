import { useSyncExternalStore } from "react";

const sinSuscripcion = () => () => {};

// false en el servidor y durante la hidratación, true después. Sirve para no usar datos que solo
// existen en el navegador (Zustand persistido) hasta que el primer render ya coincidió con el HTML.
export function useMontado(): boolean {
  return useSyncExternalStore(
    sinSuscripcion,
    () => true,
    () => false,
  );
}
