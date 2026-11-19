// Especificaciones de cada iPhone para la ficha. Son los datos que publica Apple de cada modelo,
// cargados a mano: el back no los guarda. Si el modelo no está en la tabla, la ficha no muestra
// la sección: mejor nada que un dato adivinado (antes se deducían del nombre y un iPhone 11
// salía con 5G).

export type Especificacion = { label: string; value: string };

type Ficha = { chip: string; pantalla: string; camara: string; conector: string; conectividad: string };
type Variante = "base" | "mini" | "plus" | "pro" | "pro max" | "max" | "e" | "air";
type Generacion = { comun: Partial<Ficha>; variantes: Partial<Record<Variante, Partial<Ficha>>> };

const OLED = "Super Retina XDR (OLED)";
const PROMOTION = "Super Retina XDR con ProMotion (120 Hz)";
const DOBLE_12 = "Doble de 12 MP: gran angular y ultra gran angular";

const GENERACIONES: Record<string, Generacion> = {
  x: {
    comun: { chip: "A11 Bionic", conector: "Lightning", conectividad: "4G LTE y Wi-Fi 5" },
    variantes: { base: { pantalla: `5,8" Super Retina (OLED)`, camara: "Doble de 12 MP: gran angular y teleobjetivo 2x" } },
  },
  xr: {
    comun: { chip: "A12 Bionic", conector: "Lightning", conectividad: "4G LTE y Wi-Fi 5" },
    variantes: { base: { pantalla: `6,1" Liquid Retina HD (LCD)`, camara: "Gran angular de 12 MP" } },
  },
  xs: {
    comun: { chip: "A12 Bionic", conector: "Lightning", conectividad: "4G LTE y Wi-Fi 5", camara: "Doble de 12 MP: gran angular y teleobjetivo 2x" },
    variantes: { base: { pantalla: `5,8" Super Retina (OLED)` }, max: { pantalla: `6,5" Super Retina (OLED)` } },
  },
  "11": {
    comun: { chip: "A13 Bionic", conector: "Lightning", conectividad: "4G LTE y Wi-Fi 6" },
    variantes: {
      base: { pantalla: `6,1" Liquid Retina HD (LCD)`, camara: DOBLE_12 },
      pro: { pantalla: `5,8" ${OLED}`, camara: "Triple de 12 MP, con teleobjetivo 2x" },
      "pro max": { pantalla: `6,5" ${OLED}`, camara: "Triple de 12 MP, con teleobjetivo 2x" },
    },
  },
  "12": {
    comun: { chip: "A14 Bionic", conector: "Lightning", conectividad: "5G y Wi-Fi 6" },
    variantes: {
      base: { pantalla: `6,1" ${OLED}`, camara: DOBLE_12 },
      mini: { pantalla: `5,4" ${OLED}`, camara: DOBLE_12 },
      pro: { pantalla: `6,1" ${OLED}`, camara: "Triple de 12 MP, con teleobjetivo 2x y LiDAR" },
      "pro max": { pantalla: `6,7" ${OLED}`, camara: "Triple de 12 MP, con teleobjetivo 2,5x y LiDAR" },
    },
  },
  "13": {
    comun: { chip: "A15 Bionic", conector: "Lightning", conectividad: "5G y Wi-Fi 6" },
    variantes: {
      base: { pantalla: `6,1" ${OLED}`, camara: DOBLE_12 },
      mini: { pantalla: `5,4" ${OLED}`, camara: DOBLE_12 },
      pro: { pantalla: `6,1" ${PROMOTION}`, camara: "Triple de 12 MP, con teleobjetivo 3x y LiDAR" },
      "pro max": { pantalla: `6,7" ${PROMOTION}`, camara: "Triple de 12 MP, con teleobjetivo 3x y LiDAR" },
    },
  },
  "14": {
    comun: { conector: "Lightning", conectividad: "5G y Wi-Fi 6" },
    variantes: {
      base: { chip: "A15 Bionic", pantalla: `6,1" ${OLED}`, camara: DOBLE_12 },
      plus: { chip: "A15 Bionic", pantalla: `6,7" ${OLED}`, camara: DOBLE_12 },
      pro: { chip: "A16 Bionic", pantalla: `6,1" ${PROMOTION} y Dynamic Island`, camara: "Principal de 48 MP, ultra gran angular y teleobjetivo 3x" },
      "pro max": { chip: "A16 Bionic", pantalla: `6,7" ${PROMOTION} y Dynamic Island`, camara: "Principal de 48 MP, ultra gran angular y teleobjetivo 3x" },
    },
  },
  "15": {
    comun: { conectividad: "5G y Wi-Fi 6" },
    variantes: {
      base: { chip: "A16 Bionic", pantalla: `6,1" ${OLED} con Dynamic Island`, camara: "Principal de 48 MP y ultra gran angular de 12 MP", conector: "USB-C" },
      plus: { chip: "A16 Bionic", pantalla: `6,7" ${OLED} con Dynamic Island`, camara: "Principal de 48 MP y ultra gran angular de 12 MP", conector: "USB-C" },
      pro: { chip: "A17 Pro", pantalla: `6,1" ${PROMOTION}`, camara: "Principal de 48 MP, ultra gran angular y teleobjetivo 3x", conector: "USB-C (USB 3)", conectividad: "5G y Wi-Fi 6E" },
      "pro max": { chip: "A17 Pro", pantalla: `6,7" ${PROMOTION}`, camara: "Principal de 48 MP, ultra gran angular y teleobjetivo 5x", conector: "USB-C (USB 3)", conectividad: "5G y Wi-Fi 6E" },
    },
  },
  "16": {
    comun: { conectividad: "5G y Wi-Fi 7" },
    variantes: {
      base: { chip: "A18", pantalla: `6,1" ${OLED} con Dynamic Island`, camara: "Fusion de 48 MP y ultra gran angular de 12 MP", conector: "USB-C" },
      plus: { chip: "A18", pantalla: `6,7" ${OLED} con Dynamic Island`, camara: "Fusion de 48 MP y ultra gran angular de 12 MP", conector: "USB-C" },
      e: { chip: "A18", pantalla: `6,1" ${OLED}`, camara: "Fusion de 48 MP", conector: "USB-C", conectividad: "5G y Wi-Fi 6" },
      pro: { chip: "A18 Pro", pantalla: `6,3" ${PROMOTION}`, camara: "Fusion de 48 MP, ultra gran angular de 48 MP y teleobjetivo 5x", conector: "USB-C (USB 3)" },
      "pro max": { chip: "A18 Pro", pantalla: `6,9" ${PROMOTION}`, camara: "Fusion de 48 MP, ultra gran angular de 48 MP y teleobjetivo 5x", conector: "USB-C (USB 3)" },
    },
  },
  "17": {
    comun: { conectividad: "5G y Wi-Fi 7" },
    variantes: {
      base: { chip: "A19", pantalla: `6,3" ${PROMOTION}`, camara: "Fusion de 48 MP y ultra gran angular de 48 MP", conector: "USB-C" },
      air: { chip: "A19 Pro", pantalla: `6,5" ${PROMOTION}`, camara: "Fusion de 48 MP", conector: "USB-C" },
      pro: { chip: "A19 Pro", pantalla: `6,3" ${PROMOTION}`, camara: "Tres cámaras Fusion de 48 MP, con teleobjetivo 4x", conector: "USB-C (USB 3)" },
      "pro max": { chip: "A19 Pro", pantalla: `6,9" ${PROMOTION}`, camara: "Tres cámaras Fusion de 48 MP, con teleobjetivo 4x", conector: "USB-C (USB 3)" },
    },
  },
};

function modeloDe(nombre: string): { generacion: string; variante: Variante } | null {
  const n = nombre.toLowerCase();
  if (/iphone\s+air\b/.test(n)) return { generacion: "17", variante: "air" };
  const m = n.match(/iphone\s*(\d{2}|xr|xs|x)(e)?\b/);
  if (!m) return null;
  const variante: Variante = m[2]
    ? "e"
    : /pro\s*max/.test(n)
      ? "pro max"
      : /\bpro\b/.test(n)
        ? "pro"
        : /\bplus\b/.test(n)
          ? "plus"
          : /\bmini\b/.test(n)
            ? "mini"
            : /\bmax\b/.test(n)
              ? "max"
              : "base";
  return { generacion: m[1], variante };
}

/** Las especificaciones del modelo, o null si no lo conocemos. */
export function especificacionesDe(nombre: string): Especificacion[] | null {
  const modelo = modeloDe(nombre);
  if (!modelo) return null;
  const generacion = GENERACIONES[modelo.generacion];
  const propias = generacion?.variantes[modelo.variante];
  if (!generacion || !propias) return null;
  const { chip, pantalla, camara, conector, conectividad } = { ...generacion.comun, ...propias };
  if (!chip || !pantalla || !camara || !conector || !conectividad) return null;
  return [
    { label: "Chip", value: chip },
    { label: "Pantalla", value: pantalla },
    { label: "Cámara", value: camara },
    { label: "Conectividad", value: conectividad },
    { label: "Conector", value: conector },
    { label: "Desbloqueo", value: "Face ID" },
  ];
}
