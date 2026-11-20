import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_COOKIE_NAME } from "@/lib/auth-cookie";
import { accesoAdmin } from "@/lib/acceso-admin";
import { verificarSesion } from "@/lib/sesion";
import AdminShell from "@/app/admin/components/AdminShell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Segunda capa, además de src/proxy.ts: verifica la firma del token y revalida el rol contra el
  // back (lib/acceso-admin.ts) antes de renderizar.
  // redirect() corta lanzando una excepción, así que no va dentro de un try/catch.
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  const acceso = await accesoAdmin(token);

  if (acceso === "login") {
    redirect("/login");
  }

  if (acceso === "perfil") {
    redirect("/account/profile");
  }

  const sesion = (await verificarSesion(token))!;
  return <AdminShell sesion={{ email: sesion.email, rol: sesion.rol }}>{children}</AdminShell>;
}
