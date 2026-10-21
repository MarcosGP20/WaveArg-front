import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decodeJWT } from "@/lib/jwt";
import { AUTH_COOKIE_NAME } from "@/lib/auth-cookie";
import AdminShell from "@/app/admin/components/AdminShell";

interface DecodedToken {
  rol?: string;
  exp?: number;
  [k: string]: any;
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side protection: validar cookie antes de renderizar
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get(AUTH_COOKIE_NAME);
  const token = tokenCookie?.value;

  if (!token) {
    redirect("/login");
  }

  try {
    const decoded = decodeJWT(token!) as DecodedToken | null;
    const now = Math.floor(Date.now() / 1000);

    if (!decoded || (decoded.exp && decoded.exp < now)) {
      redirect("/login");
    }

    if (decoded.rol?.toLowerCase() !== "admin") {
      redirect("/account/profile");
    }
  } catch (err) {
    // token inválido
    redirect("/login");
  }

  return <AdminShell>{children}</AdminShell>;
}
