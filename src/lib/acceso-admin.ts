// Decide si la cookie auth-token puede entrar al panel de admin (app/admin/layout.tsx).
// Además de verificar el JWT, le pregunta al back el rol de hoy (GET /Auth/me, #119): sin eso,
// un admin degradado en la DB seguía viendo el panel hasta que vencía su token (2 h).
//
// Si el back no responde (caído, arrancando en frío) decide con el rol del token ya verificado:
// el panel sin back no muestra datos, y cada request de datos pasa igual por el back, que
// revalida el rol. Así una caída del back no deja afuera al admin.
import { BACKEND_API_BASE } from "@/lib/backend";
import { esAdmin, verificarSesion } from "@/lib/sesion";

export type AccesoAdmin = "permitido" | "login" | "perfil";

async function rolEnElBack(token: string): Promise<string | "sin-sesion" | null> {
  try {
    const response = await fetch(`${BACKEND_API_BASE}/Auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (response.status === 401) return "sin-sesion";
    if (!response.ok) return null;
    const { rol } = (await response.json()) as { rol?: unknown };
    return typeof rol === "string" ? rol : null;
  } catch {
    return null;
  }
}

export async function accesoAdmin(token: string | undefined): Promise<AccesoAdmin> {
  const sesion = await verificarSesion(token);
  if (!sesion || !token) return "login";

  const rol = await rolEnElBack(token);
  if (rol === "sin-sesion") return "login";
  return esAdmin({ ...sesion, rol: rol ?? sesion.rol }) ? "permitido" : "perfil";
}
