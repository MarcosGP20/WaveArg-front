// Datos del usuario que muestra el header del admin. El email y el rol salen de la sesión
// verificada en el servidor (layout de admin); el nombre, que no viaja en el token, del
// usuario guardado en Zustand, solo si es el mismo de la sesión.

export interface UsuarioAdmin {
  nombre: string;
  email: string;
  rol: string;
  inicial: string;
}

export function usuarioAdmin(
  sesion: { email: string; rol: string },
  guardado: { email: string; nombre?: string | null } | null,
): UsuarioAdmin {
  const esElMismo = guardado?.email.toLowerCase() === sesion.email.toLowerCase();
  const nombre = (esElMismo && guardado?.nombre?.trim()) || sesion.email.split("@")[0];
  const rol = sesion.rol.toLowerCase() === "admin" ? "Administrador" : sesion.rol;

  return { nombre, email: sesion.email, rol, inicial: nombre.charAt(0).toUpperCase() };
}
