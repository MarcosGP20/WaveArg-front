import { describe, expect, it } from "vitest";
import { especificacionesDe } from "./especificaciones";

const dato = (nombre: string, label: string) => especificacionesDe(nombre)?.find((e) => e.label === label)?.value;

describe("especificacionesDe", () => {
  it("distingue el modelo dentro de la misma generación", () => {
    expect(dato("iPhone 15", "Chip")).toBe("A16 Bionic");
    expect(dato("iPhone 15 Pro", "Chip")).toBe("A17 Pro");
    expect(dato("iPhone 15 Pro Max", "Pantalla")).toContain(`6,7"`);
    expect(dato("iPhone 14 Plus", "Pantalla")).toContain(`6,7"`);
    expect(dato("iPhone 13 mini", "Pantalla")).toContain(`5,4"`);
    expect(dato("iPhone 16e", "Cámara")).toBe("Fusion de 48 MP");
    expect(dato("iPhone Air", "Chip")).toBe("A19 Pro");
    expect(dato("iPhone XS Max", "Pantalla")).toContain(`6,5"`);
  });

  it("no le inventa 5G ni USB-C a los modelos que no lo tienen", () => {
    expect(dato("iPhone 11", "Conectividad")).toBe("4G LTE y Wi-Fi 6");
    expect(dato("iPhone 14 Pro", "Conector")).toBe("Lightning");
    expect(dato("iPhone 15", "Conector")).toBe("USB-C");
  });

  it("lee el modelo aunque el nombre traiga algo más", () => {
    expect(dato("iPhone 12 (usado)", "Chip")).toBe("A14 Bionic");
    expect(dato("  IPHONE 16 PRO  ", "Chip")).toBe("A18 Pro");
  });

  it("si no conoce el modelo no devuelve nada", () => {
    expect(especificacionesDe("iPhone SE")).toBeNull();
    expect(especificacionesDe("iPhone 99")).toBeNull();
    expect(especificacionesDe("iPhone 13 Plus")).toBeNull();
    expect(especificacionesDe("Funda MagSafe")).toBeNull();
  });
});
