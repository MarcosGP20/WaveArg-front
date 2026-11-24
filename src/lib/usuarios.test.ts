import { describe, expect, it } from "vitest";
import { filtrarUsuarios, inicialDeUsuario } from "./usuarios";
import type { Usuario } from "./api";

const ana: Usuario = { id: 1, nombre: "Ana", email: "ana@correo.com", rol: "Cliente" };
// Una cuenta borrada queda anonimizada: sin email ni nombre (DELETE /Usuarios/{id}).
const borrada: Usuario = { id: 2, nombre: null, email: null, rol: "Cliente" };

describe("lista de usuarios del admin", () => {
  it("una cuenta borrada no rompe la búsqueda", () => {
    expect(filtrarUsuarios([ana, borrada], "", "ana")).toEqual([ana]);
  });

  it("la inicial de una cuenta borrada es un guion", () => {
    expect(inicialDeUsuario(ana)).toBe("A");
    expect(inicialDeUsuario(borrada)).toBe("—");
  });
});
