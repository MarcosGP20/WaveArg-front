/**
 * Shared color utilities for product and accessory cards.
 * Single source of truth for color → hex mapping and border logic.
 */

const COLOR_HEX: Record<string, string> = {
  // iPhones
  Negro: "#1a1a1a",
  Blanco: "#f5f5f7",
  Azul: "#1e40af",
  "Azul Oscuro": "#1e3a5f",
  Rojo: "#be1b1b",
  Medianoche: "#0f172a",
  Estelar: "#e8e3d5",
  Púrpura: "#6b21a8",
  Verde: "#15803d",
  Amarillo: "#ca8a04",
  Rosa: "#db2777",
  Titanio: "#8a8a8e",
  "Titanio Natural": "#c8b89a",
  "Titanio Negro": "#2c2c2e",
  "Titanio Blanco": "#f2f2f2",
  "Titanio Desierto": "#c9a96e",
  Grafito: "#374151",
  Plata: "#d1d5db",
  Dorado: "#b8962e",
  // Accesorios
  Gris: "#6b7280",
  Plateado: "#d1d5db",
  Transparente: "#e5e7eb",
};

/** Returns the hex color for a given color name, defaulting to a neutral gray. */
export function mapColorToHex(color: string): string {
  return COLOR_HEX[color] ?? "#9ca3af";
}

const LIGHT_COLORS = new Set([
  "Blanco",
  "Estelar",
  "Plata",
  "Plateado",
  "Titanio Blanco",
  "Titanio Natural",
  "Titanio Desierto",
  "Titanio",
  "Dorado",
  "Transparente",
]);

/** Returns true for colors that need a visible ring border (light swatches on white bg). */
export function needsDarkBorder(color: string): boolean {
  return LIGHT_COLORS.has(color);
}
