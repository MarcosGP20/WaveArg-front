import { esAdmin, type Sesion } from "./sesion";

// Qué hacer al entrar a /account. La sesión es la de la cookie auth-token ya verificada en el
// servidor (verificarSesion, el mismo criterio que src/proxy.ts): el store de Zustand no decide
// el acceso, porque el token no se guarda ahí y tras recargar no estaría.
//
// idGuardado es el id del usuario que quedó en localStorage. Si es de otra persona (otra sesión
// en el mismo navegador), sus datos no se pueden mostrar y hay que limpiarlos.
export type AccesoCuenta<S> =
  | { tipo: "redirigir"; destino: "/login" | "/admin" }
  | { tipo: "renderizar"; sesion: S; limpiarUsuario: boolean };

export function decidirAccesoCuenta<S extends Pick<Sesion, "id" | "rol">>(
  sesion: S | null,
  idGuardado?: string | null,
): AccesoCuenta<S> {
  if (!sesion) return { tipo: "redirigir", destino: "/login" };
  // El hub de cuenta es para clientes; los admins tienen su panel.
  if (esAdmin(sesion)) return { tipo: "redirigir", destino: "/admin" };
  return { tipo: "renderizar", sesion, limpiarUsuario: idGuardado != null && idGuardado !== sesion.id };
}
