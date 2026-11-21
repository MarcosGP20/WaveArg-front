"use client";

import { useEffect, useState } from "react";
import { useRecargarAlVolver } from "@/hooks/useRecargarAlVolver";
import { UsuariosService, Usuario } from "@/lib/api";
import { filtrarUsuarios, inicialDeUsuario } from "@/lib/usuarios";
import { Users, RefreshCw, ShieldCheck, User } from "lucide-react";
import { CabeceraPagina, EstadoError, EstadoVacio, TablaSkeleton } from "../components/PaginaAdmin";
import { botonIcono, control, encabezadoTabla, filaTabla, panel, td, th } from "../components/estilos";

// ================================================================
// HELPERS
// ================================================================
function formatFecha(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function RolBadge({ rol }: { rol: string }) {
  const isAdmin = rol.toLowerCase() === "admin";
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
        isAdmin
          ? "bg-color-principal text-white"
          : "bg-white text-tinta-suave"
      }`}
    >
      {isAdmin ? <ShieldCheck size={12} strokeWidth={1.75} /> : <User size={12} strokeWidth={1.75} />}
      {rol}
    </span>
  );
}

// ================================================================
// PÁGINA
// ================================================================
export default function UsersPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [filtroRol, setFiltroRol] = useState<string>("");
  const [busqueda, setBusqueda] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // El estado arranca en loading: la carga inicial no vuelve a prenderlo (setState en el efecto).
  function traerUsuarios() {
    UsuariosService.getAll()
      .then((data) => {
        setUsuarios(data);
      })
      .catch((err: Error) => setError(err instanceof Error ? err.message : String(err)))
      .finally(() => setLoading(false));
  }

  function cargarUsuarios() {
    setLoading(true);
    setError(null);
    traerUsuarios();
  }

  useEffect(() => {
    traerUsuarios();
  }, []);

  useRecargarAlVolver(() => {
    setError(null);
    traerUsuarios();
  });

  // Filtrado local (por rol y búsqueda de email/nombre)
  const usuariosFiltrados = filtrarUsuarios(usuarios, filtroRol, busqueda);

  // Roles únicos para el filtro
  const rolesUnicos = [...new Set(usuarios.map((u) => u.rol))];

  return (
    <div>
      <CabeceraPagina
        titulo="Usuarios"
        subtitulo={
          loading
            ? "Cargando…"
            : `${usuariosFiltrados.length} de ${usuarios.length} ${usuarios.length === 1 ? "usuario" : "usuarios"}`
        }
      >
        <input
          type="text"
          placeholder="Buscar por email o nombre"
          aria-label="Buscar usuarios por email o nombre"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className={`${control} w-60`}
        />

        <select
          value={filtroRol}
          onChange={(e) => setFiltroRol(e.target.value)}
          aria-label="Filtrar por rol"
          className={control}
        >
          <option value="">Todos los roles</option>
          {rolesUnicos.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        <button onClick={cargarUsuarios} disabled={loading} aria-label="Actualizar usuarios" className={botonIcono}>
          <RefreshCw size={16} strokeWidth={1.75} className={loading ? "animate-spin" : ""} />
        </button>
      </CabeceraPagina>

      {loading && <TablaSkeleton />}

      {error && !loading && <EstadoError mensaje={error} onReintentar={cargarUsuarios} />}

      {!loading && !error && usuariosFiltrados.length === 0 && (
        <EstadoVacio
          icono={<Users size={40} strokeWidth={1.75} />}
          mensaje={
            busqueda || filtroRol
              ? "No se encontraron usuarios con ese filtro."
              : "Todavía no hay usuarios registrados."
          }
        />
      )}

      {!loading && !error && usuariosFiltrados.length > 0 && (
        <div className={panel}>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-tinta">
              <thead>
                <tr className={encabezadoTabla}>
                  <th scope="col" className={th}>#</th>
                  <th scope="col" className={th}>Usuario</th>
                  <th scope="col" className={th}>Email</th>
                  <th scope="col" className={th}>Rol</th>
                  <th scope="col" className={th}>Registro</th>
                </tr>
              </thead>
              <tbody>
                {usuariosFiltrados.map((usuario) => (
                  <tr key={usuario.id} className={filaTabla}>
                    <td className={`${td} font-mono text-tinta-suave`}>{usuario.id}</td>
                    <td className={td}>
                      <div className="flex items-center gap-3">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-color-principal text-xs font-semibold text-white">
                          {inicialDeUsuario(usuario)}
                        </div>
                        <span className="font-medium">{usuario.nombre ?? "—"}</span>
                      </div>
                    </td>
                    <td className={`${td} text-tinta-suave`}>{usuario.email ?? "Cuenta eliminada"}</td>
                    <td className={td}>
                      <RolBadge rol={usuario.rol} />
                    </td>
                    <td className={`${td} whitespace-nowrap text-tinta-suave`}>
                      {formatFecha(usuario.fechaRegistro)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
