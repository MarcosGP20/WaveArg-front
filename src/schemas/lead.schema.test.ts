import { describe, expect, it } from "vitest";
import { leadSchema } from "./lead.schema";

const base = { email: "ana@correo.com", modelo: "", whatsapp: "" };

describe("leadSchema", () => {
  it("alcanza con un email válido", () => {
    expect(leadSchema.safeParse(base).success).toBe(true);
    expect(leadSchema.parse({ ...base, email: "  ana@correo.com " }).email).toBe("ana@correo.com");
  });

  it("rechaza el email vacío o mal escrito", () => {
    expect(leadSchema.safeParse({ ...base, email: "" }).success).toBe(false);
    expect(leadSchema.safeParse({ ...base, email: "ana@correo" }).success).toBe(false);
  });

  it("el WhatsApp es opcional, pero si viene tiene que ser un número", () => {
    expect(leadSchema.safeParse({ ...base, whatsapp: "2262 58-6880" }).success).toBe(true);
    expect(leadSchema.safeParse({ ...base, whatsapp: "+54 9 2262 586880" }).success).toBe(true);
    expect(leadSchema.safeParse({ ...base, whatsapp: "mi número" }).success).toBe(false);
    expect(leadSchema.safeParse({ ...base, whatsapp: "123" }).success).toBe(false);
  });

  it("el modelo es opcional y corto", () => {
    expect(leadSchema.safeParse({ ...base, modelo: "iPhone 15 Pro 256GB" }).success).toBe(true);
    expect(leadSchema.safeParse({ ...base, modelo: "x".repeat(61) }).success).toBe(false);
  });
});
