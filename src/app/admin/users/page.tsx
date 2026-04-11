"use client";

import { useEffect, useState } from "react";
import { UsuariosService, Usuario } from "@/lib/api";
import { Users, AlertCircle, RefreshCw, ShieldCheck, User } from "lucide-react";

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
          ? "bg-purple-100 text-purple-800"
          : "bg-gray-100 text-gray-600"
      }`}
    >
      {isAdmin ? <ShieldCheck size={11} /> : <User size={11} />}
      {rol}
    </span>
  );
}

// ================================================================
// SKELETON
// ================================================================
function TableSkeleton() {
  return (
    <div className="animate-pulse space-y-2 mt-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-12 bg-gray-100 rounded-lg" />
      ))}
    </div>
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

  function cargarUsuarios() {
    setLoading(true);
    setError(null);
    UsuariosService.getAll()
      .then((data) => {
        setUsuarios(data);
      })
      .catch((err: Error) => setError(err instanceof Error ? err.message : String(err)))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    cargarUsuarios();
  }, []);

  // Filtrado local (por rol y búsqueda de email/nombre)
  const usuariosFiltrados = usuarios.filter((u) => {
    const coincideRol = filtroRol ? u.rol.toLowerCase() === filtroRol.toLowerCase() : true;
    const query = busqueda.toLowerCase();
    const coincideBusqueda = query
      ? u.email.toLowerCase().includes(query) ||
        (u.nombre ?? "").toLowerCase().includes(query)
      : true;
    return coincideRol && coincideBusqueda;
  });

  // Roles únicos para el filtro
  const rolesUnicos = [...new Set(usuarios.map((u) => u.rol))];

  return (
    <div className="my-8 px-2 md:px-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-color-principal">Usuarios</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {loading
              ? "Cargando..."
              : `${usuariosFiltrados.length} de ${usuarios.length} usuario${usuarios.length !== 1 ? "s" : ""}`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Buscador */}
          <input
            type="text"
            placeholder="Buscar por email o nombre..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 w-56"
          />

          {/* Filtro por rol */}
          <select
            value={filtroRol}
            onChange={(e) => setFiltroRol(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <option value="">Todos los roles</option>
            {rolesUnicos.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>

          {/* Refresh */}
          <button
            onClick={cargarUsuarios}
            disabled={loading}
            title="Actualizar"
            className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* ERROR */}
      {error && !loading && (
        <div className="flex flex-col items-center justify-center h-48 gap-3 text-red-500">
          <AlertCircle size={36} />
          <p className="text-sm font-medium text-center max-w-xs">{error}</p>
          <button onClick={cargarUsuarios} className="text-xs underline">
            Reintentar
          </button>
        </div>
      )}

      {/* SKELETON */}
      {loading && <TableSkeleton />}

      {/* EMPTY */}
      {!loading && !error && usuariosFiltrados.length === 0 && (
        <div className="flex flex-col items-center justify-center h-48 gap-3 text-gray-400">
          <Users size={40} className="text-gray-300" />
          <p className="text-sm">
            {busqueda || filtroRol
              ? "No se encontraron usuarios con ese filtro"
              : "No hay usuarios registrados"}
          </p>
        </div>
      )}

      {/* TABLA */}
      {!loading && !error && usuariosFiltrados.length > 0 && (
        <div className="bg-white shadow-sm rounded-xl overflow-x-auto border border-gray-100">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 uppercase text-xs leading-normal border-b border-gray-100">
                <th className="py-3 px-4 text-left">#</th>
                <th className="py-3 px-4 text-left">Usuario</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Rol</th>
                <th className="py-3 px-4 text-left">Registro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {usuariosFiltrados.map((usuario) => (
                <tr
                  key={usuario.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-4 font-mono text-xs text-gray-400">
                    {usuario.id}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-color-principal flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {(usuario.nombre ?? usuario.email)[0].toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-800">
                        {usuario.nombre ?? "—"}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-500">{usuario.email}</td>
                  <td className="py-3 px-4">
                    <RolBadge rol={usuario.rol} />
                  </td>
                  <td className="py-3 px-4 text-gray-500 text-xs">
                    {formatFecha(usuario.fechaRegistro)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
