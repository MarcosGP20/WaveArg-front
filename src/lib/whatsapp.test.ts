import { describe, expect, it } from "vitest";
import { linkWhatsAppA } from "./whatsapp";

// wa.me pide el número internacional sin "+": en Argentina, 549 + característica + número.
describe("linkWhatsAppA", () => {
  it("un número local con característica va con 549 adelante", () => {
    expect(linkWhatsAppA("11 5555-5555")).toBe("https://wa.me/5491155555555");
    expect(linkWhatsAppA("2262 58-6880")).toBe("https://wa.me/5492262586880");
  });

  it("saca el 0 de la característica", () => {
    expect(linkWhatsAppA("011 5555-5555")).toBe("https://wa.me/5491155555555");
  });

  it("respeta un número que ya viene con +54, y le agrega el 9 si falta", () => {
    expect(linkWhatsAppA("+54 9 2262 586880")).toBe("https://wa.me/5492262586880");
    expect(linkWhatsAppA("+54 11 5555 5555")).toBe("https://wa.me/5491155555555");
  });
});
