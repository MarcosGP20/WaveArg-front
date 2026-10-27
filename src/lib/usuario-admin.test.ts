import { describe, expect, it } from "vitest";
import { usuarioAdmin } from "./usuario-admin";

const sesion = { email: "ana@wave.com", rol: "Admin" };

describe("usuarioAdmin", () => {
  it("muestra el email y el rol de la sesión verificada", () => {
    const u = usuarioAdmin(sesion, null);
    expect(u.email).toBe("ana@wave.com");
    expect(u.rol).toBe("Administrador");
  });

  it("usa el nombre guardado si es del mismo usuario que la sesión", () => {
    const u = usuarioAdmin(sesion, { email: "ANA@wave.com", nombre: "  Ana Pérez " });
    expect(u.nombre).toBe("Ana Pérez");
    expect(u.inicial).toBe("A");
  });

  it("ignora el usuario guardado si es de otro email", () => {
    const u = usuarioAdmin(sesion, { email: "otro@wave.com", nombre: "Otro" });
    expect(u.nombre).toBe("ana");
  });

  it("sin nombre guardado, usa la parte local del email", () => {
    expect(usuarioAdmin(sesion, { email: "ana@wave.com", nombre: null }).nombre).toBe("ana");
    expect(usuarioAdmin(sesion, { email: "ana@wave.com", nombre: "   " }).nombre).toBe("ana");
  });

  it("la inicial sale del nombre que se muestra, en mayúscula", () => {
    expect(usuarioAdmin({ email: "zoe@wave.com", rol: "admin" }, null).inicial).toBe("Z");
  });

  it("muestra otros roles tal como vienen", () => {
    expect(usuarioAdmin({ email: "a@b.com", rol: "Administrador" }, null).rol).toBe("Administrador");
    expect(usuarioAdmin({ email: "a@b.com", rol: "Editor" }, null).rol).toBe("Editor");
  });
});
