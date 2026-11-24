import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_COOKIE_NAME } from "@/lib/auth-cookie";
import { decidirAccesoCuenta } from "@/lib/acceso-cuenta";
import { verificarSesion } from "@/lib/sesion";
import SesionCuenta from "./SesionCuenta";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  // Igual que app/admin/layout.tsx: la sesión sale de la cookie verificada en el servidor, así que
  // recargar cualquier página de /account no depende de lo que haya en el store del navegador.
  // redirect() corta lanzando una excepción, así que no va dentro de un try/catch.
  const cookieStore = await cookies();
  const acceso = decidirAccesoCuenta(await verificarSesion(cookieStore.get(AUTH_COOKIE_NAME)?.value));

  if (acceso.tipo === "redirigir") {
    redirect(acceso.destino);
  }

  const { id, email, rol } = acceso.sesion;
  return <SesionCuenta sesion={{ id, email, rol }}>{children}</SesionCuenta>;
}
