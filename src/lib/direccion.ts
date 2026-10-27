// Dirección de envío del checkout: validación con mensajes que dicen cómo corregir el error
// (front#9) y el orden de los campos, para llevar el foco al primero inválido.

export interface DireccionForm {
  calle: string;
  ciudad: string;
  provincia: string;
  codigoPostal: string;
}

export type CampoDireccion = keyof DireccionForm;
export type ErroresDireccion = Partial<Record<CampoDireccion, string>>;

// Orden en que aparecen en el formulario.
export const CAMPOS_DIRECCION: CampoDireccion[] = ["calle", "ciudad", "codigoPostal", "provincia"];

// Mismo formato que valida el backend: CPA ("C1043AAB") o 4 dígitos, con o sin letra de provincia.
const CODIGO_POSTAL = /^[A-Za-z]?\d{4}([A-Za-z]{3})?$/;

export function validarDireccion(d: DireccionForm): ErroresDireccion {
  const errores: ErroresDireccion = {};
  if (!d.calle.trim()) errores.calle = "Ingresá la calle y el número";
  if (!d.ciudad.trim()) errores.ciudad = "Ingresá la ciudad o localidad";
  if (!d.provincia) errores.provincia = "Elegí una provincia";
  if (!d.codigoPostal.trim()) errores.codigoPostal = "Ingresá el código postal";
  else if (!CODIGO_POSTAL.test(d.codigoPostal.trim()))
    errores.codigoPostal = "El código postal no es válido (ej: 2000 o C1043AAB)";
  return errores;
}

export function primerCampoInvalido(errores: ErroresDireccion): CampoDireccion | null {
  return CAMPOS_DIRECCION.find((campo) => errores[campo]) ?? null;
}
