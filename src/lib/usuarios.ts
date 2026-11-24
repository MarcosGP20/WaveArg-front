// Lista de usuarios del admin (/admin/users): filtro por rol y búsqueda por email o nombre.
import type { Usuario } from "@/lib/api";

export function filtrarUsuarios(usuarios: Usuario[], rol: string, busqueda: string): Usuario[] {
  const query = busqueda.toLowerCase();
  return usuarios.filter((u) => {
    const coincideRol = rol ? u.rol.toLowerCase() === rol.toLowerCase() : true;
    const coincideBusqueda = query
      ? (u.email ?? "").toLowerCase().includes(query) || (u.nombre ?? "").toLowerCase().includes(query)
      : true;
    return coincideRol && coincideBusqueda;
  });
}

// Una cuenta borrada no tiene nombre ni email.
export function inicialDeUsuario(u: Usuario): string {
  const texto = u.nombre || u.email;
  return texto ? texto[0].toUpperCase() : "—";
}
