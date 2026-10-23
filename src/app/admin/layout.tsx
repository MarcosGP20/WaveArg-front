import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_COOKIE_NAME } from "@/lib/auth-cookie";
import { esAdmin, verificarSesion } from "@/lib/sesion";
import AdminShell from "@/app/admin/components/AdminShell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Segunda capa, además del middleware: verifica la firma del token antes de renderizar.
  // redirect() corta lanzando una excepción, así que no va dentro de un try/catch.
  const cookieStore = await cookies();
  const sesion = await verificarSesion(cookieStore.get(AUTH_COOKIE_NAME)?.value);

  if (!sesion) {
    redirect("/login");
  }

  if (!esAdmin(sesion)) {
    redirect("/account/profile");
  }

  return <AdminShell>{children}</AdminShell>;
}
